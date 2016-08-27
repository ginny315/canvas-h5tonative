/**
 * Created by guoningyan on 16/8/22.
 */
define(['zepto','dataManager','host', 'H5ToNative','CanvasManager'],function($,dataManager,host, H5ToNative,CanvasManager){
    var h5tonative = H5ToNative.h5tonative,
        canvasmanager = CanvasManager.CanvasManager,
        datamanager = dataManager;
    var shareRankList = [], shareRankNewImgList = [];
    var shareRankCanvas = canvasmanager.InitialCanvas(750, 1334, 'shareRankCanvas');
    var ctx = shareRankCanvas.getContext("2d");
    /**
     *  删除2行
     */
    var userHeadPortrait = '../../resource/others/imgDefault.jpg';
    var userName = 'ginny';
    //var userHeadPortrait = dataManager.userHeadPortrait || '../../resource/others/imgDefault.jpg';
    //var userName = dataManager.userName || '';

    window.onerror = function (e) {console.log(e)}
    var shareRank = {
        init: function () {
            shareRankList.push({src: '../../resource/others/g-sharerankbg.png', name: 'g-sharerankbg'});
            shareRankList.push({src:'../../resource/others/g-sharerankpink.png',name:'g-sharerankpink'});
            shareRankList.push({src:'../../resource/others/g-headporaitbg.png',name:'g-headporaitbg.png'});
            shareRankList.push({src:'../../resource/others/g-sharerankgreen.png',name:'g-sharerankgreen'});
            shareRankList.push({src:'../../resource/others/g-up.png',name:'g-up'});
            shareRankList.push({src:'../../resource/others/g-down.png',name:'g-down'});
            shareRankList.push({src:'../../resource/others/g-download.png',name:'g-download'});
            shareRankList.push({'src':userHeadPortrait,name:userHeadPortrait});


            var list = batchProcessingImgs(ctx);

            function batchProcessingImgs(ctx) {
                $.each(shareRankList,function(index,item){
                    var img = canvasmanager.createNewImg(item)
                    img.onload = function () {
                        shareRankNewImgList.push(img);
                        if (shareRankList.length == list.length){
                            shareRank.drawRank(ctx);//eg:draw(ctx)
                        }
                    }
            })
                return shareRankNewImgList;
            };
        },
        drawGrade:function (data) {
            console.log('draw grade data');
            console.dir(data)
        },
        drawRank: function (ctx) {
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
                colBrownMiddleUp = '#8a602b',
                colBrownMiddleUper = '#462a18';

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
            canvasmanager.convertImageToCanvas(ctx, canvasmanager.findImgByName('g-sharerankbg', shareRankNewImgList), 0, 0);
            canvasmanager.convertImageToCanvas(ctx, canvasmanager.findImgByName('g-sharerankpink',shareRankNewImgList),122,306);
            canvasmanager.convertImageToCanvas(ctx, canvasmanager.findImgByName('g-sharerankgreen',shareRankNewImgList),122,460);
            //canvasmanager.convertImageToCanvas(ctx, canvasmanager.findImgByName('g-headporaitbg',shareRankNewImgList),304,47);

            //draw head info
            canvasmanager.scaleAndClipImageToRound(ctx,canvasmanager.findImgByName(userHeadPortrait,shareRankNewImgList),320,67,58);
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
            canvasmanager.scaleAndClipImageToRound(ctx,canvasmanager.findImgByName(userHeadPortrait,shareRankNewImgList),59,1091,40);
            canvasmanager.canvasWordSet(ctx,'23px jdyt',colBrownMiddleUper,userName,164,1100);

            //canvasmanager.initAjaxLoadInfo('app/rank/rankingList',{userToken:window.dataManager.getLocalStorageData('userToken'),taskDate:(new Date()).getTime()},function(){canvasmanager.convertCanvasToData(shareRankCanvas);});
            canvasmanager.initAjaxLoadInfo([
                {
                    url:'http://jkm.test.111.com.cn:9081/api/app/rank/rankingList',
                    params:{userToken:'38_62ce362ca45134963d3d788fa3ae7aed_yzjk',rankType:0},

                },{
                    url:'http://jkm.test.111.com.cn:9081/api/app/rank/rankingList',
                    params:{userToken:'38_62ce362ca45134963d3d788fa3ae7aed_yzjk',rankType:1},
                }],
                function(){shareRank.drawGrade(arguments[0]);canvasmanager.convertCanvasToData(shareRankCanvas)});
        },
    }
        shareRank.init();
        //return shareRank;

});