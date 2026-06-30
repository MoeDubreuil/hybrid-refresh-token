// utils/cookies.js


function setRefreshCookie(res, refreshToken)
   {
   // Decode refresh token to get exp
   const payload = crypto.validateRefreshToken(refreshToken);

   const nowMs    = Date.now();
   const expMs    = payload.exp * 1000;
   const maxAgeMs = expMs - nowMs;

   res.cookie(
      'refresh',
      refreshToken,
      {
      httpOnly: true,
      secure:   true,
      sameSite: 'strict',
      maxAge:   maxAgeMs
      }
   );
   }


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
