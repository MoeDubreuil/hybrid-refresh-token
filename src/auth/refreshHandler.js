//------------------------------------------------------------------------------
// NOTE FOR DEMONSTRATION REPO
//------------------------------------------------------------------------------
// These log messages expose internal validation details that should NEVER be
// revealed in a production environment. They are intentionally verbose here to
// demonstrate how the hybrid refresh model works and to help you verify each
// step of the flow.
//------------------------------------------------------------------------------

const crypto               = require('../utils/crypto');
const cookies              = require('../utils/cookies');
const userModel            = require('../models/userModel');
const sessionsModel        = require('../models/sessionsModel');
const identityHash         = require('../identity/identityHash');
const { createUserTokens } = require('./createUserTokens');

//------------------------------------------------------------------------------
// validateSession
//------------------------------------------------------------------------------
function validateSession(session, payload)
   {
   if ( session.session_id !== payload.session_id )
      return false;

   if ( session.refresh_counter !== payload.refresh_counter )
      return false;

   return true;
   }

//------------------------------------------------------------------------------
// refreshHandler
//------------------------------------------------------------------------------
async function refreshHandler(req, res)
   {
   const refreshToken = req?.cookies?.refreshToken;

   if ( ! refreshToken )
      {
      console.log("REFRESH FAILED: no refreshToken cookie present");
      return res.status(401).json({ error: 'Refresh token required.' });
      }

   try
      {
      // 1. Validate refresh token structure + signature
      let payload = null;

      try
         {
         payload = crypto.validateRefreshToken(refreshToken);
         }
      catch (err)
         {
         console.log("REFRESH FAILED: malformed or invalid JWT");
         cookies.clearRefreshCookie(res);
         return res.status(401).json({ error: 'Invalid token' });
         }

      // 2. Locate user
      const user = userModel.getUserById(payload.user_id);

      if ( ! user )
         {
         console.log("REFRESH FAILED: user not found");
         cookies.clearRefreshCookie(res);
         return res.status(401).json({ error: 'Invalid token' });
         }

      // 3. Validate identity hash (global invalidation)
      const hashMatches = await identityHash.validateUserIdentity(user, payload.token_hash);

      if ( ! hashMatches )
         {
         console.log("REFRESH FAILED: identity hash mismatch detected");
         cookies.clearRefreshCookie(res);
         return res.status(401).json({ error: 'Invalid token' });
         }

      // 4. Locate session
      const session = sessionsModel.getSessionById(payload.session_id);

      if ( ! session )
         {
         console.log("REFRESH FAILED: session not found");
         cookies.clearRefreshCookie(res);
         return res.status(401).json({ error: 'Invalid token' });
         }

      // 5. Validate session fingerprint (per-session theft detection)
      const sessionMatches = validateSession(session, payload);

      if ( ! sessionMatches )
         {
         console.log("REFRESH FAILED: session fingerprint mismatch detected");
         cookies.clearRefreshCookie(res);
         return res.status(401).json({ error: 'Invalid token' });
         }

      // 6. Increment refresh_counter (rotation)
      const oldCounter = session.refresh_counter;
      sessionsModel.incrementRefreshCounter(session.session_id);
      const newCounter = session.refresh_counter;

      console.log(`REFRESH #${oldCounter} → #${newCounter} (identity ok, session ok)`);

      // 7. Rotate tokens
      const accessToken = await createUserTokens(res, user, session);

      // 8. Return new access token + user info
      return res.json(
         {
         user: { id: user.id, login_identifier: user.login_identifier, role: user.role },
         accessToken: accessToken
         }
         );
      }
   catch (err)
      {
      console.log("REFRESH FAILED: unexpected error");
      console.error('Refresh error:', err);
      return res.status(401).json({ error: 'Invalid token' });
      }
   }

module.exports = { refreshHandler };
