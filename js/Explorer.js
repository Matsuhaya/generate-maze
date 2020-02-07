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
      FromUp: 'U',
      FromRight: 'R',
      FromDown: 'D',
      FromLeft: 'L'
    };
  }

  // 探索キューからセルを取り出す
  // 取り出したセルに隣接するセルの内、未探索のセルをキューに追加
  // セルの探索は上から時計回り方向
  // セルがゴール地点であることを確認したら、その時点で探索終了
  searchGoal(passedCellList) {
    console.count();
    let nextPassedCellList = [];

    while (passedCellList.length) {
      let row = passedCellList[0][0];
      let column = passedCellList[0][1];
      passedCellList.shift();

      if (this.grid[row][column] === this.gridType.Goal) {
        console.log(this.grid[row][column]);
        console.log('ゴールしました');
        console.log(this.grid);
        return;
      }

      nextPassedCellList.push(...this.checkDirection(row, column));
    }

    this.searchGoal(nextPassedCellList);
  }

  // 上下左右の4方向を探索
  // 探索エリアは現在地から1マス先
  // 探索先が通路の場合、どの方向から来たのかを1マス先に記録
  // 探索先がゴールの場合、配列に追加してその時点で処理を終える
  // 探索可能方向を格納した配列を返す
  checkDirection(row, column) {
    const nextPassedCellList = [];
    const DISTANCE = 1; // 探索距離
    // 上方向
    if (this.grid[row - DISTANCE][column] === this.gridType.Path) {
      this.grid[row - DISTANCE][column] = this.gridType.FromDown;
      nextPassedCellList.push([row - DISTANCE, column]);
    } else if (this.grid[row - DISTANCE][column] === this.gridType.Goal) {
      nextPassedCellList.push([row - DISTANCE, column]);
      return nextPassedCellList;
    }

    // 右方向
    if (this.grid[row][column + DISTANCE] === this.gridType.Path) {
      this.grid[row][column + DISTANCE] = this.gridType.FromLeft;
      nextPassedCellList.push([row, column + DISTANCE]);
    } else if (this.grid[row][column + DISTANCE] === this.gridType.Goal) {
      nextPassedCellList.push([row, column + DISTANCE]);
      return nextPassedCellList;
    }

    // 下方向
    if (this.grid[row + DISTANCE][column] === this.gridType.Path) {
      this.grid[row + DISTANCE][column] = this.gridType.FromUp;
      nextPassedCellList.push([row + DISTANCE, column]);
    } else if (this.grid[row + DISTANCE][column] === this.gridType.Goal) {
      nextPassedCellList.push([row + DISTANCE, column]);
      return nextPassedCellList;
    }

    // 左方向
    if (this.grid[row][column - DISTANCE] === this.gridType.Path) {
      this.grid[row][column - DISTANCE] = this.gridType.FromRight;
      nextPassedCellList.push([row, column - DISTANCE]);
    } else if (this.grid[row][column - DISTANCE] === this.gridType.Goal) {
      nextPassedCellList.push([row, column - DISTANCE]);
      return nextPassedCellList;
    }
    return nextPassedCellList;
  }
}
