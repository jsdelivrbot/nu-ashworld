const http = require('http');
const Elm = require('./elm-server.js').Elm;
const pg = require('pg');

const port = process.env.PORT || 5000;
const host = process.env.HOST || 'http://localhost';
const cors = process.env.CORS || '*';

const dbConnectionString = process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/nu-ashworld'

const db = new pg.Client({connectionString: dbConnectionString});

(async () => {

    await db.connect();
    await createDbTablesIfNeeded();
    const persistedData = await getPersistedData();

    const app = Elm.Server.Main.init({
        flags: JSON.parse(persistedData),
      });

      app.ports.log.subscribe(msg => {
          console.log(`[ELM ] ${msg}`);
      });

      app.ports.persist.subscribe(async (data) => {
          const stringifiedData = JSON.stringify(data);
          await persistData(stringifiedData);
      });

      app.ports.httpResponse.subscribe(({res, urlPart, username, startTime, responseString}) => {
          res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': cors,
              'Access-Control-Allow-Headers': 'X-Username,X-Hashed-Password',
          });
          res.end(responseString);
          const elapsedTime = process.hrtime(startTime);
          const elapsedUs = Math.round(elapsedTime[0] * 1000000 + elapsedTime[1] / 1000);
          logRequest({ elapsedUs, urlPart, username });
      });

      http.createServer((request, response) => {
          if (request.method === 'OPTIONS') {

            response.writeHead(200, {
                'Access-Control-Allow-Origin': cors,
                'Access-Control-Allow-Headers': 'X-Username,X-Hashed-Password',
            });
            response.end();

          } else {

            const startTime = process.hrtime();

            const fromPlayer = request.headers['x-username']
              ? ` from ${request.headers['x-username']}`
              : '';

            console.log(`[NODE] Got request ${request.url}${fromPlayer}`);
            
            app.ports.httpRequests.send({
                url: `${host}:${port}${request.url}`,
                urlPart: request.url,
                res: response,
                startTime,
                headers: request.headers,
            });

          }
      }).listen(port);

      console.log(`[NODE] Game server started on port ${port}`);

})().catch(e => { console.log(e); });

const getPersistedData = async () => {
  const result = await db.query('SELECT data FROM persistence WHERE id = 0;');
  const data = result.rows[0].data;
  return data;
}

const persistData = (dataString) => db.query(
    'INSERT INTO persistence(id, data) VALUES (0, $1) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;',
    [dataString]
);

const createDbTablesIfNeeded = (dataString) => db.query(`
  CREATE TABLE IF NOT EXISTS persistence(id NUMERIC UNIQUE, data TEXT);
  INSERT INTO persistence(id, data) VALUES(0, NULL) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
    WHERE NOT EXISTS (SELECT * FROM persistence);

  CREATE TABLE IF NOT EXISTS log(timestamp TIMESTAMP, url TEXT, username TEXT, elapsed_time_us INTEGER);
`);

const logRequest = ({ urlPart, username, elapsedUs }) => db.query(
  'INSERT INTO log(timestamp, url, username, elapsed_time_us) VALUES(NOW(), $1, $2, $3);',
  [urlPart, username, elapsedUs]
);
