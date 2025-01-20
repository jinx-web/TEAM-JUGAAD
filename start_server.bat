@echo off
echo Starting EcoEssentials Server...
echo.

REM Activate virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)

REM Check if Python is installed
python --version > nul 2>&1
if errorlevel 1 (
    echo Python is not installed! Please install Python first.
    pause
    exit /b 1
)

REM Check if required packages are installed
pip show flask > nul 2>&1
if errorlevel 1 (
    echo Installing required packages...
    pip install -r requirements.txt
)

REM Start the Flask server
echo Starting Flask server...
start python app.py

echo.
echo Server is starting...
echo You can now open your browser and go to: http://localhost:5000
echo.
echo To stop the server, close this window.
pause
