// sessionsModel.js
// In-memory session table for demonstration purposes. In this context simplicity takes
// priority over recommended practices.

var sessions = [];
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

   ++ nextSessionId;

   sessions.push(session);

   return session;
   }

//------------------------------------------------------------------------------
// getSessionById
//------------------------------------------------------------------------------
function getSessionById(session_id)
   {
   var i;

   for (i = 0; i < sessions.length; i++)
      {
      if ( sessions[i].session_id === session_id )
         return sessions[i];
      }

   return null;
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
   var i;

   for (i = 0; i < sessions.length; i++)
      {
      if ( sessions[i].session_id === session_id )
         {
         sessions.splice(i, 1);
         return true;
         }
      }

   return false;
   }

//------------------------------------------------------------------------------
// deleteSessionsForUser
//------------------------------------------------------------------------------
function deleteSessionsForUser(user_id)
   {
   var count = 0;
   var i;

   for (i = sessions.length - 1; i >= 0; i--)
      {
      if (sessions[i].user_id === user_id)
         {
         sessions.splice(i, 1);
         ++ count;
         }
      }

   return count;
   }

module.exports =
   {
   createSession: createSession,
   getSessionById: getSessionById,
   incrementRefreshCounter: incrementRefreshCounter,
   deleteSessionById: deleteSessionById,
   deleteSessionsForUser: deleteSessionsForUser
   };
