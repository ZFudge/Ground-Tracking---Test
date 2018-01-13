const canvas = document.getElementById('canv');
const context = canvas.getContext('2d');

const game = {
  speed: 5,
  active: true,
  draw: function() {
    context.fillStyle = 'white';
    context.fillRect(0,0,canvas.width,canvas.height);
  }
};

const char = {
  x: 20,
  y: canvas.height/2,
  v: 0,
  h: 0,
  speed: 1,
  size: 10,
  color: 'black',
  adjust: function() {
    this.jumpCheck();
    this.x += this.h;
    this.y += this.v;
  },
  findGround: function() {
    ground.points[ground.groundIndex].forEach(function(c,i,arr) {
      if (char.x > arr[i][0] && char.x < arr[i+1][0]) {
        if (i === arr.length-2) {
          ground.groundIndex++;
          char.x -= canvas.width;
          return char.adjustVertical(ground.calculateSurface(char.x,[ground.points[ground.groundIndex][0][0], ground.points[ground.groundIndex][1][0]]));
        }
        return char.adjustVertical(ground.calculateSurface(char.x,[c,arr[i+1]]));
      }
    });
  },
  adjustVertical: function(y) {
    if (this.y < y) {
      this.v = this.speed;
      
    } else if (this.y > y) {
      this.y = y,
      this.v = 0
     }
  },
  draw: function() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.size, this.size);
  },
  jumping: false, 
  jumpTarget: null,// if y is below target, keep vertical set upwards. If y passes target, keep jumping set to true and steadily subtract from vertical until it is below target again, THEN switch jumping to false and allow character to fall down to ground level.
  jump: function() {
    if (!char.jumping && char.v === 0/* NO!*/) {
      char.jumping = true;
      char.jumpTarget = char.y - 50;
      
    }
  },
  jumpCheck: function() {
    if (char.jumping) {
      if (char.y <= char.jumpTarget) {
        if (char.v < 0 ) {
          console.log('one')
          char.v = parseFloat((char.v + Math.abs(char.v * 0.1)).toFixed(1));
        } else {
          console.log('two');
          char.v = parseFloat((char.v - Math.abs(char.v * 0.1)).toFixed(1));
        }
        if (0 < char.v && char.v < 2) char.v * -1;
      } else {
        if (char.v === 0) char.v = -char.speed * 2;
      }
    }
  }
};

const ground = {
  color: '#0F0',
  groundIndex: 0,
  points: [
    [[0,370], [150,380], [250,200], [375,375], [550,70], [600,80], [800,10], [canvas.width + char.size, 10], [canvas.width + char.size * 4, 10]],
    [[0,10], [200,300], [400,200], [450,270], [500,180], [850,50], [canvas.width + char.size, 10], [canvas.width + char.size * 4, 10]]
    
    ],
  draw: function() {
    context.strokeStyle = 'black';
    this.points[ground.groundIndex].forEach(function(c,ind,arr) {
      if (ind != arr.length - 1) {
        context.beginPath();
        context.moveTo(arr[ind][0],arr[ind][1]);
        context.lineTo(arr[ind+1][0],arr[ind+1][1]);
        context.stroke();
      }
    });
  },
  calculateSurface: function(x, arr) { // 20 [[0, 370], [250, 380]]
    //console.log(x - arr[0][0]);
    const distanceRight = x - arr[0][0];         // 20  - 0    20
    const horizontalDifference = arr[0][0] - arr[1][0]; // 0  -> 250  250
    const verticalDifference = arr[0][1] - arr[1][1];   // 370 - 380  -10
    
    const y = arr[0][1] + (distanceRight * (verticalDifference / horizontalDifference));
    return y - char.size;
  }
}

function main() {
  game.draw();
  if (!char.jumping) char.findGround();
  char.adjust();
  char.draw();
  ground.draw();
}

let loop = setInterval(main,game.speed);

document.addEventListener('keydown', pushedKey);
document.addEventListener('keyup', releasedKey);
function pushedKey(btn) {
  if (btn.keyCode === 32) {
    game.active = !game.active;
    (game.active) ? loop = setInterval(main, game.speed) : clearInterval(loop);
  }
  if (btn.keyCode === 37) char.h = -char.speed;
  if (btn.keyCode === 38) {
    char.jump();
  }
  if (btn.keyCode === 39) char.h = char.speed;
}
function releasedKey(btn) {
  //if (btn.keyCode === 37 && char.h === -char.speed) char.h = 0
  
  //if (btn.keyCode === 39 && char.h === char.speed) char.h = 0;
}

//gravity needs to subtract fractions from vertical speed in order to curve correctly.