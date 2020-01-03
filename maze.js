let scale = 10;

let width = 600;
//let width = windowWidth - (windowWidth % scale) - 20;

let height = 600;
//let height = windowHeight - (windowHeight % scale) - 20;


let rows = height / scale;
let cols = width / scale;

let maze = [];
// randommaze = % of maze cells to clean after generation
let doRandomMaze = true;
let randommaze = 20;

let current;
let stack = [];
let pathstack = [];

let mazeloopcount = 100;
let pathfindercount = 1;

let next;
let pathfinder;

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
    //  frameRate(20);
}


function draw() {

    //for (let loops = 0; loops < mazeloopcount; loops++) {
    while (stack.length) {
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

    if (!stack.length && randommaze && doRandomMaze) {
        for (let i = 0; i < randommaze / 100 * (cols * rows); i++) {
            let x = floor(random(cols));
            let y = floor(random(rows));
            console.log(x, y);
            if (x > 0 && x < cols - 1 && y > 0 && y < rows - 1) {
                maze[index(x, y)].removeWall(maze[index(x + 1, y)]);
            }
        }
        doRandomMaze = false;
    }

    for (let loops = 0; loops < pathfindercount; loops++) {

        if (!stack.length) {
            //console.log("!stack.length");
            if (pathfinder == undefined) {
                pathfinder = new Pathfinder(0, 0);
                pathstack.push(index(0, 0));
            }

            // stack is filled and not target
            if (pathstack.length > 0 && !(pathfinder.x == cols - 1 && pathfinder.y == rows - 1)) {
                //console.log("pathstack length");
                // grab from stack
                next = pathfinder.getNext(pathfinder.x, pathfinder.y);
                if (next != undefined) {
                    pathstack.push(next);
                    pathfinder.x = next % (cols);
                    pathfinder.y = floor(next / cols);
                } else {
                    //console.log("mark cell as dead");
                    maze[index(pathfinder.x, pathfinder.y)].isDead = true;
                    // and pop the element from stack
                    pathstack.pop();
                    // get the last entry in the stack
                    let temp = pathstack[pathstack.length - 1];
                    pathfinder.x = temp % (cols);
                    pathfinder.y = floor(temp / cols);

                }
            } else {
                console.log("pathfinder done");
                noLoop();
            }
        }
    }

    // draw the maze
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
            // pathfinder
            if (maze[index(x, y)].isDead == true) {
                //console.log("current mazefill");
                fill(64);
                noStroke();
                rect(x * scale, y * scale, scale, scale);
            }
            if (pathstack.includes(index(x, y)) === true) {
                //console.log("drawing the pathfinder");
                //console.log("current mazefill");
                fill(0, 255, 0);
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


}

function index(x, y) {
    return x + y * cols;
}

function MazeCell(x, y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.walls = [true, true, true, true];
    this.isDead = false;

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
        //console.log(this);

        if (this.x == cols - 1 && this.y == rows - 1) {
            //console.log("end found");
            noLoop();
        }

        // check that no wall is in the current direction
        if (maze[index(this.x, this.y)].walls[this.direction] === false) {
            // goto new spot
            if (this.direction == 0 && this.y > 0 && maze[index(this.x, this.y - 1)].pathfinder < 1) {
                console.log("move pathfinder to top");
                this.y -= 1;
            }
            if (this.direction == 1 && this.x < cols - 1 && maze[index(this.x + 1, this.y)].pathfinder < 1) {
                console.log("move pathfinder to right");
                this.x += 1;
            }
            if (this.direction == 2 && this.y < rows - 1 && maze[index(this.x, this.y + 1)].pathfinder < 1) {
                console.log("move pathfinder to down");
                this.y += 1;
            }
            if (this.direction == 3 && this.x > 0 && maze[index(this.x - 1, this.y)].pathfinder < 1) {
                console.log("move pathfinder to left");
                this.x -= 1;
            }
        } else {
            //console.log("change direction", this.direction);
            this.direction = (this.direction + 1) % 4;
        }

        if (this.loopcount++ > 20) {
            //console.log("loop count finished")
            this.done = true;
        }
        return maze[index(this.x, this.y)].walls;
    }


    // is there a way
    this.check = function () {
        let check = false;
        for (let i = 0; i < maze[index(this.x, this.y)].walls.length; i++) {
            if (maze[index(this.x, this.y)].walls[i]) {
                check = true;
            }
        }
        return check;
    }



    this.getNext = function (x, y) {
        //console.log("getNext: ", x, y);



        // down
        if (y < rows - 1 && maze[index(x, y)].walls[2] === false && pathstack.includes(index(x, y + 1)) === false && maze[index(x, y + 1)].isDead == false) {
            //console.log("getNext: down");
            return index(x, y + 1);
        } else {
            //console.log("getNext: down not possible");
        }


        // right
        if (x < cols - 1 && maze[index(x, y)].walls[1] === false && pathstack.includes(index(x + 1, y)) === false && maze[index(x + 1, y)].isDead == false) {
            //console.log("getNext: right");
            return index(x + 1, y);
        } else {
            //console.log("getNext: right not possible");
        }

        // left
        if (x > 0 && maze[index(x, y)].walls[3] === false && pathstack.includes(index(x - 1, y)) === false && maze[index(x - 1, y)].isDead == false) {
            //console.log("move pathfinder to left");
            return index(x - 1, y);
        } else {
            //console.log("getNext: left not possible");
        }
        // top
        if (y > 0 && maze[index(x, y)].walls[0] === false && pathstack.includes(index(x, y - 1)) === false && maze[index(x, y - 1)].isDead == false) {
            //console.log("getNext: top");
            return index(x, y - 1);
        } else {
            //console.log("getNext: top not possible");
        }


        // return undefined if nowhere to go
        //console.log("getNext: no way found");
        return undefined;
    }

    this.reset = function () {
        pathstack = [];
    }


}