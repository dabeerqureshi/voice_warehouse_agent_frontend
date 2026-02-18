# 🤖 Warehouse AI System

A complete warehouse management system with AI-powered natural language interface. This system allows users to manage warehouse inventory using conversational commands.

## 🏗️ Architecture

```
voice_warehouse_agent_frontend/
├── frontend/          # React/Next.js chat interface
├── ai_middleware/     # FastAPI + LLM routing middleware
├── README.md          # This documentation
└── SETUP.md           # Setup instructions
```

### System Flow

1. **User** types natural language command in the frontend chat
2. **Frontend** sends command to AI middleware (`http://localhost:8001/chat`)
3. **AI Middleware** uses OpenAI to interpret command and select appropriate tool
4. **Middleware** calls backend API with structured data
5. **Backend** processes request and returns result
6. **Middleware** forwards result back to frontend
7. **Frontend** displays the response to the user

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- OpenAI API Key
- Backend API running at `http://localhost:8000/warehouse/data/`

### 1. Setup AI Middleware

```bash
cd ai_middleware
pip install -r requirements.txt
```

Create `.env` file with your OpenAI API key:
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

**⚠️ Important**: You must set your OpenAI API key in the `.env` file. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys).

Example `.env` file:
```bash
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
BACKEND_URL=http://localhost:8000/warehouse/data
```

Start the AI middleware:
```bash
uvicorn main:app --reload --port 8001
```

If you see an error about "OpenAI API key not configured", double-check that:
1. Your `.env` file exists in the `ai_middleware/` directory
2. Your API key is correctly formatted
3. You haven't accidentally committed the `.env` file to version control

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Open your browser to `http://localhost:3000`

### 3. Backend Requirements

Ensure your warehouse backend API is running at `http://localhost:8000/warehouse/data/` with the following endpoints:

- `GET /` - Get all products
- `POST /` - Add a product
- `PUT /{product_id}` - Update a product
- `DELETE /{product_id}` - Delete a product

## 💬 Supported Commands

The AI middleware supports these natural language commands:

### View Products
- "Show all products"
- "List all inventory"
- "What products do I have?"

### Add Products
- "Add 50 Wireless Mouse at location A-01-01"
- "Create a new product: Bluetooth Keyboard, quantity 25, location B-02-03"

### Update Products
- "Update Wireless Mouse quantity to 75"
- "Change the location of product 123 to C-01-01"
- "Update product 456 with name 'Gaming Mouse' and quantity 100"

### Delete Products
- "Delete product 1"
- "Remove the item with ID 123"
- "Delete Wireless Mouse from inventory"

## 🔧 Configuration

### AI Middleware Configuration

Edit `ai_middleware/.env`:
```bash
OPENAI_API_KEY=your_openai_api_key_here
BACKEND_URL=http://localhost:8000/warehouse/data
```

### Frontend Configuration

The frontend is configured to connect to the AI middleware at `http://localhost:8001`. To change this:

1. Edit the axios calls in `frontend/src/app/page.tsx`
2. Update the base URL in the `sendMessage` function

## 🛠️ Development

### Running All Services

1. **Backend**: Start your warehouse backend on port 8000
2. **AI Middleware**: `cd ai_middleware && uvicorn main:app --reload --port 8001`
3. **Frontend**: `cd frontend && npm run dev`

### Testing the System

Try these commands in the chat interface:

1. **"Add 50 Wireless Mouse at location A-01-01"**
2. **"Show all products"**
3. **"Update Wireless Mouse quantity to 75"**
4. **"Delete product 1"**

## 📋 API Endpoints

### AI Middleware Endpoints

- `GET /` - Health check
- `POST /chat` - Chat endpoint for natural language commands

### Request Format

```json
{
  "message": "Add 50 Wireless Mouse at location A-01-01"
}
```

### Response Format

```json
{
  "reply": "✅ Operation successful"
}
```

## 🔍 Troubleshooting

### Common Issues

1. **"Error connecting to AI middleware"**
   - Ensure AI middleware is running on `http://localhost:8001`
   - Check firewall settings

2. **"Error: Unknown function"**
   - Verify backend API endpoints are correct
   - Check backend URL configuration

3. **OpenAI API Errors**
   - Verify `OPENAI_API_KEY` is set correctly
   - Check API key permissions and limits

### Logs

- **AI Middleware**: Check terminal output for FastAPI logs
- **Frontend**: Check browser console for React/Next.js errors
- **Backend**: Check your backend service logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the logs from all three services
3. Ensure all services are running on their expected ports
4. Verify network connectivity between services
