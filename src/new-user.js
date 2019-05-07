module.exports = function(req, res, errorMessage) {
    
    if(!req.user || req.user.role!== "Admin") {
        res.setHeader("Location", "/signin");
        res.statusCode = 302;
        res.end();
        return;
    }
    if(!errorMessage) errorMessage = "";
    res.setHeader("Content-Type", "text/html");
    var nav = res.templates.render("_nav.html", {url: req.url});
    var footer = res.templates.render("_footer.html", {});
    var content = res.templates.render("signup.html", {errorMessage: errorMessage});
    var html = res.templates.render("_page.html", {
        page: "Sign Up",
        navigation: nav,
        content: content,
        footer: footer
    });
    
    res.end(html);
}