const admin = require('../src/serve-admin');
const createUser = require('../src/create-user');
const updatePassword = require('../src/update-password');
const parseBody = require('../lib/parse-body');
const db = require('../data/userDatabase');


function adminChanges(req, res){
    
    parseBody(req, res, (req, res) => {
       updateUserRole(req, res); 
    });
}
    
function updateUserRole(req, res){
    
    db.get(`SELECT username FROM users WHERE username = '${req.body.roleUsername}'`, (err, row)=>{
        if(err) return failure(req, res, err);
        if(!row) return failure(req, res, "Invalid username");
        
        db.run(`UPDATE users SET role = '${req.body.role}' WHERE username = '${req.body.roleUsername}'`, (err)=>{
            if(err) failure(req, res, err);
            else success(req, res);
        });
    });   
}


/** @function success 
 * Creates a session for the newly created user and 
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object
 */
function success(req, res) {   
    admin(req, res, "Success");
    res.end();   
}

/** @function failure
 * Enpoint that renders the sign up form on a failure with an optional message.
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 * @param {string} errorMessage (optional) - an error message to display 
 */
function failure(req, res, errorMessage) {
  if(!errorMessage) errorMessage = "There was a problem assigning the role. Please try again.";
   admin(req, res, errorMessage);
}
    
module.exports = adminChanges;