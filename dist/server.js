const http = require('http');
const express = require('express');
const Elm = require('./elm-server.js').Elm;

const port = process.env.PORT || 5000;
const host = process.env.HOST || 'http://localhost';

const app = Elm.Server.Main.init();

app.ports.log.subscribe(msg => {
    console.log(`[ELM ] ${msg}`);
});

app.ports.httpResponse.subscribe(([response, responseString]) => {
    response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://janiczek.github.io',
    });
    response.end(responseString);
});

http.createServer((request, response) => {
    app.ports.httpRequests.send({
        url: `${host}:${port}${request.url}`,
        response,
    });
}).listen(port);

console.log(`[NODE] Game server started on port ${port}`);
