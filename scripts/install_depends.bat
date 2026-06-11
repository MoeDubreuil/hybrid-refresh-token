cls
@echo off
@echo.
@echo Installing dependencies for the Hybrid Refresh Token teaching project.
@echo.
@echo * express
@echo * cookie-parser
@echo * dotenv
@echo * bcrypt
@echo * jsonwebtoken
@echo.

PAUSE

PUSHD ..

call npm i --save express
IF ERRORLEVEL 1 goto ErrorExit

call npm i --save cookie-parser
IF ERRORLEVEL 1 goto ErrorExit

call npm i --save dotenv
IF ERRORLEVEL 1 goto ErrorExit

call npm i --save bcrypt
IF ERRORLEVEL 1 goto ErrorExit

call npm i --save jsonwebtoken
IF ERRORLEVEL 1 goto ErrorExit

goto Exit

:ErrorExit

@echo.
@echo ERROR(%ERRORLEVEL%): NPM returned an error. Review the messages above.
@echo.

:Exit

POPD

@echo.
@echo [Done]
@echo.
