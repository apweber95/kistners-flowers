const serve404 = require('./serve404');
const db = require('../data/database');

/** @function serveArrangement
  * Endpoint serving an arrangement
  * @param {http.IncomingMessage} req - the request object
  * @param {http.ServerResponse} res - the response object
  */
function serveArrangement(req, res) {
  db.arrangements.find(req.params.id, (err, arrangement) => {
    if(err || !arrangement) return serve404(req, res);
    var nav = res.templates.render("_nav.html", {url: req.url});
    var footer = res.templates.render("_footer.html", {});
    var content = res.templates.render("arrangement.html", arrangement);
    var html = res.templates.render("_page.html", {
      page: arrangement.name,
      navigation: nav,
      content: content,
      footer: footer
    });
    res.setHeader("Content-Type", "text/html");
    res.end(html);
  });
}

module.exports = serveArrangement;
