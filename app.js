const express = require('express');
const app = express();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const EventEmitter = require('events');
var bodyParser = require('body-parser')

// node event handling 
const emitter = new EventEmitter();
emitter.on('userLoggedIn', () =>  console.log("event is handled") )

var users = [{
    "id": 1,
    "name": "French",
    "email": "edwardsfrench@bovis.com"
}, {
    "id": 2,
    "name": "Holland",
    "email": "goodholland@bovis.com"
}, {
    "id": 3,
    "name": "Lloyd",
    "email": "oyd@bovis.com"
}]
var user = {
    "id": 1,
    "name": "French",
    "email": "edwardsfrench@bovis.com"
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
  var id = req.params.id;
  var selUser;
  users.forEach(function(item, key) {
    if (item.id == id) selUser = item;
  });
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
    var id = Math.floor((Math.random() * 10) + 5)
    users.push({
        "id": id,
        "name": req.body.name,
        "email": req.body.email
    })

    res.setHeader('Content-Type', 'application/json')
    res.json({'ID': id})
    fs.writeFile('log.txt', JSON.stringify(users,null,'\t'), () => { 
      console.log('user added') 
    });
})

// PATCH
app.patch('/users/:id', verifyToken, (req, res) => {
    var id = req.params.id;
    var name = req.body.name
    users.forEach(function(item, key) {
        if (item.id == id) {
            const object2 = Object.assign(item, {
                name: name
            });
        }
        console.log(JSON.stringify(users, null, 4));
    });
    res.json({
        'message': 'name is updated'
    })
})

// get jwt urlencoded in HTTP body
app.post('/login', (req, res) => {

  console.log(req.body.username)
  console.log(req.body.password)

  if(req.body.username == 'mike' && req.body.password == 'pass') {
    jwt.sign({user}, 'secretkey', { expiresIn: '1200s' }, (err, token) => {
      sec = token;
      console.log(token);
      res.json({ token:token });
    });
    emitter.emit('userLoggedIn');
  } else {
    res.sendStatus(403);
  }
});

// two promises
app.get('/twoprom',  (req, res) => {
    let promise1 = new Promise((resolve, reject) => {
        setTimeout(() => resolve('resolved after 4 seconds'), 4000)
    })
    let promise2 = new Promise((resolve, reject) => {
        setTimeout(() => resolve('resolved after 3 seconds'), 3000)
    })
    Promise.all([promise1, promise2]).then(
        (values) => console.log(values)
    );
    res.json(['done'])
})


// promise
app.post('/promise', (req, res) => {
        var name;
        let prom = new Promise((resolve, reject) => {
            try {
                name = req.body.name
                if (name === "French") resolve ('resolved')
                else
                    throw new Error("cannot extract name param or name <> 'French'")
            } catch (err) {
                reject(err);
            } finally {
                res.json(['done'])
            }
        })
        console.log(prom)

        prom
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
    })


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
app.listen(3008, () => {console.log('Example app listening on 3008')});
