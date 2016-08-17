function InitialCanvas(width,height){
	var canvas = document.createElement("canvas");
	canvas.className = 'mycanvas';
	canvas.width = width;
	canvas.height = height;
	document.getElementsByTagName('body')[0].appendChild(canvas);
	return canvas;
}

function createNewImg(obj){
	var newimg = new Image();
	newimg.setAttribute('src',obj.src);
	newimg.setAttribute('name',obj.name);
	return newimg;
}

/**
 * 全部加载完判断条件
 */
function isFinishFunc(newImgList){
	var isFinish = false
	newImgList.reduce(function(pre,cur){
		console.log(cur.complete)
		if(cur.complete){			
            isFinish=cur.complete;
        };
	},{})
	console.log(isFinish)
    return isFinish;
}

function batchProcessingImgs(imgList,newImgList){	
	imgList.reduce(function(pre,cur){
		var img = createNewImg(cur)
	  	img.onload = function(){	
			newImgList.push(img);
		}
	},{})
	return newImgList;
}

function convertImageToCanvas(ctx,img,left,top) {
	ctx.drawImage(img,left,top);
}
/**
 * 按比例缩小图像并裁剪
 * left，top:左上角
 * radius:裁剪后的圆半径，注意是半径
 * 比较宽和高，小的设置为圆的直径长，大的裁剪为scaleBorder
 */
function scaleAndClipImageToRound(ctx,img,left,top,radius){
	var scaleBord,
		width = img.width,
		height = img.height;
	ctx.save();
	scaleBord = (width >= height ? 2*radius/height : 2*radius/width);
	ctx.translate(left, top);
	ctx.scale(scaleBord,scaleBord);

	ctx.arc(left, top, radius*3, 0, Math.PI*2, false);
	ctx.drawImage(img,left,top);
	ctx.restore();	

}

function convertCanvasToData(canvas){
	console.log('start to convertCanvasToData')
	var img = document.getElementsByTagName('canvas')[0];
	img.crossOrigin = "anonymous";
	var newImg = img.toDataURL();
	//console.log(newImg);
	//document.getElementById('myimg').setAttribute('src',newImg);
}

function canvasWordSet(ctx,font,fillStyle,word,left,top,baseline,textalign) {
	ctx.font = font;
	ctx.fillStyle = fillStyle;
	ctx.textBaseline = baseline || 'top';
	ctx.textAlign = textalign || 'left';
	ctx.fillText(word,left,top);
}

function findImgByName(name,newImgList){
	var imgobj;
	for(var i=0 , len=newImgList.length ; i<len ; i++){
		if(newImgList[i].name == name)
			imgobj = newImgList[i];
	}
	return imgobj;
}

/**
 * draw round rect
 */
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
	if (width < 2*radius) 
		radius = width / 2;
	if (height < 2 * radius) 
		radius = height / 2;
	this.beginPath();
	this.moveTo(x+radius, y);
	this.arcTo(x+width, y, x+width, y+height, radius);
	this.arcTo(x+width, y+height, x, y+height, radius);
	this.arcTo(x, y+height, x, y, radius);
	this.arcTo(x, y, x+width, y, radius);
	// this.arcTo(x+r, y);
	this.closePath();
	return this;
}

/**
 * [pay attention]exclude strokeStyle = '#000000'
 */
function canvasDrawRoundRect(ctx,x,y,width,height,radius,fillStyle,strokeStyle,lineWidth){
	ctx.fillStyle = fillStyle || '';
	ctx.strokeStyle = strokeStyle || '';
	ctx.lineWidth = lineWidth || 1;
	ctx.roundRect(x,y,width,height,radius);
	if(ctx.fillStyle != '') ctx.fill();
	if(ctx.strokeStyle != '#000000') ctx.stroke();
}

function initAjaxLoadInfo(url,data,func,method){
	var myHeaders = new Headers();
	var res;
	myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
	var form = new FormData();
	var str='';
	for(key in data){
		str+=key+'='+data[key]+'&';
	}
	str = str.substring(0,str.length-1);

	if(method == 'get') {
		console.log(url)
		//var index = Array.prototype.lastIndexOf.call(this,url,'/');
		var index = url.split('').lastIndexOf('/');
		url = url.substring(index+1,url.length);

		console.log('url='+url)
		var myInit = { 
			method: 'GET',
        	headers: myHeaders,
        	mode: 'cors',
        	cache: 'default',
        };
        var myRequest = new Request('data/'+url+'.json');
	}else{
		var myInit = { 
			method: 'POST',
        	headers: myHeaders,
        	mode: 'cors',
        	cache: 'default',
        	body: str
        };
        var myRequest = new Request(url);
	}

	

	fetch(myRequest,myInit).then(function(response) {
		return response.json().then(function(data){data.data;
			return data.data;
		}) 
	}).then(function(data){
		func(data);
	});
}

function drawRect(ctx,x, y, width, height,fillStyle,strokeStyle,lineWidth){
	ctx.fillStyle = fillStyle || '';
	ctx.strokeStyle = strokeStyle || '';
	ctx.lineWidth = lineWidth || 1;
	ctx.fillRect(x, y, width, height);
}

function minLen(normalMin,allAmount,len,offset){
	offset = offset || 0;
	return normalMin/allAmount*len+offset;
}
function maxLen(normalMax,allAmount,len,offset){
	offset = offset || 0;
	return normalMax/allAmount*len+offset;
}
function realLen(realAmount,allAmount,len){
	return realAmount/allAmount*len;
}

/**
 * 1 超值
 * 2 正常值为0
 * 3 小于最小值
 * 4 大于最大值
 * 5 正常值
 */
function compareReal(normalMin,normalMax,realAmount,allAmount){
	if(realAmount > allAmount)
		return 1;
	else if (realAmount == 0 || realAmount == null || realAmount == undefined)
		return 2;
	else if (realAmount < normalMin)
		return 3;
	else if (realAmount > normalMax)
		return 4;
	else if(realAmount < normalMax && realAmount > normalMin)
		return 5;
}
//ctx,x,y,width,height,radius,fillStyle,strokeStyle,lineWidth
function drawFoodBar(ctx,min,max,all,top,color,obj,compare,unit) {
	drawRect(ctx,minLen(min,all,265,245), top, 2, 16,color.colTagBlue,'','');
	drawRect(ctx,maxLen(max,all,265,245), top, 2, 16,color.colTagBlue,'','');
		if(compare == 1){
			canvasDrawRoundRect(ctx,245,top,265,18,10,color.colProRedLight,color.colProRedDark,4);
			canvasWordSet(ctx,'32px jdyt',color.colProRedLight,obj.realAmount+unit,520,top-5);
		}else if(compare == 2){
			canvasWordSet(ctx,'32px jdyt',color.colProYellowLight,obj.realAmount+unit,520,top-5);
		}
		else if(compare == 3){
			canvasDrawRoundRect(ctx,245,top,realLen(obj.realAmount,all,265),18,10,color.colProYellowLight,color.colProYellowDark,4);
			canvasWordSet(ctx,'32px jdyt',color.colProYellowLight,obj.realAmount+unit,520,top-5);
		}
		else if(compare == 4){
			canvasDrawRoundRect(ctx,245,top,realLen(obj.realAmount,all,265),18,10,color.colProRedLight,color.colProRedDark,4);
			canvasWordSet(ctx,'32px jdyt',color.colProRedLight,obj.realAmount+unit,520,top-5);
		}
		else if(compare == 5){
			canvasDrawRoundRect(ctx,245,top,realLen(obj.realAmount,all,265),18,10,color.colProGreenLight,color.colProGreenDark,4);
			canvasWordSet(ctx,'32px jdyt',color.colProGreenLight,obj.realAmount+unit,520,top-5);
		}
}

function drawSportBar(ctx,min,max,all,top,color,obj,compare){
	drawRect(ctx,minLen(min,all,375,220), top, 2, 16,color.colTagGreen,'','');
	drawRect(ctx,maxLen(max,all,375,220), top, 2, 16,color.colTagGreen,'','');
		if(compare == 1){
			canvasDrawRoundRect(ctx,220,top,375,18,10,color.colProRedLight,color.colProRedDark,4);
			canvasWordSet(ctx,'32px jdyt',color.colProRedLight,'超标',610,top-5);
		}
		else if(compare == 2){
			canvasWordSet(ctx,'32px jdyt',color.colProYellowLight,'偏低',610,top-5);
		}
		else if(compare == 3){
			canvasDrawRoundRect(ctx,220,top,realLen(obj.realAmount,all,375),18,10,color.colProYellowLight,color.colProYellowDark,4);
			canvasWordSet(ctx,'32px jdyt',color.colProYellowLight,'偏低',610,top-5);
		}
		else if(compare == 4){
			canvasDrawRoundRect(ctx,220,top,realLen(obj.realAmount,all,375),18,10,color.colProRedLight,color.colProRedDark,4);
			canvasWordSet(ctx,'32px jdyt',color.colProRedLight,'超标',610,top-5);
		}
		else if(compare == 5){
			canvasDrawRoundRect(ctx,220,top,realLen(obj.realAmount,all,375),18,10,color.colProGreenLight,color.colProGreenDark,4);
			canvasWordSet(ctx,'32px jdyt',color.colProGreenLight,'正常',610,top-5);
		}
}

function drawSleepBar(ctx,min,max,all,top,color,obj,compare){
	drawRect(ctx,minLen(min,all,375,220), top, 2, 16,color.colTagBrown,'','');
	drawRect(ctx,maxLen(max,all,375,220), top, 2, 16,color.colTagBrown,'','');
		if(compare == 1){
			canvasDrawRoundRect(ctx,220,top,375,18,10,color.colProRedLight,color.colProRedDark,4);
			canvasWordSet(ctx,'32px jdyt',color.colProRedLight,obj.realAmount+'小时',610,top-5);
		}
		else if(compare == 2){
			canvasWordSet(ctx,'32px jdyt',color.colProYellowLight,obj.realAmount+'小时',610,top-5);
		}
		else if(compare == 3){
			canvasDrawRoundRect(ctx,220,top,realLen(obj.realAmount,all,375),18,10,color.colProYellowLight,color.colProYellowDark,4);
			canvasWordSet(ctx,'32px jdyt',color.colProYellowLight,obj.realAmount+'小时',610,top-5);
		}
		else if(compare == 4){
			canvasDrawRoundRect(ctx,220,top,realLen(obj.realAmount,all,375),18,10,color.colProRedLight,color.colProRedDark,4);
			canvasWordSet(ctx,'32px jdyt',color.colProRedLight,obj.realAmount+'小时',610,top-5);
		}
		else if(compare == 5){
			canvasDrawRoundRect(ctx,220,top,realLen(obj.realAmount,all,375),18,10,color.colProGreenLight,color.colProGreenDark,4);
			canvasWordSet(ctx,'32px jdyt',color.colProGreenLight,obj.realAmount+'小时',610,top-5);
		}
}

window.onload = function() {
	var imgList = [],newImgList = [];
	var colWhite = '#fff2d7',
		colBlue = '#70d2ea',
		colGreen = '#abce2a',
		colBrown = '#fdc100',
		colGrey = '#828b96',
		colYellowDark = '#ffcf16',
		colBlueDark = '#002335',
		colBlueLight = '#064b6d',
		colGreenDark = '#253007',
		colGreenLight = '#364609',
		colBrownDark = '#683304',
		colBrownLight = '#8e4b10',
		colBrownLighter = '#dacab1',
		colBrownMiddle = '#786553',
		colYellowMiddle = '#ffcf16',
		colOrangeMiddle = '#fe8103',
		colBrownMiddleUp = '#8a602b';

	var color = {
		colTagBlue : '#064b6d',
		colTagGreen : '#364609',
		colTagBrown : '#8e4b10',
		colProRedLight : '#ff4233',
		colProRedDark : '#6b1e00',
		colProGreenLight : '#00ff9c',
		colProGreenDark : '#009775',
		colProYellowLight : '#ffcb00',
		colProYellowDark : '#854309'
	}
	

	/**
	 * imgList store imgs
	 * TODO:取名优化成正则
	 */
		imgList.push({src:'../../resource/others/g-bg.png',name:'g-bg'});
		imgList.push({src:'../../resource/others/g-title.png',name:'g-title'});
		imgList.push({src:'../../resource/others/g-headporaitbg.png',name:'g-headporaitbg'});
		imgList.push({src:'../../resource/others/g-bluebar.png',name:'g-bluebar'});
		imgList.push({src:'../../resource/others/g-blueimg.png',name:'g-blueimg'});
		imgList.push({src:'../../resource/others/g-greenbar.png',name:'g-greenbar'});
		imgList.push({src:'../../resource/others/g-greenimg.png',name:'g-greenimg'});
		imgList.push({src:'../../resource/others/g-brownbar.png',name:'g-brownbar'});
		imgList.push({src:'../../resource/others/g-brownimg.png',name:'g-brownimg'});
		imgList.push({src:'../../resource/others/g-hot.png',name:'g-hot'});
		imgList.push({src:'../../resource/others/g-protein.png',name:'g-protein'});
		imgList.push({src:'../../resource/others/g-fat.png',name:'g-fat'});
		imgList.push({src:'../../resource/others/g-fibre.png',name:'g-fibre'});
		imgList.push({src:'../../resource/others/g-c.png',name:'g-c'});
		imgList.push({src:'../../resource/others/g-water.png',name:'g-water'});
		imgList.push({src:'../../resource/others/g-consumehot.png',name:'g-consumehot'});
		imgList.push({src:'../../resource/others/g-strengthmusle.png',name:'g-strengthmusle'});
		imgList.push({src:'../../resource/others/g-broadheart.png',name:'g-broadheart'});
		imgList.push({src:'../../resource/others/g-strengthborn.png',name:'g-strengthborn'});
		imgList.push({src:'../../resource/others/g-trainbrain.png',name:'g-trainbrain'});
		imgList.push({src:'../../resource/others/g-release.png',name:'g-release'});
		imgList.push({src:'../../resource/others/g-trainjoint.png',name:'g-trainjoint'});
		imgList.push({src:'../../resource/others/g-time.png',name:'g-time'});
		imgList.push({src:'../../resource/others/g-timedevation.png',name:'g-timedevation'});
		imgList.push({src:'../../resource/others/g-download.png',name:'g-download'});
		imgList.push({src:'../../resource/others/g-up.png',name:'g-up'});
		imgList.push({src:'../../resource/others/g-down.png',name:'g-down'});
		imgList.push({'src':'../../resource/others/testhead.jpg',name:'testhead'});

	var list = batchProcessingImgs(imgList,newImgList);

	document.getElementById('change').onclick = function() {
		var mycanvas = InitialCanvas(750,2134);
		var ctx = mycanvas.getContext("2d");
		var min,max,real,all;
		
		
		if(imgList.length == list.length){
			convertImageToCanvas(ctx,findImgByName('g-bg',newImgList),0,0);
			convertImageToCanvas(ctx,findImgByName('g-title',newImgList),232,25);
			convertImageToCanvas(ctx,findImgByName('g-headporaitbg',newImgList),138,208);
			convertImageToCanvas(ctx,findImgByName('g-bluebar',newImgList),69,415);
			convertImageToCanvas(ctx,findImgByName('g-blueimg',newImgList),271,426);
			convertImageToCanvas(ctx,findImgByName('g-greenbar',newImgList),69,962);
			convertImageToCanvas(ctx,findImgByName('g-greenimg',newImgList),271,964);
			convertImageToCanvas(ctx,findImgByName('g-brownbar',newImgList),69,1582);
			convertImageToCanvas(ctx,findImgByName('g-brownimg',newImgList),271,1590);
			convertImageToCanvas(ctx,findImgByName('g-hot',newImgList),70,515);
			convertImageToCanvas(ctx,findImgByName('g-protein',newImgList),70,584);
			convertImageToCanvas(ctx,findImgByName('g-fat',newImgList),70,657);
			convertImageToCanvas(ctx,findImgByName('g-fibre',newImgList),70,728);
			convertImageToCanvas(ctx,findImgByName('g-c',newImgList),70,801);
			convertImageToCanvas(ctx,findImgByName('g-water',newImgList),70,872);
			convertImageToCanvas(ctx,findImgByName('g-consumehot',newImgList),70,1062);
			convertImageToCanvas(ctx,findImgByName('g-strengthmusle',newImgList),70,1133);
			convertImageToCanvas(ctx,findImgByName('g-broadheart',newImgList),70,1207);
			convertImageToCanvas(ctx,findImgByName('g-strengthborn',newImgList),70,1278);
			convertImageToCanvas(ctx,findImgByName('g-trainbrain',newImgList),70,1350);
			convertImageToCanvas(ctx,findImgByName('g-release',newImgList),70,1419);
			convertImageToCanvas(ctx,findImgByName('g-trainjoint',newImgList),70,1491);
			convertImageToCanvas(ctx,findImgByName('g-time',newImgList),70,1688);
			convertImageToCanvas(ctx,findImgByName('g-timedevation',newImgList),70,1758);
			//convertImageToCanvas(ctx,)
			

			canvasWordSet(ctx,'24px jdyt',colWhite,'今日健康得分：',313,221);
			canvasWordSet(ctx,'30px jdyt',colWhite,'共打败',312,294);
			canvasWordSet(ctx,'30px jdyt',colWhite,'的用户',537,295);
			canvasWordSet(ctx,'36px jdyt',colBlue,'饮食摄入',330,434);
			canvasWordSet(ctx,'36px jdyt',colGreen,'运动程度',330,981);
			canvasWordSet(ctx,'36px jdyt',colBrown,'睡眠质量',330,1602);
			canvasWordSet(ctx,'24px jdyt',color.colProRedLight,'%',505,300);

			//draw bg roundrect bar
			canvasDrawRoundRect(ctx,245,526,265,18,10,colBlueDark,'','');
			canvasDrawRoundRect(ctx,245,595,265,18,10,colBlueDark,'','');
			canvasDrawRoundRect(ctx,245,668,265,18,10,colBlueDark,'','');
			canvasDrawRoundRect(ctx,245,739,265,18,10,colBlueDark,'','');
			canvasDrawRoundRect(ctx,245,812,265,18,10,colBlueDark,'','');
			canvasDrawRoundRect(ctx,245,883,265,18,10,colBlueDark,'','');
			canvasDrawRoundRect(ctx,220,1073,375,18,10,colGreenDark,'','');
			canvasDrawRoundRect(ctx,220,1144,375,18,10,colGreenDark,'','');
			canvasDrawRoundRect(ctx,220,1218,375,18,10,colGreenDark,'','');
			canvasDrawRoundRect(ctx,220,1289,375,18,10,colGreenDark,'','');
			canvasDrawRoundRect(ctx,220,1361,375,18,10,colGreenDark,'','');
			canvasDrawRoundRect(ctx,220,1430,375,18,10,colGreenDark,'','');
			canvasDrawRoundRect(ctx,220,1502,375,18,10,colGreenDark,'','');
			canvasDrawRoundRect(ctx,220,1699,375,18,10,colBrownDark,'','');
			canvasDrawRoundRect(ctx,220,1769,375,18,10,colBrownDark,'','');

			//draw foot
			canvasDrawRoundRect(ctx,28,1847,695,261,30,colWhite,colGrey,6);
			convertImageToCanvas(ctx,findImgByName('g-download',newImgList),516,1887);
			canvasDrawRoundRect(ctx,58,2022,435,4,2,colBrownLighter,colBrownLighter,2);
			convertImageToCanvas(ctx,findImgByName('g-up',newImgList),194,1930);
			convertImageToCanvas(ctx,findImgByName('g-down',newImgList),314,1948);
			canvasWordSet(ctx,'28px jdyt',colBrownMiddle,'健康日记，为你量身定制健康日程',57,2044);
			canvasWordSet(ctx,'28px jdyt',colBrownMiddle,'在',160,1932);
			canvasWordSet(ctx,'28px jdyt',colBrownMiddle,'健康日记',203,1932);
			canvasWordSet(ctx,'28px jdyt',colBrownMiddle,'中',331,1932);
			canvasWordSet(ctx,'28px jdyt',colBrownMiddle,'健康排名',161,1976);
			scaleAndClipImageToRound(ctx,findImgByName('testhead',newImgList),57,1690,40);
			canvasWordSet(ctx,'23px jdyt',colYellowMiddle,'用户名',161,1886);
			
			/**
			 * 需要先画背景
			 * 再画加载的头像
			 * 再画段位
			 */
			canvasDrawRoundRect(ctx,233,300,50,28,14,colYellowMiddle,colOrangeMiddle,6);
			//scaleAndClipImageToRound(ctx,findImgByName('testhead',newImgList),138,213,50);
			canvasWordSet(ctx,'23px jdyt',colYellowMiddle,'用户名changchanngchang',215,351,null,'center');
			canvasWordSet(ctx,'16px jdyt',colBrownMiddleUp,'段',260,307);
			
			

			
			var drawHealthBar = function(param) {
				var healthSumScore = param.healthSumScore || '',
				    sumScoreBeatNumber = param.sumScoreBeatNumber || '',
				    sumScoreLevel = param.sumScoreLevel || 0;

				canvasWordSet(ctx,'48px jdyt','#dcff66',healthSumScore,481,210);
				canvasWordSet(ctx,'72px jdyt',color.colProRedLight,sumScoreBeatNumber,420,265);
				canvasWordSet(ctx,'28px jdyt',colBrownMiddle,sumScoreLevel,276,1977);
				
				

				var food = param.eatFoodAmount;
				for(key in food){
					switch (key){
						case 'calory':
							drawFoodBar(ctx,food[key].normalMin,food[key].normalMax,food[key].allAmount,526,color,food[key],compareReal(food[key].normalMin,food[key].normalMax,food[key].realAmount,food[key].allAmount),'卡');
							break;
						case 'protein':
							drawFoodBar(ctx,food[key].normalMin,food[key].normalMax,food[key].allAmount,595,color,food[key],compareReal(food[key].normalMin,food[key].normalMax,food[key].realAmount,food[key].allAmount),'克');
							break;
						case 'fat':
							drawFoodBar(ctx,food[key].normalMin,food[key].normalMax,food[key].allAmount,668,color,food[key],compareReal(food[key].normalMin,food[key].normalMax,food[key].realAmount,food[key].allAmount),'克');
							break;
						case 'fiberDietary':
							drawFoodBar(ctx,food[key].normalMin,food[key].normalMax,food[key].allAmount,739,color,food[key],compareReal(food[key].normalMin,food[key].normalMax,food[key].realAmount,food[key].allAmount),'克');
							break;
						case 'carbohydrate':
							drawFoodBar(ctx,food[key].normalMin,food[key].normalMax,food[key].allAmount,812,color,food[key],compareReal(food[key].normalMin,food[key].normalMax,food[key].realAmount,food[key].allAmount),'克');
							break;
						case 'water':
							drawFoodBar(ctx,food[key].normalMin,food[key].normalMax,food[key].allAmount,883,color,food[key],compareReal(food[key].normalMin,food[key].normalMax,food[key].realAmount,food[key].allAmount),'毫升');
							break;
						default:
							break;
						}
				}

				var sport = param.doSportAmount;
				for(var key in sport){
					switch (key){
						case 'caloryUse':
							drawSportBar(ctx,sport[key].normalMin,sport[key].normalMax,sport[key].allAmount,1073,color,sport[key],compareReal(sport[key].normalMin,sport[key].normalMax,sport[key].realAmount,sport[key].allAmount),'卡');
							break;
						case 'muscleGrowth':
							drawSportBar(ctx,sport[key].normalMin,sport[key].normalMax,sport[key].allAmount,1144,color,sport[key],compareReal(sport[key].normalMin,sport[key].normalMax,sport[key].realAmount,sport[key].allAmount),'克');
							break;
						case 'strengthenHeart':
							drawSportBar(ctx,sport[key].normalMin,sport[key].normalMax,sport[key].allAmount,1218,color,sport[key],compareReal(sport[key].normalMin,sport[key].normalMax,sport[key].realAmount,sport[key].allAmount),'克');
							break;
						case 'strengthenBone':
							drawSportBar(ctx,sport[key].normalMin,sport[key].normalMax,sport[key].allAmount,1289,color,sport[key],compareReal(sport[key].normalMin,sport[key].normalMax,sport[key].realAmount,sport[key].allAmount),'克');
							break;
						case 'strengthenBrain':
							drawSportBar(ctx,sport[key].normalMin,sport[key].normalMax,sport[key].allAmount,1361,color,sport[key],compareReal(sport[key].normalMin,sport[key].normalMax,sport[key].realAmount,sport[key].allAmount),'克');
							break;
						case 'relieveMind':
							drawSportBar(ctx,sport[key].normalMin,sport[key].normalMax,sport[key].allAmount,1430,color,sport[key],compareReal(sport[key].normalMin,sport[key].normalMax,sport[key].realAmount,sport[key].allAmount),'毫升');
							break;
						case 'relaxJoint':
							drawSportBar(ctx,sport[key].normalMin,sport[key].normalMax,sport[key].allAmount,1502,color,sport[key],compareReal(sport[key].normalMin,sport[key].normalMax,sport[key].realAmount,sport[key].allAmount),'毫升');
							break;
						default:
							break;
						}
				}

				var sleep = param.doSleepQuality;
				for(var key in sleep){
					switch (key){
						case 'sleepTime':
							drawSleepBar(ctx,sleep[key].normalMin,sleep[key].normalMax,sleep[key].allAmount,1699,color,sleep[key],compareReal(sleep[key].normalMin,sleep[key].normalMax,sleep[key].realAmount,sleep[key].allAmount));
							break;
						case 'sleepTimerOffset':
							drawSleepBar(ctx,sleep[key].normalMin,sleep[key].normalMax,sleep[key].allAmount,1769,color,sleep[key],compareReal(sleep[key].normalMin,sleep[key].normalMax,sleep[key].realAmount,sleep[key].allAmount));
							break;
						default:
							break;
						}
				}
			}
			initAjaxLoadInfo('http://jkm.test.111.com.cn:9081/api/app/health_pi/todayHealthInfo',{userToken:'38_14c3883afc06cf3a527fbe51a647fc09_yzjk',taskDate:1471339506000},drawHealthBar,'get');

			
		}
		convertCanvasToData(mycanvas);		
	}
}

