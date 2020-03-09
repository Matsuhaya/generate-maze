export class Maze {
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
      ExtendingWall: 2,
      ExtendingStart: 3 // startCellList内に含まれており、かつPathである状態
    };
    this.extendingCounter = 0; // 迷路の壁を拡張するたびにカウンターが増加する
  }

  // HEIGHT行,WIDTH列の行列を生成
  generateGrid() {
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

  // row,columnともに偶数となるセルを壁伸ばし開始地点(候補)としてリストに格納
  addStartCellList() {
    for (let row = 1; row < this.HEIGHT - 1; row++) {
      for (let column = 1; column < this.WIDTH - 1; column++) {
        if (row % 2 === 0 && column % 2 === 0) {
          this.startCellList.push([row, column]);
          this.grid[row][column] = this.cellType.ExtendingStart;
        }
      }
    }
  }

  removeStartCellList(index) {
    this.startCellList.splice(index, 1);
  }

  getStartCell() {
    let nextRandIndex = Math.floor(Math.random() * this.startCellList.length);
    let nextStartRow = this.startCellList[nextRandIndex][0];
    let nextStartColumn = this.startCellList[nextRandIndex][1];
    return {
      randIndex: nextRandIndex,
      startRow: nextStartRow,
      startColumn: nextStartColumn
    };
  }

  // 1. row, column がともに偶数となるセルを、壁伸ばし開始地点(候補)としてリストに追加
  // 2. ランダムでリストからセルを選び、壁かどうかを確認
  //     *  壁でない場合、3の処理へ
  //     *  壁の場合、5の処理へ
  // 3. 選んだセルを拡張中の壁に更新
  // 4. 壁の拡張を実行
  //     *  成功した場合、5の処理へ
  //     *  失敗した場合、7の処理へ
  // 5. 拡張中の壁を壁に更新
  // 6. 選んだセルはリストから削除して、8の処理へ
  // 7. 拡張中の壁を元に戻して、2の処理へ
  // 8. リストが空かどうかを確認
  //     *  空ではない場合、2の処理へ
  //     *  空の場合、処理を終了
  generateMaze() {
    this.addStartCellList();

    while (this.startCellList.length) {
      // ランダムでリストからセルを取り出す
      let { randIndex, startRow, startColumn } = this.getStartCell();
      let isExtendingSuccess = false;

      // 選んだセルが既存の壁ではないならextedWallを実行する
      // 壁でない場合、必然通路になるはず
      if (this.grid[startRow][startColumn] === this.cellType.ExtendingStart) {
        this.grid[startRow][startColumn] = this.cellType.ExtendingWall;
        isExtendingSuccess = this.extendWall(startRow, startColumn);

        // falseがリターンされるテスト
        // isExtendingSuccess = this.extendWall_ng_falseClearDirectionListAndFalseIsConnectedWall();

        if (isExtendingSuccess) {
          this.updateExtendingWall(this.cellType.Wall);
          // 更新後に描画する方が、更新プロセスがわかりやすい
          // this.drowMyself();
          this.removeStartCellList(randIndex);
        } else {
          console.log('拡張中の壁を元にもどし、再度壁を拡張します');
          this.updateExtendingWall(this.cellType.Path);
          // return; // テストを実行する時はreturnを記述してwhileループを抜ける
        }
      } else {
        this.removeStartCellList(randIndex);
      }
    }
  }

  // extendWallを実行中、拡張中の壁だけがExtendingWallとなるようにする。
  // 迷路の情報を更新して、PathとWallのみにする。
  // 壁に更新する場合、ExtendingWallはWallに変更
  // 更新をリセットする場合、ExtendingWallはPathとExtendingStartに変更
  updateExtendingWall(nextCellType) {
    for (let row = 0; row < this.HEIGHT; row++) {
      for (let column = 0; column < this.WIDTH; column++) {
        if (this.grid[row][column] === this.cellType.ExtendingWall) {
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

  // 1. 4方向全てについて、壁を伸ばせるかどうか確認
  //     * 壁を伸ばせる方向がある場合、2の処理へ
  //     * 壁を伸ばせる方向がなければ、壁伸ばし失敗をリターン
  // 2. 壁を伸ばせる方向を全てリストに追加
  // 3. ランダムでリストから壁を伸ばす方向を選ぶ
  // 4. 2セル先までを拡張中の壁に更新
  // 5. 2セル先が壁かどうかを確認
  //     * 壁と接続していない場合、1の処理へ
  //     * 壁と接続した場合、6の処理へ
  // 6. 拡張中の壁を、壁に更新
  // 7. 壁伸ばし成功をリターン
  extendWall(row, column) {
    const DISTANCE = 2; // 進行距離
    let isConnectedWall = false;
    let clearDirectionList = this.addClearDirectionList(row, column, DISTANCE);

    if (clearDirectionList.length) {
      let randIndex = Math.floor(Math.random() * clearDirectionList.length);
      // row, column, isConnectedWallを更新
      ({ row, column, isConnectedWall } = this.updateExtendingWallOnDirection(
        row,
        column,
        clearDirectionList[randIndex],
        DISTANCE
      ));
      this.drowMyself();

      // もしまだ既存の壁と接続していなければ、壁伸ばし続行！
      if (!isConnectedWall) {
        return this.extendWall(row, column);
      } else {
        console.log('壁伸ばし成功');
        return true;
      }
    } else {
      console.log('壁伸ばし失敗');
      return false;
    }
  }

  // 上下左右の4方向を探索
  // 探索距離はDISTANCEで指定
  // 探索条件は"拡張中の壁か否か"
  // 探索可能方向を格納した配列を返す
  addClearDirectionList(row, column, DISTANCE) {
    const clearDirectionList = [];
    // 上方向
    if (this.grid[row - DISTANCE][column] !== this.cellType.ExtendingWall) {
      clearDirectionList.push('UP');
    }
    // 下方向
    if (this.grid[row + DISTANCE][column] !== this.cellType.ExtendingWall) {
      clearDirectionList.push('DOWN');
    }
    // 左方向
    if (this.grid[row][column - DISTANCE] !== this.cellType.ExtendingWall) {
      clearDirectionList.push('LEFT');
    }
    // 右方向
    if (this.grid[row][column + DISTANCE] !== this.cellType.ExtendingWall) {
      clearDirectionList.push('RIGHT');
    }
    return clearDirectionList;
  }

  // 実行順序を変更しないこと
  // 拡張先 = 引数の方向に、2セル先
  // 1.リストからランダムに壁を伸ばす方向を選ぶ
  // 1.拡張先が壁の場合、壁接続フラグを立てる
  // 2.拡張先まで拡張中の壁に更新
  // 3.実行後は、拡張先の位置とフラグの結果を返す
  updateExtendingWallOnDirection(row, column, direction, DISTANCE) {
    let isConnectedWall;

    switch (direction) {
      case 'UP':
        isConnectedWall =
          this.grid[row - DISTANCE][column] === this.cellType.Wall;
        for (let i = 0; i < DISTANCE; i++) {
          this.grid[--row][column] = this.cellType.ExtendingWall;
        }
        break;
      case 'DOWN':
        isConnectedWall =
          this.grid[row + DISTANCE][column] === this.cellType.Wall;
        for (let i = 0; i < DISTANCE; i++) {
          this.grid[++row][column] = this.cellType.ExtendingWall;
        }
        break;
      case 'LEFT':
        isConnectedWall =
          this.grid[row][column - DISTANCE] === this.cellType.Wall;
        for (let i = 0; i < DISTANCE; i++) {
          this.grid[row][--column] = this.cellType.ExtendingWall;
        }
        break;
      case 'RIGHT':
        isConnectedWall =
          this.grid[row][column + DISTANCE] === this.cellType.Wall;
        for (let i = 0; i < DISTANCE; i++) {
          this.grid[row][++column] = this.cellType.ExtendingWall;
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
        } else if (this.grid[row][column] === this.cellType.ExtendingWall) {
          tr.append($('<td class="maze-cell -extending-wall"></td>'));
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
  extendWall_ng_falseClearDirectionListAndFalseIsConnectedWall() {
    // 1.前提条件を満たす状態変更
    const DISTANCE = 2; // 進行距離
    let isConnectedWall = false;
    let row = 2;
    let column = 2;
    let extendingDirectionList = [
      'DOWN',
      'DOWN',
      'RIGHT',
      'RIGHT',
      'UP',
      'UP',
      'LEFT',
      'DOWN'
    ];
    this.grid[row][column] = this.cellType.ExtendingWall;

    for (let i = 0; i < extendingDirectionList.length; i++) {
      ({ row, column, isConnectedWall } = this.updateExtendingWallOnDirection(
        row,
        column,
        extendingDirectionList[i],
        DISTANCE
      ));
      this.drowMyself();
    }

    // 2.実行
    let result = this.extendWall(4, 4);

    // 3.結果表示
    if (!result) {
      console.log('テスト成功:', this.grid);
    } else {
      console.log('テスト失敗:', this.grid);
    }

    return result;
  }
}
