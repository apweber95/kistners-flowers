/** @function serve500
  * Endpoint serving 500 errors
  * @param {http.IncomingMessage} req - the request object
  * @param {http.ServerResponse} res - the response object
  */
function serve500(req, res) {
  // Log the 404 error
  console.error(`500 Server Error`);
  // Set the status code & message
  res.statusCode = 500;
  res.statusMessage = "Server Error";
  // Render a pretty error page
  var html = res.templates.render('500.html',{});
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

module.exports = serve500;
