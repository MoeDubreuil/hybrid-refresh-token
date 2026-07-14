const cookies                = require('../utils/cookies');
const { createAccessToken }  = require('./accessTokens');
const { createRefreshToken } = require('./refreshTokens');


//------------------------------------------------------------------------------
// createUserTokens
//------------------------------------------------------------------------------
// Issues a new access token and refresh token. The refresh token contains:
//   - user.id
//   - token_hash (identity hash)
//   - session_id
//   - refresh_counter
//------------------------------------------------------------------------------
async function createUserTokens(res, user, session)
   {
   const newAccessToken  = createAccessToken(user);
   const newRefreshToken = await createRefreshToken(user, session);

   cookies.setRefreshCookie(res, newRefreshToken);

   return newAccessToken;
   }

module.exports =
   {
   createUserTokens: createUserTokens
   };
