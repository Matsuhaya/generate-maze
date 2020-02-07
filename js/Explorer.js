export default class Explorer {
  // mazeの情報からexplorerを生成する
  constructor(maze) {
    this.WIDTH = maze.WIDTH;
    this.HEIGHT = maze.HEIGHT;
    this.grid = maze.grid; // 壁の場合は1,道の場合は0を格納した二次元配列
    this.start = maze.start; // スタート地点の[row, column]
    this.goal = maze.goal; // ゴール地点
  }

  // 探索キューからセルを取り出す
  // 取り出したセルに隣接するセルの内、未探索のセルをキューに追加
  // セルの探索は上から時計回り方向
  // セルがゴール地点であることを確認したら、その時点で探索終了
  searchGoal(passedCellList) {
    let nextPassedCellList = [];
    let isGoaled = false;

    while (passedCellList.length) {
      let row = passedCellList[0][0];
      let column = passedCellList[0][1];
      passedCellList.shift();

      console.count();

      if (this.grid[row][column] !== 'S' && this.grid[row][column] !== 'G') {
        this.grid[row][column] = 2;
      } else if (this.grid[row][column] === 'G') {
        console.log(this.grid[row][column]);
        console.log('ゴールしました');
        isGoaled = true;
        return;
      }

      nextPassedCellList.push(...this.checkDirection(row, column));
    }

    if (!isGoaled) {
      this.searchGoal(nextPassedCellList);
    } else {
      console.log(this.grid);
    }
  }

  // 上下左右の4方向を探索
  // 探索エリアは現在地から1マス先
  // 探索条件は"通路、またはゴールである"こと
  // 探索済みエリアは2で表現する
  // 探索可能方向を格納した配列を返す
  checkDirection(row, column) {
    const nextPassedCellList = [];
    const DISTANCE = 1; // 探索距離
    // 上方向
    if (
      this.grid[row - DISTANCE][column] === 0 ||
      this.grid[row - DISTANCE][column] === 'G'
    ) {
      nextPassedCellList.push([row - DISTANCE, column]);
    }
    // 右方向
    if (
      this.grid[row][column + DISTANCE] === 0 ||
      this.grid[row][column + DISTANCE] === 'G'
    ) {
      nextPassedCellList.push([row, column + DISTANCE]);
    }
    // 下方向
    if (
      this.grid[row + DISTANCE][column] === 0 ||
      this.grid[row + DISTANCE][column] === 'G'
    ) {
      nextPassedCellList.push([row + DISTANCE, column]);
    }
    // 左方向
    if (
      this.grid[row][column - DISTANCE] === 0 ||
      this.grid[row][column - DISTANCE] === 'G'
    ) {
      nextPassedCellList.push([row, column - DISTANCE]);
    }
    return nextPassedCellList;
  }
}
