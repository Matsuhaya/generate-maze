export default class Explorer {
  // mazeの情報からexplorerを生成する
  constructor(maze) {
    this.WIDTH = maze.WIDTH;
    this.HEIGHT = maze.HEIGHT;
    this.grid = maze.grid; // gridTypeを格納した二次元配列
    this.start = maze.start; // スタート地点の[row, column]
    this.goal = maze.goal; // ゴール地点
    this.gridType = {
      Start: 'S',
      Goal: 'G',
      Path: 0,
      Wall: 1,
      AnswerRoute: 3,
      FromUp: 'U',
      FromRight: 'R',
      FromDown: 'D',
      FromLeft: 'L'
    };
    this.beforeGoal = []; // ゴール手前の[row, column]
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

      if (this.grid[row][column] === this.gridType.Goal) {
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
      let nextGridType;
      if (i === 0) {
        // 上方向
        nextRow = row - DISTANCE;
        nextColumn = column;
        nextGridType = this.gridType.FromDown;
      } else if (i === 1) {
        // 右方向
        nextRow = row;
        nextColumn = column + DISTANCE;
        nextGridType = this.gridType.FromLeft;
      } else if (i === 2) {
        // 下方向
        nextRow = row + DISTANCE;
        nextColumn = column;
        nextGridType = this.gridType.FromUp;
      } else if (i === 3) {
        // 左方向
        nextRow = row;
        nextColumn = column - DISTANCE;
        nextGridType = this.gridType.FromRight;
      }

      if (this.grid[nextRow][nextColumn] === this.gridType.Path) {
        this.grid[nextRow][nextColumn] = nextGridType;
        nextPassedCellList.push([nextRow, nextColumn]);
      } else if (this.grid[nextRow][nextColumn] === this.gridType.Goal) {
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
    if (this.grid[row][column] !== this.gridType.Start) {
      switch (this.grid[row][column]) {
        case this.gridType.FromUp:
          this.grid[row][column] = this.gridType.AnswerRoute;
          --row;
          break;
        case this.gridType.FromRight:
          this.grid[row][column] = this.gridType.AnswerRoute;
          ++column;
          break;
        case this.gridType.FromDown:
          this.grid[row][column] = this.gridType.AnswerRoute;
          ++row;
          break;
        case this.gridType.FromLeft:
          this.grid[row][column] = this.gridType.AnswerRoute;
          --column;
          break;
      }
    } else {
      return;
    }
    this.updateAnswerRoute(row, column);
  }
}
