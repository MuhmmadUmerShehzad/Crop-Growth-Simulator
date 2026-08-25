@echo off
echo ========================================================
echo Installing Docker Desktop to D:\Docker\Docker (Saving C: drive)...
echo ========================================================
echo.
if exist "D:\Docker\installer\DockerDesktopInstaller.exe" (
    echo Launching installer with target directory: D:\Docker\Docker
    "D:\Docker\installer\DockerDesktopInstaller.exe" install --installation-dir="D:\Docker\Docker" --accept-license
) else (
    echo Installer not found at D:\Docker\installer\DockerDesktopInstaller.exe.
    echo Downloading now...
    curl.exe -L -o "D:\Docker\installer\DockerDesktopInstaller.exe" "https://desktop.docker.com/win/main/amd64/Docker%%20Desktop%%20Installer.exe"
    "D:\Docker\installer\DockerDesktopInstaller.exe" install --installation-dir="D:\Docker\Docker" --accept-license
)
echo.
echo ========================================================
echo Done. Please launch Docker Desktop from Start menu or D:\Docker\Docker.
echo ========================================================
pause
