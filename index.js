const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const rateLimit = require("express-rate-limit");
const cors = require('cors')
const https = require('https');
const path = require('path');
const fs = require('fs');


const app = express();
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(function (req, res, next) {
  res.setHeader('X-Content-Type-Options', "nosniff")
  res.setHeader('X-Frame-Options', "Deny")  //clickjacking protection
  next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// app.use(cors());
app.disable('x-powered-by');
app.use(cookieParser());
app.use(session({
    secret: 'ghuieorifigyfuu9u3i45jtr73490548t7ht',
    resave: false,
    saveUninitialized: true,
    name: "session",
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000000,
        sameSite: 'lax'  //use secure: true   
    },
    store: new MongoStore({
        url: 'mongodb://localhost/user_data', 
        ttl: 14 * 24 * 60 * 60
    }) // = 14 days. Default 
}))

const port = 80;
app.listen(port, () => { //Uncomment if you want to use http
    console.log(`Server is listening on port ${port}`);
});

 // https.createServer({
 //     key: fs.readFileSync('/etc/letsencrypt/live/qwertyforce.ru/privkey.pem'),
 //     cert: fs.readFileSync('/etc/letsencrypt/live/qwertyforce.ru/cert.pem')
 //    }, app).listen(port);

// console.log(`Server is listening on port ${port}`);

const google_oauth_redirect=require('./routes/google_oauth_redirect.js') 
const github_oauth_redirect=require('./routes/github_oauth_redirect.js') 

const github_oauth_callback=require('./routes/github_oauth_callback.js') 
const google_oauth_callback=require('./routes/google_oauth_callback.js') 

const add_note=require('./routes/add_note.js')
const delete_note=require('./routes/delete_note.js') 
const update_note=require('./routes/update_note.js') 
const get_notes=require('./routes/get_notes.js') 
const sync=require('./routes/sync.js') 



app.get('/auth/google',google_oauth_redirect)
app.get('/auth/github',github_oauth_redirect)

app.get('/auth/github/callback',github_oauth_callback)
app.get('/auth/google/callback',google_oauth_callback)

app.post('/add_note',add_note)
app.post('/delete_note',delete_note)
app.post('/update_note',update_note)
app.get('/get_notes',get_notes)

app.post('/sync',sync)

app.get('/logout', async (req, res) => {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                res.send('<p>error</p>')
            } else {
                res.redirect("http://localhost:3000/")
            }
        });
    }
})