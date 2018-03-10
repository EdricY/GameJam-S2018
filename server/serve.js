const WebSocket = require('ws');
const wss = new WebSocket.Server( { port : 8191 } );

const fs = require('fs');

const pi = Math.PI;
const tau = 2 * Math.PI;

const TSIZE = 48
const MW = 1536;
const MH = 1536;
const FRICTION = .85;
const GRAVITY = 1;


const CONNECT = 1;
const READY = 2;
const PLAYERLIST = 3;
const PARTICLE = 4;
const UPDATE = 5;

console.log("Running server on port 8191.")

map=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,255,255,255,255,255,255,255,255,255,0,255,255,255,255,255,255,255,255,255,255,0,255,255,255,255,255,255,255,255,255,0],[0,255,255,255,255,255,255,255,255,255,0,255,255,255,255,255,255,255,255,255,255,0,255,255,255,255,255,255,255,255,255,0],[0,255,255,255,255,255,255,255,255,255,0,255,255,255,255,255,255,255,255,255,255,0,255,255,255,255,255,255,255,255,255,0],[0,255,255,255,255,255,127,127,127,127,0,127,127,127,0,0,0,0,127,127,127,0,127,127,127,127,255,255,255,255,255,0],[0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0],[0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0],[0,127,127,127,0,0,0,255,255,255,255,255,127,127,127,127,127,127,127,127,255,255,255,255,255,0,0,0,127,127,127,0],[0,255,255,255,255,255,0,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0,0,255,255,255,255,255,0],[0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0],[0,255,255,255,255,255,255,255,255,255,255,0,0,255,255,255,255,255,255,0,0,255,255,255,255,255,255,255,255,255,255,0],[0,255,255,255,255,255,255,255,255,0,0,0,0,127,127,127,127,127,127,0,0,0,0,255,255,255,255,255,255,255,255,0],[0,127,127,127,127,127,127,0,0,0,0,0,0,255,255,255,255,255,255,0,0,0,0,0,0,127,127,127,127,127,127,0],[0,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0,0],[0,0,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0,0,0],[0,0,0,0,255,255,255,255,255,255,255,255,255,127,127,127,127,127,127,255,255,255,255,255,255,255,255,255,0,0,0,0],[0,0,0,0,0,127,127,127,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,127,127,127,0,0,0,0,0],[0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0],[0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0],[0,255,255,255,255,255,255,127,127,127,255,255,255,255,255,255,255,255,255,255,255,255,127,127,127,255,255,255,255,255,255,0],[0,255,255,255,255,255,255,255,255,255,255,255,255,0,127,127,127,127,0,255,255,255,255,255,255,255,255,255,255,255,255,0],[0,255,255,255,255,255,255,255,255,255,255,0,0,0,255,255,255,255,0,0,0,255,255,255,255,255,255,255,255,255,255,0],[0,255,255,255,127,127,127,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,127,127,127,255,255,255,0],[0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0],[0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0],[0,127,127,127,127,127,0,0,0,127,127,127,127,127,0,0,0,0,127,127,127,127,127,0,0,0,127,127,127,127,127,0],[0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0],[0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0],[0,255,255,255,255,255,255,255,255,255,127,127,127,255,255,255,255,255,255,127,127,127,255,255,255,255,255,255,255,255,255,0],[0,0,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0,0,0],[0,0,0,0,0,255,255,255,255,255,255,255,255,0,0,0,0,0,0,255,255,255,255,255,255,255,255,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]

playing = false;
TRAPW = 16;
traps = []; //24
bullets = []; //12
slimes = []
players = []

slimeTimer = 1000;
trapTimer = 200;
difficulty = 1;


            //    Red,      Yellow,     Green,     Blue,      Pink,     White
var COLORS = ["#F83800", "#F8B800", "#58D854", "#6844FC", "#D800CC", "#BCBCBC"]

shuffleColors();

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        data = JSON.parse(data);
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
            console.log("ready mesg")
            ws.ready = data.obj;
            brodacastPlayerReadyList()
            if (allReady()){
                console.log("game start")
                playing = true;
                let colorsdict = createColorDict();
                sendToAll(READY, {"colorsdict": colorsdict});
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
function createColorDict() {
    let count = 0;
    let colordict = {}
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            colordict[client.drawid] = COLORS[count];
            count ++;
        }
    });
    return colordict
}
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
        players = getPlayerObjs()
        trapTimer--;
        if (trapTimer <= 0){
            createNewTrap()
            trapTimer = 10 + Math.floor((500/difficulty) * Math.random())
        }
        slimeTimer --;
        if (slimeTimer <= 0) {
            difficulty += .0001
            spawnNewSlime()
            slimeTimer = 300 + Math.floor((200/difficulty) * Math.random())
        }

        for (let i in traps) {
            let tr = traps[i]
            traps[i].t --;
            for (p of players) {
                let dx = Math.abs(p.x - tr.x);
                let dy = Math.abs(p.y - tr.y);
                if (dx < 24 + 12 && dy < 48 + 12) {
                    console.log('trap!')
                    spawnBullets(tr.x, tr.y, p.color)
                    tr.t -= 2000;
                    console.log('trap2!')
                }
            }

            if (traps[i].t <= 0) {
                traps.splice(i--, 1)
            }
        }
        for (let i in bullets) {
            let bulletv = 5;
            let b = bullets[i];
            b.x += bulletv * Math.sin(b.theta)
            b.y -= bulletv * Math.cos(b.theta)

            for (let j in slimes) {
                let sl = slimes[j]
                if (circleRectCollision(b.x, b.y, 12, sl.x, sl.y, TSIZE, TSIZE)) {
                    slimes.splice(j--, 1)
                    b.x = -600;
                }
            }

            if (b.x < -500 || b.x > 2000 || b.y < -500 || b.y > 2000){
                bullets.splice(i--, 1)
            }
        }

        for (let i in slimes) {
            let sl = slimes[i]
            sl.update();
        }

        sendToAll(UPDATE, {
            players: players,
            traps: traps,
            bullets: bullets,
            slimes: slimes
        });
        if (wss.clients.size <= 0) {
            reset()
        }
    }
}
function spawnNewSlime() {
    let r = 1 + Math.floor(Math.random() * 30);
    let c = 1 + Math.floor(Math.random() * 30);
    while (map[r][c] != 255){
        console.log("a")
        r = 1 + Math.floor(Math.random() * 30);
        c = 1 + Math.floor(Math.random() * 30);
    }
    let y = r * 48 + 24;
    let x = c * 48 + 24
    let color1 = players[Math.floor(Math.random() * players.length)].color
    let color2 = players[Math.floor(Math.random() * players.length)].color
    let slime = newSlime(x, y, color1, color2)
    slimes.push(slime);

}

function createNewTrap() {
    let r = 1 + Math.floor(Math.random() * 30);
    let c = 1 + Math.floor(Math.random() * 30);
    let x = r * 48 + 24;
    let y = c * 48 + 24
    let newTrap = {
        x: x,
        y: y,
        t: 2000
    }
    traps.push(newTrap);
}

function spawnBullets(x, y, color) {
    for (let i = 0; i < 8; i++){
        bullets.push({
            x: x,
            y: y,
            color: color,
            theta: i*(pi/4)
        });
    }
}

function reset() {
    playing = false;
    bullets = [];
    traps = [];
    slimes = [];
    shuffleColors();
}

function newSlime(x, y, color, playerc) {
    return {
        x: x,
        y: y,
        color: color,
        vx: 0,
        vy: 0,
        playerc: playerc,
        maxv: .5 + Math.random() * 1,
        ax: .1,
        jumps: 1,
        midair: true,
        animationCount: 0,
        frame: 0,
        facingR: false,
        downtimer: 500,
        draw: function(ctx) {
            if (this.vx < 0){
                this.facingR = false;
            } else if (this.vx > 0){
                this.facingR = true;
            }

            if (this.midair){
                this.frame = 2;
                this.animationCount = 0;
            } else {
                if (Math.abs(this.vx) <= .3){
                    this.frame = 0;
                    this.animationCount = 0;
                } else {
                    this.frame = Math.floor(this.animationCount/16);
                    this.animationCount = (this.animationCount + 1) % 64;
                }
            }
            if (this.facingR) this.frame += 4;
        },
        update: function() {
            this.downtimer--;
            if (this.downtimer <= 0) {
                this.downtimer = 1000 + Math.floor(200 * Math.random())
            }
            this.midair = true;
            let playerx = p.x
            let playery = p.y
            for (let p of players){
                if (p.color == playerc){
                    playerx = p.x;
                    playery = p.y;
                }
            }

            if (this.x - playerx > 4) { //left
                this.vx -= this.ax;
                if (this.vx < -this.maxv)
                    this.vx = -this.maxv;
            }
            if (playerx - this.x > 4) { //right
                this.vx += this.ax;
                if (this.vx > this.maxv)
                    this.vx = this.maxv;
            }
            if (Math.random() < .01) { //up
                this.vy = -18;
            }
            this.x += this.vx;
            this.y += this.vy;

            let myR = this.x + TSIZE/2;
            let myL = this.x - TSIZE/2;
            let myU = this.y - TSIZE/2;
            let myD = this.y + TSIZE/2;
            let prevR = myR - this.vx -1; //This -1 is kinda important :(
            let prevL = myL - this.vx;
            let prevU = myU - this.vy;
            let prevD = myD - this.vy;

            myR = Math.floor(myR/TSIZE);
            myL = Math.floor(myL/TSIZE);
            myU = Math.floor(myU/TSIZE);
            myD = Math.floor(myD/TSIZE);
            prevR = Math.floor(prevR/TSIZE);
            prevL = Math.floor(prevL/TSIZE);
            prevU = Math.floor(prevU/TSIZE);
            prevD = Math.floor(prevD/TSIZE);

            let leftest = Math.min(myL, prevL);
            let rightest = Math.max(myR, prevR);

            if (myD >= prevD && this.vy > 0) {
                for (let i = leftest; i <= rightest; i++){
                    let block = map[myD][i];
                    if (block == 0 || (block == 127 && this.downtimer > 100)) {//collide with blocks and clouds if not holding down
                        this.vy = 0;
                        this.y = myD*TSIZE - TSIZE/2
                        this.midair = false;
                        this.jumps = 1;
                    }
                }

            }
            if (myU < prevU && this.vy < 0) {
                for (let i = leftest; i <= rightest; i++){
                    let block = map[myU][i];
                    if (block == 0) {//collide with blocks only
                        this.vy = 0;
                        this.y = myU*TSIZE + TSIZE + TSIZE/2
                    }
                }

            }

            if (myR > prevR) {
                let highest = Math.min(myU, prevU);
                myD = this.y + TSIZE/2 - 1; //Prevent sticking to floor?
                prevD = myD - this.vy;
                myD = Math.floor(myD/TSIZE);
                prevD = Math.floor(prevD/TSIZE);
                let lowest = Math.max(myD, prevD);
                for (let i = highest; i <= lowest; i++){
                    let block = map[i][myR];
                    if (block != 255) {//collide with non-air
                        this.vx = 0;
                        this.x = myR*TSIZE - TSIZE/2
                    }
                }
            }
            else if (myL < prevL) {
                let highest = Math.min(myU, prevU);
                myD = this.y + TSIZE/2 - 1; //Prevent sticking to floor?
                prevD = myD - this.vy;
                myD = Math.floor(myD/TSIZE);
                prevD = Math.floor(prevD/TSIZE);
                let lowest = Math.max(myD, prevD);
                for (let i = highest; i <= lowest; i++){
                    let block = map[i][myL];
                    if (block != 255) {//collide with non-air
                        this.vx = 0;
                        this.x = myL*TSIZE + TSIZE + TSIZE/2
                    }
                }
            }

            if (this.y < TSIZE/2) { // hitting ceiling
                this.y = TSIZE/2;
                this.vy = 0;
            } else if (this.y < MH - TSIZE/2 - TSIZE){ //above floor
                this.vy += GRAVITY;
            }
            else { //hit floor
                this.vy = 0;
                this.y = MH - TSIZE/2 - TSIZE
                this.jumps = 2;
                this.midair = false;
            }

            if (this.x + TSIZE/2 > MW) {
                this.vx = 0;
                this.x = MW - TSIZE/2;
            } else if (this.x - TSIZE/2 < 0) {
                this.vx = 0;
                this.x = TSIZE/2;
            }

            this.vx *= FRICTION;
            this.draw();

        }
    }
}

function write() {
  writeData = wss.clients.size
  if (writeData == 0) {
      writeData = "Empty"
  }
  if (writeData >= 6) {
    writeData = "Full"
  }
  fs.writeFile("players", writeData, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("write!");
  });
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function shuffleColors() {
    COLORS = shuffle(COLORS)
}

function circleRectCollision(cX, cY, cRad, rX, rY, rWidth, rHeight) {
    var distX = Math.abs(cX - rX-rWidth/2);
    var distY = Math.abs(cY - rY-rHeight/2);

    // Check if definitely not colliding
    if(distX > rWidth/2 + cRad) {return false;}
    if(distY > rHeight/2 + cRad) {return false;}

    // Check if definitely colliding
    if(distX <= rWidth/2) {return true;}
    if(distY <= rHeight/2) {return true;}

    // check corner collision
    var dx = distX - rWidth/2;
    var dy = distY - rHeight/2;
    // Use pythagorean theorem to
    return ((dx*dx) + (dy*dy) <= (cRad*cRad));
}

setInterval(write, 5000);

setInterval(tick, 10);
