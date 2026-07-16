const crypto       = require('../utils/crypto');
const cookies      = require('../utils/cookies');
const identityHash = require('../identity/identityHash');

//------------------------------------------------------------------------------
// createAccessToken
//------------------------------------------------------------------------------
function createAccessToken(user)
   {
   return crypto.generateAccessToken(
      {
      purpose: 'session_access',
      id:      user.id,
      role:    user.role
      }
      );
   }

//------------------------------------------------------------------------------
// createRefreshToken
//------------------------------------------------------------------------------
async function createRefreshToken(user, session)
   {
   const token_hash = await identityHash.createIdentityHash(user);

   const payload =
      {
      purpose:         "session_refresh",
      user_id:         user.id,
      token_hash:      token_hash,
      session_id:      session.session_id,
      refresh_counter: session.refresh_counter
      };

   return crypto.generateRefreshToken(payload);
   }

//------------------------------------------------------------------------------
// createUserTokens
//------------------------------------------------------------------------------
// Issues a new access token and refresh token. The refresh token contains:
//   - user.id
//   - token_hash (identity hash)
//   - session_id
//   - refresh_counter
//------------------------------------------------------------------------------
async function createUserTokens(res, user, session)
   {
   const newAccessToken  = createAccessToken(user);
   const newRefreshToken = await createRefreshToken(user, session);

   cookies.setRefreshCookie(res, newRefreshToken);

   return newAccessToken;
   }

module.exports = 
   { 
   createUserTokens 
   };
