import {Config} from "./Config";

function log(...args:any[]){

    if(!Config.debug)return;

    for(let item in arguments){
        console.log(arguments[item]);
    }

}
export {log};