const express        = require('express');
const cookieParser   = require('cookie-parser');
const { buildRoutes } = require('./routes');

async function createServer()
   {
   const app = express();

   app.use(express.json());
   app.use(cookieParser());

   app.use('/auth', buildRoutes());

   const port = process.env.PORT || 3000;

   app.listen(port, function ()
      {
      console.log('Server listening on port', port);
      });
   }

module.exports = { createServer };
