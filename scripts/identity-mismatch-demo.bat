@echo off

echo === STEP 1: Login (obtain refresh cookie) ===
curl -i -c cookies\demo.txt -X POST http://localhost:3000/auth/login ^
   -H "Content-Type: application/json" ^
   -d "{\"login_identifier\":\"demo@example.com\",\"password\":\"demo\"}"

echo.
echo.
echo === STEP 2: Refresh (should succeed) ===
curl -i -b cookies\demo.txt -c cookies\demo.txt ^
   -X POST http://localhost:3000/auth/refresh


echo.
echo.
echo === STEP 3: Logout-All (rotate identity hash) ===
curl -i -b cookies\demo.txt ^
  -X POST http://localhost:3000/auth/logout-all ^
  -H "Content-Type: application/json" ^
  -d "{\"user_id\":1}"


echo.
echo.
echo === STEP 4: Refresh again (should FAIL with identity hash mismatch) ===
curl -i -b cookies\demo.txt -c cookies\demo.txt ^
   -X POST http://localhost:3000/auth/refresh

echo.
echo === DEMO COMPLETE ===
