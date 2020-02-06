import Maze from './Maze.js';

// Mazeインスタンスのデータを元に、DOMを生成
const drowMaze = maze => {
  for (let row = 0; row < maze.height; row++) {
    let tr = $('<tr>');
    for (let column = 0; column < maze.width; column++) {
      if (maze.grid[row][column] === 1) {
        tr.append($('<td class="maze-cell -wall"></td>'));
      } else if (maze.grid[row][column] === 'S') {
        tr.append($('<td class="maze-cell -start"></td>'));
      } else if (maze.grid[row][column] === 'G') {
        tr.append($('<td class="maze-cell -goal"></td>'));
      } else {
        tr.append($('<td class="maze-cell"></td>'));
      }
    }
    $('.maze tbody').append(tr);
  }
};

//サイズは必ず5以上の奇数で生成する
const width = 15;
const height = 15;
const maze = new Maze(width, height);
maze.makeGrid();
maze.countStartCellList();
maze.createMaze();
maze.setStart();
maze.setGoal();
drowMaze(maze);
console.log('maze:', maze);
