/** @function serve404
  * Endpoint serving 404 errors 
  * @param {http.IncomingMessage} req - the request object
  * @param {http.ServerResponse} res - the response object
  */
function serve404(req, res) {
  // Log the 404 error
  console.error(`404 Error: Unable to serve ${req.url}`);
  // Set the status code & message
  res.statusCode = 404;
  res.statusMessage = "Not Found";
  // Render a pretty error page
  var html = res.templates.render('404.html',{});
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

module.exports = serve404;
