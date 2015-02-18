var alloc = require('tcp-bind');
var minimist = require('minimist');
var argv = minimist(process.argv.slice(2), {
    alias: { p: 'port', u: 'uid', g: 'gid' },
    default: { port: require('is-root')() ? 80 : 8000 }
});
var fd = alloc(argv.port);
if (argv.gid) process.setgid(argv.gid);
if (argv.uid) process.setuid(argv.uid);

var http = require('http');
var ecstatic = require('ecstatic')(__dirname + '/static');
var fs = require('fs');
var path = require('path');

var router = require('routes')();
router.addRoute('/', function (req, res, params) {
  res.setHeader('content-type', 'text/html');
  read('index.html').pipe(res);
});

var server = http.createServer(function (req, res) {
    var m = router.match(req.url);
    if (m) m.fn(req, res, m.params);
    else ecstatic(req, res)
});
server.listen({ fd: fd }, function () {
    console.log('listening on :' + server.address().port);
});

function read (file) {
    return fs.createReadStream(path.join(__dirname, 'static', file));
}
