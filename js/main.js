import { Maze } from './Maze.js';
import Explorer from './Explorer.js';

// 正解ルートの表示切り替え
$('.answer').click(e => {
  e.preventDefault();
  $(e.target).toggleClass('active');
  $('.maze-cell.-answer').toggleClass('show');
});

//サイズは必ず5以上の奇数で生成する
const WIDTH = 49;
const HEIGHT = 49;
const maze = new Maze(WIDTH, HEIGHT);
maze.generateGrid();
maze.generateMaze();
maze.setUpperLeftStart();
maze.setUnderRightGoal();
console.log('maze:', maze);

const explorer = new Explorer(maze.WIDTH, maze.HEIGHT);
explorer.deepCopyMaze(maze.grid, maze.start);
console.log('explorer:', explorer);
explorer.breadthFirstSearch();
explorer.updateAnswerRoute();
console.log('explorer.grid:', JSON.parse(JSON.stringify(explorer.grid)));

maze.updateMazeAnserRoute(explorer.grid);
maze.drowMyself();
