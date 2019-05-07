const serve404 = require('./serve404');
const db = require('../data/database');

/** @function serveArrangementImage
  * Endpoint serving an arrangement image
  * @param {http.IncomingMessage} req - the request object
  * @param {http.ServerResponse} res - the response object
  */
function serveArrangementImage(req, res) {
  db.arrangementImages.find(req.params.id, (err, image) => {
    if(err || !image) return serve404(req, res);
    res.setHeader("Content-Type", image.mime_type);
    res.end(image.data);
  });
}

module.exports = serveArrangementImage;
