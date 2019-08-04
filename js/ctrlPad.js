var CtrlPad = (function () {
  class CtrlPad {
    constructor(canvas, callback) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.size = 100;
      this.mouseX = 0;
      this.mouseY = 0;
      this.mouseDown = 0;
      this.touchX = 0;
      this.touchY = 0;
      this.callback = callback;
      this.init();
    }

    drawCenter() {
      this.drawDot(this.ctx, this.canvas.width / 2, this.canvas.height / 2, this.size);
    }

    drawDot(ctx, x, y, size) {
      this.clearCanvas(this.canvas, this.ctx);
      var r = 0;
      var g = 0;
      var b = 0;
      var a = 255;
      this.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.size, 0, Math.PI * 2, true);
      this.ctx.closePath();
      this.ctx.fill();
      //
      var powerLR = this.canvas.width / 2;
      var lr = x < powerLR ? (powerLR - x) / powerLR : (x - powerLR) / (-1 * powerLR);
      lr = parseInt(lr * 100) / 100;
      var power0 = this.canvas.height / 2;
      var powerR = y < power0 ? (power0 - y) / power0 : (y - power0) / (-1 * power0);
      var powerL = y < power0 ? (power0 - y) / power0 : (y - power0) / (-1 * power0);
      powerR = parseInt(powerR * 100) / 100;
      powerL = parseInt(powerL * 100) / 100;
      if (lr < 0) {
        powerR = parseInt((powerR + lr) * 100) / 100;
      } else {
        powerL = parseInt((powerL - lr) * 100) / 100;
      }
      this.callback(powerL, powerR);
    }

    clearCanvas(canvas, ctx) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#e0e0e0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    sketchpad_mouseDown() {
      this.ctrlPad.mouseDown = 1;
      this.ctrlPad.drawDot(
        this.ctrlPad.ctx, this.ctrlPad.mouseX,
        this.ctrlPad.mouseY, this.ctrlPad.size);
    }

    sketchpad_mouseUp(e) {
      this.drawCenter();
      this.mouseDown = 0;
    }

    sketchpad_mouseMove(e) {
      var self = this.ctrlPad;
      self.getMousePos(e);
      if (self.mouseDown == 1) {
        self.drawDot(self.ctx, self.mouseX, self.mouseY, self.size);
      }
    }

    getMousePos(e) {
      if (!e)
        var e = event;
      if (e.offsetX) {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
      } else if (e.layerX) {
        this.mouseX = e.layerX;
        this.mouseY = e.layerY;
      }
    }

    sketchpad_touchStart() {
      var self = this.ctrlPad;
      console.log("self:", self);
      self.getTouchPos();
      self.drawDot(self.ctx, self.touchX, self.touchY, self.size);
      event.preventDefault();
    }

    sketchpad_touchEnd() {
      var self = this.ctrlPad;
      self.getTouchPos();
      self.drawCenter();
      event.preventDefault();
    }

    sketchpad_touchMove(e) {
      var self = this.ctrlPad;
      self.getTouchPos(e);
      self.drawDot(self.ctx, self.touchX, self.touchY, self.size);
      event.preventDefault();
    }

    getTouchPos(e) {
      if (!e)
        var e = event;
      if (e.touches) {
        if (e.touches.length == 1) { // Only deal with one finger
          var touch = e.touches[0]; // Get the information for finger #1
          this.touchX = touch.pageX - touch.target.offsetLeft;
          this.touchY = touch.pageY - touch.target.offsetTop;
        }
      }
    }

    init() {
      var self = this;
      this.canvas.ctrlPad = this;
      this.canvas.addEventListener('mousedown',
        this.sketchpad_mouseDown, false);
      this.canvas.addEventListener('mousemove',
        this.sketchpad_mouseMove, false);
      window.addEventListener('mouseup', function (e) {
        self.sketchpad_mouseUp(e);
      }, false);
      this.canvas.addEventListener('touchstart',
        this.sketchpad_touchStart, false);
      this.canvas.addEventListener('touchmove',
        this.sketchpad_touchMove, false);
      this.canvas.addEventListener('touchend',
        this.sketchpad_touchEnd, false);
      this.drawCenter();
    }
  }
  return CtrlPad;
})();