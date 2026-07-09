const userModel       = require('../models/userModel');
const sessionsModel   = require('../models/sessionsModel');
const cookies         = require('../utils/cookies');
const { createUserTokens } = require('./createUserTokens');

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

      // Password check omitted for demonstration repo

      //----------------------------------------------------------------------
      // Create session row (refresh_counter = 0)
      //----------------------------------------------------------------------
      const session = sessionsModel.createSession(user.id);

      //----------------------------------------------------------------------
      // Issue user-based tokens (access and refresh), and store refresh
      // token in a cookie.
      //----------------------------------------------------------------------
      const accessToken = await createUserTokens(res, user, session);

      //----------------------------------------------------------------------
      // Response
      //----------------------------------------------------------------------
      return res.json(
         {
         user:
            {
            id:               user.id,
            login_identifier: user.login_identifier,
            role:             user.role
            },
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

module.exports =
   {
   loginHandler: loginHandler
   };
