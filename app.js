const express = require('express');
const app = express();
const port = 3000;

const server = app.listen(port, () => console.log(`Example API listening on port ${port}!`));
// const server = require('http').createServer(app);
const io = require('socket.io')(server);

// MongoDB
const mongo = require("mongodb").MongoClient;
const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/chat";

io.on('connection', async function (socket) {
    console.info("User connected");
    try {
        let res = await findInCollection(dsn, "posts", {}, {}, 0);
        io.emit('earlier chat', res)
    } catch (err) {
        console.log(err);
    }

    socket.on('chat message', async function (message) {
        io.emit('chat message', message);
        await saveToCollection(dsn, "posts", message);
        console.log(message);
    });
});

app.get('/', (req, res) => {
  res.send('<h1>Hallo Welt</h1>');
});


// server.listen(port);
// module.exports = server;

/**
 * Find documents in an collection by matching search criteria.
 *
 * @async
 *
 * @param {string} dsn        DSN to connect to database.
 * @param {string} colName    Name of collection.
 * @param {object} criteria   Search criteria.
 * @param {object} projection What to project in results.
 * @param {number} limit      Limit the number of documents to retrieve.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */
async function findInCollection(dsn, colName, criteria, projection, limit) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find(criteria, projection).limit(limit).toArray();

    await client.close();

    return res;
}



/**
 * Find documents in an collection by matching search criteria.
 *
 * @async
 *
 * @param {string} dsn        DSN to connect to database.
 * @param {string} colName    Name of collection.
 * @param {object} document   Document to save.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */
async function saveToCollection(dsn, colName, document) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    await col.insertOne(document);

    await client.close();
}
