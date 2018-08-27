/**
 * 用户信息统计
 * @liaohengfan@yeah.net
 * 2018.08.08
 */
import {IDataAnalysisInfo} from "./IDataAnalysisInfo";
import {log} from "../core/Log";
import {PLATFORM, platform} from "../core/BrowserMana";
import {Config} from "../core/Config";
import {Tools} from "../../tools/Tools";

class UserStatis {
    info: IDataAnalysisInfo;
    userStayxmlhttp:XMLHttpRequest;

    /**
     * 上报用户行为
     */
    postAction(target:string,action:string){
        let xml_http:XMLHttpRequest = new XMLHttpRequest();

        /**         * 拼凑请求数据         */
        let requsetObject:any={};
        requsetObject[Config.REQ_PROJECT_ID]=Config.PROJECT_ID;
        requsetObject[Config.REQ_TARGET]=target;
        requsetObject[Config.REQ_ACTION]=action;
        requsetObject.user_id=this.info.user_id;
        requsetObject.share_from=this.info.share_from;
        let requestStr:string=Tools.addQueryString(requsetObject);

        //上报数据
        xml_http.open("POST",Config.SERVER_URL+Config.POS_USER_ACTION,true);
        xml_http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xml_http.send(requestStr);
    }

    constructor() {
        this.init();
    }

    private init() {
        this.info = {
            project_id: '',
            user_id: '',
            page_from: '',
            now_url:'',
            devices:'',
            share_from: '',
            ip: '',
            inner_ip: '',
            platform: '',
            language: '',
            cookie: '',
            time: 0,
            init_time: 0,
            startTime: 0,
            endTime: 0
        };

        //获取项目id
        this.info.project_id=Config.PROJECT_ID;

        //获取设备信息
        this.info.devices = Tools.detectOS();

        //平台信息
        this.info.platform=platform;

        //微博平台判断
        if(this.info.platform==PLATFORM.WEI_BO){

            //不包含平台信息
            if(Tools.getQueryString('platform')!=PLATFORM.WEI_BO){
                let quers:any=Tools.parseQueryString(window.location.href);
                quers.platform=PLATFORM.WEI_BO;//在连接中添加微博信息
                let newUrl:string=Tools.getPureURL(window.location.href)+'?'+Tools.addQueryString(quers);

                //刷新地址
                window.location.href=newUrl;
            }
        }

        //获取用户标识
        this.info.user_id = Tools.getCookies('user_id') || Tools.createUserID();
        Tools.setCookies('user_id', this.info.user_id);

        //获取用户第一次的访问时间
        this.info.init_time = Tools.getCookies('init_time') || Tools.formatDateTime(Date.now());
        Tools.setCookies('init_time', String(this.info.init_time));

        //初始此次开始访问时间
        this.info.startTime = Tools.formatDateTime(Date.now());

        //用户的语言
        this.info.language = navigator.language;

        //来源页面
        this.info.page_from = document.referrer;

        //当前页面地址
        this.info.now_url=window.location.href;

        //获取分享来自哪个用户
        this.info.share_from = Tools.getQueryString(Config.SHARE_SOURCE_NAME) || '';
        log('info',JSON.stringify(this.info));

        /**         * 提交用户信息         */
        this.postUserDetails();

        /**         * 初始化用户停留处理         */
        this.initUserStay();
    }

    /**
     * 用户停留时长
     */
    private initUserStay():void{
        this.userStayxmlhttp=new XMLHttpRequest();
        /**         * 请求配置文件         */
        this.userStayxmlhttp.onreadystatechange=()=>{
        };

        /**         * 定时刷新并上报用户停留时间         */
        setInterval(this.statisEndTime, 10000);
    }

    /**     * 上报用户停留时长度     */
    private postUserStayTime():void{
        let userStayTime:any={
            project_id:this.info.project_id,
            user_id:this.info.user_id,
            startTime:this.info.startTime,
            endTime:this.info.endTime
        };

        let requestURL:string=Config.SERVER_URL+Config.POS_USER_STAY;
        let requestStr:string=Tools.addQueryString(userStayTime);
        this.userStayxmlhttp.open('POST',requestURL,true);
        this.userStayxmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        this.userStayxmlhttp.send(requestStr);
    }


    /**
     * 上报用户详细信息
     */
    private postUserDetails():void{
        let requestURL:string=Config.SERVER_URL+Config.POS_USER_DETAILS;
        let requestStr:string=Tools.addQueryString(this.info);
        var xmlhttp:XMLHttpRequest=new XMLHttpRequest();
        /**         * 请求配置文件         */
        xmlhttp.onreadystatechange=()=>{

        };
        xmlhttp.open('POST',requestURL,true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send(requestStr);
    }

    /**     * 刷新用户的停留时长     */
    private statisEndTime = () => {
        this.info.endTime = Tools.formatDateTime(Date.now());
        this.postUserStayTime();
        //log('info',JSON.stringify(this.info));
    }
}
let userStatis:UserStatis=new UserStatis();
export {userStatis,UserStatis};