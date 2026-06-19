@echo off
echo Building React app...
call npm run build

echo.
echo Starting server on http://localhost:5000
echo.
cd backend
call npm start
