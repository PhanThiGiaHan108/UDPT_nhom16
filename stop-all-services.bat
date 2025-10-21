@echo off
echo ========================================
echo Stopping All EduLearn Services
echo ========================================
echo.

echo Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul

echo Killing all npm processes...
taskkill /F /IM npm.cmd 2>nul

echo.
echo ========================================
echo All services stopped!
echo ========================================
pause
