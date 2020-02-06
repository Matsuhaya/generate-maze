export default class Explorer {
  // mazeの情報からexplorerを生成する
  constructor(maze) {
    this.width = maze.width;
    this.height = maze.height;
    this.grid = maze.grid; // 壁の場合は1,道の場合は0を格納した二次元配列
    this.start = maze.start; // スタート地点の[row, column]
    this.goal = maze.goal; // ゴール地点
    this.passedCellList = [this.start]; //スタート地点のセルを二次元配列探索キューに追加
  }

  // 探索キューからセルを取り出す
  // セルがゴール地点なら探索終了
  // 取り出したセルに隣接するセルの内、未探索のセルをキューに追加
  searchGoal() {
    this.passedCellList.map(cell => {});
  }
}
