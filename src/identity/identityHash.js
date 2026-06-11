const bcrypt                      = require('bcrypt');
const { createUserIdentityState } = require('./identityState');
const { buildIdentityString }     = require('./identityString');

async function createIdentityHash(user)
   {
   const identityState  = createUserIdentityState(user);
   const identityString = buildIdentityString(identityState);

   return bcrypt.hash(identityString, 12);
   }

async function validateUserIdentity(user, token_hash)
   {
   const identityState  = createUserIdentityState(user);
   const identityString = buildIdentityString(identityState);
   const current_hash   = await bcrypt.hash(identityString, 12);

   return bcrypt.compare(current_hash, token_hash);
   }

module.exports =
   {
   createIdentityHash,
   validateUserIdentity
   };
