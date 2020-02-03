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

const drowMaze = maze => {
  for (let row = 0; row < maze.size; row++) {
    let tr = $('<tr>');
    for (let column = 0; column < maze.size; column++) {
      if (maze.grid[row][column]) {
        tr.append($('<td class="maze-cell -wall"></td>'));
      } else {
        tr.append($('<td class="maze-cell"></td>'));
      }
    }
    $('.maze tbody').append(tr);
  }
};

const size = 7;
const maze = new Maze(size);
maze.makeGrid();
drowMaze(maze);
