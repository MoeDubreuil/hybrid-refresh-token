// sessionsModel.js
// In-memory session table for demonstration purposes. In this context simplicity takes
// priority over recommended practices.

var sessions = new Map();
var nextSessionId = 1;

//------------------------------------------------------------------------------
// createSession
//------------------------------------------------------------------------------
function createSession(user_id)
   {
   var session =
      {
      session_id: nextSessionId,
      user_id: user_id,
      refresh_counter: 0,
      created_at: Date.now(),
      updated_at: Date.now()
      };

   sessions.set(session.session_id, session);
   ++ nextSessionId;

   return session;
   }

//------------------------------------------------------------------------------
// getSessionById
//------------------------------------------------------------------------------
function getSessionById(session_id)
   {
   return sessions.get(session_id) || null;
   }

//------------------------------------------------------------------------------
// incrementRefreshCounter
//------------------------------------------------------------------------------
function incrementRefreshCounter(session_id)
   {
   var session = getSessionById(session_id);

   if ( session === null )
      return false;

   ++ session.refresh_counter;
   session.updated_at = Date.now();

   return true;
   }

//------------------------------------------------------------------------------
// deleteSessionById
//------------------------------------------------------------------------------
function deleteSessionById(session_id)
   {
   return sessions.delete(session_id);
   }

//------------------------------------------------------------------------------
// deleteSessionsForUser
//------------------------------------------------------------------------------
function deleteSessionsForUser(user_id)
   {
   var count = 0;

   for (const entry of sessions.entries())
      {
      var session_id = entry[0];
      var my_session = entry[1];

      if ( my_session.user_id === user_id )
         {
         deleteSessionById(session_id);
         ++ count;
         }
      }

   return count;
   }

module.exports =
   {
   createSession,
   getSessionById,
   incrementRefreshCounter,
   deleteSessionById,
   deleteSessionsForUser
   };
