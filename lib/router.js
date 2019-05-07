const Route = require('./route');

/** @class Router
 * A class that stores and applies routes and thier
 * corresponding request handlers.
 */
class Router {

  /** @constructor
   * Constructs a new instance of Router
   * @param {function} notFoundHandler - a request handler to invoke
   * when a matching route cannot be found (i.e. a 404 error).
   */
  constructor(notFoundHandler){
    this.notFound = notFoundHandler;
    this.routes = {}
  }

  /** @method addRoute
   * Adds a new route to the handler
   * @param {string} method - the route's HTTP method, i.e. GET or POST
   * @param {string} pattern - the route's url pattern, i.e. /widgets/:id,
   * where tokens starting with : are a wildcard to capture and assign to the
   * supplied name (id in the example).
   */
  addRoute(method, pattern, handler) {
    if(!this.routes[method]) this.routes[method] = [];
    this.routes[method].push(new Route(pattern, handler));
  }

  /** @method route
   * Routes the incoming request to the matching request handler, or
   * responds with a 404.  Any wildcards in the route pattern are
   * captured and attached to the req.params object.
   * @param {http.IncomingRequest} req - the request object
   * @param {http.ServerResponse} res - the response object
   */
  route(req, res) {

    // If there is no routes matching the request method, there can be no match
    if(!this.routes[req.method]) return this.notFound(req, res);

    // Find the first matching route (route.match returns a bool
    // indicating if there was a match, and also invokes the matching
    // request handler when there is).
    var matched = this.routes[req.method].find((route)=>{
      return route.match(req, res);
    });

    // If we did not have a matching route, respond with a 404
    if(!matched) this.notFound(req, res);
  }
}

module.exports = Router;
