class App {
  constructor() {
    // 한칸 사이즈
    this.CELLSIZE = 30;
    // 가로 세로 수
    this.ROWS = 25;
    this.COLUMNS = 15;

    //KEY EVENT 목록
    this.key = {
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
      up: "ArrowUp"
    }


    // $가 붙은 변수는 El 요소를 표기
    this.$socreEl = document.querySelector("#score > .number");
    this.$countEl = document.querySelector("#count > .number");
    this.$difficultyEl = document.querySelector("#difficulty >.number");
    this.$btn = document.querySelector('#start');
    this.$gameoverEl = document.querySelector("#gameover");
    this.$difficultySelectedEl = document.querySelector("#difficultySelected");


    // ROWS * COLUMNS 크기의 2차원배열 생성
    this.array = Array.from({ length: this.COLUMNS }, () => { return Array(this.ROWS).fill(0) });

    //캔버스El 생성 후 2d Context 생성
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    // canvas 가로 세로 크기
    this.ctx.canvas.width = this.CELLSIZE * this.ROWS;
    this.ctx.canvas.height = this.CELLSIZE * this.COLUMNS;

    // 가로 세로 한칸 크기를 30픽셀로 지정
    this.ctx.scale(this.CELLSIZE, this.CELLSIZE);

    // autoMaticMovement함수 반복 시간
    this.time = 300;
    // 뱀이 몇개 블록 먹었는지 확인 변수
    this.count = 0;

    // 뱀 인스턴스 담는 배열
    this.SNAKE_ARRAY = [];


    // window keydown ev 발생 시 눌린 키값 저장
    this.currentDirection = "right";

    // 게임 시작 했는지 체크
    this.started = false;
    // 난이도 선택했는지 체크
    this.difficulted = false;

    // 단계별 난이도가 올랐는지 체크
    this.difficultyObj = {
      _3: false,
      _5: false,
      _10: false
    }

    this.setElement();
  }

  start = () => {

    // 시작 버튼 클릭 시 중복 시작 방지
    if (!this.started) {

      // 난이도를 선택 했다면 난이도에 따른 속도 할당
      let idx = this.$difficultySelectedEl.selectedIndex;
      let value = parseInt(this.$difficultySelectedEl.options[idx].value);

      if (value !== 0) {
        this.difficulted = true;
        if (value === 5) {
          this.time = 100;
        } else if (value === 7) {
          this.time = 80;
        } else if (value === 9) {
          this.time = 60;
        } else {
          this.time = 40;
        }
        this.$difficultyEl.textContent = value;
      }

      this.init();
      this.started = true;
    }
  }


  setElement() {
    document.querySelector("#root").appendChild(this.canvas);
    this.$btn.addEventListener('click', this.start);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ROWS, this.COLUMNS);

  }
  init() {
    // 처음 뱀 몸통 개수 초기화
    let start = 3;
    for (let i = start; i >= 0; i--) {
      const snake = new Snake(i, 0);
      // this.SNAKE_ARRAY[0] 부분이 뱀의 머리
      // 캔버스 3,0 좌표부터 뱀이 그려짐
      this.SNAKE_ARRAY.push(snake);
    }

    this.eventHandler();
    this.render();
    this.autoMaticMovement();
    this.autoMaticRender();
  }

  eventHandler() {
    // key이벤트 등록
    window.addEventListener('keydown', this.keyEv);
  }

  keyEv = (e) => {
    switch (e.key) {
      case this.key.down:
        // 뱀의 방향과 동일한 방향 또는 반대 방향의 키값이 들어오면 리턴
        if (this.currentDirection === "up" || this.currentDirection === "down")
          return;

        this.currentDirection = "down";
        break;
      case this.key.left:
        if (this.currentDirection === "right" || this.currentDirection === "left")
          return;

        this.currentDirection = "left";
        break;
      case this.key.right:
        if (this.currentDirection === "left" || this.currentDirection === "right")
          return;

        this.currentDirection = "right";
        break;
      case this.key.up:
        if (this.currentDirection === "down" || this.currentDirection === "up")
          return;

        this.currentDirection = "up";
        break;
    }
  }


  rightMove(state) {
    // 뱀이 캔버스 x축을 넘어가지는지 체크
    if ((state.x + 1) < this.ROWS) {
      const nextValue = this.array[state.y][state.x + 1];
      // 뱀의 진행 방향에 다음 값을 뽑아온 후 
      // 1이면 뱀의 몸통
      if (nextValue === 1)
        return true;
      // 0이면 아무것도 없음
      if (nextValue === 0)
        this.SNAKE_ARRAY.pop();
      // 2이면 먹이
      if (nextValue === 2) {
        this.count++;
        this.setScore();
      }

      // JSON를 통해 뱀의 머리 깊은 복사
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
    // 캔버스에 그리기 전에 모두 지워주는 함수
    // 초기화 함수
    this.renderAllRemove();

    this.array.forEach((rows) => {
      rows.forEach((value, idx) => {
        // 뱀의 먹이를 제외하고 배열 모두 0으로 초기화
        if (value !== 2) {
          rows[idx] = 0;
        }
      });
    });

    // 뱀들의 몸통에 있는 좌표 값으로 2차원 배열에 1를 표기
    this.SNAKE_ARRAY.forEach(snake => this.array[snake.state.y][snake.state.x] = 1);

    this.array.forEach((columns, idx) => {
      columns.forEach((value, index) => {
        // 1 뱀의 몸통
        // 2 뱀의 먹이
        if (value === 1) {
          this.ctx.fillStyle = this.getRandomColor();
          this.ctx.fillRect(index, idx, 0.95, 0.95);
        }
        if (value === 2) {
          this.ctx.fillStyle = "#D18063";
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

      // 사용자가 난이도를 선택했다면 this.difficulted값이 true여서 따로 난이도 상승 x
      // 난이도 미선택 시 먹이 갯수에 따라 난이도 상승
      if (!this.difficulted && (this.difficultyObj._3 === false || this.difficultyObj._5 === false || this.difficultyObj._10 === false)) {
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
        // 게임 오버가 되면 게임 오버 배너 생성
        // 이벤트 및 비동기 처리 제거
        this.gameOver();
        clearInterval(this._autoMaticMovement);
        clearInterval(this._autoMaticRander);
      } else {
        this.render();
      }
    }, this.time);
  }

  // 뱀 먹이 3초마다 한개 씩 2차원 배열에 무작위로 등록
  autoMaticRender() {
    this._autoMaticRander = setInterval(() => {
      let x = Math.floor(Math.random() * this.COLUMNS);
      let y = Math.floor(Math.random() * this.ROWS);
      this.array[x][y] = 2;
    }, 3000);
  }

  setDifficult() {
    // 난이도 미선택 시 먹이에 개수에 따라 난이도 상승
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

  // 랜덤으로 rgb값을 리턴하는 함수
  // _isAlpha가 true이면 rgba를 리턴한다.
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

  // 먹이를 먹을때마다 점수 갱신
  setScore() {
    let score = this.count * 50;
    this.$socreEl.textContent = `${score}`;
    this.$countEl.textContent = `${this.count}`;
  }


  // 게임 오버 시 배너 생성 및 이벤트 제거
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

// 뱀 객체
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