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

  // 探索キューからセルを取り出す
  // 取り出したセルに隣接するセルの内、未探索のセルをキューに追加
  // セルの探索は上から時計回り方向
  // セルがゴール地点であることを確認したら、その時点で探索終了
  searchGoal(passedCellList) {
    // console.count('Go');
    let nextPassedCellList = [];

    while (passedCellList.length) {
      let row = passedCellList[0][0];
      let column = passedCellList[0][1];
      passedCellList.shift();

      if (this.grid[row][column] === this.cellType.Goal) {
        return;
      }

      nextPassedCellList.push(...this.checkDirection(row, column));
    }

    this.searchGoal(nextPassedCellList);
  }

  // 上下左右の4方向を探索
  // 探索エリアは現在地から1マス先
  // 探索先が通路の場合、どの方向から来たのかを1マス先に記録
  // 探索先がゴールの場合、現在地をbeforeGoalに、探索先をnextPassedCellListにそれぞれ追加してその時点で処理を終える
  // 探索可能方向を格納した配列を返す
  checkDirection(row, column) {
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
