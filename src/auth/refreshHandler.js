const crypto               = require('../utils/crypto');
const cookies              = require('../utils/cookies');
const userModel            = require('../models/userModel');
const identityHash         = require('../identity/identityHash');
const { createAccessToken }  = require('./accessTokens');
const { createRefreshToken } = require('./refreshTokens');

async function refreshHandler(req, res)
   {
   const refreshToken = req?.cookies?.refreshToken;

   if ( ! refreshToken )
      {
      return res.status(401).json({ error: 'Refresh token required.' });
      }

   try
      {
      let payload = null;

      // Extract the token payload

      try
         {
         payload = crypto.validateRefreshToken(refreshToken);
         }
      catch (err)
         {
         cookies.clearRefreshCookie(res);
         return res.status(401).json({ error: 'Invalid token' });
         }

      // Locate the user referenced by the token 

      const user = userModel.getUserById(payload.id);

      if ( ! user )
         {
         cookies.clearRefreshCookie(res);
         return res.status(401).json({ error: 'Invalid token' });
         }

      // Validate the identity state fingerprint held by the token

      const hashMatches = await identityHash.validateUserIdentity(user, payload.token_hash);

      if ( ! hashMatches )
         {
         cookies.clearRefreshCookie(res);
         return res.status(401).json({ error: 'Invalid token' });
         }

      //------------------------------------------------------------------
      // Refresh successful - rotate tokens
      //------------------------------------------------------------------

      const accessToken = createAccessToken(user);
      const newRefresh  = await createRefreshToken(user);

      // Decode new refresh token to extract exp
      const newPayload = crypto.validateRefreshToken(newRefresh);

      const nowMs     = Date.now();
      const expMs     = newPayload.exp * 1000;
      const maxAgeMs  = expMs - nowMs;

      cookies.setRefreshCookie(res, newRefresh, maxAgeMs);

      return res.json(
         {
         user:        { id: user.id, login_identifier: user.login_identifier, role: user.role },
         accessToken: accessToken
         }
         );
      }
   catch (err)
      {
      console.error('Refresh error:', err);
      return res.status(401).json({ error: 'Invalid token' });
      }
   }

module.exports = { refreshHandler };
