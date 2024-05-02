const make2DArray = (cols, rows) =>
  Array.from({ length: cols }, () => Array.from({ length: rows }, () => 0));

const createNewSetup = () => {
  cols = width / box;
  rows = height / box;
  grid = make2DArray(cols, rows);
}

let box = 10;
let grid;
let cols, rows;
let hueValue = 5;
let matrix = 5

function setup() {
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);
  colorMode(HSB, 360, 255, 255);
  createNewSetup()
}

function mouseDragged() {
  const extent = floor(matrix / 2);

  for (let i = -extent; i <= extent; i++) {
    for (let j = -extent; j <= extent; j++) {
      if (random(1) < 0.6) {
        const col = floor(mouseX / box) + i;
        const row = floor(mouseY / box) + j;

        if (
          col >= 0 &&
          col <= cols - 1 &&
          row >= 0 &&
          row <= rows - 1
        ) {
          if (keyIsPressed && key === 'z') {
            grid[col][row] = 0;
          } else if (grid[col][row] <= 0) {
            grid[col][row] = hueValue;
          }
        }
      }
    }
  }

  hueValue = hueValue > 360 ? 10 : hueValue + 0.5;
}

function keyPressed() {
  console.log(key)
  switch (key) {
    case 'Backspace':
      grid = make2DArray(cols, rows)
      return
    case 'ArrowDown':
      matrix = matrix > 1 ? --matrix : 1
      return;
    case 'ArrowUp':
      matrix = matrix < 20 ? ++matrix : 20
      return;
    case 'ArrowLeft':
      box = box > 1 ? --box : 1;
      createNewSetup()
      return;
    case 'ArrowRight':
      box = box < 50 ? ++box : 50
      createNewSetup()
      return;
  }
}


function draw() {
  background(0);

  textSize(16);
  fill(255);

  [
    'Rubber: drag + z',
    'Reset: click backspace',
    `Change matrix size: ↕️, actual: ${matrix}`,
    `Change box size: ↔️, actual: ${box}` ,
  ].forEach((t, i) => text(t, 10, 24 * (i+1)))

  grid.forEach((col, i) =>
    col.forEach((state, j) => {
      noStroke();
      if (state < 1) {
        return;
      }

      fill(state, 255, 255);
      square(i * box, j * box, box);
    })
  );

  const nextGrid = make2DArray(cols, rows);

  grid.forEach((col, i) =>
    col.forEach((state, j) => {
      if (state <= 0) {
        return;
      }

      const dir = random([-1, 1]);
      const below = grid[i][j + 1];
      let belowA, belowD;

      if (i + dir >= 0 && i + dir <= cols - 1) {
        belowA = grid[i + dir][j + 1];
      }

      if (i - dir >= 0 && i - dir <= cols - 1) {
        belowD = grid[i - dir][j + 1];
      }

      if (below === 0) {
        nextGrid[i][j + 1] = state;
      } else if (belowA === 0) {
        nextGrid[i + dir][j + 1] = state;
      } else if (belowD === 0) {
        nextGrid[i - dir][j + 1] = state;
      } else {
        nextGrid[i][j] = state;
      }
    })
  );

  grid = nextGrid;
}
