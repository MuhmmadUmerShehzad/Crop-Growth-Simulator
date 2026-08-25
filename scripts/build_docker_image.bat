@echo off
cd /d "%~dp0\.."
echo ========================================================
echo Building Docker Image for Rice Yield Growth Simulator...
echo ========================================================
echo.

docker build -t rice-yield-growth-simulator:latest .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo Docker image built successfully!
    echo.
    echo To run the container on port 8080, run:
    echo   docker compose up -d
    echo   or
    echo   docker run -d -p 8080:80 --name rice_yield_frontend rice-yield-growth-simulator:latest
    echo ========================================================
) else (
    echo.
    echo Build failed. Please check that Docker Desktop daemon is running.
)

pause
