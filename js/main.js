class Maze {
  constructor(size) {
    this.size = size;
    this.grid = []; // 壁の場合は1,道の場合は0を格納した二次元配列
    this.startCellList = []; // 壁を生成するスタート地点となるセルの候補を格納した二次元配列
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

  // row,columnともに偶数となる座標を壁伸ばし開始座標(候補)としてリストアップ
  countStartCellList() {
    for (let row = 1; row < this.size - 1; row++) {
      for (let column = 1; column < this.size - 1; column++) {
        if (row % 2 === 0 && column % 2 === 0) {
          this.startCellList.push([row, column]);
        }
      }
    }
  }
}

// Mazeインスタンスのデータを元に、DOMを生成
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

//サイズは必ず5以上の奇数で生成する
const size = 7;
const maze = new Maze(size);
maze.makeGrid();
drowMaze(maze);
