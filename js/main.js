class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = []; // 壁の場合は1,道の場合は0を格納した二次元配列
    this.startCellList = []; // 壁を生成するスタート地点となるセルの候補を格納した二次元配列
  }

  makeGrid() {
    for (let row = 0; row < this.height; row++) {
      let rowData = [];
      for (let column = 0; column < this.width; column++) {
        if (row === 0 || row === this.height - 1) {
          rowData.push(1);
        } else {
          if (column === 0 || column === this.width - 1) {
            rowData.push(1);
          } else {
            rowData.push(0);
          }
        }
      }
      this.grid.push(rowData);
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
      let rand = Math.floor(Math.random() * this.startCellList.length);
      let startRow = this.startCellList[rand][0];
      let startColumn = this.startCellList[rand][1];
      this.startCellList.splice(rand, 1);

      if (this.grid[startRow][startColumn] === 0) {
        this.updateMaze();
        this.extendWall(startRow, startColumn);
      } else {
        console.log(`Not execute at ${startRow},${startColumn}`);
      }
    }
  }

  // extendWallを実行中、拡張中の壁だけが2となるようにする。
  // 迷路の情報を更新して、0,1のみにする。2は1に変更
  updateMaze() {
    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        if (this.grid[row][column] === 2) {
          this.grid[row][column] = 1;
        }
      }
    }
  }

  // 壁伸ばし処理
  // 再帰処理
  // 今の場所を拡張中ステータスの2に変更
  // ランダムで選択した壁を伸ばせる方向に2進む
  // 行き先が通路かどうかを判定
  extendWall(row, column) {
    console.count();
    console.log(row, column);
    this.grid[row][column] = 2;

    let clearDirection = this.checkDirection(row, column);
    console.log('clearDirection:', clearDirection);

    if (clearDirection.length) {
      let rand = Math.floor(Math.random() * clearDirection.length);
      let needsExtending = false;

      switch (clearDirection[rand]) {
        case 'UP':
          needsExtending = this.grid[row - 2][column] == 0;
          this.grid[--row][column] = 2;
          this.grid[--row][column] = 2;
          console.log('UPした');
          break;
        case 'DOWN':
          needsExtending = this.grid[row + 2][column] == 0;
          this.grid[++row][column] = 2;
          this.grid[++row][column] = 2;
          console.log('DOWNした');
          break;
        case 'LEFT':
          needsExtending = this.grid[row][column - 2] == 0;
          this.grid[row][--column] = 2;
          this.grid[row][--column] = 2;
          console.log('LEFTした');
          break;
        case 'RIGHT':
          needsExtending = this.grid[row][column + 2] == 0;
          this.grid[row][++column] = 2;
          this.grid[row][++column] = 2;
          console.log('RIGHTした');
          break;
      }

      // もしまだ既存の壁と接続していなければ、壁伸ばし続行だ！
      if (needsExtending) {
        console.log('拡張MODE継続!!');
        this.extendWall(row, column);
      }
    }
  }

  // 上下左右の4方向を探索
  // 探索エリアは現在地から2マス先
  // 探索条件は"拡張中ではないエリアか否か"
  // 拡張中エリアは2で表現する
  // 探索可能方向を格納した配列を返す
  checkDirection(row, column) {
    let directions = [];
    // 上方向
    if (this.grid[row - 2][column] !== 2) {
      directions.push('UP');
    }
    // 下方向
    if (this.grid[row + 2][column] !== 2) {
      directions.push('DOWN');
    }
    // 左方向
    if (this.grid[row][column - 2] !== 2) {
      directions.push('LEFT');
    }
    // 右方向
    if (this.grid[row][column + 2] !== 2) {
      directions.push('RIGHT');
    }
    return directions;
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
const width = 15;
const height = 15;
const maze = new Maze(width, height);
maze.makeGrid();
maze.countStartCellList();
maze.createMaze();
drowMaze(maze);
