window.version = '1.0.0';
window.debug = false;
requirejs.config({
    baseUrl:'./',
    paths:{
        zepto:'./js/lib/zepto',
        await:'./js/lib/await',
        canvasManager:'./js/lib/canvasManager',
        index:'./js/main',
        host:'./host',
        common:'./js/common'
    },
    shim:{
        slider:{
            deps:['zepto']
        },
        zepto:{
            exports:'$'
        }
    },
    //urlArgs:'v='+(debug==true?version:version)
});
