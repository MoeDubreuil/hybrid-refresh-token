function setRefreshCookie(res, token, maxAgeMs)
   {
   res.cookie(
      'refreshToken',
      token,
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
