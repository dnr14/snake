/*
  더 개발 해야될것들
  1. 시간에 따른 난이도 상승
  2. 원하는 난이도에서 시작
  4. ul 개발
  5. n X n 선택 가능
  6. 변수 명 정리
  7. 코드 리팩토링
  시작 눌렀을때 시작
*/

class App {
  constructor() {
    this.CELLSIZE = 30;
    this.ROWS = 25;
    this.COLUMNS = 15;

    this.key = {
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
      up: "ArrowUp"
    }


    this.$socreEl = document.querySelector("#score > .number");
    this.$countEl = document.querySelector("#count > .number");
    this.$difficultyEl = document.querySelector("#difficulty >.number");
    this.$gameoverEl = document.querySelector("#gameover");
    this.array = Array.from({ length: this.COLUMNS }, () => { return Array(this.ROWS).fill(0) });
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.ctx.canvas.width = this.CELLSIZE * this.ROWS;
    this.ctx.canvas.height = this.CELLSIZE * this.COLUMNS;

    this.ctx.scale(this.CELLSIZE, this.CELLSIZE);

    this.time = 300;
    this.count = 0;

    this.SNAKE_ARRAY = [];

    this.currentDirection = "down";


    this.difficultyObj = {
      _3: false,
      _5: false,
      _10: false
    }

    this.setElement();
    this.init();
  }

  setElement() {
    document.querySelector("#root").appendChild(this.canvas);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ROWS, this.CELLSIZE);
  }
  init() {
    let start = 3;
    for (let i = start; i >= 0; i--) {
      const snake = new Snake(i, 0);
      this.SNAKE_ARRAY.push(snake);
    }
    this.eventHandler();
    this.render();
    this.autoMaticMovement();
    this.autoMaticRender();
  }

  eventHandler() {
    window.addEventListener('keydown', this.keyEv);
  }

  keyEv = (e) => {
    switch (e.key) {
      case this.key.down:
        this.currentDirection = "down";
        break;
      case this.key.left:
        this.currentDirection = "left";
        break;
      case this.key.right:
        this.currentDirection = "right";
        break;
      case this.key.up:
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
      if (nextValue === 2) {
        this.count++;
        this.setScore();
      }

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
      if (nextValue === 2) {
        this.count++;
        this.setScore();
      }

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
      if (nextValue === 2) {
        this.count++;
        this.setScore();
      }

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
      if (nextValue === 2) {
        this.count++;
        this.setScore();
      }

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

    this.array.forEach((rows) => {
      rows.forEach((value, idx) => {
        if (value !== 2) {
          rows[idx] = 0;
        }
      });
    });

    this.SNAKE_ARRAY.forEach(snake => this.array[snake.state.y][snake.state.x] = 1);

    this.array.forEach((columns, idx) => {
      columns.forEach((value, index) => {
        if (value === 1) {
          this.ctx.fillStyle = this.getRandomColor();
          this.ctx.fillRect(index, idx, 0.95, 0.95);
        }
        if (value === 2) {
          this.ctx.fillStyle = "red";
          this.ctx.fillRect(index, idx, 1, 1);
        }
      });
    })

  }

  renderAllRemove() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ROWS, this.COLUMNS);
  }

  autoMaticMovement() {
    this._autoMaticMovement = setInterval(() => {

      if (this.difficultyObj._3 === false || this.difficultyObj._5 === false || this.difficultyObj._10 === false) {
        this.setDifficult();
      }

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
    }, this.time);
  }

  autoMaticRender() {
    this._autoMaticRander = setInterval(() => {
      let x = Math.floor(Math.random() * this.COLUMNS);
      let y = Math.floor(Math.random() * this.ROWS);
      this.array[x][y] = 2;
    }, 3000);
  }

  setDifficult() {
    if (this.count === 3 && this.difficultyObj._3 === false) {
      this.$difficultyEl.textContent = `${3}`;
      this.difficultyObj._3 = true;
      this.time = 150;
      clearInterval(this._autoMaticMovement);
      this.autoMaticMovement();
    }

    if (this.count === 5 && this.difficultyObj._5 === false) {
      this.$difficultyEl.textContent = `${5}`;
      this.difficultyObj._5 = true;
      this.time = 100;
      clearInterval(this._autoMaticMovement);
      this.autoMaticMovement();
    }
    if (this.count === 10 && this.difficultyObj._10 === false) {
      this.$difficultyEl.textContent = `${10}`;
      this.difficultyObj._10 = true;
      this.time = 50;
      clearInterval(this._autoMaticMovement);
      this.autoMaticMovement();
    }

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

  setScore() {
    let score = this.count * 50;
    this.$socreEl.textContent = `${score}`;
    this.$countEl.textContent = `${this.count}`;
  }


  gameOver() {
    this.$gameoverEl.style.opacity = 1;
    setInterval(() => {
      this.$gameoverEl.style.opacity === "1"
        ? this.$gameoverEl.style.opacity = 0
        : this.$gameoverEl.style.opacity = 1;
    }, 700);

    window.removeEventListener('keydown', this.keyEv);
  }
}

class Snake {
  constructor(x, y) {
    this.state = {};
    this.state.x = x;
    this.state.y = y;
  }

}

window.onload = () => {
  new App();
}