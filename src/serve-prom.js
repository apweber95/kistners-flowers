/** @function serveProm
  * Endpoint serving the prom celebration page
  * @param {http.IncomingMessage} req - the request object
  * @param {http.ServerResponse} res - the response object
  */
function serveProm(req, res) {
  var nav = res.templates.render("_nav.html", {url: req.url});
  var footer = res.templates.render("_footer.html", {});
  var content = res.templates.render("prom.html", {});
  var html = res.templates.render("_page.html", {
    page: "Prom",
    navigation: nav,
    content: content,
    footer: footer
  });
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

module.exports = serveProm;
