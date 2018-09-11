const http = require('http');
const express = require('express');
const Elm = require('./elm-server.js').Elm;

const webServerPort = process.env.PORT || 5000;
const gameServerPort = 3333;
const host = process.env.HOST || 'http://localhost';

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
        url: `${host}:${gameServerPort}${request.url}`,
        response,
    });
}).listen(gameServerPort);

console.log(`[NODE] Game server started on port ${gameServerPort}`);

express()
  .use(express.static(__dirname))
  .listen(webServerPort, () => console.log(`[NODE] Web server started on port ${webServerPort}`));
