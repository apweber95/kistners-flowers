/** @function serveSororitySisterhood
  * Endpoint serving the sorority sisterhood page 
  * @param {http.IncomingMessage} req - the request object
  * @param {http.ServerResponse} res - the response object
  */
function serveSororitySisterhood(req, res) {
  var nav = res.templates.render("_nav.html", {url: req.url});
  var footer = res.templates.render("_footer.html", {});
  var content = res.templates.render("sorority-sisterhood.html", {});
  var html = res.templates.render("_page.html", {
    page: "Sorority Sisterhood",
    navigation: nav,
    content: content,
    footer: footer
  });
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

module.exports = serveSororitySisterhood;
