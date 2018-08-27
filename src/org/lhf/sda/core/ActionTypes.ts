/**
 * 用户行为类型分类
 * @author liaohengfan@yeah.net
 * 2018.08.16
 */
class ActionTypes{

    /**     * 分享-微信朋友圈     */
    static readonly SHARE_WECHAT_CIRCLE:string='ShareWeChatCircle';

    /**     * 分享-微信消息     */
    static readonly SHARE_WECHAT_MSG:string='ShareWeChatMessage';

    /**     * 分享-QQ消息     */
    static readonly SHARE_QQ_MSG:string='ShareQQMessage';

    /**     * 分享-腾讯微博消息     */
    static readonly SHARE_TXWB_MSG:string='ShareWeiBoMessage';

    /**     * 用户浏览进度     */
    static readonly READ_PROGRESS:string='ReadProgress';

    /**     * 行为成功     */
    static readonly ACTION_SUCCESS:string="ActionSuccess";

    /**     * 行为取消     */
    static readonly ACTION_CANCEL:string="ActionCancel";

    /**     * 行为失败     */
    static readonly ACTION_FAIL:string="ActionFail";

}
export {ActionTypes}