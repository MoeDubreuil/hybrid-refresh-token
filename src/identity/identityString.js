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
