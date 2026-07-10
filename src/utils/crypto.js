const jwt = require('jsonwebtoken');

//------------------------------------------------------------------------------
// generateAccessToken
//------------------------------------------------------------------------------
function generateAccessToken(payload)
   {
   return jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
      );
   }

//------------------------------------------------------------------------------
// generateRefreshToken
//------------------------------------------------------------------------------
function generateRefreshToken(payload)
   {
   return jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
      );
   }

//------------------------------------------------------------------------------
// validateRefreshToken
//------------------------------------------------------------------------------
function validateRefreshToken(token)
   {
   return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
   }

module.exports =
   {
   generateAccessToken,
   generateRefreshToken,
   validateRefreshToken
   };
