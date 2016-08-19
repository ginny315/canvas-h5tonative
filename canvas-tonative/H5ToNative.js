define([],function(){
	var h5tonative =
	{
		getAllCookie:function()
		{
			return unescape(document.cookie);
		},
		getCookie:function(sMainName,sSubName)
		{
			return document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"))==null ? null : decodeURIComponent(RegExp.$2);
		},
		getUserAgent:function(){return navigator.userAgent;},
		platform:
		{
			isandroid:function(){return h5tonative.getUserAgent().indexOf("ossnameandroid")>0;},
			isios:function(){return h5tonative.getUserAgent().indexOf("ossnameios")>0;},
			isiosWK:function(){return h5tonative.getUserAgent().indexOf("ossnameiosWK")>0;},
			isother:function(){return h5tonative.getUserAgent().indexOf("ossnameandroid")< 0 && h5tonative.getUserAgent().indexOf("ossnameios")<0;}
		},
		getUserToken:function(){return h5tonative.getCookie("usertoken","");},
		//url:h5 to native协议地址,必须以/结尾,如:ossname://home/,ossname://shake/
		//iostype 针对ios调用，默认0为fun调用，1为路由调用
		goToNative:function(url,param,iostype)
		{
			if (h5tonative.platform.isother()) return;
			if (h5tonative.platform.isiosWK()){
				param = JSON.parse(param);
				window.webkit.messageHandlers.ossname.postMessage({url:url,param:param});
			}else{
				window.ossname.enterNativeWithData(url,param);
			}
		},
	};
	return {
		h5tonative : h5tonative
	};
});