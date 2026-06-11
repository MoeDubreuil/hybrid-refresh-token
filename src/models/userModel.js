const users = new Map();

function getUserById(id)
   {
   return users.get(id) || null;
   }

function findUserByLoginIdentifier(login_identifier)
   {
   for (const user of users.values())
      {
      if (user.login_identifier === login_identifier)
         {
         return user;
         }
      }

   return null;
   }

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
