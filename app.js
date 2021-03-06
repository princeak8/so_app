const express = require('express');
var cors = require("cors");
var bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
var mqtt = require('mqtt');
var WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080,
});

const routes = require('./routes/index');

const app = express();

//Perform all mqtt and websocket actions
options={
    clientId:"mqttjs01",
    //username:"akalo",
    //password:"akalo88",
    clean:true
};
host = "mqtt://ec2-34-212-195-204.us-west-2.compute.amazonaws.com";//"mqtt://127.0.0.1"
var client  = mqtt.connect(host, options);

var power = ['156','155','160','150','128','144','136','181','173','178'];
var mvar = ['8','15','10','15','12','14','16','18','13','17'];
var current = ['256','285','300','250','238','244','313','281','237','287'];
var voltage = ['340','335','332','350','348','346','336','330','333','338'];
client.on('connect', function () {
    client.subscribe('ugwuaji330kv/K1U/#', function (err) {
        if (!err) {
            /*for(var i=0; i<10; i++) {
                client.publish('presence', i.toString());
            }*/
            let start = true;
            
            setInterval(()=>{  
                var n = Math.floor(Math.random() * 10);
                client.publish('ugwuaji330kv/K1U/power', power[n]);

                n = Math.floor(Math.random() * 10);
                client.publish('ugwuaji330kv/K1U/mvar', mvar[n]);

                n = Math.floor(Math.random() * 10);
                client.publish('ugwuaji330kv/K1U/current', current[n]);

                n = Math.floor(Math.random() * 10);
                client.publish('ugwuaji330kv/K1U/voltage', voltage[n]);
            }, 10000);
        }else{
            console.log(err);
        }
    })
})

client.on('error', function (error) {
    console.log("failed to connect: "+error);
})

wss.on('connection', (ws) => {
    console.log('connected to ws');
    //ws.send('Welcome to the chat, enjoy :)');
});

if(data == undefined) {
    var data = {power: '', mvar: '', voltage: '', current: ''};
}
client.on('message', async function (topic, message) {
    // message is Buffer
    //console.log('Message from '+topic+': '+message.toString());
    data = await add(topic, message.toString(), data);
    //console.log(data);
    //client.end();
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            //wsData = [data];
          client.send(JSON.stringify(data));
        }
    });
})



async function add(topic, message, data)
{
    //let data = {power: '', mvar: '', voltage: '', current: ''};
    switch(topic) {
        case 'ugwuaji330kv/K1U/power' : data.power = message; break;
        case 'ugwuaji330kv/K1U/mvar' : data.mvar = message; break;
        case 'ugwuaji330kv/K1U/voltage' : data.voltage = message; break;
        case 'ugwuaji330kv/K1U/current' : data.current = message; break;
    }
    return data;
}

app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use('/', routes);


app.listen('3001', () => {
    console.log('Server started on port 3001');
})