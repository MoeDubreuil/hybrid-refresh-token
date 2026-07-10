require('dotenv').config();

const { seedUser } = require('./models/userModel');
const { createServer } = require('./http/server');


//------------------------------------------------------------------------------
// seedExampleUser
//------------------------------------------------------------------------------
function seedExampleUser()
   {
   seedUser(
      {
      id:                   1,
      login_identifier:     'demo@example.com',
      role:                 'user',
      password_fingerprint: 'demo-password',
      token_version:        0
      }
      );
   }

//------------------------------------------------------------------------------
// main
//------------------------------------------------------------------------------
async function main()
   {
   try
      {
      seedExampleUser();
      await createServer();
      }
   catch (err)
      {
      console.error('Fatal startup error:', err);
      }
   }

main();
