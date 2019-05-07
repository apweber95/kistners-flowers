/** @function newSession
 * Endpoint for rendering a sign in form.
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 */
module.exports = function newSession(req, res, errorMessage) {
    if(!errorMessage) errorMessage = "";
  res.setHeader("Content-Type", "text/html");
      var nav = res.templates.render("_nav.html", {url: req.url});
      var footer = res.templates.render("_footer.html", {});
      var content = res.templates.render("signin.html", {errorMessage: ""});
      var html = res.templates.render("_page.html", {
      page: "Sign In",
      navigation: nav,
      content: content,
      footer: footer
    });
  res.end(html);
}

