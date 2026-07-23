@echo off
echo ===================================================
echo   UtilityHub AI - Client & Server Runner (Windows)
echo ===================================================
echo.

REM 1. Check for Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python was not found in your system PATH.
    echo Please install Python (>=3.8) and check the "Add to PATH" box.
    echo.
    pause
    exit /b 1
)

REM 2. Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js/NPM was not found in your system PATH.
    echo Please install Node.js (>=18) to build/run the React client.
    echo.
    pause
    exit /b 1
)

echo [✓] Prerequisites checked successfully!
echo.

REM 3. Setup and Run Backend
echo [1/2] Preparing Python backend server...
cd backend
if not exist venv (
    echo Creating virtual environment (venv)...
    python -m venv venv
)
echo Activating virtual environment and installing dependencies...
call venv\Scripts\activate
pip install -r requirements.txt
echo Starting FastAPI server in a new window...
start cmd /k "title UtilityHub Backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"
cd ..
echo.

REM 4. Setup and Run Frontend
echo [2/2] Preparing Vite React frontend...
cd frontend
if not exist node_modules (
    echo Installing node modules (this might take a minute)...
    call npm install
)
echo Starting React dev server in a new window...
start cmd /k "title UtilityHub Frontend && npm run dev"
cd ..
echo.

echo ===================================================
echo Startup commands issued successfully!
echo.
echo - Backend API running at: http://localhost:8000
echo - Frontend Application running at: http://localhost:5173
echo ===================================================
echo.
pause
