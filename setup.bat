@echo off
REM Security Toolkit - Project Setup Script
REM This script creates all necessary directories and copies files

echo.
echo ========================================
echo   Security Toolkit - Setup
echo ========================================
echo.

REM Create directories
echo Creating directory structure...
mkdir public\css
mkdir public\js
mkdir scanner

echo Directories created.

REM Copy scanner files
echo.
echo Copying scanner modules from link_scanner...
xcopy "link_scanner\scanner\*" "scanner\" /Y /I

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Run: npm start
echo.
echo The toolkit will be available at http://localhost:3000
echo.
pause
