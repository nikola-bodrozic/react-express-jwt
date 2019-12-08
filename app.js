const express = require('express');
const app = express();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const EventEmitter = require('events');
const bodyParser = require('body-parser')

// node event handling 
const emitter = new EventEmitter();
emitter.on('userLoggedIn', () =>  console.log("event is handled") )

var users = [{
  "id": 1,
  "name": "Bradney",
  "email": "bmomery0@sakura.ne.jp"
}, {
  "id": 2,
  "name": "Tommie",
  "email": "tcovino1@ycombinator.com"
}]

var user = {
  "id": 2,
  "name": "Tommie",
  "email": "tcovino1@ycombinator.com"
}

var sec = '';

app.use(bodyParser.json()) // json in http body
app.use(bodyParser.urlencoded({ extended: true })); // url encoded in http body

// cors headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// GET calls
app.get('/', (req, res) => res.send('Hello get'))
app.get('/users', (req, res) => res.json(users))

app.get('/users/:id', function(req, res) {
  const id = req.params.id;
  var selUser = null;
  users.forEach((item, key) => {
    if (item.id == id) selUser = item;
  });
  if(selUser === null) res.send({ error: "user doesn't exist" });
  res.setHeader('Content-Type', 'application/json')
  res.json(selUser);
});

app.get('/users/name/:name', function(req, res) {
    let name = req.params.name;
    const result = users.filter(data => data.name == name)
    return res.json(result)
});

// POST call - JSON in HTTP body 
app.post('/users', verifyToken,(req, res) => {
    var id = Math.floor((Math.random() * 1000) + 50)
    users.push({
        "id": id,
        "name": req.body.name,
        "email": req.body.email
    })

    res.setHeader('Content-Type', 'application/json')
    res.status(201).json({'ID': id})
    fs.writeFile('log.txt', JSON.stringify(users,null,'\t'), () => { 
      console.log('user added') 
    });
})

// PATCH
app.patch('/users/:id', verifyToken, (req, res) => {
    var id = req.params.id;
    var name = req.body.name
    users.forEach((item, key) => {
        if (item.id == id) {
            const object2 = Object.assign(item, {
                name: name
            });
        }
        console.log(JSON.stringify(users, null, 4));
    });
    res.json({'message': 'name is updated'})
})

// get JWT in HTTP body
app.post('/login', (req, res) => {

  console.log(req.body.username)
  console.log(req.body.password)

  if(req.body.username == 'mike' && req.body.password == 'pass') {
    jwt.sign({user}, 'secretkey', { expiresIn: '1200s' }, (err, token) => {
      sec = token;
      console.log(token);
      res.json({ token });
    });
    emitter.emit('userLoggedIn');
  }
});


// Verify Token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    if(bearerToken==sec)
      next();
    else 
      res.sendStatus(403);
  } else {
    res.sendStatus(403);
  }
}    

// start server
const port = 3008
app.listen(port, () => {console.log(`Example app listening on ${port}`)});
