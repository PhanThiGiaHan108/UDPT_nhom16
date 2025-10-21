@echo off
echo ========================================
echo Starting EduLearn Services
echo ========================================
echo.

REM Start API Gateway (Port 5000)
echo [1/5] Starting API Gateway on port 5000...
start "API Gateway" cmd /k "cd Backend\api-gateway && node server.js"
timeout /t 3 /nobreak >nul

REM Start Auth Service (Port 5001)
echo [2/5] Starting Auth Service on port 5001...
start "Auth Service" cmd /k "cd Backend\auth-service && node server.js"
timeout /t 3 /nobreak >nul

REM Start Course Service (Port 5002)
echo [3/5] Starting Course Service on port 5002...
start "Course Service" cmd /k "cd Backend\course-service && node server.js"
timeout /t 3 /nobreak >nul

REM Start Payment Service (Port 5004)
echo [4/5] Starting Payment Service on port 5004...
start "Payment Service" cmd /k "cd Backend\payment-service && node server.js"
timeout /t 3 /nobreak >nul

REM Start Frontend (Port 5173)
echo [5/5] Starting Frontend on port 5173...
start "Frontend" cmd /k "cd Frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo.
echo API Gateway:     http://localhost:5000
echo Auth Service:    http://localhost:5001
echo Course Service:  http://localhost:5002
echo Payment Service: http://localhost:5004
echo Frontend:        http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
