@echo off

REM NOTE: This script file uses curl to simulate refresh cookie
REM       theft detection.

echo === STEP 1: Login (obtain refresh cookie) ===
curl -i -c cookies\demo.txt ^
  -X POST http://localhost:3000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"login_identifier\":\"demo@example.com\",\"password\":\"demo\"}"

echo.
echo Saving original refresh cookie for later replay...
copy /Y cookies\demo.txt cookies\demo_original.txt >nul

echo.
echo === STEP 2: Refresh (should succeed and rotate refresh_counter) ===
curl -i -b cookies\demo.txt -c cookies\demo.txt ^
  -X POST http://localhost:3000/auth/refresh

echo.
echo === STEP 3: Replay original cookie (simulate attacker using stolen token) ===
copy /Y cookies\demo_original.txt cookies\demo.txt >nul

echo.
echo === STEP 4: Refresh again (should FAIL with session fingerprint mismatch) ===
curl -i -b cookies\demo.txt ^
  -X POST http://localhost:3000/auth/refresh

echo.
echo === DEMO COMPLETE ===
