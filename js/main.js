/*
  더 개발 해야될것들
  1. 시간에 따른 난이도 상승
  2. 원하는 난이도에서 시작
  3. 점수 
  4. ul 개발
  5. n X n 선택 가능
  6. 변수 명 정리
  7. 코드 리팩토링
  8. 자바스크립트 스레드 멈추기
*/

class App {
  constructor() {
    this.BLOCKSIZE = 30;
    this.ROWS = 25;
    this.COLUMNS = 15;

    this.key = {
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
      up: "ArrowUp"
    }

    this.array = Array.from({ length: this.COLUMNS }, () => { return Array(this.ROWS).fill(0) });
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.ctx.canvas.width = this.BLOCKSIZE * this.ROWS;
    this.ctx.canvas.height = this.BLOCKSIZE * this.COLUMNS;

    this.ctx.scale(this.BLOCKSIZE, this.BLOCKSIZE);

    this.SNAKE_ARRAY = [];

    this.currentDirection = "down";
    let start = 3;

    for (let i = start; i >= 0; i--) {
      const snake = new Snake(i, 0);
      this.SNAKE_ARRAY.push(snake);
    }
    this.setElement();
    this.init();

  }

  setElement() {
    document.querySelector("#root").appendChild(this.canvas);
  }
  init() {
    this.eventHandler();
    this.render();
    this.autoMaticMovement();
    this.autoMaticRender();
  }

  eventHandler() {
    window.addEventListener('keydown', this.keyEv);
  }
  keyEv = (e) => {
    let { state } = this.SNAKE_ARRAY[0];
    let isGameOver = false;
    switch (e.key) {
      case this.key.down:
        // isGameOver = this.downMove(state);
        this.currentDirection = "down";
        break;
      case this.key.left:
        // isGameOver = this.leftMove(state);
        this.currentDirection = "left";
        break;
      case this.key.right:
        // isGameOver = this.rightMove(state);
        this.currentDirection = "right";
        break;
      case this.key.up:
        // isGameOver = this.upMove(state);
        this.currentDirection = "up";
        break;
    }
  }


  rightMove(state) {
    if ((state.x + 1) < this.ROWS) {
      const nextValue = this.array[state.y][state.x + 1];
      if (nextValue === 1)
        return true;
      if (nextValue === 0)
        this.SNAKE_ARRAY.pop();

      const deepCopy = JSON.parse(JSON.stringify(this.SNAKE_ARRAY[0]));
      deepCopy.state.x += 1;
      this.SNAKE_ARRAY.unshift(deepCopy);

    } else {
      return true;
    }
    return false;
  }


  leftMove(state) {
    if ((state.x - 1) >= 0) {
      const nextValue = this.array[state.y][state.x - 1];
      if (nextValue === 1)
        return true;
      if (nextValue === 0)
        this.SNAKE_ARRAY.pop();

      const deepCopy = JSON.parse(JSON.stringify(this.SNAKE_ARRAY[0]));
      deepCopy.state.x -= 1;
      this.SNAKE_ARRAY.unshift(deepCopy);

    } else {
      return true;
    }
    return false;
  }

  downMove(state) {
    if ((state.y + 1) < this.COLUMNS) {
      const nextValue = this.array[state.y + 1][state.x];
      if (nextValue === 1)
        return true;
      if (nextValue === 0)
        this.SNAKE_ARRAY.pop();

      const deepCopy = JSON.parse(JSON.stringify(this.SNAKE_ARRAY[0]));
      deepCopy.state.y += 1;
      this.SNAKE_ARRAY.unshift(deepCopy);

    } else {
      return true;
    }
    return false;
  }
  upMove(state) {

    if ((state.y - 1) >= 0) {
      const nextValue = this.array[state.y - 1][state.x];
      if (nextValue === 1)
        return true;
      if (nextValue === 0)
        this.SNAKE_ARRAY.pop();

      const deepCopy = JSON.parse(JSON.stringify(this.SNAKE_ARRAY[0]));
      deepCopy.state.y -= 1;
      this.SNAKE_ARRAY.unshift(deepCopy);

    } else {
      return true;
    }
    return false;
  }

  render() {
    this.renderAllRemove();
    this.array.forEach((columns, iy) => {
      columns.forEach((value, ix) => {
        if (value !== 2) {
          columns[ix] = 0;
        }
      });
    });

    this.SNAKE_ARRAY.forEach(snake => {
      let { state } = snake;
      this.array[state.y][state.x] = 1;
    });


    this.array.forEach((columns, idx) => {
      columns.forEach((value, index) => {
        if (value === 1) {
          this.ctx.fillStyle = this.getRandomColor();
          this.ctx.fillRect(index, idx, 0.95, 0.95);
        }
        if (value === 2) {
          this.ctx.fillStyle = "green";
          this.ctx.fillRect(index, idx, 1, 1);
        }
      });
    })

  }

  renderAllRemove() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ROWS, this.COLUMNS);
  }

  gameOver() {
    alert("게임오버");
    window.removeEventListener('keydown', this.keyEv);
  }

  autoMaticMovement() {
    this._autoMaticMovement = setInterval(() => {
      let { state } = this.SNAKE_ARRAY[0];
      let isGameOver = false;
      switch (this.currentDirection) {
        case "down":
          isGameOver = this.downMove(state);
          break;
        case "left":
          isGameOver = this.leftMove(state);
          break;
        case "right":
          isGameOver = this.rightMove(state);
          break;
        case "up":
          isGameOver = this.upMove(state);
          break;
      }

      if (isGameOver) {
        this.gameOver();
        clearInterval(this._autoMaticMovement);
        clearInterval(this._autoMaticRander);
      } else {
        this.render();
      }
    }, 100);
  }
  autoMaticRender() {
    this._autoMaticRander = setInterval(() => {
      let x = Math.floor(Math.random() * this.COLUMNS);
      let y = Math.floor(Math.random() * this.ROWS);
      this.array[x][y] = 2;
      console.log(this.array);
      this.array.forEach((columns, idx) => {
        columns.forEach((value, index) => {
          if (value === 2) {
            this.ctx.fillStyle = "green";
            this.ctx.fillRect(index, idx, 1, 1);
          }
        });
      })
    }, 3000);
  }

  getRandomColor = function (_isAlpha) {
    let r = getRand(0, 255),
      g = getRand(0, 255),
      b = getRand(0, 255),
      a = getRand(0, 10) / 10;

    let rgb = _isAlpha ? 'rgba' : 'rgb';
    rgb += '(' + r + ',' + g + ',' + b;
    rgb += _isAlpha ? ',' + a + ')' : ')';

    return rgb;

    function getRand(min, max) {
      if (min >= max) return false;
      return ~~(Math.random() * (max - min + 1)) + min;
    };
  };

}


class Snake {
  constructor(x, y, color) {
    this.state = {};
    this.state.x = x;
    this.state.y = y;
    this.color = color;
  }
}

window.onload = () => {
  new App();
}