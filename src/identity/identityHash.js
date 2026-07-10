const bcrypt                      = require('bcrypt');
const { createUserIdentityState } = require('./identityState');
const { buildIdentityString }     = require('./identityString');

//------------------------------------------------------------------------------
// createIdentityHash
//------------------------------------------------------------------------------
async function createIdentityHash(user)
   {
   const identityState  = createUserIdentityState(user);
   const identityString = buildIdentityString(identityState);

   return bcrypt.hash(identityString, 12);
   }

//------------------------------------------------------------------------------
// validateUserIdentity
//------------------------------------------------------------------------------
async function validateUserIdentity(user, token_hash)
   {
   const identityState  = createUserIdentityState(user);
   const identityString = buildIdentityString(identityState);

   return bcrypt.compare(identityString, token_hash);
   }

module.exports =
   {
   createIdentityHash,
   validateUserIdentity
   };
