@echo off
echo Starting Backend Server...
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to initialize...
timeout /t 5

echo Starting Frontend Client...
cd client
start "Frontend Client" cmd /k "npm run dev"
