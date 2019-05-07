const fs = require('fs');
const path = require('path');
const serve404 = require('./serve404');

/** @function serveFile
  * Endpoint serving a file from the public directory
  * @param {http.IncomingMessage} req - the request object
  * @param {http.ServerResponse} res - the response object
  */
function serveFile(req, res) {
  var filePath = path.join('./public', req.params.filename);
  var extension = path.extname(filePath).replace('.', '');
  // Load the requested file asynchronously
  fs.readFile(filePath, (err, data) => {
    if(err) {
      // The most likely error is a file was requested that
      // does not exist in our directory - so serve a 404 page
      console.error(`404 Error: Unable to open ${filePath}`);
      serve404(req, res);
      return;
    }
    // Determine the mime type based on extension
    switch(extension) {
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'gif':
        // Images
        res.setHeader("Content-Type", `image/${extension}`);
        break;
      case 'html':
      case 'css':
        // text
        res.setHeader("Content-Type", `text/${extension}`);
        break;
      case 'js':
        // javascript
        res.setHeader("Content-Type", `text/javascript`);
        break;
      case 'woff':
        // web open font
        res.setHeader("Content-Type", "application/x-font-woff");
        break;
      case 'ttf':
        // true type font
        res.setHeader("Content-Type", "application/x-font-ttf");
        break;
      default:
        res.setHeader("Content-Type", "application/octet-stream");
    }
    // Serve the file
    res.end(data);
  });
}

module.exports = serveFile;
