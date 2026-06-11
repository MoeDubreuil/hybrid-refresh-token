cls
@echo off
@echo Logging in as demo@example.com
@echo.

curl -i -X POST http://localhost:3000/auth/login ^
   -H "Content-Type: application/json" ^
   -d "{\"login_identifier\":\"demo@example.com\",\"password\":\"demo\"}"

@echo.
@echo [Done]
@echo.
