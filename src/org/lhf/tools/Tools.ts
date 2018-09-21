/**
 * 工具
 * @author liaohengfan@yeah.net
 * 2018.08.06
 */
class Tools{

    /**
     * 设置cookie
     * @param name
     * @param value
     */
    static setCookies (name:string, value:string):void{
        let today = new Date().getTime();
        let endDay = new Date(today + 8 * 60 * 60 *1000);
        let cookieStr = name + '=' + value + ';' + endDay + ';' ;
        document.cookie = cookieStr;
    }

    /**
     * 获取cookie
     * @param name cookie names
     */
    static getCookies(cName:string):string{
        if(document.cookie.length > 0){
            let cStart:number = document.cookie.indexOf(cName + '=');
            if(cStart !== -1){
                cStart = cStart + cName.length + 1;
                let cEend:number = document.cookie.indexOf(';',cStart);
                if(cEend ===-1){
                    cEend = document.cookie.length;
                }
                return unescape(document.cookie.substring(cStart, cEend));
            }
        }
        return '';
    }

    /**
     * 获取纯净的url
     */
    static getPureURL(href:string):string{
        let splits:string[]=href.split('?');
        let url:string=splits[0];
        return url;
    }

    /**
     * 获取请求参数
     * @param name
     */
    static getQueryString(name:string) {
        let reg:RegExp = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        if(window.location.search.split("?").length>1){
            let r = window.location.search.split("?")[1].match(reg);
            if(r != null){
                return unescape(r[2]);
            }
            return null;
        }else {
            return null;
        }
    }

    /**
     * 拼接请求参数
     * @param url
     * @param param
     */
    static addQueryString(param:any){
        let urlLink:string = '';
        for(let item in param){
            let link = '&' + item + "=" + encodeURIComponent(param[item]);
            urlLink += link;
        }
        urlLink = urlLink.substr(1);
        return urlLink.replace(' ', '');
    }

    /**
     * 获取所有请求参数
     */
    static parseQueryString(url:string):any{
        let result:any = {};
        if (url.indexOf('?') > -1) {
            let str:string = url.split('?')[1];
            let temp:string[] = str.split('&');
            for (let i = 0; i < temp.length; i++) {
                let temp2 = temp[i].split('=');
                result[temp2[0]] = temp2[1];
            }
        }
        return result;
    }

    /**
     * 获取时间对象
     * @param datetime
     */
    static getTimeObject(datetime:Date):any{
        let result:any = {};
        result.year = datetime.getFullYear();
        result.month = datetime.getMonth()+1<10 ? '0' + (datetime.getMonth()+1) : datetime.getMonth()+1;
        result.day = datetime.getDate() <10 ? '0' + datetime.getDate() : datetime.getDate();
        result.hour = datetime.getHours() <10 ? '0' + datetime.getHours() : datetime.getHours();
        result.minute= datetime.getMinutes() <10 ? '0' + datetime.getMinutes() : datetime.getMinutes();
        result.second= datetime.getSeconds() <10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
        return result;
    }

    /**
     * 时间转 yy-mm-dd
     * @param obj
     */
    static formatDate(obj:any):string{
        let date:Date =  new Date(obj);
        let y = date.getFullYear();
        let m = "0"+(date.getMonth()+1);
        let d = "0"+date.getDate();
        return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
    }

    /**
     * 时间转 yy-mm-dd hh-mm-ss
     * @param inputTime
     */
    static formatDateTime(inputTime:any):string{
        let date:Date = new Date(inputTime);
        let y:number|string = date.getFullYear();
        let m:number|string = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d:number|string = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h:number|string = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute:number|string = date.getMinutes();
        let second:number|string = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
    }

    /**
     * 秒转时间
     * @param s
     */
    static secToTime(s:number):string{
        let t:number|string="";
        if(s > -1){
            let hour:number|string = Math.floor(s/3600);
            let min:number|string = Math.floor(s/60) % 60;
            let sec:number|string = s % 60;
            if(hour<1){

            }else if(hour < 10) {
                t = '0'+ hour + ":";
            } else {
                t = hour + ":";
            }

            if(min < 10){t += "0";}
            t += min + ":";
            if(sec < 10){t += "0";}
            t += sec.toFixed(0);
        }
        return t;
    }

    /**
     * 时间转秒
     * @param time
     */
    static timeToSec(time:string):number{
        let s:any = '';
        let hour:any = time.split(':')[0];
        let min:any = time.split(':')[1];
        let sec:any = time.split(':')[2];
        s = Number(hour*3600) + Number(min*60) + Number(sec);
        return s;
    }


    /**     * 获取用户设备信息     */
    static detectOS():string{
        let sUserAgent:string=navigator.userAgent;
        let isWin:boolean = (navigator.platform == "Win32") || (navigator.platform == "Windows");

        let isMac:boolean = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac) return "Mac";

        let isiPhone:boolean=(navigator.platform == "iPhone");
        if(isiPhone) return 'iPhone';

        let bIsIpad:boolean = (String(sUserAgent.match(/ipad/i)) == "ipad");
        if (bIsIpad) return "iPad";

        let isUnix = (navigator.platform == "X11") && !isWin && !isMac;
        if (isUnix) return "Unix";

        let isLinux:boolean = (String(navigator.platform).indexOf("Linux") > -1);
        let bIsAndroid:boolean = String(sUserAgent.toLowerCase().match(/android/i)) == "android";
        if (isLinux) {
            if(bIsAndroid) return "Android";
            else return "Linux";
        }

        let bIsCE:boolean = String(sUserAgent.match(/windows ce/i)) == "windows ce";
        if (bIsCE) return "WinCE";

        let bIsWM:boolean = String(sUserAgent.match(/windows mobile/i)) == "windows mobile";
        if (bIsWM) return "WinMobile";

        if (isWin) {
            let isWin2K:boolean = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
            if (isWin2K) return "Win2000";

            let isWinXP:boolean = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
            if (isWinXP) return "WinXP";

            let isWin2003:boolean = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
            if (isWin2003) return "Win2003";

            let isWinVista:boolean= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
            if (isWinVista) return "WinVista";

            let isWin7:boolean = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            if (isWin7) return "Win7";

            let isWin8:boolean = sUserAgent.indexOf("Windows NT 6.2") > -1 || sUserAgent.indexOf("Windows 8") > -1;
            if (isWin8) return "Win8";

            let isWin10:boolean = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 8") > -1;
            if (isWin10) return "Win10";
        }

        return "Unknow";
    }

    /**     * 获取用户浏览器     */
    static getBrowser():string{
        return navigator.appName;
    }

    /**     * 创建唯一标识     */
    static genID():string {
        let crc:string='';
        let bin:string='';
        let canvasSup:boolean=Tools.canvasSupport();
        if(canvasSup) {
            let canvas: HTMLCanvasElement = document.createElement('canvas');
            let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
            let txt = 'http://www.skcg.cn';
            ctx.textBaseline = 'top';
            ctx.font = "14px 'Arial'";
            ctx.fillStyle = '#0ff';
            ctx.fillRect(0, 0, 140, 50);
            ctx.fillStyle = '#00f';
            ctx.fillText(txt, 2, 15);
            ctx.fillStyle = 'rgba(102,204,0,0.7)';
            ctx.fillText(txt, 4, 17);

            let b64: string = canvas.toDataURL().replace('data:image/png;base64,', '');
            bin = atob(b64);
        }else{
            bin=Number(Math.random().toString().substr(3,30) + Date.now()).toString(36);
        }
        crc=Tools.bin2hex(bin.slice(-16,-12));
        return crc;
    }

    /**     * 获取十六进制     */
    static bin2hex(bin:string):string{
        let i:number=0;
        let l:number=bin.length;
        let chr:string;
        let hex:string='';
        for (i; i < l; ++i){
            chr=bin.charCodeAt(i).toString(16);
            hex+=chr.length<2 ? '0'+chr : chr;
        }
        return hex;
    }

    /**     * 微信jssdk支持     */
    static checkWechatSDK():boolean{
        const WINDOW:any=window;
        if(WINDOW.wx){
            return true;
        }
        return false;
    }

    /**     * 是否支持canvas     */
    static canvasSupport():boolean{
        return !document.createElement('canvas').getContext('2d');
    }

    /**     * 生成唯一id     */
    static createUserID(){
        return Date.now()+'_'+this.genID();
    }


}
export {Tools};