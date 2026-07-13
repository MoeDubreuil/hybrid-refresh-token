const express            = require('express');
const { loginHandler }   = require('../auth/loginHandler');
const { refreshHandler } = require('../auth/refreshHandler');
const { logoutHandler }  = require('../auth/logoutHandler');
const { logoutAllHandler } = require('../auth/logoutAllHandler');

//------------------------------------------------------------------------------
// buildRoutes
//------------------------------------------------------------------------------
function buildRoutes()
   {
   const router = express.Router();

   router.post('/login',   loginHandler);
   router.post('/refresh', refreshHandler);
   router.post('/logout',  logoutHandler);
   router.post('/logout-all', logoutAllHandler);

   return router;
   }

module.exports = { buildRoutes };
