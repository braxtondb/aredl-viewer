const cors = require('cors');
const express = require('express');
const { MongoClient } = require('mongodb');

async function getUsers(client, args, callback) {
    const db = client.db('gdl_data');
    let ret = "";
    await db.collection('users').find({}).forEach((user) => {ret += ',' + user.id + ',' + user.username});
    callback(ret.slice(1));
}

async function getRecords(client, args, callback) {
    const db = client.db('gdl_data');
    let ret = "";
    await db.collection('records').find({}).forEach((rec) => {ret += ',' + rec.id + ',' + rec.url + ',' + rec.user.id});
    callback(ret.slice(1));
}

async function addLevel(client, args, callback) {
    const db = client.db('gdl_data');
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
    callback();
}

async function editLevel(client, args, callback) {
    const db = client.db('gdl_data');
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
    callback();
}

async function deleteLevel(client, args, callback) {
    const database = client.db('gdl_data');
    const levels = database.collection('levels');
    await levels.deleteOne({'id': args.id});
    callback();
}

async function addUser(client, args, callback) {
    const db = client.db('gdl_data');
    await db.collection('users').insertOne({'id': args.id, 'username': args.username});
    callback();
}

async function editUser(client, args, callback) {
    const db = client.db('gdl_data');
    await db.collection('users').updateOne({'id': args.id}, {$set: {'username': args.username}});
    callback();
}

async function deleteUser(client, args, callback) {
    const db = client.db('gdl_data');
    await db.collection('users').deleteOne({'id': args.id});
    callback();
}

async function addRecord(client, args, callback) {
    const db = client.db('gdl_data');
    let user = await db.collection('users').findOne({'id': args.userid});
    await db.collection('records').insertOne({'id': args.id, 'url': args.url, 'user': user});
    callback();
}

async function editRecord(client, args, callback) {
    const db = client.db('gdl_data');
    let user = await db.collection('users').findOne({'id': args.userid});
    await db.collection('records').updateOne({'id': args.id}, {$set: {'url': args.url, 'user': user}});
    callback();
}

async function deleteRecord(client, args, callback) {
    const db = client.db('gdl_data');
    await db.collection('records').deleteOne({'id': args.id});
    callback();
}

const app = express();
const port = 3000;

app.use(cors());

app.get('/getusers', (req, res) => {
    query(getUsers, req.query, (val) => {res.send(val)}).catch(console.dir);
});

app.get('/getrecords', (req, res) => {
    query(getRecords, req.query, (val) => {res.send(val)}).catch(console.dir);
});

app.get('/addlevel', (req, res) => {
    query(addLevel, req.query, (val) => {res.send(val)}).catch(console.dir);
});

app.get('/editlevel', (req, res) => {
    query(editLevel, req.query, (val) => {res.send(val)}).catch(console.dir);
});

app.get('/deletelevel', (req, res) => {
    query(deleteLevel, req.query, (val) => {res.send(val)}).catch(console.dir);
});

app.get('/adduser', (req, res) => {
    query(addUser, req.query, (val) => {res.send(val)}).catch(console.dir);
});

app.get('/edituser', (req, res) => {
    query(editUser, req.query, (val) => {res.send(val)}).catch(console.dir);
});

app.get('/deleteuser', (req, res) => {
    query(deleteUser, req.query, (val) => {res.send(val)}).catch(console.dir);
});

app.get('/addrecord', (req, res) => {
    query(addRecord, req.query, (val) => {res.send(val)}).catch(console.dir);
});

app.get('/editrecord', (req, res) => {
    query(editRecord, req.query, (val) => {res.send(val)}).catch(console.dir);
});

app.get('/deleterecord', (req, res) => {
    query(deleteRecord, req.query, (val) => {res.send(val)}).catch(console.dir);
});

app.listen(port, () => {
  console.log(`Web server listening on port ${port}`);
});

// Connect to Mongo cluster

const uri = 'mongodb+srv://braxtondb:nessmb03@gdll.zfzt0.mongodb.net/?retryWrites=true&w=majority&appName=GDLL';

const client = new MongoClient(uri);

async function query(myquery, args, callback) {
    try {
        await client.connect();
        await myquery(client, args, callback);
    } finally {
        console.log("Sending response");
        await client.close();
    }
}