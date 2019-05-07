var http = require('http');
const Router = require('./lib/router');
const Templates = require('./lib/templates');
const serveFile = require('./src/serve-file');
const serveHome = require('./src/serve-home');
const serveAnniversary = require('./src/serve-anniversary');
const serveBaby = require('./src/serve-baby');
const serveBirthday = require('./src/serve-birthday');
const serveProm = require('./src/serve-prom');
const serveSororitySisterhood = require('./src/serve-sorority-sisterhood');
const serveSympathy = require('./src/serve-sympathy');
const serveWedding = require('./src/serve-wedding');
const serveArrangement = require('./src/serve-arrangement');
const serveArrangementImage = require('./src/serve-arrangement-image');
const serve404 = require('./src/serve404');
const createUser = require('./src/create-user');
const newUser = require('./src/new-user');
const newSession = require('./src/new-session');
const createSession = require('./src/create-session');
const loadSession = require('./lib/load-session');
const newPassword = require('./src/new-password');
const updatePassword = require('./src/update-password');
const serveAdmin = require('./src/serve-admin');
const adminChanges = require('./src/admin-changes');
const serveArrangementCreation = require('./src/serve-arrangement-creation');
const arrangementCreation = require('./src/arrangement-creation');

const PORT = 3000;

var router = new Router(serve404);
var templates = new Templates("./templates");

router.addRoute("GET", "/static/:filename", serveFile);
router.addRoute("GET", "/", serveHome);
router.addRoute("GET", "/index", serveHome);
router.addRoute("GET", "/index.html", serveHome);
router.addRoute("GET", "/anniversary", serveAnniversary);
router.addRoute("GET", "/baby", serveBaby);
router.addRoute("GET", "/birthday", serveBirthday);
router.addRoute("GET", "/prom", serveProm);
router.addRoute("GET", "/sorority-sisterhood", serveSororitySisterhood);
router.addRoute("GET", "/sympathy", serveSympathy);
router.addRoute("GET", "/weddings", serveWedding);
router.addRoute("GET", "/arrangements/:id", serveArrangement);
router.addRoute("GET", "/arrangement-images/:id", serveArrangementImage);
router.addRoute("GET", "/signup", newUser);
router.addRoute("GET", "/signin", newSession);
router.addRoute("GET", "/", serveHome);
router.addRoute("GET", "/update" ,newPassword);
router.addRoute("GET", "/admin", serveAdmin);
router.addRoute("GET", "/create", serveArrangementCreation);

router.addRoute("POST", "/signup", createUser);
router.addRoute("POST", "/signin", createSession);
router.addRoute("POST", "/update", updatePassword);
router.addRoute("POST", "/admin", adminChanges);
router.addRoute("POST", "/create", arrangementCreation);

// Setup http server
var server = http.createServer((req, res) => {
    loadSession(req, res , (req,res) =>{
      // Attach the template library to the response
      res.templates = templates;
      // TODO: Attach the database to the response
      router.route(req, res);
    });
});

// Begin listening for requests
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
