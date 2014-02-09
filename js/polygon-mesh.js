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

	var meshWidth = 0
	, meshHeight = 0
	, expandCanvasToWindow
	, render
	, ctx
	, pointArr = []
	, pointsNum = 15
	, gradient
	, maxRadius = 20
	, minRadius = 5
	, maxRotationRate = 0.03
	, hue = 250
	, gradientColor;

	expandCanvasToWindow = function() {
		meshWidth = $(window).width();
		meshHeight = $(window).height();

		$('#mesh').attr('width', meshWidth);
		$('#mesh').attr('height', meshHeight);

		for(var x=0;x<pointsNum+1;x++) {
		for(var y=0;y<pointsNum+1;y++) {
			pointArr[x][y].x = x * (meshWidth / pointsNum);
			pointArr[x][y].y = y * (meshHeight / pointsNum);
		}
		}

	};

	for(var x=0;x<pointsNum+1;x++) {
		pointArr[x] = [];
	for(var y=0;y<pointsNum+1;y++) {
		pointArr[x].push({
			x: x * (meshWidth / pointsNum),
			y: y * (meshHeight / pointsNum),
			rx: this.x,
			ry: this.y,
			radius: minRadius + Math.random() * (maxRadius - minRadius),
			radians: Math.random() * (Math.PI * 2),
			rotationRate: Math.random() * (maxRotationRate*2) - maxRotationRate,
			move: function() {
				this.radians = (this.radians + this.rotationRate) % (Math.PI * 2);

				this.rx = this.x + this.radius * Math.cos(this.radians);
				this.ry = this.y + this.radius * Math.sin(this.radians);
			}
		});
	}
	}

	expandCanvasToWindow();

	$(window).resize(function() {
		expandCanvasToWindow();
	});

	ctx = document.getElementById('mesh').getContext('2d');

	render = function() {
		ctx.fillStyle = 'hsla('+Math.round(hue)+', 10%, 10%, 1)';
		ctx.fillRect(0, 0, meshWidth, meshHeight);

		hue = hue + 0.1 % 360;

		for(var x=0;x<pointsNum+1;x++) {
		for(var y=0;y<pointsNum+1;y++) {
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
      render();
      requestAnimFrame(animationloop);
    })();


});
