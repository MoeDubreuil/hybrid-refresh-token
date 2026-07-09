const crypto       = require('../utils/crypto');
const identityHash = require('../identity/identityHash');

//------------------------------------------------------------------------------
// createRefreshToken (teaching repo version)
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

module.exports = { createRefreshToken };
