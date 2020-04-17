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
var neo4j = require('neo4j');
var graphenedbURL = process.env['GRAPHENEDB_URL'] || "http://localhost:7474/db/data/"
var neo4jdb = new neo4j.GraphDatabase(graphenedbURL);

// var graphenedbUser = process.env.GRAPHENEDB_BOLT_USER || "cxd";
// var graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD || "b.2uCrRnmP9DAr.yOEls3itVFafuWwk";


server.get('/api', (req,res)=>{
    res.json({
        message:"Welcome to API!"
    });
});
server.get('/api/:p1', (req,res)=>{
    var p1 = req.params.p1;
    // session
    //     .run("MATCH (p:Person) RETURN p LIMIT 10")
    //     .then(function(result) {
    //
    //         result.records.forEach(function(record) {
    //             console.log(record);
    //         });
    //         res.json({
    //             records:result.records
    //         });
    //         session.close();
    //     })
    //     .catch(function(error) {
    //         res.json({
    //             err: error
    //         });
    //     });
    // superagent.post("http://localhost:7474/db/data").send({
    //     query: 'Match (bacon:Person) RETURN bacon'
    // }).end(function (neoRes) {
    //     res.json({text:neoRes.text});
    // })
    // var cypherQuery = "MATCH (n:Person) RETURN n";
    // db.query(cypherQuery, function(err, results) {
    //     var result = results[0];
    //     if (err) {
    //         console.error('Error saving new node to database:', err);
    //     } else {
    //         console.log('Node saved to database with id:', result.id);
    //     }
    // });
    neo4jdb.cypher({
        query: 'MATCH (n:Person {name: {personName}}) RETURN n',
        params: {
            personName: p1
        }
    }, function(err, results){
        var result = results[0];
        if (err) {
            console.error('Error saving new node to database:', err);
        } else {
            res.json({
                data: result
            });
        }
    });
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