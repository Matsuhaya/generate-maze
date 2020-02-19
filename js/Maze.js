export default class Maze {
  constructor(WIDTH, HEIGHT) {
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.grid = []; // cellTypeを格納した二次元配列
    this.startCellList = []; // 壁を生成するスタート地点となるセルの候補を格納した二次元配列
    this.start = []; // スタート地点の[row, column]
    this.goal = []; // ゴール地点の[row, column]
    this.cellType = {
      Start: 'S',
      Goal: 'G',
      Path: 0,
      Wall: 1,
      Extending: 2,
      ExtendingStart: 3
    };
    this.extendingCounter = 0;
  }

  // HEIGHT行,WIDTH列の行列を生成
  makeGrid() {
    for (let row = 0; row < this.HEIGHT; row++) {
      let rowList = [];
      for (let column = 0; column < this.WIDTH; column++) {
        rowList.push(this.initializeCellType(row, column));
      }
      this.grid.push(rowList);
    }
  }

  // rowとcolumの値に応じたcellTypeの初期化を実施
  // 大外は壁に設定
  initializeCellType(row, column) {
    if (row === 0 || row === this.HEIGHT - 1) {
      return this.cellType.Wall;
    } else {
      if (column === 0 || column === this.WIDTH - 1) {
        return this.cellType.Wall;
      } else {
        return this.cellType.Path;
      }
    }
  }

  // row,columnともに偶数となる座標を壁伸ばし開始座標(候補)としてリストアップ
  countStartCellList() {
    for (let row = 1; row < this.HEIGHT - 1; row++) {
      for (let column = 1; column < this.WIDTH - 1; column++) {
        if (row % 2 === 0 && column % 2 === 0) {
          this.startCellList.push([row, column]);
          this.grid[row][column] = this.cellType.ExtendingStart;
        }
      }
    }
  }

  // startCellListの中身がなくなるまで、extendWallを繰り返し実行する
  // startCellListの中身は、実行するごとにランダムに１つずつ減っていく
  // startCellListの中身が壁でないなら、壁の拡張処理を実行する
  // 壁を伸ばせる方向がなければ、拡張中の壁に関する変更を破棄した後、再度壁を拡張する
  createMaze() {
    while (this.startCellList.length) {
      let rand = Math.floor(Math.random() * this.startCellList.length);
      let startRow = this.startCellList[rand][0];
      let startColumn = this.startCellList[rand][1];
      let isExtendingSuccess = false;

      // -----壁拡張が失敗するパターンでextendWallを実行した場合のテスト-----
      // isExtendingSuccess = this.extendWall_ng_falseClearDirectionAndFalseIsConnectedWall();
      // if (isExtendingSuccess) {
      //   this.startCellList.splice(rand, 1);
      // } else {
      //   console.log('拡張中の壁を破棄し、再度壁を拡張します');
      //   this.updateExtending(this.cellType.Path);
      //   return;
      // }
      // -----------------------------------------------------------

      if (this.grid[startRow][startColumn] !== this.cellType.Wall) {
        this.grid[startRow][startColumn] = this.cellType.Extending;
        isExtendingSuccess = this.extendWall(startRow, startColumn);
      } else {
        console.log(`Not execute extendWall at ${startRow},${startColumn}`);
        this.startCellList.splice(rand, 1);
      }

      if (isExtendingSuccess) {
        this.startCellList.splice(rand, 1);
      } else {
        console.log('拡張中の壁を破棄し、再度壁を拡張します');
        this.updateExtending(this.cellType.Path);
      }
    }
  }

  // extendWallを実行中、拡張中の壁だけがExtendingとなるようにする。
  // 迷路の情報を更新して、PathとWallのみにする。
  // 壁に更新する場合、ExtendingはWallに変更
  // 更新をリセットする場合、ExtendingはPathとExtendingStartに変更
  updateExtending(nextCellType) {
    for (let row = 0; row < this.HEIGHT; row++) {
      for (let column = 0; column < this.WIDTH; column++) {
        if (this.grid[row][column] === this.cellType.Extending) {
          this.grid[row][column] = nextCellType;

          if (
            nextCellType === this.cellType.Path &&
            row % 2 === 0 &&
            column % 2 === 0
          ) {
            this.grid[row][column] = this.cellType.ExtendingStart;
          }
        }
      }
    }
  }

  // 壁伸ばし処理
  // 再帰処理
  // 今いるgridの場所をExtendingに変更
  // ランダムで選択した壁を伸ばせる方向に2進む
  // 行き先が壁かどうかを判定
  extendWall(row, column) {
    const DISTANCE = 2; // 進行距離
    let clearDirection = this.checkDirection(row, column, DISTANCE);
    let isConnectedWall = false;

    if (clearDirection.length) {
      let rand = Math.floor(Math.random() * clearDirection.length);
      // row, column, isConnectedWallを更新
      ({ row, column, isConnectedWall } = this.updateExtendingToDirection(
        row,
        column,
        clearDirection[rand],
        DISTANCE
      ));
      this.drowMyself();

      // もしまだ既存の壁と接続していなければ、壁伸ばし続行だ！
      if (!isConnectedWall) {
        this.extendWall(row, column);
      } else {
        this.updateExtending(this.cellType.Wall);
        // 更新後に描画する方が、更新プロセスがわかりやすい
        this.drowMyself();
        return true;
      }
    } else {
      console.log('壁に接続していないのに、進める方向がありません');
      return false;
    }
  }

  // 上下左右の4方向を探索
  // 探索エリアは現在地から2マス先
  // 探索条件は"拡張中ではないエリアか否か"
  // 探索可能方向を格納した配列を返す
  checkDirection(row, column, DISTANCE) {
    const directions = [];
    // 上方向
    if (this.grid[row - DISTANCE][column] !== this.cellType.Extending) {
      directions.push('UP');
    }
    // 下方向
    if (this.grid[row + DISTANCE][column] !== this.cellType.Extending) {
      directions.push('DOWN');
    }
    // 左方向
    if (this.grid[row][column - DISTANCE] !== this.cellType.Extending) {
      directions.push('LEFT');
    }
    // 右方向
    if (this.grid[row][column + DISTANCE] !== this.cellType.Extending) {
      directions.push('RIGHT');
    }
    return directions;
  }

  // 実行順序を変更しないこと
  // 1.拡張先が既存の壁の場合、フラグを立てる
  // 2.引数の方向に壁を拡張する
  // 3.実行後は、フラグの結果を返す
  updateExtendingToDirection(row, column, direction, DISTANCE) {
    let isConnectedWall;
    switch (direction) {
      case 'UP':
        isConnectedWall =
          this.grid[row - DISTANCE][column] === this.cellType.Wall;
        for (let i = 0; i < DISTANCE; i++) {
          this.grid[--row][column] = this.cellType.Extending;
        }
        break;
      case 'DOWN':
        isConnectedWall =
          this.grid[row + DISTANCE][column] === this.cellType.Wall;
        for (let i = 0; i < DISTANCE; i++) {
          this.grid[++row][column] = this.cellType.Extending;
        }
        break;
      case 'LEFT':
        isConnectedWall =
          this.grid[row][column - DISTANCE] === this.cellType.Wall;
        for (let i = 0; i < DISTANCE; i++) {
          this.grid[row][--column] = this.cellType.Extending;
        }
        break;
      case 'RIGHT':
        isConnectedWall =
          this.grid[row][column + DISTANCE] === this.cellType.Wall;
        for (let i = 0; i < DISTANCE; i++) {
          this.grid[row][++column] = this.cellType.Extending;
        }
        break;
    }
    return {
      row: row,
      column: column,
      isConnectedWall: isConnectedWall
    };
  }

  setUpperLeftStart() {
    let startRow = 1;
    let startColumn = 1;
    this.start = [startRow, startColumn];
    this.grid[startRow][startColumn] = this.cellType.Start;
  }

  setUnderRightGoal() {
    let goalRow = this.HEIGHT - 2;
    let goalColumn = this.WIDTH - 2;
    this.goal = [goalRow, goalColumn];
    this.grid[goalRow][goalColumn] = this.cellType.Goal;
  }

  // ランダムでスタート地点候補を決定
  // 候補がPathであればスタート地点とする
  // 候補がPathでなければ再帰実行
  setRandStart() {
    let startRow = Math.floor(Math.random() * this.HEIGHT);
    let startColumn = Math.floor(Math.random() * this.WIDTH);

    if (
      (startRow % 2 || startColumn % 2) &&
      this.grid[startRow][startColumn] === this.cellType.Path
    ) {
      this.start = [startRow, startColumn];
      this.grid[startRow][startColumn] = this.cellType.Start;
    } else {
      this.setStart();
    }
  }

  // スタート地点と同様の手順でゴールを決定
  // スタート地点と被らないようにする
  setRandGoal() {
    let goalRow = Math.floor(Math.random() * this.HEIGHT);
    let goalColumn = Math.floor(Math.random() * this.WIDTH);

    if (
      (goalRow % 2 || goalColumn % 2) &&
      this.grid[goalRow][goalColumn] === this.cellType.Path
    ) {
      this.goal = [goalRow, goalColumn];
      this.grid[goalRow][goalColumn] = this.cellType.Goal;
    } else {
      this.setGoal();
    }
  }

  // インスタンスのデータを元に、DOMを生成
  drowMyself() {
    ++this.extendingCounter;
    let className = `maze step${this.extendingCounter}`;
    $('.maze-wrapper').append(
      $(`<table class="${className}"><caption>${className}</caption>`).append(
        $('<tbody>')
      )
    );

    for (let row = 0; row < this.HEIGHT; row++) {
      let tr = $('<tr>');
      for (let column = 0; column < this.WIDTH; column++) {
        if (this.grid[row][column] === this.cellType.Wall) {
          tr.append($('<td class="maze-cell -wall"></td>'));
        } else if (this.grid[row][column] === this.cellType.Extending) {
          tr.append($('<td class="maze-cell -extending"></td>'));
        } else if (this.grid[row][column] === this.cellType.ExtendingStart) {
          tr.append($('<td class="maze-cell -extending-start"></td>'));
        } else if (this.grid[row][column] === 'S') {
          tr.append($('<td class="maze-cell -start"></td>'));
        } else if (this.grid[row][column] === 'G') {
          tr.append($('<td class="maze-cell -goal"></td>'));
        } else {
          tr.append($('<td class="maze-cell -path"></td>'));
        }
      }

      $(`.maze.step${this.extendingCounter} tbody`).append(tr);
    }
  }

  // テスト
  // this.grid(4,4)が拡張中の壁に囲まれる状態にする
  // 壁拡張中、拡張中の壁に囲まれたらテスト成功をコンソールに出力
  extendWall_ng_falseClearDirectionAndFalseIsConnectedWall() {
    // 前提条件を満たす状態変更
    const DISTANCE = 2; // 進行距離
    let isConnectedWall = false;
    let row = 2;
    let column = 2;
    let directions = [
      'DOWN',
      'DOWN',
      'RIGHT',
      'RIGHT',
      'UP',
      'UP',
      'LEFT',
      'DOWN'
    ];
    this.grid[row][column] = this.cellType.Extending;

    for (let i = 0; i < directions.length; i++) {
      ({ row, column, isConnectedWall } = this.updateExtendingToDirection(
        row,
        column,
        directions[i],
        DISTANCE
      ));
      this.drowMyself();
    }

    // 実行
    let result = this.extendWall(4, 4);

    // 結果表示
    if (!result) {
      console.log('テスト成功:', this.grid);
    } else {
      console.log('テスト失敗:', this.grid);
    }
  }
}
