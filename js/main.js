import { Maze } from './Maze.js';
import Explorer from './Explorer.js';

// 正解ルートの表示切り替え
$('.answer').click(e => {
  e.preventDefault();
  $(e.target).toggleClass('active');
  $('.maze-cell.-answer').toggleClass('show');
});

//サイズは必ず5以上の奇数で生成する
const WIDTH = 9;
const HEIGHT = 9;
const maze = new Maze(WIDTH, HEIGHT);
maze.generateGrid();
maze.generateMaze();
maze.setUpperLeftStart();
maze.setUnderRightGoal();
console.log('maze:', maze);

const explorer = new Explorer(maze.WIDTH, maze.HEIGHT);
explorer.deepCopyMaze(maze.grid, maze.start);
console.log('explorer:', explorer);

explorer.searchGoal([explorer.start]); //スタート地点のセルを二次元配列探索キューに追加
explorer.updateAnswerRoute(explorer.beforeGoal[0], explorer.beforeGoal[1]);

maze.updateMazeAnserRoute(explorer.grid);
maze.drowMyself();
