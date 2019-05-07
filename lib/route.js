/** @class Route
 * A class embodying a single route (url pattern, and
 * request handler).
 */
class Route {
  /** @constructor
   * Constructs a new route from the supplied url pattern
   * and request handler.
   * @param {string} pattern - the request url pattern to match against
   * @param {function} handler - the request handler to invoke on a match
   * @returns {bool} returns true if there was a match, false otherwise
   */
  constructor(pattern, handler) {
    // Save the handler as an instance variable
    this.handler = handler;
    // Create a keys array as in instance variable
    this.keys = [];

    // Split the pattern into tokens, then map each token
    // to a corresponding regular expression part
    var regExpParts = pattern.split('/').map((part) => {
      if(part.charAt(0) === ":") {
        // this is a wildcard!  We need to store the name
        // in the keys array
        this.keys.push(part.slice(1));
        // then return a regular expression pattern to capture
        // the real url's token
        return "([^/]+)";
      } else {
        // this is a letter-for-letter match, so just return
        // the token
        return part;
      }
    });

    // Take the array of regular expression parts, rejoin them with
    // forward slashes, and add the symbols for start & end of string.
    // Take the resulting string and convert it into a regular expression
    // and store it in an instance variable.
    this.regexp = new RegExp(`^${ regExpParts.join("/") }/?$`)
  }

  /** @method match
   * Tries to match the incoming request to the supplied route.
   * If there is a match, invoke the request handler and return true.
   * If there is no match, return false.
   * @param {http.IncomingRequest} req - the request object
   * @param {http.ServerResponse} res - the response object
   * @returns {bool} true if match was found, false if not.
   */
  match(req, res) {
    // Execute the stored regular expression against the incoming request url
    var match = this.regexp.exec(req.url);

    // If there was no match, return false
    if(!match) return false;

    // If there was a match, add any captured values
    // to the req.params object, using the corresponding
    // keys (determined by order)
    var params = {}
    this.keys.forEach((key, i) => {
      params[key] = match[i+1];
    });
    req.params = params;

    // Invoke the request handler and return true
    this.handler(req, res);
    return true;
  }

}

module.exports = Route;
