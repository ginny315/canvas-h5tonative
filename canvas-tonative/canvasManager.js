define(['zepto','H5ToNative'], function($, H5ToNative) {
	var CanvasManager = {
		imgObj:[
			'img1.png',
			'img2.png',
			'img3.png'
		]
		init:function(){

		},
		draw:function(){
			var color = {
				colRed = '#ff4233',
				colBlue = '#fdc100'
			}
			CanvasManager.convertImageToCanvas(ctx,findImgByName('img1',newImgList),0,0);
			CanvasManager.canvasWordSet(ctx,'24px Calibri',colWhite,'这里设置文字',0,0);
			CanvasManager.canvasDrawRoundRect(ctx,245,526,265,18,10,colBlueDark,'','');
			CanvasManager.initAjaxLoadInfo('myurl',{data:'this is data'},
				function(){
					//sth exec after ajax,eg:drawAfterAjax(arguments[0]);
					CanvasManager.convertCanvasToData(mycanvas);
				}
			);					
		},
		InitialCanvas:function(width,height){
			var canvas = document.createElement("canvas");
			canvas.className = 'mycanvas';
			canvas.width = width;
			canvas.height = height;
			document.getElementsByTagName('body')[0].appendChild(canvas).setAttribute('style','display:none');
			return canvas;
		},
		createNewImg:function(obj){
			var newimg = new Image();
			newimg.setAttribute('src',obj.src);
			newimg.setAttribute('name',obj.name);
			return newimg;
		},
		isFinishFunc:function (newImgList){
			var isFinish = false
			newImgList.reduce(function(pre,cur){
				console.log(cur.complete)
				if(cur.complete){			
		            isFinish=cur.complete;
		        };
			},{})
			console.log(isFinish)
		    return isFinish;
		},
		batchProcessingImgs:function (ctx){	
			imgList.reduce(function(pre,cur){
				var img = createNewImg(cur)
			  	img.onload = function(){	
					newImgList.push(img);
					if(imgList.length == list.length)
						draw(ctx);
				}
			},{})
			return newImgList;
		},
		convertImageToCanvas:function (ctx,img,left,top) {
			ctx.drawImage(img,left,top);
		},
		scaleAndClipImageToRound:function (ctx,img,left,top,radius){
			var scaleBord,
				width = img.width,
				height = img.height;
			ctx.save();
			var newCanvans = document.createElement('canvas');
			newCanvans.width = img.width;
			newCanvans.height = img.height;
			var newCtx = newCanvans.getContext("2d");
			
			scaleBord = (width >= height ? 2*radius/height : 2*radius/width);
			newCtx.scale(scaleBord,scaleBord);
			newCtx.drawImage(img,0,0);


			var p = ctx.createPattern(newCanvans,"no-repeat");
			ctx.fillStyle = p;
			ctx.translate(left, top);
			ctx.arc(radius, radius, radius, 0, Math.PI*2);
			ctx.fill();
			ctx.restore();
		},
		convertCanvasToData:function (canvas){
			console.log('start to convertCanvasToData')
			var img = document.getElementsByClassName('mycanvas')[0];
			canvas.crossOrigin = "anonymous";
			var newImg = canvas.toDataURL();//需要传送给native的
			var param = {
				userToken:window.dataManager.getLocalStorageData('userToken'),
				userName:window.dataManager.getLocalStorageData('userName'),
				userLogo:window.dataManager.getLocalStorageData('userHeadPortrait'),
				type:3,
				data:newImg
			}
			h5tonative.goToNative('yzjk://shareImage/',param);
			// console.log(newImg);
			// var newimg2 = document.createElement('img');
			// newimg2.src = newImg;
			// document.body.appendChild(newimg2)
		},
		canvasWordSet:function (ctx,font,fillStyle,word,left,top,baseline,textalign) {
			ctx.font = font;
			ctx.fillStyle = fillStyle;
			ctx.textBaseline = baseline || 'top';
			ctx.textAlign = textalign || 'left';
			ctx.fillText(word,left,top);
		},
		findImgByName:function (name,newImgList){
			var imgobj;
			for(var i=0 , len=newImgList.length ; i<len ; i++){
				if(newImgList[i].name == name)
					imgobj = newImgList[i];
			}
			return imgobj;
		},
		drawRect:function (ctx,x, y, width, height,fillStyle,strokeStyle,lineWidth){
			ctx.fillStyle = fillStyle || '';
			ctx.strokeStyle = strokeStyle || '';
			ctx.lineWidth = lineWidth || 1;
			ctx.fillRect(x, y, width, height);
		},
		drawRound:function (ctx,left,top,radius,fillStyle){
			ctx.beginPath();
            ctx.arc(left+radius, top+radius, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = fillStyle;
            ctx.fill();
		}
		/**
		 * [pay attention]exclude strokeStyle = '#000000'
		 */
		drawRoundRect:function (ctx,x,y,width,height,radius,fillStyle,strokeStyle,lineWidth){
			ctx.fillStyle = fillStyle || '';
			ctx.strokeStyle = strokeStyle || '';
			ctx.lineWidth = lineWidth || 1;
			if (width < 2*radius) 
				radius = width / 2;
			if (height < 2 * radius) 
				radius = height / 2;
			ctx.beginPath();
			ctx.moveTo(x+radius, y);
			ctx.arcTo(x+width, y, x+width, y+height, radius);
			ctx.arcTo(x+width, y+height, x, y+height, radius);
			ctx.arcTo(x, y+height, x, y, radius);
			ctx.arcTo(x, y, x+width, y, radius);
			// ctx.arcTo(x+r, y);
			ctx.closePath();
			if(ctx.fillStyle != '') ctx.fill();
			if(ctx.strokeStyle != '#000000') ctx.stroke();
		},
		initAjaxLoadInfo:function (url,data,func){
			$.ajax({
                type: 'POST',
                dataType: 'json',
                url: url,
                data:data,
                success: function (response) {
                    func(response.data);
                },
                error: function (xhr, msg) {
                	console.log('error occur!')
                }
            });	
		}
		
	return {
		CanvasManager:CanvasManager
	}
}