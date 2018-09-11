const http = require('http');
const Elm = require('./elm-server.js').Elm;

const port = process.env.PORT || 3333;

const app = Elm.Server.Main.init();

app.ports.log.subscribe(msg => {
    console.log(`[ELM ] ${msg}`);
});

app.ports.httpResponse.subscribe(([response, responseString]) => {
    response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    });
    response.end(responseString);
});

http.createServer((request, response) => {
    app.ports.httpRequests.send({
        url: `http://localhost:${port}${request.url}`,
        response,
    });
}).listen(port);

console.log(`[NODE] Server started on port ${port}`);
