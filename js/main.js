class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = []; // 壁の場合は1,道の場合は0を格納した二次元配列
    this.startCellList = []; // 壁を生成するスタート地点となるセルの候補を格納した二次元配列
  }

  makeGrid() {
    for (let row = 0; row < this.height; row++) {
      let cell = [];
      for (let column = 0; column < this.width; column++) {
        if (row === 0 || row === this.height - 1) {
          cell.push(1);
        } else {
          if (column === 0 || column === this.width - 1) {
            cell.push(1);
          } else {
            cell.push(0);
          }
        }
      }
      this.grid.push(cell);
    }
  }

  // row,columnともに偶数となる座標を壁伸ばし開始座標(候補)としてリストアップ
  countStartCellList() {
    for (let row = 1; row < this.height - 1; row++) {
      for (let column = 1; column < this.width - 1; column++) {
        if (row % 2 === 0 && column % 2 === 0) {
          this.startCellList.push([row, column]);
        }
      }
    }
  }

  // startCellListの中身がなくなるまで、extendWallを繰り返し実行する
  // startCellListの中身は、実行するごとにランダムに１つずつ減っていく
  createMaze() {
    while (this.startCellList.length) {
      let random = Math.floor(Math.random() * this.startCellList.length);
      let startRow = this.startCellList[random][0];
      let startColumn = this.startCellList[random][1];
      this.startCellList.splice(random, 1);

      if (this.grid[startRow][startColumn] === 0) {
        this.extendWall(startRow, startColumn);
      }
    }
  }

  // 壁伸ばし処理
  // 再帰処理
  extendWall(row, column) {
    console.count();
    console.log(row, column);
    // 壁を伸ばす方向を探索
    // もし伸ばすことが可能な方向がなければ、拡張中リストの壁で再帰処理だ！
    // 壁を伸ばせる方向に2進む
    // 拡張に成功したら壁を拡張中リストにスタック
  }
}

// Mazeインスタンスのデータを元に、DOMを生成
const drowMaze = maze => {
  for (let row = 0; row < maze.height; row++) {
    let tr = $('<tr>');
    for (let column = 0; column < maze.width; column++) {
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
const width = 7;
const height = 9;
const maze = new Maze(width, height);
maze.makeGrid();
maze.countStartCellList();
maze.createMaze();
drowMaze(maze);
