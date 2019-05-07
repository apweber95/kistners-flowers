/** @function serveBirthday
  * Endpoint serving the birthday celebration page
  * @param {http.IncomingMessage} req - the request object
  * @param {http.ServerResponse} res - the response object
  */
function serveBirthday(req, res) {
  var nav = res.templates.render("_nav.html", {url: req.url});
  var footer = res.templates.render("_footer.html", {});
  var content = res.templates.render("birthday.html", {});
  var html = res.templates.render("_page.html", {
    page: "Birthdays",
    navigation: nav,
    content: content,
    footer: footer
  });
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

module.exports = serveBirthday;
