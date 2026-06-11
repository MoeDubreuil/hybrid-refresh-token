const userModel            = require('../models/userModel');
const cookies              = require('../utils/cookies');
const crypto               = require('../utils/crypto');
const { createAccessToken }  = require('./accessTokens');
const { createRefreshToken } = require('./refreshTokens');

async function loginHandler(req, res)
   {
   const login_identifier = req.body.login_identifier;
   const password         = req.body.password;

   try
      {
      const user = userModel.findUserByLoginIdentifier(login_identifier);

      if ( ! user )
         {
         return res.status(401).json({ error: 'Invalid credentials' });
         }

      // Password check omitted for teaching repo

      const accessToken  = createAccessToken(user);
      const refreshToken = await createRefreshToken(user);

      const payload = crypto.validateRefreshToken(refreshToken);

      const nowMs    = Date.now();
      const expMs    = payload.exp * 1000;
      const maxAgeMs = expMs - nowMs;

      cookies.setRefreshCookie(res, refreshToken, maxAgeMs);

      return res.json(
         {
         user:        { id: user.id, login_identifier: user.login_identifier, role: user.role },
         accessToken: accessToken
         }
         );
      }
   catch (err)
      {
      console.error('loginHandler failed:', err);
      return res.status(500).json({ error: 'Internal server error' });
      }
   }

module.exports = { loginHandler };
