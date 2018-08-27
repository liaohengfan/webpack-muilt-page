/**
 * 环境判断
 */
const browser: any = {
    versions: function () {
        const u: string = navigator.userAgent;
        console.log('userAgent:',u);
        return {
            trident: u.indexOf('Trident') > -1,//IE内核
            presto: u.indexOf('Presto') > -1,//opera内核
            webKit: u.indexOf('AppleWebKit') > -1,//苹果谷歌
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
            //mobile: !!u.match('/(AppleWebKit.*)(Mobile.*)/'),
            mobile: (/(iPhone|iPad|iPod|iOS|Android)/i.test(u)),
            ios: !!u.match(/\(i[^;]+;(U;)? CPU.+Mac OS X/),//ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,//安卓或者uc
            iPhone: u.indexOf('iPhone') > -1,//是否为iPhone
            iPad: u.indexOf('iPad') > -1,//是否为iPad
            webApp: u.indexOf('Safari') == -1//是否web应用程序,
        }
    }(),
    language: (navigator.language).toLowerCase()
};

/** * 平台 */
enum PLATFORM {
    WECHAT="WeChat",
    WEI_BO="WeiBo",
    QQ="QQ",
    IOS="IOS",
    ANDROID="Android",
    PC="PC"
}

const platform:string=function(){
    if(browser.versions.mobile) {
        const u: string = navigator.userAgent.toLowerCase();
        if (String(u.match(/MicroMessenger/i)) == 'micromessenger') {
            return PLATFORM.WECHAT;
        }
        if (String(u.match(/WeiBo/i)) == 'weibo') {
            return PLATFORM.WEI_BO;
        }
        if (String(u.match(/QQ/i)) == 'qq') {
            return PLATFORM.QQ;
        }
        if (browser.versions.ios) {
            return PLATFORM.IOS;
        }
        if (browser.versions.android) {
            return PLATFORM.ANDROID;
        }
    }
    return PLATFORM.PC;
}();
export {browser,platform,PLATFORM};