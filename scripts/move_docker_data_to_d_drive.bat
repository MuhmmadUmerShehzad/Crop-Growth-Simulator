@echo off
echo ========================================================
echo Relocating Docker WSL2 Storage to D:\Docker\wsl\data...
echo This ensures all Docker images/containers use D: drive, NOT C:.
echo ========================================================
echo.

wsl --shutdown

if not exist "D:\Docker\wsl\data" mkdir "D:\Docker\wsl\data"

echo Exporting docker-desktop-data to D:\Docker\wsl\docker-desktop-data.tar...
wsl --export docker-desktop-data "D:\Docker\wsl\docker-desktop-data.tar"

if %ERRORLEVEL% EQU 0 (
    echo Unregistering old C: drive location...
    wsl --unregister docker-desktop-data
    
    echo Importing to D:\Docker\wsl\data...
    wsl --import docker-desktop-data "D:\Docker\wsl\data" "D:\Docker\wsl\docker-desktop-data.tar" --version 2
    
    echo Cleaning up tar file...
    del "D:\Docker\wsl\docker-desktop-data.tar"
    
    echo.
    echo Successfully moved Docker storage to D: drive!
) else (
    echo Note: docker-desktop-data WSL instance not active yet.
    echo Once Docker Desktop starts, run this script to migrate image storage to D:.
)

pause
