const crypto       = require('../utils/crypto');
const identityHash = require('../identity/identityHash');

async function createRefreshToken(user)
   {
   const token_hash = await identityHash.createIdentityHash(user);

   const payload =
      {
      purpose:    'session_refresh',
      id:         user.id,
      token_hash: token_hash
      };

   return crypto.generateRefreshToken(payload);
   }

module.exports = { createRefreshToken };
