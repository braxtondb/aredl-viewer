const cors = require('cors');
const express = require('express');
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://braxtondb:nessmb03@gdll.zfzt0.mongodb.net/?retryWrites=true&w=majority&appName=GDLL';
const client = new MongoClient(uri);
let db;

// TODO: Fix datatypes (int)

async function openConnection() {
    try {
        await client.connect();
        db = client.db('gdl_data');
        console.log('Connected to gdl_data');
    } catch (e) {
        console.error('openConnection():', e);
        process.exit(1);
    }
}

async function closeConnection() {
    try {
        await client.close();
        console.log('Connection closed');
    } catch (e) {
        console.error('closeConnection():', e);
    }
}

// Query handlers

async function getLevels(args, callback) {
    let ret = "";
    const levels = await db.collection('levels').find({}).toArray();
    for (const lvl of levels) {
        ret += `,${lvl.id},${lvl.position},${lvl.name},${lvl.publisher.id},${lvl.verification.id},${JSON.stringify(lvl.creators.map(i => i.id)).replaceAll(',','|')},${JSON.stringify(lvl.records.map(i => i.id)).replaceAll(',','|')},${lvl.points},${lvl.enjoyment}`;
    }
    await callback(ret.slice(1));
}

async function getUsers(args, callback) {
    let ret = "";
    const users = await db.collection('users').find({}).toArray();
    for (const user of users) {
        ret += `,${user.id},${user.username}`;
    }
    await callback(ret.slice(1));
}

async function getRecords(args, callback) {
    let ret = "";
    const recs = await db.collection('records').find({}).toArray();
    for (const rec of recs) {
        ret += `,${rec.id},${rec.url},${rec.user.id}`;
    }
    await callback(ret.slice(1));
}

async function addLevel(args, callback) {
    await db.collection('levels').insertOne({
        'id': args.id,
        'position': args.position,
        'name': args.name,
        'publisher': await db.collection('users').findOne({'id': args.publisher}),
        'verification': await db.collection('records').findOne({'id': args.verification}),
        'creators': await db.collection('users').find({'id': {$in: args.creators.split(',')}}).toArray(),
        'records': await db.collection('records').find({'id': {$in: args.records.split(',')}}).toArray(),
        'points': args.points,
        'enjoyment': args.enjoyment
    });
    await callback();
}

async function editLevel(args, callback) {
    await db.collection('levels').updateOne({'id': args.id}, {$set: {
        'position': args.position,
        'name': args.name,
        'publisher': await db.collection('users').findOne({'id': args.publisher}),
        'verification': await db.collection('records').findOne({'id': args.verification}),
        'creators': await db.collection('users').find({'id': {$in: args.creators.split(',')}}).toArray(),
        'records': await db.collection('records').find({'id': {$in: args.records.split(',')}}).toArray(),
        'points': args.points,
        'enjoyment': args.enjoyment
    }});
    await callback();
}

async function deleteLevel(args, callback) {
    const levels = db.collection('levels');
    await levels.deleteOne({'id': args.id});
    await callback();
}

async function addUser(args, callback) {
    await db.collection('users').insertOne({'id': args.id, 'username': args.username});
    await callback();
}

async function editUser(args, callback) {
    await db.collection('users').updateOne({'id': args.id}, {$set: {'username': args.username}});
    await callback();
}

async function deleteUser(args, callback) {
    await db.collection('users').deleteOne({'id': args.id});
    await callback();
}

async function addRecord(args, callback) {
    const user = await db.collection('users').findOne({'id': args.userid});
    await db.collection('records').insertOne({'id': args.id, 'url': args.url, 'user': user});
    await callback();
}

async function editRecord(args, callback) {
    const user = await db.collection('users').findOne({'id': args.userid});
    await db.collection('records').updateOne({'id': args.id}, {$set: {'url': args.url, 'user': user}});
    await callback();
}

async function deleteRecord(args, callback) {
    await db.collection('records').deleteOne({'id': args.id});
    await callback();
}

// Initialize app

const app = express();
const port = 3000;

app.use(cors());

function registerQuery(query, handler) {
    app.get(query, async (req, res) => {
        await handler(req.query, async (val)=>{ res.send(val) }).catch(console.dir);
        console.log('Response sent to ' + query);
    });
}

registerQuery('/getlevels',    getLevels);
registerQuery('/getusers',     getUsers);
registerQuery('/getrecords',   getRecords);
registerQuery('/addlevel',     addLevel);
registerQuery('/editlevel',    editLevel);
registerQuery('/deletelevel',  deleteLevel);
registerQuery('/adduser',      addUser);
registerQuery('/edituser',     editUser);
registerQuery('/deleteuser',   deleteUser);
registerQuery('/addrecord',    addRecord);
registerQuery('/editrecord',   editRecord);
registerQuery('/deleterecord', deleteRecord);

app.listen(port, () => {
  console.log(`Web server listening on port ${port}`);
});

// App exit

process.on('SIGINT', async () => {
    await closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeConnection();
    process.exit(0);
});

// Connect to Mongo cluster

(async () => {
    await openConnection();
})();
