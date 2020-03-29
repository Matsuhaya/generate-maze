export default class Explorer {
  // mazeの情報からexplorerを生成する
  // ObjectはDeepCopyする
  constructor(WIDTH, HEIGHT) {
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.grid = []; // cellTypeを格納した二次元配列
    this.start = []; // スタート地点の[row, column]
    this.beforeGoal = []; // ゴール手前の[row, column]
    this.cellType = {
      Start: 'S',
      Goal: 'G',
      Path: 0,
      Wall: 1,
      AnswerRoute: 'A',
      FromUp: 'U',
      FromRight: 'R',
      FromDown: 'D',
      FromLeft: 'L'
    };
  }

  deepCopyMaze(grid, start) {
    // 二次元配列のDeepCopy
    this.grid = JSON.parse(JSON.stringify(grid));
    $.extend(this.start, start);
  }

  // 1. 根ノード(スタート地点)を探索キューに追加
  // 2. 探索キューからセルを取り出す
  // 3. 取り出したセルのゴール判定
  //     * ゴールの場合、処理を終了
  // 4. 隣接セル探索の実行
  // 5. 探索したセルを探索キューに追加
  // 6. 探索キューが空かどうかを確認
  //     * 空ではない場合、2の処理へ
  //     * 空の場合、処理を終了
  breadthFirstSearch(start) {
    let passedCellList = [start];

    while (passedCellList.length) {
      let [row, column] = passedCellList.shift();

      if (this.grid[row][column] === this.cellType.Goal) {
        return;
      }

      passedCellList.push(...this.checkNextCell(row, column));
    }
  }

  // 1. 現在地の隣接セルが、通路もしくはゴールかどうか確認
  //     * 通路の場合、2の処理へ
  //     * ゴールの場合、5の処理へ
  //     * どちらでもない場合、4の処理へ
  // 2. 探索済の印(どの方向から来たのかを示す)をつける
  // 3. 対象の隣接セルを通路リストに追加
  // 4. 4方向全て探索完了したか
  //     * 未完了の場合、1の処理へ
  //     * 完了した場合、7の処理へ
  // 5. 現在地をゴール手前のセルとして更新
  // 6. 対象の隣接セルを通路リストに追加
  // 7. 通路リストをリターン
  checkNextCell(row, column) {
    const nextPassedCellList = [];
    const DISTANCE = 1; // 探索距離

    for (let i = 0; i < 4; i++) {
      let nextRow;
      let nextColumn;
      let nextcellType;
      if (i === 0) {
        // 上方向
        nextRow = row - DISTANCE;
        nextColumn = column;
        nextcellType = this.cellType.FromDown;
      } else if (i === 1) {
        // 右方向
        nextRow = row;
        nextColumn = column + DISTANCE;
        nextcellType = this.cellType.FromLeft;
      } else if (i === 2) {
        // 下方向
        nextRow = row + DISTANCE;
        nextColumn = column;
        nextcellType = this.cellType.FromUp;
      } else if (i === 3) {
        // 左方向
        nextRow = row;
        nextColumn = column - DISTANCE;
        nextcellType = this.cellType.FromRight;
      }

      if (this.grid[nextRow][nextColumn] === this.cellType.Path) {
        this.grid[nextRow][nextColumn] = nextcellType;
        nextPassedCellList.push([nextRow, nextColumn]);
      } else if (this.grid[nextRow][nextColumn] === this.cellType.Goal) {
        this.beforeGoal = [row, column];
        nextPassedCellList.push([nextRow, nextColumn]);
        return nextPassedCellList;
      }
    }

    return nextPassedCellList;
  }

  // ゴールからスタートの道を辿り、AnswerRouteに更新
  updateAnswerRoute(row, column) {
    // console.count('Back');
    if (this.grid[row][column] !== this.cellType.Start) {
      switch (this.grid[row][column]) {
        case this.cellType.FromUp:
          this.grid[row][column] = this.cellType.AnswerRoute;
          --row;
          break;
        case this.cellType.FromRight:
          this.grid[row][column] = this.cellType.AnswerRoute;
          ++column;
          break;
        case this.cellType.FromDown:
          this.grid[row][column] = this.cellType.AnswerRoute;
          ++row;
          break;
        case this.cellType.FromLeft:
          this.grid[row][column] = this.cellType.AnswerRoute;
          --column;
          break;
      }
    } else {
      return;
    }
    this.updateAnswerRoute(row, column);
  }
}
