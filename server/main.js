const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
// const expressWs = 
require('express-ws')(app)
// const ws_server = expressWs.getWss('/');

const onlyws = process.argv.includes('onlyws')

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 't}5v7]5136%=}{hf'
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 

if(!onlyws) {
    app.use('/', express.static(path.join(__dirname, '../client/dist')))
}

app.ws('/', function(ws, req) {
    
    ws.on('message', function(message) {
        
        ws.send(message)

    })
})

app.listen('80', function() {
    console.log('server run on localhost')
})
