# MoodMix - Startup Scripts

This directory contains convenient scripts to start all MoodMix services at once.

## Quick Start

### Windows

**Option 1: Double-click the file**
- Navigate to the project folder and double-click `start-all.bat`

**Option 2: Command Prompt**
```cmd
start-all.bat
```

**Option 3: PowerShell**
```powershell
.\start-all.bat
```

### macOS/Linux
```bash
# Make scripts executable (first time only)
chmod +x start-all.sh start-ml-service.sh start-backend.sh start-frontend.sh

# Run the startup script
./start-all.sh
```

---

## What These Scripts Do

| Script | Purpose |
|--------|---------|
| `start-all.bat` | Windows: Opens 3 terminal windows for all services |
| `start-all.sh` | macOS/Linux: Opens 3 terminal sessions for all services |
| `start-ml-service.sh` | Starts ML Service only (port 8000) |
| `start-backend.sh` | Starts Backend only (port 5000) |
| `start-frontend.sh` | Starts Frontend only (port 5173) |

---

## Prerequisites

Before running these scripts, ensure:

1. **All dependencies installed:**
   ```bash
   npm install
   cd ml-service && pip install -r requirements.txt
   cd ../backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment variables set:**
   - `backend/.env` configured with database and Spotify credentials
   - `frontend/.env` configured with API URL
   - `ml-service/.env` configured (optional)

3. **Python virtual environment activated** (Linux/macOS):
   ```bash
   cd ml-service && python -m venv venv
   ```

---

## Individual Service Startup

If you only need to run one service:

### Windows
```cmd
# ML Service
cd ml-service && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000

# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### macOS/Linux
```bash
# ML Service
cd ml-service && source venv/bin/activate && uvicorn app.main:app --reload --port 8000

# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

---

## Accessing Services

Once all services are running:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | User-facing web app |
| Backend | http://localhost:5000 | REST API |
| ML Service | http://localhost:8000 | Emotion detection API |
| API Docs | http://localhost:8000/docs | Swagger UI for ML Service |

---

## Troubleshooting

### "Port already in use"
Kill the process on the port:

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### "venv not found"
Create the virtual environment:
```bash
cd ml-service && python -m venv venv
```

### "npm packages not installed"
Install dependencies:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../ml-service && pip install -r requirements.txt
```

### "Database connection failed"
Verify your `backend/.env` has the correct `DATABASE_URL`:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

---

## Docker Alternative

If you have Docker installed, start all services with:
```bash
docker-compose up
```

---

## Stopping Services

- **Windows:** Close each terminal window
- **macOS/Linux:** Press `Ctrl+C` in each terminal
