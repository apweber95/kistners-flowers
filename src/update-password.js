const bcrypt = require('bcrypt');
const templates = require('../lib/templates');
const parseBody = require('../lib/parse-body');
const db = require('../data/userDatabase');
const serve500 = require('../src/serve500');
const sessions = require('../lib/sessions');
const newPassword = require('../src/new-password');


const ENCRYPTION_PASSES = 10;

/** @module createUser 
 * POST enpiont for creating a user 
 */
module.exports = updateUser;

function updateUser(req, res) {
        if(!req.user || req.user.role !== "Employee" || req.user.role !== "Admin") {
        res.setHeader("Location", "/signin");
        res.statusCode = 302;
        res.end();
        return;
    }
  parseBody(req, res, (req, res) => {
    validateUser(req, res, req.body);
  });
}


/** @function newPassword 
 * Validates the provided user and invokes createPasswordHash()
 * or failure().
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 * @param {object} user - the user to validate
 */
function validateUser(req, res, body) {   
   
  db.get("SELECT cryptedPassword FROM users WHERE username = ?", req.user.username, (err, row) => {
      if(err) return failure(req, res, err);
      
      bcrypt.compare(body.password, row.cryptedPassword, (err, valid) => {
          if(err) return failure(req, res, err);
          if(!valid) return failure(req, res, "Incorrect password");
   
          if(typeof body.newPassword !== "string" || body.newPassword.length < 10)
            return failure(req, res, "Password must be at least ten characters in length");
          if(body.newPassword !== body.newPasswordConfirmation)
            return failure(req, res, "New password and new password confirmation must match");

          req.user.password = body.newPassword;
          createPasswordHash(req, res, req.user);
    });
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
    if(err) return failure(req, res, err);
    user.cryptedPassword = hash;
    updatePassword(req,res,user)
  });
}

/** @function saveUser 
 * Saves the provided user to the database and invokes createPasswordHash()
 * or failure().
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 * @param {object} user - the user to validate
 */
function updatePassword(req, res, user) {
  db.run(`UPDATE users SET cryptedPassword = '${user.cryptedPassword}' WHERE username = '${user.username}'`,
    (err) => {
      if(err) failure(req, res, err);
      else success(req, res, user);
    }
  ); 
}

/** @function success 
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 */
function success(req, res) {   
  newPassword(req, res,  "Password Updated!");
  res.end();
}

/** @function failure
 * Enpoint that renders the sign up form on a failure with an optional message.
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 * @param {string} errorMessage (optional) - an error message to display 
 */
function failure(req, res, errorMessage) {
  if(!errorMessage) errorMessage = "There was a problem updating your password. Please try again.";
   newPassword(req, res, errorMessage);
}