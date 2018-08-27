interface IDataAnalysisInfo {

    /**     * 项目id     */
    project_id:string;

    /**     * 用户唯一标识     */
    user_id:string;

    /**     * 父级页面     */
    page_from:string;

    /**     * 当前页面地址     */
    now_url:string;

    /**     *分享来自谁     */
    share_from:string;

    /**     * ip地址     */
    ip:string;

    /**     * 内网ip     */
    inner_ip:string;

    /**     * 位置     */
    coord?:ICoordinates;

    /**     * 平台     */
    devices:string;

    /**     * 渠道来源     */
    platform:string;

    /**     * 语言     */
    language:string;

    /**     * cookie数据     */
    cookie:any;

    /**     * time时间     */
    time:string|number;

    /**     * 用户初次访问时间     */
    init_time:string|number;

    /**     * 开始时间     */
    startTime:string|number;

    /**     * 结束时间     */
    endTime:string|number;

}

interface ICoordinates {

    /**     * 纬度     */
    lat:number;

    /**     * 经度     */
    lon:number;

    /**     * 海拔     */
    altitude:number;

    /**     * 精度     */
    accuracy:number;

    /**     * 位置     */
    address:string;
}

interface IDate {
    year?:number|string;
    month?:number|string;
    day?:number|string;
    hour?:number|string;
    minute?:number|string;
    second?:number|string;
}


export {IDataAnalysisInfo,ICoordinates,IDate};