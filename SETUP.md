# 🚀 Warehouse AI System - Setup Instructions

## Prerequisites

- Python 3.8+
- Node.js 18+
- OpenAI API Key
- Backend API running at `http://localhost:8000/warehouse/data/`

## Quick Setup

### 1. AI Middleware Setup

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

### 2. Frontend Setup

```bash
cd frontend
npm install
```

### 3. Run Services

```bash
# Start AI Middleware
cd ai_middleware && uvicorn main:app --reload --port 8001

# Start Frontend (in another terminal)
cd frontend && npm run dev
```

### 4. Access System

- Frontend: http://localhost:3000
- AI Middleware: http://localhost:8001

## Test Commands

Try these natural language commands in the chat:
- "Add 50 Wireless Mouse at location A-01-01"
- "Show all products"
- "Update Wireless Mouse quantity to 75"
- "Delete product 1"

## 🚨 Important Notes

1. **Environment Variables**: Never commit `.env` files to version control
2. **API Keys**: Keep your OpenAI API key secure
3. **Backend**: Ensure your warehouse backend is running on http://localhost:8000
4. **CORS**: The AI middleware is configured to allow requests from http://localhost:3000

## 🔧 Troubleshooting

### AI Middleware Issues
- Check that your `.env` file exists and has the correct API key
- Verify the backend URL is correct
- Check terminal logs for error messages

### Frontend Issues
- Ensure AI middleware is running on http://localhost:8001
- Check browser console for JavaScript errors
- Verify CORS configuration in AI middleware

### Connection Issues
- Check that all services are running on their expected ports
- Verify firewall settings allow local connections
- Check network connectivity between services
