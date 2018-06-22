//particle.js
function Particle(x, y) {
  this.radius = 1;
  this.futurRadius = utils.randomInt(radVal+1, radVal+2);

  this.rebond = utils.randomInt(1, 5);
  this.x = x;
  this.y = y;

  this.dying = false;

  this.base = [x, y];

  this.vx = 0;
  this.vy = 0;
  this.friction = .99;
  this.color = colors[0];         //colors[Math.floor(Math.random() * colors.length)];

  this.getHeading = function() {
    return Math.atan2(this.vy, this.vx);
  };

  this.setHeading = function(heading) {
    var speed = 0.05;
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  };

  this.update = function(heading) {
    this.x += this.vx;
    this.y += this.vy;

    this.vx *= this.friction;
    this.vy *= this.friction;

    if(this.radius < this.futurRadius && this.dying === false){
      this.radius += durVal;
    }else{
      this.dying = true;
    }

    if(this.dying === true){
      this.radius -= durVal;
    }

      context.save();
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      context.closePath();
      context.fill();
      context.restore();


    if (this.y < 0 || this.radius < 1) {
      this.x = this.base[0];
      this.y = this.base[1];
      this.dying = false;
      this.radius = 1.1;
      this.futurRadius = utils.randomInt(radVal+1, radVal+2);
      this.setHeading(utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360)));
    }

  }

  this.setHeading(utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360)));

}

function Shape(x, y, texte){
   this.x = x;
   this.y = y;

   this.text = texte;
    this.size = this.text.length * 100;
   this.placement = [];
 }
Shape.prototype.getValue = function(){//拓展shape

    context.textAlign = "center";
    context.font =  200/(this.text.length+10) + "em STKaiti";//字体
    context.fillText(this.text, this.x, this.y);

    var idata = context.getImageData(0, 0, W, H);
    var buffer32 = new Uint32Array(idata.data.buffer);

    for(var j=0; j < H; j += gridY){
     for(var i=0 ; i < W; i += gridX){
       if(buffer32[j * W + i]){
         var particle = new Particle(i, j);
         this.placement.push(particle);
       }
     }
    }
context.clearRect(0, 0, W, H);
}

var utils = {
  randomInt: function(min, max) {
    return min + Math.random() * (max - min + 1);
  },
  degreesToRads: function(degrees) {
    return degrees / 180 * Math.PI;
  }
}
//index.js
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    W = canvas.width = window.innerWidth*2,
    H = canvas.height = window.innerHeight/2,
    gridY = 7, gridX = 7,
    door = document.getElementById('door'),
    colors = [
   '#fff',
   ];





var message = '(눈_눈)',
  durVal = 0.1,//周期
  radVal = 1;//半径


var word = new Shape(W/2, H/2, message);
word.getValue();


(function drawFrame(){
 window.requestAnimationFrame(drawFrame, canvas);
 context.clearRect(0, 0, W, H);

 for(let i=0; i< word.placement.length; i++){
   word.placement[i].update();
 }
}());
