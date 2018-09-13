const http = require('http');
const Elm = require('./elm-server.js').Elm;
const pg = require('pg');

const port = process.env.PORT || 5000;
const host = process.env.HOST || 'http://localhost';
const cors = process.env.CORS || '*';
const jwtSecret = process.env.JWT_SECRET || 'jwt_secret';

const dbConnectionString = process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/nu-ashworld'

const db = new pg.Client({connectionString: dbConnectionString});

(async () => {

    await db.connect();
    await createDbTableIfNeeded();
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

      app.ports.httpResponse.subscribe(([response, responseString]) => {
          response.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': cors,
              'Access-Control-Allow-Headers': 'X-Username,X-Hashed-Password',
          });
          response.end(responseString);
      });

      http.createServer((request, response) => {
          if (request.method === 'OPTIONS') {

            response.writeHead(200, {
                'Access-Control-Allow-Origin': cors,
                'Access-Control-Allow-Headers': 'X-Username,X-Hashed-Password',
            });
            response.end();

          } else {

            app.ports.httpRequests.send({
                url: `${host}:${port}${request.url}`,
                response,
                headers: request.headers,
            });

          }
      }).listen(port);

      console.log(`[NODE] Game server started on port ${port}`);

})().catch(e => { console.log(e); });

const getPersistedData = async () => {
  const result = await db.query('SELECT data FROM persistence WHERE id = 0;');
  const data = result.rows[0].data;
  console.log(`[SQL ] Loaded persisted data: ${data}`);
  return data;
}

const persistData = (dataString) => {
  console.log(`[SQL ] Persisting data: ${dataString}`);
  db.query(
    'INSERT INTO persistence(id, data) VALUES (0, $1) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;',
    [dataString]
  );
};

const createDbTableIfNeeded = (dataString) => db.query(`
  CREATE TABLE IF NOT EXISTS persistence(id NUMERIC UNIQUE, data TEXT);
  INSERT INTO persistence(id, data) VALUES(0, NULL) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
    WHERE NOT EXISTS (SELECT * FROM persistence);
`);
