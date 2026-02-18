from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client with error handling
try:
    from openai import OpenAI
    client = OpenAI()
except Exception as e:
    print(f"⚠️  Warning: OpenAI client initialization failed: {e}")
    print("Please set your OPENAI_API_KEY in the .env file")
    client = None

BASE_BACKEND_URL = "http://localhost:8000/warehouse/data"

# ----------------------------
# Request model
# ----------------------------
class ChatRequest(BaseModel):
    message: str

# ----------------------------
# Middleware tools (your backend APIs)
# ----------------------------
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_all_products",
            "description": "Retrieve all warehouse products",
            "parameters": {"type": "object", "properties": {}, "required": []}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "add_product",
            "description": "Add a product to the warehouse",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_name": {"type": "string"},
                    "product_desc": {"type": "string"},
                    "quantity": {"type": "integer"},
                    "location": {"type": "string"}
                },
                "required": ["product_name", "quantity", "location"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_product",
            "description": "Update a product in the warehouse",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {"type": "integer"},
                    "product_name": {"type": "string"},
                    "quantity": {"type": "integer"},
                    "location": {"type": "string"}
                },
                "required": ["product_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delete_product",
            "description": "Delete a product from the warehouse",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {"type": "integer"}
                },
                "required": ["product_id"]
            }
        }
    }
]

# ----------------------------
# Backend caller
# ----------------------------
def call_backend(function_name, args):
    try:
        if function_name == "get_all_products":
            r = requests.get(BASE_BACKEND_URL)
        elif function_name == "add_product":
            r = requests.post(BASE_BACKEND_URL, json=args)
        elif function_name == "update_product":
            product_id = args.pop("product_id")
            r = requests.put(f"{BASE_BACKEND_URL}/{product_id}", json=args)
        elif function_name == "delete_product":
            product_id = args["product_id"]
            r = requests.delete(f"{BASE_BACKEND_URL}/{product_id}")
        else:
            return "Unknown function"
        
        return r.json() if r.content else "✅ Operation successful"
    except Exception as e:
        return f"⚠ Error: {str(e)}"

# ----------------------------
# Chat endpoint
# ----------------------------
@app.post("/chat")
def chat(req: ChatRequest):
    if client is None:
        return {"reply": "⚠️ Error: OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file."}
    
    try:
        # Send message to OpenAI LLM with tool functions
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": req.message}],
            tools=tools
        )

        message = response.choices[0].message

        # If LLM wants to call a function
        if message.tool_calls:
            tool_call = message.tool_calls[0]
            function_name = tool_call.function.name
            arguments = json.loads(tool_call.function.arguments)

            return {"reply": call_backend(function_name, arguments)}

        return {"reply": message.content}
    except Exception as e:
        return {"reply": f"⚠️ Error processing request: {str(e)}"}

# ----------------------------
# Health check endpoint
# ----------------------------
@app.get("/")
def health_check():
    return {"status": "AI Middleware is running", "backend_url": BASE_BACKEND_URL}