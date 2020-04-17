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

server.get('/api', (req,res)=>{
    res.json({
        message:"Welcome to API!"
    });
});
server.get('/api/ka', (req,res)=>{
    res.json({
        message:"Welcome to API!"
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