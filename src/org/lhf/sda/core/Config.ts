class Config{

    /**     * 调试模式     */
    static debug: boolean=false;

    /**     * 项目id     */
    static PROJECT_ID:string='';

    /**     * 默认延迟时间     */
    static readonly DEFAULT_DELAY_TIME:number=1000;

    /**     * 服务器地址     */
    static readonly SERVER_URL:string='http://dsc.vr68.com/';

    /**     * 微信 jssdk路径     */
    static readonly WX_JSSDK_URL:string='h5/assets/js/jweixin-1.2.0.js';

    /**     * 上报行为接口     */
    static readonly POS_USER_ACTION:string="index/index/behaviorAdd";

    /**     * 用户信息上报接口     */
    static readonly POS_USER_DETAILS:string="index/index/recordAdd";

    /**     * 用户停留上报接口     */
    static readonly POS_USER_STAY:string="index/index/recordExit";

    /**     * 微信配置信息     */
    static readonly WE_CHAT_INI:string="api/index/getTicket";

    /**     * 项目id Meta     */
    static readonly PROJECT_ID_META:string='project_config';

    /**     * 微信默认分享meta     */
    static readonly WX_META_SHARE_MSG:string='wx_meta_share_msg';

    /**     * 微信朋友圈分享meta     */
    static readonly WX_META_SHARE_CIRCLE:string='wx_meta_share_circle';

    /**     * 来源用户标识     */
    static readonly SHARE_SOURCE_NAME:string='sourceName';

    /**
     * 接口参数约定
     */
    /**     * 项目id     */
    static readonly REQ_PROJECT_ID:string='projectId';
    /**     * 行为目标     */
    static readonly REQ_TARGET:string='target';
    /**     * 项目id     */
    static readonly REQ_ACTION:string='action';


}

export {Config}