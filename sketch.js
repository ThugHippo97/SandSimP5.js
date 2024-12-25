let grid;
let sandSize = 10;
let rows, cols;

let hueVal = 200;
let totParticles = 0;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 255, 255);
  rows = floor(width / sandSize);
  cols = floor(height / sandSize);
  grid = make2DArray(rows, cols);
  frameRate(60);
}

function draw() {
  background(0);

  // Display FPS and particle count
  textSize(20);
  fill(255);
  text(`FPS: ${round(frameRate())}`, width - 200, 30);
  text(`Total Particles: ${totParticles}`, width - 200, 60);

  // Render the grid
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] > 0) {
        noStroke();
        fill(grid[i][j], 255, 255);
        let x = i * sandSize;
        let y = j * sandSize;
        rect(x, y, sandSize, sandSize);
      }
    }
  }

  // Simulate sand falling
  let nextGrid = make2DArray(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let state = grid[i][j];
      if (state > 0) {
        let below = j < cols - 1 ? grid[i][j + 1] : 0;
        let belowL = (j < cols - 1 && i > 0) ? grid[i - 1][j + 1] : 0;
        let belowR = (j < cols - 1 && i < rows - 1) ? grid[i + 1][j + 1] : 0;

        if (j === cols - 1) {
          nextGrid[i][j] = state;
        } else if (below === 0) {
          nextGrid[i][j + 1] = state;
        } else if (belowL === 0 && i > 0) {
          nextGrid[i - 1][j] = state;
        } else if (belowR === 0 && i < rows - 1) {
          nextGrid[i + 1][j] = state;
        } else {
          nextGrid[i][j] = state;
        }
      }
    }
  }
  grid = nextGrid;

  totParticles = getParticleCount();
}

function mouseDragged() {
  let mouseCol = floor(mouseX / sandSize);
  let mouseRow = floor(mouseY / sandSize);

  let sandAmt = 3;
  let extent = floor(sandAmt / 2);

  for (let i = -extent; i <= extent; i++) {
    for (let j = -extent; j <= extent; j++) {
      let col = mouseCol + i;
      let row = mouseRow + j;
      if (col >= 0 && col < rows && row >= 0 && row < cols) {
        grid[col][row] = hueVal;
      }
    }
  }
  hueVal = (hueVal + 1) % 360;
}

function getParticleCount() {
  let count = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] > 0) {
        count++;
      }
    }
  }
  return count;
}

function make2DArray(rows, cols) {
  let array = new Array(rows);
  for (let i = 0; i < rows; i++) {
    array[i] = new Array(cols).fill(0);
  }
  return array;
}