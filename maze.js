let scale = 10;

let width = 1200;
//let width = windowWidth - (windowWidth % scale) - 20;

let height = 600;
//let height = windowHeight - (windowHeight % scale) - 20;


let rows = height / scale;
let cols = width / scale;

let maze = [];
let current;
let stack = [];
let mazeloopcount = 50;

let pathfinder;
let paths = [];

function setup() {
    createCanvas(width, height);
    background(51);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            maze.push(new MazeCell(x, y));
        }
    }
    current = maze[0];
    current.visited = true;
    stack.push(current);
    //frameRate(10);
}


function draw() {



    for (let loops = 0; loops < mazeloopcount; loops++) {
        //while (stack.length) {
        if (stack.length) {
            current = stack.pop()
            if (current.hasNeighbor()) {
                let next = current.getNeighbor();
                stack.push(current);
                current.removeWall(next);
                next.visited = true;
                stack.push(next);
                current = next;
            }
        }
    }



    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[index(x, y)].visited == true && maze[index(x, y)] != current) {
                //console.log("visited mazefill");
                fill(255, 255, 255);
                noStroke();
                rect(x * scale, y * scale, scale, scale);
            }
            if (maze[index(x, y)] == current) {
                //console.log("current mazefill");
                fill(255, 0, 100);
                noStroke();
                rect(x * scale, y * scale, scale, scale);
            }
            if (maze[index(x, y)].hasNeighbors == true) {
                //console.log("current mazefill");
                fill(127);
                noStroke();
                rect(x * scale, y * scale, scale, scale);
            }
            stroke(0);
            // top
            if (maze[index(x, y)].walls[0] == true) {
                line(x * scale, y * scale, (x + 1) * scale, y * scale);
            }
            // right
            if (maze[index(x, y)].walls[1] == true) {
                line((x + 1) * scale, y * scale, (x + 1) * scale, (y + 1) * scale);
            } else {
                //console.log("no right wall");
            }
            // bottom
            if (maze[index(x, y)].walls[2] == true) {
                line(x * scale, (y + 1) * scale, (x + 1) * scale, (y + 1) * scale);
            }
            // left
            if (maze[index(x, y)].walls[3] == true) {
                line(x * scale, y * scale, x * scale, (y + 1) * scale);
            } else {
                //console.log("no left wall");
            }
            noStroke();
        }
    } // for
    if (!stack.length) {
        // store the maze for pathfinding
        //console.log(JSON.stringify(maze));
        if (pathfinder == undefined) {
            pathfinder = new Pathfinder(0, 0);
        }
        console.log("running pathfinder");
        pathfinder.findPath();
        fill(0, 255, 0);
        noStroke();
        rect(pathfinder.x * scale, pathfinder.y * scale, scale, scale);
    }
    if (pathfinder.done) {
        noLoop();
    }
}

function index(x, y) {
    return x + y * cols;
}

function MazeCell(x, y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.walls = [true, true, true, true];

    this.getNeighbor = function () {
        let notVisited = [];
        // top
        if (this.y > 0 && maze[index(x, this.y - 1)].visited == false) {
            //console.log("top");
            notVisited.push(maze[index(x, this.y - 1)]);
        }
        // right
        if (this.x < cols - 1 && maze[index(this.x + 1, this.y)].visited == false) {
            //console.log("right");
            notVisited.push(maze[index(this.x + 1, this.y)]);
        }
        // bottom
        if (this.y < rows - 1 && maze[index(this.x, this.y + 1)].visited == false) {
            //console.log("bottom");
            notVisited.push(maze[index(this.x, this.y + 1)]);
        }
        // left
        if (this.x > 0 && maze[index(this.x - 1, this.y)].visited == false) {
            //console.log("left");
            notVisited.push(maze[index(this.x - 1, this.y)]);
        }
        //console.log("notVisited", notVisited);
        return random(notVisited);
    }

    this.hasNeighbor = function () {
        let notVisited = [];
        // top
        if (this.y > 0 && maze[index(x, this.y - 1)].visited == false) {
            //console.log("top");
            notVisited.push(maze[index(x, this.y - 1)]);
        }
        // right
        if (this.x < cols - 1 && maze[index(this.x + 1, this.y)].visited == false) {
            //console.log("right");
            notVisited.push(maze[index(this.x + 1, this.y)]);
        }
        // bottom
        if (this.y < rows - 1 && maze[index(this.x, this.y + 1)].visited == false) {
            //console.log("bottom");
            notVisited.push(maze[index(this.x, this.y + 1)]);
        }
        // left
        if (this.x > 0 && maze[index(this.x - 1, this.y)].visited == false) {
            //console.log("left");
            notVisited.push(maze[index(this.x - 1, this.y)]);
        }
        if (notVisited.length) {
            this.hasNeighbors = true;
            return true;
        } else {
            this.hasNeighbors = false;
            return false;
        }
    }

    this.removeWall = function (next) {
        // remove walls with top neighbor
        if (next.y < this.y) {
            this.walls[0] = false;
            next.walls[2] = false;
        }
        // remove walls with right neighbor
        if (next.x > this.x) {
            this.walls[1] = false;
            next.walls[3] = false;
        }
        // remove walls with bottom neighbor
        if (next.y > this.y) {
            this.walls[2] = false;
            next.walls[0] = false;
        }
        // remove walls with left neighbor
        if (next.x < this.x) {
            this.walls[3] = false;
            next.walls[1] = false;
        }
        //console.log(this, next);
    }

}

function Pathfinder(x, y) {
    this.x = x;
    this.y = y;
    this.direction = 0;
    this.done = false;
    this.loopcount = 0;

    this.findPath = function () {
        console.log(this);
        // check that no wall is in the current direction
        if (maze[index(this.x, this.y)].walls[this.direction] === false) {
            // goto new spot
            if (this.direction == 0 && this.y > 0 && paths[index(this.x, this.y - 1)]) {
                console.log("move pathfinder to top");
                this.y -= 1;
            }
            if (this.direction == 1 && this.x < cols - 1) {
                console.log("move pathfinder to right");
                this.x += 1;
            }
            if (this.direction == 2 && this.y < rows - 1) {
                console.log("move pathfinder to down");
                this.y += 1;
            }
            if (this.direction == 3 && this.x > 0) {
                console.log("move pathfinder to left");
                this.x -= 1;
            }
        } else {
            console.log("change direction");
            this.direction = (this.direction + 1) % 4;
        }

        if (this.loopcount++ > 10) {
            console.log("loop count finished")
            this.done = true;
        }
        return maze[index(this.x, this.y)].walls;
    }

}