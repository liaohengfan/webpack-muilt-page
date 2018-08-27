/**
 * 分享
* @author liaohengfan@yeah.net
* 2018.08.02
*/
import {userStatis} from "./user/UserStatis";
import {WeChatShare} from "./user/WeChatShare";
import {Config} from "./core/Config";
import {MetaParseMana} from "./core/MetaParseMana";
import {browser, platform} from "./core/BrowserMana";
import {log} from "./core/Log";

export * from './user/IDataAnalysisInfo';
export * from '../tools/Tools';
export * from './core/Config';
export * from './core/Observer';
export * from './core/SpaceDAEvents';
export * from './core/ActionTypes';
export {platform,browser} from "./core/BrowserMana";
export {userStatis} from "./user/UserStatis";

Config.debug=true;
MetaParseMana.getInstance();
let projectConfigMeta:HTMLMetaElement=MetaParseMana.getInstance().getMeta(Config.PROJECT_ID_META);
if(projectConfigMeta){
    Config.PROJECT_ID = projectConfigMeta.dataset.id;
}else{
    Config.PROJECT_ID='unknown';
}

let wshare:WeChatShare=new WeChatShare();//微信分享配置

log('window:',window);