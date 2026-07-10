cls
@echo off
@echo Refreshing session using refreshToken cookie
@echo.

curl -i -b cookies\demo.txt -c cookies\demo.txt ^
   -X POST http://localhost:3000/auth/refresh


@echo.
@echo [Done]
@echo.
