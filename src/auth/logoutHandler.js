const cookies = require('../utils/cookies');

//------------------------------------------------------------------------------
// logoutHandler
//------------------------------------------------------------------------------
async function logoutHandler(req, res)
   {
   const refreshToken = req?.cookies?.refreshToken;

   if ( ! refreshToken )
      return res.status(401).json({ error: 'Refresh token required.' });

   cookies.clearRefreshCookie(res);

   return res.json({ message: 'Logged out successfully' });
   }

module.exports = { logoutHandler };
