/**
 * 观察者
 * @author liaohengfan@yeah.net
 * 2018.08.16
 */
import {LHFEventDispatcher} from "../../core/LHFEventDispatcher";

class Observer extends LHFEventDispatcher{
    static _instance:Observer=null;
    static getInstance():Observer{
        if(!this._instance){
            new Observer();
        }
        return this._instance;
    }
    constructor() {
        super();
        if(Observer._instance){
            throw new Error("数据分析观察者为单例!");
        }
        Observer._instance=this;
    }
}
const observer:Observer=Observer.getInstance();
export {observer};