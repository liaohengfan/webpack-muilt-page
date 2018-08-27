/**
 * meta解析
 * @author liaohengfan@yeah.net
 * 2018.08.10
 */
class MetaParseMana{
    static _instance:MetaParseMana=null;
    static getInstance():MetaParseMana{
        if(!MetaParseMana._instance){
            new MetaParseMana();
        }
        return MetaParseMana._instance;
    }

    metas:NodeListOf<HTMLMetaElement>;

    constructor() {
        if(MetaParseMana._instance){
            throw new Error("mete管理为单例模式！");
        }
        MetaParseMana._instance=this;
        this.init();
    }

    private init():void{
        this.metas = document.getElementsByTagName('meta');
    }

    public getMeta(name:string):HTMLMetaElement{
        let i:number=0;
        let l:number=this.metas.length;
        for (i; i < l; i++) {
            if (this.metas[i].getAttribute('name') == name) {
                return this.metas[i];
            }
        }
        return null;
    }
}
export {MetaParseMana}