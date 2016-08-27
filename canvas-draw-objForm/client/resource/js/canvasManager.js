    var Promise = require('es6-promise').Promise;
    require('es6-promise').polyfill();
    require('fetch-polyfill');

	var CanvasManager = {
		/**
		 * just consider function draw as a demo , but use it as obj.attr
		 * you should exec you method in sequence of painting.
		 * */
		draw: function () {
			var color = {
				colRed : '#ff4233',
				colBlue : '#fdc100'
			}
			CanvasManager.convertImageToCanvas(ctx, findImgByName('img1', newImgList), 0, 0);
			CanvasManager.canvasWordSet(ctx, '24px Calibri', colWhite, '这里设置文字', 0, 0);
			CanvasManager.initAjaxLoadInfo('myurl', {data: 'this is data'},
				function () {
					//sth exec after ajax,eg:drawAfterAjax(arguments[0]);
					CanvasManager.convertCanvasToData(mycanvas);
				}
			);
		},
		/**
		 * elm:HTMLElement , append canvas to elm 
		 * className:canvas has its className
		 */	
		InitialCanvas: function (elm,width, height,className) {
			var canvas = document.createElement("canvas");
			canvas.className = className;
			canvas.width = width;
			canvas.height = height;
			elm.appendChild(canvas).setAttribute('style','widht:100%');
			return canvas;
		},
		createNewImg: function (obj) {
			var newimg = new Image();
			newimg.setAttribute('src', obj.src);
			newimg.setAttribute('name', obj.name);
			return newimg;
		},
		isFinishFunc: function (newImgList) {
			var isFinish = false
			newImgList.reduce(function (pre, cur) {
				console.log(cur.complete)
				if (cur.complete) {
					isFinish = cur.complete;
				}
				;
			}, {})
			console.log(isFinish)
			return isFinish;
		},
		/**
		 * this method should copy to your code module
		 * set a window various to contain batchProcessingImgs
		 * eg:list = batchProcessingImgs(ctx);
		 */
		batchProcessingImgs: function (ctx) {
			imgList.reduce(function (pre, cur) {
				var img = CanvasManager.createNewImg(cur)
				img.onload = function () {
					newImgList.push(img);
					if (imgList.length == list.length)
						func(ctx);//eg:draw(ctx)
				}
			}, {})
			return newImgList;
		},
		convertImageToCanvas: function (ctx, img, left, top) {
			ctx.drawImage(img, left, top);
		},
		chooseAndConvertImageToCanvas: function(ctx,img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight){
			ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		},
		/**
		 * num:response data[string]
		 * offset:call designer put every digit divided into same distance
		 * func:cb
		 */
		convertDigitToImg:function (num,offset,func){
			var arr = (num+'').split(''),
				len = arr.length,
				offset = offset;
			for(var i=0 ; i<len ; i++) {
				offset = offset*arr[i];
				func(offset,i);
			}
		},
		scaleAndClipImageToRound: function (ctx, img, left, top, radius) {
			var scaleBord,
				width = img.width,
				height = img.height;
			ctx.save();
			var newCanvans = document.createElement('canvas');
			newCanvans.width = img.width;
			newCanvans.height = img.height;
			var newCtx = newCanvans.getContext("2d");

			scaleBord = (width >= height ? 2 * radius / height : 2 * radius / width);
			newCtx.scale(scaleBord, scaleBord);
			newCtx.drawImage(img, 0, 0);

			var p = ctx.createPattern(newCanvans, "no-repeat");
			ctx.fillStyle = p;
			ctx.translate(left, top);
			ctx.arc(radius, radius, radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		},
		convertCanvasToData: function (canvas) {
			console.log('start to convertCanvasToData')
			var img = document.getElementsByClassName('mycanvas')[0];
			canvas.crossOrigin = "anonymous";
			var newImg = canvas.toDataURL();//需要传送给server端的png图片
			return newImg;
		},
		canvasWordSet: function (ctx, font, fillStyle, word, left, top, baseline, textalign) {
			ctx.save();
			ctx.font = font;
			ctx.fillStyle = fillStyle || '';
			ctx.textBaseline = baseline || 'top';
			ctx.textAlign = textalign || 'left';
			ctx.fillText(word, left, top);
			ctx.restore();
		},
		findImgByName: function (name, newImgList) {
			var imgobj;
			for (var i = 0, len = newImgList.length; i < len; i++) {
				if (newImgList[i].name == name)
					imgobj = newImgList[i];
			}
			return imgobj;
		},
		/**
		 * just use null if fillStyle,strokeStyle,lineWidth are not required.
		 */
		drawRect: function (ctx, x, y, width, height, fillStyle, strokeStyle, lineWidth) {
			ctx.save();
			ctx.fillStyle = fillStyle || '';
			ctx.strokeStyle = strokeStyle || '';
			ctx.lineWidth = lineWidth || 1;
			if (ctx.fillStyle != '') ctx.fill();
			if (ctx.strokeStyle != '#000000') ctx.stroke();
			ctx.restore();
		},
		/**
		 * just use null if fillStyle,strokeStyle,lineWidth are not required.
		 * [pay attention]exclude strokeStyle = '#000000'
		 */
		drawRound: function (ctx, left, top, radius, fillStyle, strokeStyle, lineWidth) {
			ctx.save();
			ctx.fillStyle = fillStyle || '';
			ctx.strokeStyle = strokeStyle || '';
			ctx.lineWidth = lineWidth || 1;
			ctx.beginPath();
			ctx.arc(left + radius, top + radius, radius, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fillStyle = fillStyle || '';
			ctx.strokeStyle = strokeStyle || '';
			if (ctx.fillStyle != '') ctx.fill();
			if (ctx.strokeStyle != '#000000') ctx.stroke();
			ctx.restore();
		},
		/**
		 * just use null if fillStyle,strokeStyle,lineWidth are not required.
		 * [pay attention]exclude strokeStyle = '#000000'
		 */
		drawRoundRect: function (ctx, x, y, width, height, radius, fillStyle, strokeStyle, lineWidth) {
			if (width < 2 * radius)
				radius = width / 2;
			if (height < 2 * radius)
				radius = height / 2;
			ctx.save();
			ctx.fillStyle = fillStyle || '';
			ctx.strokeStyle = strokeStyle || '';
			ctx.lineWidth = lineWidth || 1;
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.arcTo(x + width, y, x + width, y + height, radius);
			ctx.arcTo(x + width, y + height, x, y + height, radius);
			ctx.arcTo(x, y + height, x, y, radius);
			ctx.arcTo(x, y, x + width, y, radius);
			ctx.closePath();
			if (ctx.fillStyle != '') ctx.fill();
			if (ctx.strokeStyle != '#000000') ctx.stroke();
			ctx.restore();
		},
		initSingleAjaxLoadInfo:function(url, data, func){
			var initparam = data || '';
			fetch(url,initparam).then(function(response) {
	            return response.text()
	        }).then(function(data) {
	            func(data);
	        })
	    },
	    /**
	     * this method allow the same urls exec same callback,
	     * not allow urls exec follow the following's response.
	     * you should write url like this: urls[{url:'',params:{},},{url:'',params:{},}]
	     * if request success,exec callback
	     */
		initMultiAjaxLoadInfo: function (urls,func) {
			console.log('start to ajax')
			Promise.all(urls.map(function(item){
				var initparam = item.param || '';
			    return fetch(item.url).then(function(response) {
		            return response.text()
		        }).then(function(data) {
		            return JSON.parse(data).data;
		        })
			})).then(function(data){
					func(data);
			});
		},
	};

	module.exports = CanvasManager;
