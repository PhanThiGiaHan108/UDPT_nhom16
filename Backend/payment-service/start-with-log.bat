@echo off
echo Starting Payment Service with logging...
node server.js 2>&1 | tee payment-debug.log
pause
