
//------------------------------------------------------------------------------
// buildIdentityString
//
// The purpose of this function is to create a string containing all
// identity state fields. Any change to any character in the output string creates
// a change to the resulting identity hash generated from it. To be correct all
// identity state fields must be included.
//------------------------------------------------------------------------------
function buildIdentityString(identityState)
   {
   return [
      identityState.role,
      identityState.app_token_version,
      identityState.id,
      identityState.password_fingerprint,
      identityState.token_version,
      identityState.login_identifier
      ].join(':');
   }

module.exports = { buildIdentityString };
