
sessionsModel = require("../models/sessionsModel");
userModel = require("../models/userModel");
cookies = require("../utils/cookies");

//------------------------------------------------------------------------------
// logoutAllHandler
//------------------------------------------------------------------------------
// NOTE: This is intentionally verbose for teaching purposes. In a production
// system, you would NOT reveal internal invalidation details.
//------------------------------------------------------------------------------
async function logoutAllHandler(req, res)
   {
   const userId = req.body?.user_id;

   if ( ! userId )
      {
      console.log("LOGOUT-ALL FAILED: no user_id provided");
      return res.status(400).json({ error: "user_id required" });
      }


   // Because the token version field is used to construct the identity string,
   // changing its' value changes the identity hash. This causes all tokens which 
   // carry the identity hash to become invalid globally and instantly.
   
   const newVersion = userModel.incrementTokenVersion(userId);

   if ( newVersion === 0 )
      {
      console.log("LOGOUT-ALL FAILED: user not found");
      return res.status(404).json({ error: "user not found" });
      }

   console.log(`LOGOUT-ALL: token_version ${newVersion - 1} → ${newVersion}`);

   // Cookie and session cleanup      
   cookies.clearRefreshCookie(res);
   sessionsModel.deleteSessionsForUser(userId);
   console.log(`LOGOUT-ALL: deleted all sessions for user ${userId}`);

   return res.json(
      {
      message: "All sessions invalidated (identity hash rotated)",
      user_id: userId,
      old_version: newVersion - 1,
      new_version: newVersion
      }
   );
   }

module.exports = { logoutAllHandler };
