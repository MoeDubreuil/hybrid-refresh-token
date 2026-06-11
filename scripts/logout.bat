cls
@echo off
@echo Logging out (clearing refreshToken cookie)
@echo.

@echo Note: Replace YOUR_REFRESH_TOKEN_HERE with the cookie value from login.
@echo.

curl -i -X POST http://localhost:3000/auth/logout ^
   --cookie "refreshToken=YOUR_REFRESH_TOKEN_HERE"

@echo.
@echo [Done]
@echo.
