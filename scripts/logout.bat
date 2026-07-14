cls
@echo off
@echo Logging out (clearing refreshToken cookie)
@echo.

curl -i -b cookies\demo.txt -c cookies\demo.txt ^
  -X POST http://localhost:3000/auth/logout

@echo.
@echo [Done]
@echo.
