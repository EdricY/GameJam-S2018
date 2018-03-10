const WebSocket = require('ws');
const wss = new WebSocket.Server( { port : 8191 } );

const fs = require('fs');

const CONNECT = 1;
const READY = 2;
const PLAYERLIST = 3;
const PARTICLE = 4;
const UPDATE = 5;

console.log("Running server on port 8191.")

playing = false;

const COLORS = ["", "", "", "", "", ""]

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        data = JSON.parse(data);
        console.log(data.type)
        if (data.type == CONNECT) {
            if (playing == true) {
                ws.terminate()
                return
            }
            if (!data.obj.name || data.obj.name.trim().length === 0)
              data.obj.name = "(blank)"
            ws.name = data.obj.name;
            ws.drawid = data.obj.drawid
            ws.ready = false;
            ws.score = 0;
            console.log("Connection:  " + ws._socket.remoteAddress + " " + ws.name);
            brodacastPlayerReadyList()

            return;
        } else if (data.type == READY) {
            ws.ready = data.obj;
            brodacastPlayerReadyList()
            if (allReady()){
                console.log("game start")
                playing = true;
                sendToAll(READY)
                return
            }
        } else if (data.type == UPDATE) {
            ws.p = data.obj;
        }
    });

    ws.on('close', function closing(data) {
        console.log('Disconnect: ' + ws.name + '  Score: ' + ws.score);
    });
});

function sendToAll(type, obj) {
  let packet = newPacket(type, obj)
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(packet);
    }
  });
}

function brodacastPlayerReadyList() {
    let playerlist = []
    wss.clients.forEach(function each(client) {
      playerlist.push({name:client.name, ready:client.ready})
    });
    sendToAll(PLAYERLIST, {playerlist: playerlist})
}

function newPacket(type, obj){
	return JSON.stringify({'type': type, 'obj': obj});
}

function allReady() {
    console.log(wss.clients.size)
    let goodtogo = true;
    if (wss.clients.size <= 0) return false;
    wss.clients.forEach(function each(client){
        console.log(client.ready)
        if (!client.ready) {
            goodtogo = false;
        }
    });
    return goodtogo;
}

function getPlayerObjs() {
    let ps = []
    wss.clients.forEach(function each(client){
        if (client.p) {
            ps.push(client.p);
        }
    });
    return ps;
}

function tick() {
    if (playing){
        // if (Math.random() < .1){
        //     sendToAll(PARTICLE, {x: 300 + 100*Math.random(), y: 300 + 100 * Math.random()})
        // }
        let players = getPlayerObjs()
        sendToAll(UPDATE, {
            players: players
        });
        if (wss.clients.size <= 0) {
            reset()
        }
    }
}

function reset() {
    playing = false;
}

function write() {
  writeData = wss.clients.size
  if (writeData == 0) {
      writeData = "Empty"
  }
  if (writeData >= 4) {
    writeData = "Full"
  }
  fs.writeFile("players", writeData, function(err) {
      if(err) {
          return console.log(err);
      }
      //console.log("write!");
  });
}

setInterval(write, 5000);

setInterval(tick, 10);
