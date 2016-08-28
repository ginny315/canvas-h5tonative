/**
 * Created by guoningyan on 16/8/22.
 */
define(['canvasManager','await'],function(canvasManager,await){
    var canvasmanager = canvasManager;
    var shareRankList = [], shareRankNewImgList = [];

    var shareRankCanvas = canvasmanager.InitialCanvas(document.getElementsByTagName('body')[0],750, 1334, 'shareRankCanvas');
    var ctx = shareRankCanvas.getContext("2d");
    /**
     *  删除2行
     */
    var userHeadPortrait = './img/imgDefault.jpg';
    var userName = 'ginny';
    

    window.onerror = function (e) {console.log(e)}
    var shareRank = {
        init: function () {
            shareRankList.push({src:'./img/g-sharerankbg.png', name: 'g-sharerankbg'});
            shareRankList.push({src:'./img/g-sharerankpink.png',name:'g-sharerankpink'});
            shareRankList.push({src:'./img/g-headporaitbg.png',name:'g-headporaitbg.png'});
            shareRankList.push({src:'./img/g-sharerankgreen.png',name:'g-sharerankgreen'});
            shareRankList.push({src:'./img/g-up.png',name:'g-up'});
            shareRankList.push({src:'./img/g-down.png',name:'g-down'});
            shareRankList.push({src:'./img/g-download.png',name:'g-download'});
            shareRankList.push({src:userHeadPortrait,name:'userHeadPortrait'});
            shareRankList.push({src:'./img/digit.png',name:'digit'});

            var list = batchProcessingImgs(ctx);

            function batchProcessingImgs(ctx) {
                shareRankList.reduce(function(pre,cur){
                    var img = canvasmanager.createNewImg(cur)
                    img.onload = function(){   
                            // for(var i in shareRankNewImgList) 
                            //     if(img != shareRankNewImgList[i])
                                    shareRankNewImgList.push(img);
                                    console.log(shareRankNewImgList);
                        if (shareRankList.length == list.length){
                            shareRank.drawRank(ctx);//eg:draw(ctx)
                            console.dir(shareRankNewImgList);
                        }
                    }
                },{});
                return shareRankNewImgList;
            }
        },
        drawGrade:function (data) {
            console.log('draw grade data');
            console.dir(data)
            // sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
            var weekSrore = data[0].myRanking.score,
                weekRank = data[0].myRanking.rank,
                hundredScore = data[1].myRanking.score,
                hundredRank = data[1].myRanking.rank;

            function cb(offset,index){
                canvasmanager.chooseAndConvertImageToCanvas(ctx, canvasmanager.findImgByName('digit',shareRankNewImgList),offset,0,24,38,234+24*index,382,24,38)
            }
            canvasmanager.convertDigitToImg(weekSrore,24,cb); 
            canvasmanager.convertCanvasToData(shareRankCanvas);       
        },
        drawRank: function (ctx) {
            var colWhite = '#fff2d7',
                colBrown = '#fdc100',
                colGrey = '#3d6578',
                colBrownLighter = '#dacab1',
                colBrownMiddle = '#786553',
                colBrownMiddleUp = '#8a602b';
                colBrownMiddleUper = '#462a18';

            canvasmanager.convertImageToCanvas(ctx, canvasmanager.findImgByName('g-sharerankbg', shareRankNewImgList), 0, 0);
            canvasmanager.convertImageToCanvas(ctx, canvasmanager.findImgByName('g-sharerankpink',shareRankNewImgList),122,306);
            canvasmanager.convertImageToCanvas(ctx, canvasmanager.findImgByName('g-sharerankgreen',shareRankNewImgList),122,460);

            //draw head info
            console.dir(shareRankNewImgList)
            canvasmanager.scaleAndClipImageToRound(ctx,canvasmanager.findImgByName('userHeadPortrait',shareRankNewImgList),320,67,58);
            canvasmanager.canvasWordSet(ctx,'43px jdyt',colBrownMiddleUper,userName,375,223,'','center');

            //draw foot
            canvasmanager.drawRoundRect(ctx,33,1055,695,261,30,colWhite,colGrey,6);
            canvasmanager.convertImageToCanvas(ctx,canvasmanager.findImgByName('g-download',shareRankNewImgList),518,1099);
            canvasmanager.drawRoundRect(ctx,60,1231,435,4,2,colBrownLighter,colBrownLighter,2);
            canvasmanager.convertImageToCanvas(ctx,canvasmanager.findImgByName('g-up',shareRankNewImgList),198,1142);
            canvasmanager.convertImageToCanvas(ctx,canvasmanager.findImgByName('g-down',shareRankNewImgList),318,1160);
            canvasmanager.canvasWordSet(ctx,'28px jdyt',colBrownMiddle,'健康日记，为你量身定制健康日程',60,1251);
            canvasmanager.canvasWordSet(ctx,'28px jdyt',colBrownMiddle,'在',164,1145);
            canvasmanager.canvasWordSet(ctx,'28px jdyt',colBrownMiddle,'健康日记',208,1145);
            canvasmanager.canvasWordSet(ctx,'28px jdyt',colBrownMiddle,'中',333,1145);
            canvasmanager.canvasWordSet(ctx,'28px jdyt',colBrownMiddle,'健康排名',164,1185);
            canvasmanager.scaleAndClipImageToRound(ctx,canvasmanager.findImgByName('userHeadPortrait',shareRankNewImgList),59,1091,40);
            canvasmanager.canvasWordSet(ctx,'23px jdyt',colBrownMiddleUper,userName,164,1100);

            //canvasmanager.initAjaxLoadInfo('app/rank/rankingList',{userToken:window.dataManager.getLocalStorageData('userToken'),taskDate:(new Date()).getTime()},function(){shareRank.drawGrade(arguments[0]);});
            canvasmanager.initMultiAjaxLoadInfo([
                {
                    url:'../data/rankingList.json',
                    param:{userToken:'aaa',rankType:0},

                },{
                    url:'../data/rankingList2.json',
                    param:{userToken:'bbb',rankType:1},
                }],
                function(){shareRank.drawGrade(arguments[0]);}
            );
        }
    };
    shareRank.init();
    return shareRank;
})
