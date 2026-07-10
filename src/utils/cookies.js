// utils/cookies.js

const crypto = require('../utils/crypto');

//------------------------------------------------------------------------------
// setRefreshCookie
//------------------------------------------------------------------------------
// This function extracts the EXPiration timestamp from the refresh token, then
// creates a cookie whose lifetime matches the JWT.
//------------------------------------------------------------------------------
function setRefreshCookie(res, refreshToken)
   {
   // Decode refresh token to get EXPiration timestamp
   const payload = crypto.validateRefreshToken(refreshToken);

   const nowMs    = Date.now();
   const expMs    = payload.exp * 1000;  // Convert exp to milliseconds
   const maxAgeMs = expMs - nowMs;       // Set cookie expiration to match JWT

   res.cookie(
      'refreshToken',
      refreshToken,
      {
      httpOnly: true,
      secure:   true,
      sameSite: 'strict',
      maxAge:   maxAgeMs
      }
   );
   }


//------------------------------------------------------------------------------
// clearRefreshCookie
//------------------------------------------------------------------------------
function clearRefreshCookie(res)
   {
   res.clearCookie(
      'refreshToken',
      {
      httpOnly: true,
      secure:   true,
      sameSite: 'strict'
      }
      );
   }

module.exports =
   {
   setRefreshCookie,
   clearRefreshCookie
   };
