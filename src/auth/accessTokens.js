const crypto = require('../utils/crypto');

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

module.exports = { createAccessToken };
