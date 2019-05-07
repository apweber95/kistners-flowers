const bcrypt = require('bcrypt');
const templates = require('../lib/templates');
const parseBody = require('../lib/parse-body');
const db = require('../data/userDatabase');
const serve500 = require('../src/serve500');
const sessions = require('../lib/sessions');
const newUser = require('../src/new-user');


const ENCRYPTION_PASSES = 10;

/** @module createUser 
 * POST enpiont for creating a user 
 */
module.exports = createUser;

/** @function createUser 
 * Starts the process of creating a user from the POSTed form data
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 */
function createUser(req, res) {
  parseBody(req, res, (req, res) => {
    validateUser(req, res, req.body);
  });
}

/** @function validateUser 
 * Validates the provided user and invokes createPasswordHash()
 * or failure().
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 * @param {object} user - the user to validate
 */
function validateUser(req, res, user) {
  // Validation checks
  if(typeof user.username !== "string" || user.username.length < 3) 
    return failure(req, res, "Username must be at least three characters in length");
  if(typeof user.password !== "string" || user.password.length < 10)
    return failure(req, res, "Password must be at least ten characters in length");
  if(user.password !== user.passwordConfirmation)
    return failure(req, res, "Password and Password Confirmation must match");
  // Uniqueness check 
  db.get("SELECT id FROM users WHERE username = ?", user.username, (err, row) => {
    if(err) return failure(req, res);
    if(row) return failure(req, res, 'That username is already taken.  Did you mean to <a href="/signin">sign in</a>?');
    // If we get this far, we have a valid and unique user!
    createPasswordHash(req, res, user);
  });
}

/** @function createPasswordHash
 * Creates a hashed version of the user password and invokes
 * saveUser() or failure().
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 * @param {object} user - the user to create a hash for
 */
function createPasswordHash(req, res, user) {
  bcrypt.hash(user.password, ENCRYPTION_PASSES, (err, hash) => {
    if(err) return failure(req, res);
    user.cryptedPassword = hash;
    saveUser(req, res, user);
  });
}

/** @function saveUser 
 * Saves the provided user to the database and invokes createPasswordHash()
 * or failure().
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 * @param {object} user - the user to validate
 */
function saveUser(req, res, user) {
   user.role = "Employee";
  db.run(`INSERT INTO users (username, cryptedPassword, role) VALUES('${user.username}', '${user.cryptedPassword}', '${user.role}');`,
    (err) => {
      if(err) failure(req, res, err);
      else success(req, res, user);
    }
  ); 
}

/** @function success 
 * Creates a session for the newly created user and 
 * redirects them to the home page.
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object
 * @param {Object} user - the user this session belongs to 
 */
function success(req, res, user) {
  sessions.create(user, (err, sid) => {
    if(err) return serve500(req, res, err);
    // Set the cookie containing the SID
    res.setHeader("Set-Cookie", `SID=${sid}; Secure`);
    // Redirect to the home page 
    res.setHeader("Location", "/");
    res.statusCode = 302;
    res.end();
  });
}

/** @function failure
 * Enpoint that renders the sign up form on a failure with an optional message.
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 * @param {string} errorMessage (optional) - an error message to display 
 */
function failure(req, res, errorMessage) {
  if(!errorMessage) errorMessage = "There was a problem creating your account. Please try again.";
   newUser(req, res, errorMessage);
}