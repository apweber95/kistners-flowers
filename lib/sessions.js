const uuidv1 = require('uuid/v1');

// Expire sessions after 3 minutes
const SESSION_MAX_DURATION = 3 * 60 * 1000;

// Clear sessions every hour
const EXPIRATION_INTERVAL = 60 * 60 * 1000;

var sessions = {}  
  
/** @function generateUUID 
 * Generates a Universally Unique Identifier
 * @returns {uiid} the generated uuid
 */
function generateUUID() {
  var id = uuidv1();
  // Invariant: The current value of uuid is already in use 
  while(sessions[id]) {id = uuidv1()}
  return id;
}

/** @function isSessionExpired 
 * Checks if a session has expired.  Will delete an expired session.
 * @param {uuid} sid - the id of the session to check.
 */
function isSessionExpired(sid) {
  if(!sessions[sid]) return true; // session doesn't exist
  var expired = Date.now() - sessions[sid].timestamp > SESSION_MAX_DURATION;
  if(expired) {
    delete sessions[sid];
    return true;
  } else {
    return false;
  }
}

/** @function expireSessions 
 * Iterates through the sessions and clears any that have expired
 */
function expireSessions() {
  for(var sid in sessions) {
    isSessionExpired(sid);
  }
}

/** Trigger the expiration of sessions at the supplied interval */
setInterval(expireSessions, EXPIRATION_INTERVAL);

/** @function createSession 
 * Creates a new session for the supplied user 
 * @param {object} user - the user this session is for 
 * @param {function} callback - the callback to invoke when done .
 * Expects an error parameter (will be truthy if the session expired)
 */
function createSession(user, callback) {
  var sid = generateUUID();
  sessions[sid] = {
    timestamp: Date.now(),
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    },
    data: {}
  };
  callback(false, sid);
}
  

/** @function getSession 
 * Retrieves the requested session, and resets its timestamp 
 * @param {uuid} id - the session identifier 
 * @param {function} callback - a callback function to invoke when done 
 * Expects two parameters: and error (will be truthy if the session is expired) and 
 * the session.
 */
function getSession(id, callback) {
  if(isSessionExpired(id)) {
    callback("Session expired");
  } else {
    // reset the timestamp 
    sessions[id].timestamp = Date.now();
    callback(false, sessions[id]);
  }
}
  
/** @function updateSession 
 * Updates the specified session with teh specified data 
 * @param {uuid} id - the session identifier 
 * @param {object} data - the data to store in the session 
 * @param {function} callback - a callaback to invoke when done.  
 * Expects a single error parameter 
 */
function updateSession(id, data, callback) {
  if(isSessionExpired(id)) {
    callback("Session expired");
  } else {
    sessions[id].timestamp = Date.now();
    sessions[id].data = data;
    callback(false);
  }
}

/** @function destroySession 
 * Destroys the specified session (if it exists)
 * @param {uuid} id - the session identifier
 * @param {function} callback - a function to invoke when the session is destroyed
 * It takes one parameter, an error value.
 */
function destroySession(id, callback) {
  delete sessions[id];
  callback(false);
}

/** @module sessions 
 * Exposes the methods for creating, retrieving, updating, and destroying sessions.
 */
module.exports = {
  create: createSession,
  get: getSession,
  update: updateSession,
  destroy: destroySession
}
 