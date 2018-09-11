const http = require('http');
const Elm = require('./elm-server.js').Elm;
const storage = require('node-persist');

const port = process.env.PORT || 5000;
const host = process.env.HOST || 'http://localhost';
const cors = process.env.CORS || '*';
const dataKey = 'data';

(async () => {

    await storage.init();
    const persistedData = await storage.get(dataKey);
    console.log(`Loaded persisted data: ${JSON.stringify(persistedData)}`);

    const app = Elm.Server.Main.init({
        flags: {
          data: persistedData,
        },
      });

      app.ports.log.subscribe(msg => {
          console.log(`[ELM ] ${msg}`);
      });

      app.ports.persist.subscribe(async (data) => {
          console.log(`[ELM ] Persisting model: ${JSON.stringify(data)}`)
          await storage.setItem(dataKey, data);
      });

      app.ports.httpResponse.subscribe(([response, responseString]) => {
          response.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': cors,
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

})().catch(e => { console.log(e); });
