const express = require('express');
const cors = require('cors');
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const { v4: uuidv4 } = require('uuid');


const app = express();

const jsonParser = express.json();
 
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
 
let dbClient;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("todosdb").collection("todos");
    app.listen(8000, function(){
        console.log("Сервер ожидает подключения...");
    });
});

app.get('/', (response, request) => {
    request.send('Just a simple express server configuration')
})

app.post("/api/todos/add", jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
       
    const todosItems = req.body.items;
    const todosUid = uuidv4();
    const todos = {id: todosUid, items: todosItems};
       
    const collection = req.app.locals.collection;
    collection.insertOne(todos, function(err, result){
               
        if(err) return res.status(500).send();
        console.log(result);

        res.status(200).send({uid: todosUid});
    });
});

app.post("/api/todos/update", jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
       
    const todosItems = req.body.items;
    const todosUid = req.body.uid;
       
    const collection = req.app.locals.collection;
    collection.updateOne({id: todosUid}, {$set: {id: todosUid, items: todosItems}}, function(err, result){
               
        if(err) return res.status(500).send();
        res.status(200).send();
    });
});

app.post("/api/todos/get", jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
       
    const todosUid = req.body.uid;
       
    const collection = req.app.locals.collection;
    collection.find({id: todosUid}).toArray(function(err, result) {
        if(err) return console.log('get', err)
        if(result[0]) {
            res.send({items: result[0].items});
        } else {
            res.send({items: 0});
        }
        console.log(result);
    })
});

process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});