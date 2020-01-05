let scale = 20;
let width = 400;
let height = 400;
let rows = height / scale;
let cols = width / scale;

let startx = 0;
let starty = 0;

let pool = [];

let diameter = scale / 2;
let backgroundcolor = 51;

let createMaze = true;
let para;

function setup() {
    createCanvas(width, height);
    background(backgroundcolor);
    initDijkstra(startx, starty);
}


function initDijkstra(x, y) {
    pool = [];
    for (let i = 0; i < rows * cols; i++) {
        pool.push(new Dijkstra(i));
    }
    pool[index(x, y)].distance = 0;
    startx = x;
    starty = y;

    if (createMaze) {
        for (let barx = 2; barx < 9; barx++) {
            pool[index(barx, 1)].barrier = true;
        }
        for (let barx = 3; barx < 10; barx++) {
            pool[index(barx, 3)].barrier = true;
        }
        for (let barx = 0; barx < 9; barx++) {
            pool[index(barx, 5)].barrier = true;
        }
        for (let barx = 1; barx < 10; barx++) {
            pool[index(barx, 7)].barrier = true;
        }
        for (let barx = 0; barx < 9; barx++) {
            pool[index(barx, 9)].barrier = true;
        }
        for (let barx = 5; barx < 8; barx++) {
            pool[index(barx, 11)].barrier = true;
        }
        for (let barx = 5; barx < 8; barx++) {
            pool[index(barx, 11)].barrier = true;
        }
        for (let barx = 10; barx < 12; barx++) {
            pool[index(barx, 10)].barrier = true;
        }
        for (let barx = 2; barx < 5; barx++) {
            pool[index(barx, 12)].barrier = true;
        }
        for (let barx = 7; barx < 11; barx++) {
            pool[index(barx, 13)].barrier = true;
        }

        for (let barx = 13; barx < 16; barx++) {
            pool[index(barx, 13)].barrier = true;
        }
        for (let barx = 17; barx < 20; barx++) {
            pool[index(barx, 13)].barrier = true;
        }


        for (let bary = 0; bary < 4; bary++) {
            pool[index(1, bary)].barrier = true;
        }
        for (let bary = 11; bary < 14; bary++) {
            pool[index(1, bary)].barrier = true;
        }
        for (let bary = 11; bary < 13; bary++) {
            pool[index(3, bary)].barrier = true;
        }
        for (let bary = 11; bary < 14; bary++) {
            pool[index(5, bary)].barrier = true;
        }
        for (let bary = 1; bary < 14; bary++) {
            pool[index(10, bary)].barrier = true;
        }
        for (let bary = 0; bary < 7; bary++) {
            pool[index(12, bary)].barrier = true;
        }
        for (let bary = 8; bary < 14; bary++) {
            pool[index(12, bary)].barrier = true;
        }
    }



    // for (let ran = 0; ran < (rows * cols) / 5; ran++) {
    //     randpos = floor(random(cols * rows));
    //     //console.log(randpos);
    //     if (randpos != index(startx, starty)) {
    //         pool[randpos].barrier = true;
    //     }
    // }
}


function draw() {
    background(backgroundcolor);
    let targetx = floor(mouseX / scale);
    let targety = floor(mouseY / scale);

    if (mouseIsPressed) {
        if (mouseButton === LEFT) {
            initDijkstra(floor(mouseX / scale), floor(mouseY / scale));
        }
        if (mouseButton === RIGHT) {
            pool[index(targetx, targety)].barrier = !pool[index(targetx, targety)].barrier;
            initDijkstra(startx, starty);
        }
    }

    let next = getUnvisited();
    //while (next != undefined) {
    if (next != undefined) {
        pool[next].updateNeighbors();
        next = getUnvisited()
    }

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (pool[index(x, y)].comingfrom !== false) {
                stroke(255, 127, 0, 80);
                strokeWeight(2);
                let tempX = pool[pool[index(x, y)].comingfrom].x;
                let tempY = pool[pool[index(x, y)].comingfrom].y;
                line(x * scale + scale / 2, y * scale + scale / 2, tempX * scale + scale / 2, tempY * scale + scale / 2);
                noStroke();
            }
            if (pool[index(x, y)].visited !== false) {
                fill(0, 255, 0);
            } else {
                if (pool[index(x, y)].distance < Infinity) {
                    fill(0, 0, 255);
                } else {
                    fill(255);
                }
            }
            if (pool[index(x, y)].barrier === true) {
                fill(0);
            }
            if (x == targetx && y == targety) {
                fill(255, 0, 0);
            }
            if (x == startx && y == starty) {
                fill(255, 127, 0);
            }
            ellipse(x * scale + scale / 2, y * scale + scale / 2, diameter, diameter);
        }
    }

    // draw the line to the source
    if (targetx < cols && targetx >= 0 && targety < rows && targety >= 0 && pool[index(targetx, targety)].visited == true) {
        let source = index(targetx, targety);
        stroke(255, 0, 0, 80);
        strokeWeight(scale / 2);
        if (pool[source].comingfrom != false) {
            while (source != index(startx, starty)) {
                let tempX = pool[pool[source].comingfrom].x;
                let tempY = pool[pool[source].comingfrom].y;
                line(pool[source].x * scale + scale / 2, pool[source].y * scale + scale / 2, tempX * scale + scale / 2, tempY * scale + scale / 2);
                source = pool[source].comingfrom;
            }
        }

        noStroke();
    }
}



function index(x, y) {
    return x + y * cols;
}

function deindex(pos) {
    this.x = function () {
        let xpos = pos % cols;
        return xpos;
    }
    this.y = function () {
        let ypos = floor(pos / cols);
        return ypos;
    }
}

function getUnvisited() {
    let distance = Infinity;
    let next = undefined;
    for (let i = 0; i < pool.length; i++) {
        if (pool[i].visited === false && pool[i].barrier === false && pool[i].distance < distance) {
            distance = pool[i].distance;
            next = i;
        }
    }
    return next;
}

function Dijkstra(dijkstrapos) {
    //this.neighbors = [];
    this.pos = new deindex(dijkstrapos);
    this.x = this.pos.x();
    this.y = this.pos.y();
    this.distance = Infinity;
    this.visited = false;
    this.comingfrom = false;
    this.barrier = false;

    this.updateNeighbors = function () {
        // if position is not on the top row
        if (this.y > 0) {
            // left
            if (this.x > 0) {
                // top left
                this.checkNeighbor(index(this.x - 1, this.y - 1));
            }
            // top
            this.checkNeighbor(index(this.x, this.y - 1));
            // top right
            if (this.x < cols - 1) {
                this.checkNeighbor(index(this.x + 1, this.y - 1));
            }
        }

        // check left element
        if (this.x > 0) {
            this.checkNeighbor(index(this.x - 1, this.y));
        }
        // check right element
        if (this.x < cols - 1) {
            this.checkNeighbor(index(this.x + 1, this.y));
        }

        // if position is not in the bottom row
        if (this.y < rows - 1) {
            // bottom left
            if (this.x > 0) {
                // bottom left
                this.checkNeighbor(index(this.x - 1, this.y + 1));
            }
            // below
            this.checkNeighbor(index(this.x, this.y + 1));
            // bottom right
            if (this.x < cols - 1) {
                this.checkNeighbor(index(this.x + 1, this.y + 1));

            }
        }
        this.visited = true;
    } // updateNeighbors

    // check if neighbor is visited and update the distance if needed
    this.checkNeighbor = function (pos) {
        let neighborPos = new deindex(pos);
        //console.log(pos);
        if (pool[pos].visited === false && pool[pos].barrier === false) {
            let tempX = neighborPos.x() - this.x;
            let tempY = neighborPos.y() - this.y;
            let newdistance = this.distance + (Math.sqrt(tempX * tempX + tempY * tempY));
            if (newdistance < pool[pos].distance) {
                pool[pos].distance = newdistance;
                pool[pos].comingfrom = index(this.x, this.y);
            }
            return true;
        } else {
            return false;
        }
    }


}