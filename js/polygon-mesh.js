/*
The MIT License (MIT)

Copyright (c) 2014 Ivan Grgurevic (IvanGrgurevic.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


"use strict";

$(document).ready(function() {

	window.requestAnimFrame = (function() {
		return  window.requestAnimationFrame || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame || 
				window.oRequestAnimationFrame || 
				window.msRequestAnimationFrame || 
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
	})();

	var meshWidth = $(window).width()
	, meshHeight = $(window).height()
	, meshRatio
	, expandCanvasToWindow
	, createPoints
	, paint
	, ctx
	, pointArr = []
	, pointsNum = 200
	, pointsNumX
	, pointsNumY
	, maxRadius = 20
	, minRadius = 5
	, maxRotationRate = 0.03
	, hue = 250
	, hueRate = 0.1
	, gradient
	, gradientColor

	expandCanvasToWindow = function() {
		meshWidth = $(window).width();
		meshHeight = $(window).height();

		$('#mesh').attr('width', meshWidth);
		$('#mesh').attr('height', meshHeight);

		createPoints();
	};

	createPoints = function() {
		meshRatio = meshHeight/meshWidth;

		pointsNumX = Math.ceil(Math.sqrt(pointsNum/meshRatio));
		pointsNumY = Math.ceil(pointsNum / Math.sqrt(pointsNum/meshRatio));

		for(var x=0;x<pointsNumX+1;x++) {
			pointArr[x] = [];
		for(var y=0;y<pointsNumY+1;y++) {
			var tempRadius
			, tempRadians
			, tempRotationRate;

			if(x*y == 0 || x == pointsNumX || y == pointsNumY) {
				tempRadius = 0;
				tempRadians = 0;
				tempRotationRate = 0;
			}
			else {
				tempRadius = minRadius + Math.random() * (maxRadius - minRadius);
				tempRadians = Math.random() * (Math.PI * 2);
				tempRotationRate = Math.random() * (maxRotationRate*2) - maxRotationRate;
			}

			pointArr[x].push({
				x: x * (meshWidth / Math.sqrt(pointsNum/meshRatio)),
				y: y * (meshHeight / (pointsNum / Math.sqrt(pointsNum/meshRatio))),
				rx: x * (meshWidth / Math.sqrt(pointsNum/meshRatio)),
				ry: y * (meshHeight / (pointsNum / Math.sqrt(pointsNum/meshRatio))),
				radius: tempRadius,
				radians: tempRadians,
				rotationRate: tempRotationRate,
				move: function() {
					this.radians = (this.radians + this.rotationRate) % (Math.PI * 2);

					this.rx = this.x + this.radius * Math.cos(this.radians);
					this.ry = this.y + this.radius * Math.sin(this.radians);
				}
			});
		}
		}
	};

	createPoints();
	expandCanvasToWindow();

	$(window).resize(function() {
		expandCanvasToWindow();
	});

	ctx = document.getElementById('mesh').getContext('2d');

	paint = function() {
		ctx.fillStyle = 'hsla(' + Math.round(hue) + ', 10%, 10%, 1)';
		ctx.fillRect(0, 0, meshWidth, meshHeight);

		hue = hue + hueRate % 360;

		for(var x=0;x<pointsNumX+1;x++) {
		for(var y=0;y<pointsNumY+1;y++) {
			pointArr[x][y].move();

			if(x > 0 && y > 0) {
				gradientColor = (Math.round(hue+(-y-x)*4) % 360) + ', 50%, 40%';

				gradient = ctx.createLinearGradient(
					pointArr[x-1][y-1].rx
					, pointArr[x-1][y-1].ry
					, pointArr[x][y].x
					, pointArr[x][y].y);

				gradient.addColorStop(1, 'hsla(' + gradientColor + ',0)');
				gradient.addColorStop(0, 'hsla(' + gradientColor + ',1)');

				ctx.fillStyle = gradient;
				ctx.beginPath();

				ctx.moveTo(pointArr[x-1][y-1].rx, pointArr[x-1][y-1].ry);
				ctx.lineTo(pointArr[x][y-1].rx, pointArr[x][y-1].ry);
				ctx.lineTo(pointArr[x-1][y].rx, pointArr[x-1][y].ry);

				ctx.closePath();
				ctx.fill();


				gradient = ctx.createLinearGradient(
					pointArr[x-1][y-1].x
					, pointArr[x-1][y-1].y
					, pointArr[x][y].rx
					, pointArr[x][y].ry);

				gradient.addColorStop(1, 'hsla(' + gradientColor + ',0)');
				gradient.addColorStop(0, 'hsla(' + gradientColor + ',1)');

				ctx.fillStyle = gradient;
				ctx.beginPath();

				ctx.moveTo(pointArr[x][y-1].rx, pointArr[x][y-1].ry);
				ctx.lineTo(pointArr[x][y].rx, pointArr[x][y].ry);
				ctx.lineTo(pointArr[x-1][y].rx, pointArr[x-1][y].ry);

				ctx.closePath();
				ctx.fill();
			}
		}
		}
	};

	(function animationloop(){
      paint();
      requestAnimFrame(animationloop);
    })();
});