const http = require('http');
const Elm = require('./elm-server.js').Elm;

const port = 3333;

const app = Elm.Server.Main.init();

app.ports.log.subscribe(msg => {
  console.log(`[ELM ] ${msg}`);
});

http.createServer(function (req, res) {

    new Promise(function(resolve, reject) {
        const handler = response => {
          resolve({response, handler});
        };
        app.ports.httpResponse.subscribe(handler);
    })
    .then(obj => {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        });
        res.write(obj.response);
        res.end();
        app.ports.httpResponse.unsubscribe(obj.handler);
    })

    app.ports.httpRequests.send(`http://localhost:${port}${req.url}`);

}).listen(port);

console.log(`[NODE] Server started on port ${port}`);
