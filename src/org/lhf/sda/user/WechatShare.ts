/**
 * 微信分享部分
 * @liaohengfan@yeah.net
 * 2018.08.09
 */
import {Config} from "../core/Config";
import {log} from "../core/Log";
import {MetaParseMana} from "../core/MetaParseMana";
import {observer} from "../core/Observer";
import {SpaceDAEvents} from "../core/SpaceDAEvents";
import {ActionTypes} from "../core/ActionTypes";
import {userStatis} from "./UserStatis";
import {Tools} from "../../tools/Tools";
declare let wx:any;

class WeChatShare {
    injectionInterval:number=-1;
    injection:boolean=true;
    constructor() {
        if(!Tools.checkWechatSDK()){
            console.warn('没有微信jssdk!!!');
            /**             * 注入jssdk             */
            this.injectionWechatSDK();
        }else{
            this.init();
        }
    }

    /**     * 请求微信分享配置     */
    private requestWeChatIni() {

        const RES_URL:string=Config.SERVER_URL+Config.WE_CHAT_INI;
        var xmlhttp:XMLHttpRequest=new XMLHttpRequest();
        /**         * 请求配置文件         */
        xmlhttp.onreadystatechange=()=>{
            if(xmlhttp.readyState==4&&xmlhttp.status==200){

                //解析微信分享配置
                let resData:any=JSON.parse(xmlhttp.responseText);

                if(resData.acc_url!=''){
                    window.location.href=resData.acc_url;
                    return;
                }

                let weIni:IWeChatIni={
                    //debug:true,
                    appId:resData.appId,
                    timestamp:resData.timestamp||'',
                    nonceStr:resData.nonceStr||'',
                    signature:resData.signature||'',
                    jsApiList:[
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'scanQRCode'
                    ]
                };

                //激活微信分享配置
                this.activeWeChatShareIni(weIni);
            }
        };

        //url
        let requestParamse:string='?url='+encodeURIComponent(location.href);

        //用户id
        requestParamse+='&user_id='+userStatis.info.user_id;

        //项目id
        if(Config.PROJECT_ID){
            requestParamse+='&'+Config.REQ_PROJECT_ID+'='+encodeURIComponent(Config.PROJECT_ID);
        }

        xmlhttp.open('GET',RES_URL+requestParamse,true);
        xmlhttp.send();
    }

    /**     * 激活微信分享配置     */
    private activeWeChatShareIni(ini:IWeChatIni):void{

        log("激活微信分享配置");
        wx.config(ini);
        wx.ready(this.wxReadyHandler);
        wx.error((res:any)=>{
           log('wechat config error:',res);
        });
    }

    /**     * 微信jssdk准备完成     */
    wxReadyHandler=()=>{
        log("微信jssdk准备完成!");

        /**         * 消息分享设置-- 一对一分享         */
        const SHARE_META_MSG:HTMLMetaElement=MetaParseMana.getInstance().getMeta(Config.WX_META_SHARE_MSG);

        /**         * 微信朋友圈分享         */
        const SHARE_META_CIRCLE:HTMLMetaElement=MetaParseMana.getInstance().getMeta(Config.WX_META_SHARE_CIRCLE);

        /**         * 当前连接地址         */
        const LINK:string=window.location.href;

        /**         * 当前title         */
        const TITLE:string=document.title;

        /**         * 默认图标         */
        const SHARE_ICON:string='http://'+window.location.host+'/assets/share.jpg';

        /**         * 消息分享的连接         */
        let share_msg_link_ori:string=SHARE_META_MSG.dataset.link||LINK;
        let requestParams:any=Tools.parseQueryString(share_msg_link_ori);
        let share_msg_link_pure:string=Tools.getPureURL(share_msg_link_ori);
        requestParams[Config.SHARE_SOURCE_NAME]=userStatis.info.user_id;//添加来源用户

        /***         * 最终消息分享的连接         */
        const SHARE_MSG_LINK:string=share_msg_link_pure+'?'+Tools.addQueryString(requestParams);

        /**         * 消息分享的连接         */
        let share_circle_link_ori:string=SHARE_META_CIRCLE.dataset.link||LINK;
        let c_requestParams:any=Tools.parseQueryString(share_circle_link_ori);
        let c_share_msg_link_pure:string=Tools.getPureURL(share_circle_link_ori);
        c_requestParams[Config.SHARE_SOURCE_NAME]=userStatis.info.user_id;//添加来源用户

        /***         * 最终消息分享的连接         */
        const SHARE_CIRCLE_LINK:string=c_share_msg_link_pure+'?'+Tools.addQueryString(c_requestParams);

        /**         * 分享给好友         */
        wx.onMenuShareAppMessage({
            title: SHARE_META_MSG.dataset.title || TITLE,

            // 分享标题
            desc: SHARE_META_MSG.dataset.desc || TITLE,

            link: SHARE_MSG_LINK, // 分享链接
            imgUrl: SHARE_META_MSG.dataset.image || SHARE_ICON,
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function (data:any) {
                userStatis.postAction(ActionTypes.SHARE_WECHAT_MSG,ActionTypes.ACTION_SUCCESS);
                observer.dispatchEvent({type:SpaceDAEvents.WE_SHARE_MSG_SUCCESS,data:data});
            },
            cancel: function (data:any) {
                userStatis.postAction(ActionTypes.SHARE_WECHAT_MSG,ActionTypes.ACTION_CANCEL);
                observer.dispatchEvent({type:SpaceDAEvents.WE_SHARE_MSG_CANCEL,data:data});
            }
        });

        /**         * 分享到朋友圈         */
        wx.onMenuShareTimeline({
            title: SHARE_META_CIRCLE.dataset.title || TITLE,//分享标题
            link: SHARE_CIRCLE_LINK, // 分享链接
            imgUrl: SHARE_META_CIRCLE.dataset.image || SHARE_ICON,// 分享图标

            success: function (data:any) {
                userStatis.postAction(ActionTypes.SHARE_WECHAT_CIRCLE,ActionTypes.ACTION_SUCCESS);
                observer.dispatchEvent({type:SpaceDAEvents.WE_SHARE_CIRCLE_SUCCESS,data:data});
            },
            cancel: function (data:any) {
                userStatis.postAction(ActionTypes.SHARE_WECHAT_CIRCLE,ActionTypes.ACTION_CANCEL);
                observer.dispatchEvent({type:SpaceDAEvents.WE_SHARE_CIRCLE_CANCEL,data:data});
            }
        });

        //分享到QQ
        wx.onMenuShareQQ({
            title: SHARE_META_MSG.dataset.title || TITLE,

            // 分享标题
            desc: SHARE_META_MSG.dataset.desc || TITLE,

            link: SHARE_MSG_LINK, // 分享链接
            imgUrl: SHARE_META_MSG.dataset.image || SHARE_ICON,
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function (data:any) {
                userStatis.postAction(ActionTypes.SHARE_QQ_MSG,ActionTypes.ACTION_SUCCESS);
                observer.dispatchEvent({type:SpaceDAEvents.WE_SHARE_QQ_SUCCESS,data:data});
            },
            cancel: function (data:any) {
                userStatis.postAction(ActionTypes.SHARE_QQ_MSG,ActionTypes.ACTION_CANCEL);
                observer.dispatchEvent({type:SpaceDAEvents.WE_SHARE_QQ_CANCEL,data:data});
            }
        });

        //分享到腾讯微博
        wx.onMenuShareWeibo({
            title: SHARE_META_MSG.dataset.title || TITLE,

            // 分享标题
            desc: SHARE_META_MSG.dataset.desc || TITLE,

            link: SHARE_MSG_LINK, // 分享链接
            imgUrl: SHARE_META_MSG.dataset.image || SHARE_ICON,
            success: function (data:any) {
                userStatis.postAction(ActionTypes.SHARE_TXWB_MSG,ActionTypes.ACTION_SUCCESS);
                observer.dispatchEvent({type:SpaceDAEvents.WE_SHARE_TXWB_SUCCESS,data:data});
            },
            cancel: function (data:any) {
                userStatis.postAction(ActionTypes.SHARE_TXWB_MSG,ActionTypes.ACTION_CANCEL);
                observer.dispatchEvent({type:SpaceDAEvents.WE_SHARE_TXWB_CANCEL,data:data});
            }
        });

    };


    /**     * 初始化微信分享     */
    private init():void{
        log("init wechat share");

        //不需要注入
        this.injection=false;
        clearInterval(this.injectionInterval);

        //请求微信分享配置
        this.requestWeChatIni();
    }

    /**     * 注入js sdk     */
    private injectionWechatSDK() {
        let scriptElement:HTMLScriptElement=document.createElement('script');
        scriptElement.src=Config.SERVER_URL+Config.WX_JSSDK_URL;
        document.head.appendChild(scriptElement);

        /**         * 注入状态判断         */
        this.injectionInterval=setInterval(this.injectionJudage,Config.DEFAULT_DELAY_TIME);
    }

    /**     * js sdk注入判断     */
    private injectionJudage=()=>{
        log("微信jssdk 注入情况判断!");
        if(Tools.checkWechatSDK()){
            this.init();
        }
    };
}

interface IWeChatIni {
    debug?:boolean;
    appId:string;
    timestamp:string;
    nonceStr:string;
    signature:string;
    jsApiList:string[];
}
export {WeChatShare}