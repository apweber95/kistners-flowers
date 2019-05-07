/** @function serveBaby
  * Endpoint serving the new baby celebration page
  * @param {http.IncomingMessage} req - the request object
  * @param {http.ServerResponse} res - the response object
  */
function serveBaby(req, res) {
  var nav = res.templates.render("_nav.html", {url: req.url});
  var footer = res.templates.render("_footer.html", {});
  var content = res.templates.render("baby.html", {});
  var html = res.templates.render("_page.html", {
    page: "New Baby",
    navigation: nav,
    content: content,
    footer: footer
  });
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

module.exports = serveBaby;
