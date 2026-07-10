const express            = require('express');
const { loginHandler }   = require('../auth/loginHandler');
const { refreshHandler } = require('../auth/refreshHandler');
const { logoutHandler }  = require('../auth/logoutHandler');

//------------------------------------------------------------------------------
// buildRoutes
//------------------------------------------------------------------------------
function buildRoutes()
   {
   const router = express.Router();

   router.post('/login',   loginHandler);
   router.post('/refresh', refreshHandler);
   router.post('/logout',  logoutHandler);

   return router;
   }

module.exports = { buildRoutes };
