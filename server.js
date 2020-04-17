//include packages
utils = require('./utils');
const bodyParser = require('body-parser');
// json-server router
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
// Jsonwebtoken
const jwt = require('jsonwebtoken');
// Connect Neo4j in heroku
var neo4j = require('neo4j-driver').v1;
var graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
var graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
var graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;
var driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass));
var session = driver.session();

server.get('/api', (req,res)=>{
    res.json({
        message:"Welcome to API!"
    });
});
server.get('/api/ka', (req,res)=>{
    session
        .run("MATCH (bacon:Person {name:\"Kevin Bacon\"})-[*1]-(hollywood)\n" +
            "RETURN DISTINCT bacon,hollywood")
        .then(function(result) {
            result.records.forEach(function(record) {
                res.json({
                    record:record
                });
            });

            session.close();
        })
        .catch(function(error) {
            res.json({
                err: error
            });
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
server.use(bodyParser);

server.listen(port);