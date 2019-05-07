const sessions = require('../lib/sessions');

/** @function loadSession 
 * Middleware function for attaching an active session 
 * (if any) to the request object.  Adds session data to 
 * req.session and user data to req.user 
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 * @param {function} callback - an endpoint or middleware to invoke once done.
 */
function loadSession(req, res, callback) {
console.log('cookie', req.headers.cookie)
  // If there is no cookie, there is no session to load
  if(!req.headers.cookie) return callback(req, res);
  // If the cookie exists, check for match
  var match = /SID=(\S+);?/.exec(req.headers.cookie);
console.log('match', match);
  // If there is no match, there is no session to load
  if(!match) return callback(req, res);
  // Load the session and attach it to the request
  var sid = match[1];
  sessions.get(sid, (err, session) => {
    if(err) return callback(req, res);
    console.log('valid session', session.user, session.data);
    req.user = session.user;
    req.session = session.data;
    callback(req, res);
  });
}

module.exports = loadSession;