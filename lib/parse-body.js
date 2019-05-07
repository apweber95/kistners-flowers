const serve500 = require('../src/serve500');
const qs = require('querystring');
const CRLF = Buffer.from([0x0D,0x0A]);
const DOUBLE_CRLF = Buffer.from([0x0D,0x0A,0x0D,0x0A]);

/** @function parseBody
  * Parses a http.IncomingMessage body and
  * attaches the content as key/value pairs to
  * the request body parameter.
  * @param {http.IncomingMessage} req - the request object
  * @param {http.ServerResponse} res - the response message
  * @param {parseBody~parseBodyCallback} callback - the callback
  * to invoke with the modified req object.
  */
function parseBody(req, res, callback) {
  var chunks = [];

  // Event handler for network errors ocurring while recieving the POST request body
  req.on('error', (err) => {
    console.error(err);
    serve500(req, res);
  });

  // Event handler for an incoming chunk of the POST request body
  // These will always be recieved in order
  req.on('data', (chunk) => {
    chunks.push(chunk);
  });


  // Event handler for when the POST body has been fully recieved
  req.on('end', () => {
    var body = Buffer.concat(chunks);
    var shortContentType = req.headers['content-type'] ?
        req.headers['content-type'].split(';')[0] :
        '';

    switch(shortContentType) {
      case 'application/x-www-form-urlencoded':
        req.body = qs.parse(body.toString());
        callback(req, res);
        break;
      case 'multipart/form-data':
        var match = /boundary=(\S+)/.exec(req.headers['content-type']);
        if(!match || !match[1]) return serve500(req, res);
        var boundary = match[1];
        req.body = parseMultipart(body, boundary);
        callback(req, res);
        break;
      case 'text/plain':
        req.body = body.toString();
        break;
      default:
        console.error(`Unknown POST Content-Type: ${shortContentType}`);
        serve500(req, res);
    }
  });
}
/** @callback parseBody~parseBodyCallback
  * @param {http.IncomingMessage} req - the request object, with body property containing the incoming body
  * @param {http.serverResponse} res - the response object
  */

/** @function parseMultipart
  * A helper function to parse Multipart form data
  * @param {Buffer} body - the multipart submission
  * @param {string} boundary - the boundary bytes
  * @returns {Object} the form data as key/value pairs
  */
function parseMultipart(body, boundary) {
  var results = {};
  // Split the content parts
  splitContentParts(body, boundary)
  // Parse the content parts
  .map((part) => {
    return parseContentPart(part);
  })
  // Assign the content key/value pairs
  .forEach((entry) => {
    results[entry[0]] = entry[1];
  });
  // return the results
  return results;
}

/** @function splitContentParts
  * A helper function that splits a multipart form submission
  * into its composite content parts.
  * @param {Buffer} buffer - the submission body to be split
  * @param {string} boundary - the boundary bytes between sections
  * @returns {Buffer[]} the content parts
  */
function splitContentParts(buffer, boundary) {
  var contentParts = [];
  var boundaryBytes = '--' + boundary;
  var start = buffer.indexOf(boundary) + boundaryBytes.length;
  var end = buffer.indexOf(boundaryBytes, start);
  // Invariant: Content parts remain to be split off
  while(end != -1) {
    contentParts.push(buffer.slice(start, end - 2));
    start = end + boundaryBytes.length;
    end = buffer.indexOf(boundaryBytes, start+1);
  }
  return contentParts;
}

/** @function parseContentPart
  * A helper function to parse a content
  * section consisting of a head and body.
  * @param {Buffer} content - the content to parse
  * @returns an array with the first entry being the
  * input field name, and the second the value.
  * If the input was a file, the content value is
  * an object with filename, contentType, and data
  * properties.
  */
function parseContentPart(content) {
  const separator = content.indexOf(DOUBLE_CRLF);
  // Separate the Head and Body
  var head = content.slice(0, separator).toString();
  var body = content.slice(separator + 4);
  // Match the name and filename in the head
  var nameMatch = /name="([^"]*)"/.exec(head);
  var filenameMatch = /filename="([^"]*)"/.exec(head);
  // Determine if the content is a file or form field
  if(filenameMatch && filenameMatch[1]) {
    // This is a file!  Find its content-type
    var typeMatch = /Content-Type:\s?(\S+)/.exec(head);
    return [nameMatch[1], {
      filename: filenameMatch[1],
      contentType: typeMatch && typeMatch[1] ? typeMatch[1] : 'application/octet-stream',
      data: body
    }];
  } else {
    // This is a regular input!
    return [nameMatch[1], body.toString()];
  }
}

module.exports = parseBody;
