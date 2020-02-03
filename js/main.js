class Maze {
  constructor(size) {
    this.size = size;
    this.grid = [];
  }

  makeGrid() {
    for (let row = 0; row < this.size; row++) {
      let _rowData = [];
      for (let column = 0; column < this.size; column++) {
        if (row === 0 || row === this.size - 1) {
          _rowData.push(1);
        } else {
          if (column === 0 || column === this.size - 1) {
            _rowData.push(1);
          } else {
            _rowData.push(0);
          }
        }
      }
      this.grid.push(_rowData);
    }
  }
}

const size = 5;
const maze = new Maze(size);
maze.makeGrid();
