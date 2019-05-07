function serveAdmin(req, res, errorMessage) {
    
    if(!req.user || req.user.role !== "Admin") {
        res.setHeader("Location", "/signin");
        res.statusCode = 302;
        res.end();
        return;
    }
    if(!errorMessage) errorMessage = "";
    var nav = res.templates.render("_nav.html", {url: req.url});
    var footer = res.templates.render("_footer.html", {});
    var content = res.templates.render("admin.html", {errorMessage: errorMessage});
    var html = res.templates.render("_page.html", {
        page: "Admin",
        navigation: nav,
        content: content,
        footer: footer
    });
    
    res.setHeader("Content-Type", "text/html");
    res.end(html);
}

module.exports = serveAdmin;
