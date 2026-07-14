const cookies = require('../utils/cookies');

//------------------------------------------------------------------------------
// logoutHandler
//------------------------------------------------------------------------------
async function logoutHandler(req, res)
   {
   const refreshToken = req?.cookies?.refreshToken;

   if ( ! refreshToken )
      return res.status(401).json({ error: 'Refresh token required.' });

   try
      {
      // If the token is valid enough to extract a session_id,
      // delete the corresponding session row.
      const payload = crypto.validateRefreshToken(refreshToken);
      sessionsModel.deleteSessionById(payload.session_id);
      }
   catch (err)
      {
      // Token is invalid, expired, malformed, or untrusted.
      // We cannot delete a session row because we cannot trust the payload,
      // but logout must still succeed.
      }
   finally
      {
      // Clearing the cookie must always be done because it is the logout 
      // mechanism of the hybrid model. Deleting the session row above is done 
      // for completeness.

      cookies.clearRefreshCookie(res);
      }

   return res.json({ message: 'Logged out successfully' });
   }

module.exports = { logoutHandler };
