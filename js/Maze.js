export default class Maze {
  constructor(WIDTH, HEIGHT) {
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.grid = []; // gridTypeを格納した二次元配列
    this.startCellList = []; // 壁を生成するスタート地点となるセルの候補を格納した二次元配列
    this.start = []; // スタート地点の[row, column]
    this.goal = []; // ゴール地点の[row, column]
    this.gridType = {
      Start: 'S',
      Goal: 'G',
      Path: 0,
      Wall: 1,
      Extending: 2
    };
  }

  // HEIGHT行,WIDTH列の行列を生成
  // 大外は壁に設定
  makeGrid() {
    for (let row = 0; row < this.HEIGHT; row++) {
      let rowList = [];
      for (let column = 0; column < this.WIDTH; column++) {
        if (row === 0 || row === this.HEIGHT - 1) {
          rowList.push(this.gridType.Wall);
        } else {
          if (column === 0 || column === this.WIDTH - 1) {
            rowList.push(this.gridType.Wall);
          } else {
            rowList.push(this.gridType.Path);
          }
        }
      }
      this.grid.push(rowList);
    }
  }

  // row,columnともに偶数となる座標を壁伸ばし開始座標(候補)としてリストアップ
  countStartCellList() {
    for (let row = 1; row < this.HEIGHT - 1; row++) {
      for (let column = 1; column < this.WIDTH - 1; column++) {
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

      if (this.grid[startRow][startColumn] === this.gridType.Path) {
        this.extendWall(startRow, startColumn);
      } else {
        // console.log(`Not execute at ${startRow},${startColumn}`);
      }
    }
  }

  // extendWallを実行中、拡張中の壁だけがExtendingとなるようにする。
  // 迷路の情報を更新して、PathとWallのみにする。
  // ExtendingはPathに変更
  updateMaze() {
    for (let row = 0; row < this.HEIGHT; row++) {
      for (let column = 0; column < this.WIDTH; column++) {
        if (this.grid[row][column] === this.gridType.Extending) {
          this.grid[row][column] = this.gridType.Wall;
        }
      }
    }
  }

  // 壁伸ばし処理
  // 再帰処理
  // 今いるgridの場所をExtendingに変更
  // ランダムで選択した壁を伸ばせる方向に2進む
  // 行き先がPathかどうかを判定
  extendWall(row, column) {
    this.grid[row][column] = this.gridType.Extending;
    let clearDirection = this.checkDirection(row, column);
    const DISTANCE = 2; // 進行距離

    if (clearDirection.length) {
      let rand = Math.floor(Math.random() * clearDirection.length);
      let needsExtending = false;

      switch (clearDirection[rand]) {
        case 'UP':
          needsExtending =
            this.grid[row - DISTANCE][column] == this.gridType.Path;
          this.grid[--row][column] = this.gridType.Extending;
          this.grid[--row][column] = this.gridType.Extending;
          // console.log('UPした');
          break;
        case 'DOWN':
          needsExtending =
            this.grid[row + DISTANCE][column] == this.gridType.Path;
          this.grid[++row][column] = this.gridType.Extending;
          this.grid[++row][column] = this.gridType.Extending;
          // console.log('DOWNした');
          break;
        case 'LEFT':
          needsExtending =
            this.grid[row][column - DISTANCE] == this.gridType.Path;
          this.grid[row][--column] = this.gridType.Extending;
          this.grid[row][--column] = this.gridType.Extending;
          // console.log('LEFTした');
          break;
        case 'RIGHT':
          needsExtending =
            this.grid[row][column + DISTANCE] == this.gridType.Path;
          this.grid[row][++column] = this.gridType.Extending;
          this.grid[row][++column] = this.gridType.Extending;
          // console.log('RIGHTした');
          break;
      }

      // もしまだ既存の壁と接続していなければ、壁伸ばし続行だ！
      if (needsExtending) {
        // console.log('拡張MODE継続!!');
        this.extendWall(row, column);
      } else {
        this.updateMaze();
      }
    }
  }

  // 上下左右の4方向を探索
  // 探索エリアは現在地から2マス先
  // 探索条件は"拡張中ではないエリアか否か"
  // 探索可能方向を格納した配列を返す
  checkDirection(row, column) {
    const directions = [];
    const DISTANCE = 2; // 探索距離
    // 上方向
    if (this.grid[row - DISTANCE][column] !== this.gridType.Extending) {
      directions.push('UP');
    }
    // 下方向
    if (this.grid[row + DISTANCE][column] !== this.gridType.Extending) {
      directions.push('DOWN');
    }
    // 左方向
    if (this.grid[row][column - DISTANCE] !== this.gridType.Extending) {
      directions.push('LEFT');
    }
    // 右方向
    if (this.grid[row][column + DISTANCE] !== this.gridType.Extending) {
      directions.push('RIGHT');
    }
    return directions;
  }

  // ランダムでスタート地点候補を決定
  // 候補がPathであればスタート地点とする
  // 候補がPathでなければ再帰実行
  setStart() {
    let startRow = Math.floor(Math.random() * this.HEIGHT);
    let startColumn = Math.floor(Math.random() * this.WIDTH);

    if (
      (startRow % 2 || startColumn % 2) &&
      this.grid[startRow][startColumn] === this.gridType.Path
    ) {
      this.start = [startRow, startColumn];
      this.grid[startRow][startColumn] = this.gridType.Start;
    } else {
      this.setStart();
    }
  }

  // スタート地点と同様の手順でゴールを決定
  // スタート地点と被らないようにする
  setGoal() {
    let goalRow = Math.floor(Math.random() * this.HEIGHT);
    let goalColumn = Math.floor(Math.random() * this.WIDTH);

    if (
      (goalRow % 2 || goalColumn % 2) &&
      this.grid[goalRow][goalColumn] === this.gridType.Path
    ) {
      this.goal = [goalRow, goalColumn];
      this.grid[goalRow][goalColumn] = this.gridType.Goal;
    } else {
      this.setGoal();
    }
  }
}
