import Maze from './Maze.js';
import Explorer from './Explorer.js';

// Mazeインスタンスのデータを元に、DOMを生成
const drowMaze = maze => {
  for (let row = 0; row < maze.HEIGHT; row++) {
    let tr = $('<tr>');
    for (let column = 0; column < maze.WIDTH; column++) {
      if (maze.grid[row][column] === 1) {
        tr.append($('<td class="maze-cell -wall"></td>'));
      } else if (maze.grid[row][column] === 3) {
        tr.append($('<td class="maze-cell -answer-route"></td>'));
      } else if (maze.grid[row][column] === 'S') {
        tr.append($('<td class="maze-cell -start"></td>'));
      } else if (maze.grid[row][column] === 'G') {
        tr.append($('<td class="maze-cell -goal"></td>'));
      } else {
        tr.append($('<td class="maze-cell -path"></td>'));
      }
    }
    $('.maze tbody').append(tr);
  }
};

//サイズは必ず5以上の奇数で生成する
const WIDTH = 99;
const HEIGHT = 99;
const maze = new Maze(WIDTH, HEIGHT);
maze.makeGrid();
maze.countStartCellList();
maze.createMaze();
maze.setUpperLeftStart();
maze.setUnderRightGoal();
console.log('maze:', maze);

const explorer = new Explorer(maze);
console.log('explorer:', explorer);
explorer.searchGoal([explorer.start]); //スタート地点のセルを二次元配列探索キューに追加
explorer.updateAnswerRoute(explorer.beforeGoal[0], explorer.beforeGoal[1]);
drowMaze(maze);
