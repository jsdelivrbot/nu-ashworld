const http = require('http');
const Elm = require('./elm-server.js').Elm;
const app = Elm.Server.Main.init();
const port = 3333;

app.ports.log.subscribe(msg => {
  console.log(msg);
});

http.createServer(function (req, res) {

    new Promise(function(resolve, reject) {
        const handler = response => {
          resolve({response, handler});
        };
        app.ports.httpResponse.subscribe(handler);
    })
    .then(obj => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(obj.response);
        res.end();
        app.ports.httpResponse.unsubscribe(obj.handler);
    })

    app.ports.httpRequests.send(req.url);

}).listen(port);

console.log(`Elm server started on port ${port}`);

