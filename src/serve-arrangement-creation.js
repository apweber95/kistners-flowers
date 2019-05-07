function serveArrangementCreation(req, res, errorMessage) {
  if(!errorMessage) errorMessage = "";
  var nav = res.templates.render("_nav.html", {url: req.url});
  var footer = res.templates.render("_footer.html", {});
  var content = res.templates.render("arrangement-creation.html", {errorMessage: errorMessage});
  var html = res.templates.render("_page.html", {
    page: "Arrangement Creation",
    navigation: nav,
    content: content,
    footer: footer
  });
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

module.exports = serveArrangementCreation;
