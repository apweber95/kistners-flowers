module.exports = function(req, res, errorMessage) {
    if(!errorMessage) errorMessage = "";
  res.setHeader("Content-Type", "text/html");
      var nav = res.templates.render("_nav.html", {url: req.url});
      var footer = res.templates.render("_footer.html", {});
      var content = res.templates.render("update-password.html", {errorMessage: errorMessage});
      var html = res.templates.render("_page.html", {
      page: "Update Password",
      navigation: nav,
      content: content,
      footer: footer
    });
  res.end(html);
}