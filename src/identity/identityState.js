function createUserIdentityState(user)
   {
   return {
      id:                   user.id,
      login_identifier:     user.login_identifier,
      role:                 user.role,
      password_fingerprint: user.password_fingerprint,
      token_version:        user.token_version,
      app_token_version:    process.env.APP_TOKEN_VERSION || 0
      };
   }

module.exports = { createUserIdentityState };
