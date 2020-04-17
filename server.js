//include packages
utils = require('./utils');
const bodyParser = require('body-parser');
//const multer = require('multer');
// json-server router
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
// Jsonwebtoken
const jwt = require('jsonwebtoken');
// Connect Neo4j in heroku
var neo4j = require('neo4j-driver');
var graphenedbURL = process.env.GRAPHENEDB_BOLT_URL || "bolt://hobby-kagcfkdfpfnpgbkemigmppel.dbs.graphenedb.com:24787";
var graphenedbHttpURL = process.env.GRAPHENEDB_HTTP_URL || "https://hobby-kagcfkdfpfnpgbkemigmppel.dbs.graphenedb.com:24780/db/data/";
var graphenedbUser = process.env.GRAPHENEDB_BOLT_USER || "cxd";
var graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD || "b.2uCrRnmP9DAr.yOEls3itVFafuWwk";
var driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass));
var session = driver.session();
var superagent = require('superagent');
// Seraph
var db = require("seraph")({
    server: "https://hobby-kagcfkdfpfnpgbkemigmppel.dbs.graphenedb.com:24780/db/data/",
    user: "cxddddd",
    pass: "b.2uCrRnmP9DAr.yOEls3itVFafuWwk"
});

server.get('/api', (req,res)=>{
    res.json({
        message:"Welcome to API!"
    });
});
server.get('/api/:p1', (req,res)=>{
    var p1 = req.params.p1;
    session
        .run("MATCH (p:Person) RETURN p",{p: p1})
        .then(function(result) {

            result.records.forEach(function(record) {

            });
            res.json({
                records:result.records
            });
            session.close();
        })
        .catch(function(error) {
            res.json({
                err: error
            });
        });
    // superagent.post(graphenedbHttpURL+'/cypher').send({
    //     query: 'MATCH (bacon:Person {name:"Kevin Bacon"})-[*1]-(hollywood)\n' +
    //         'RETURN DISTINCT bacon,hollywood'
    // }).end(function (neoRes) {
    //     res.json({text:neoRes.text});
    // })
    // var cypherQuery = "MATCH (bacon:Person {name:\"Kevin Bacon\"})-[*1]-(hollywood) " +
    //     "RETURN DISTINCT bacon,hollywood";
    // db.query(cypherQuery, function(err, results) {
    //     var result = results[0];
    //     if (err) {
    //         console.error('Error saving new node to database:', err);
    //     } else {
    //         console.log('Node saved to database with id:', result.id);
    //     }
    // });
});
server.post('/api/login',(req,res)=>{
    const user = {
        id:1,
        name: 'cxd',
        nickname: 'cc',
        email: 'feelingcxd@126.com'
    }
    jwt.sign({user},'mysecretkey', (err, token)=>{
        if(err){
            res.json({
                err
            });
        }else{
            res.json({
                token
            });
        }
    });
})

server.get('/user',utils.verifyToken, (req,res)=>{
    const userInfo = req.userInfo;
    res.json({
        user: userInfo.user
    });
});

server.use(middlewares);
server.use(utils.exclude('/api/:other', utils.verifyToken));
server.use(jsonServer.bodyParser);
server.use(router);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.listen(port,()=>{console.log("JsonServer Started.")});