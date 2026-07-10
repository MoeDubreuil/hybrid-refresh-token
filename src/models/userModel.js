const users = new Map();

//------------------------------------------------------------------------------
// getUserById
//------------------------------------------------------------------------------
function getUserById(id)
   {
   return users.get(id) || null;
   }

//------------------------------------------------------------------------------
// findUserByLoginIdentifier
//------------------------------------------------------------------------------
function findUserByLoginIdentifier(login_identifier)
   {
   for (const user of users.values())
      {
      if ( user.login_identifier === login_identifier )
         return user;
      }

   return null;
   }

//------------------------------------------------------------------------------
// seedUser
//------------------------------------------------------------------------------
function seedUser(user)
   {
   users.set(user.id, user);
   }

module.exports =
   {
   getUserById,
   findUserByLoginIdentifier,
   seedUser
   };
