@echo off
REM MoodMix - Start All Services (Windows)
REM This script starts the ML Service, Backend, and Frontend in separate terminal windows

echo Starting MoodMix services...
echo.

REM Start ML Service in new terminal
echo Launching ML Service on port 8000...
start cmd /k "cd ml-service && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

REM Wait a moment before starting backend
timeout /t 2 /nobreak

REM Start Backend in new terminal
echo Launching Backend on port 5000...
start cmd /k "cd backend && npm run dev"

REM Wait a moment before starting frontend
timeout /t 2 /nobreak

REM Start Frontend in new terminal
echo Launching Frontend on port 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo All services started! Access the application at http://localhost:5173
echo.
echo Service URLs:
echo   Frontend:    http://localhost:5173
echo   Backend:     http://localhost:5000
echo   ML Service:  http://localhost:8000
echo.
pause
