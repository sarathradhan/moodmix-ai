#!/bin/bash
# MoodMix - Start All Services (macOS/Linux)
# This script starts the ML Service, Backend, and Frontend in separate terminal sessions

echo "🚀 Starting MoodMix services..."
echo ""

# Check if running on macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - use open command to create new Terminal windows
    echo "📱 Detected macOS - opening Terminal windows..."
    
    # ML Service
    echo "🤖 Launching ML Service on port 8000..."
    open -a Terminal "$(pwd)/start-ml-service.sh"
    
    sleep 2
    
    # Backend
    echo "⚙️  Launching Backend on port 5000..."
    open -a Terminal "$(pwd)/start-backend.sh"
    
    sleep 2
    
    # Frontend
    echo "🎨 Launching Frontend on port 5173..."
    open -a Terminal "$(pwd)/start-frontend.sh"
else
    # Linux - use gnome-terminal, xterm, or similar
    echo "🐧 Detected Linux - opening terminals..."
    
    if command -v gnome-terminal &> /dev/null; then
        echo "🤖 Launching ML Service on port 8000..."
        gnome-terminal -- bash -c "cd ml-service && source venv/bin/activate && uvicorn app.main:app --reload --port 8000; exec bash"
        
        sleep 2
        
        echo "⚙️  Launching Backend on port 5000..."
        gnome-terminal -- bash -c "cd backend && npm run dev; exec bash"
        
        sleep 2
        
        echo "🎨 Launching Frontend on port 5173..."
        gnome-terminal -- bash -c "cd frontend && npm run dev; exec bash"
    else
        echo "❌ gnome-terminal not found. Please install it or run services manually."
        exit 1
    fi
fi

echo ""
echo "✅ All services started!"
echo ""
echo "📍 Service URLs:"
echo "   🎨 Frontend:    http://localhost:5173"
echo "   ⚙️  Backend:     http://localhost:5000"
echo "   🤖 ML Service:  http://localhost:8000"
echo ""
echo "💡 To stop services, close the terminal windows or press Ctrl+C in each."
