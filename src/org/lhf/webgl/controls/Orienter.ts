/**
 * 横竖屏重力感应的易用组件
 * @details js 2 ts
 * @trans-author liaohengfan@yeah.net
 * @cover https://github.com/shrekshrek/orienter
 * 2018.08.23
 */
import {LHFEventDispatcher} from "../../core/LHFEventDispatcher";
import {LHFWebGLEvents} from "../events/LHFWebGLEvents";

class Orienter extends LHFEventDispatcher{
    lon:number=0;
    lat:number=0;
    direction:string|number=0;
    fix:number=0;
    os:string='';
    config:any=null;
    run:boolean=false;
    constructor() {
        super();
        this.init();
    }

    private init():void{
        this.direction=window.orientation||0;
        switch (this.direction) {
            case 0:
                this.fix = 0;
                break;
            case 90:
                this.fix = -270;
                break;
            case -90:
                this.fix = -90;
                break;
        }

        if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            this.os = 'ios';
        } else {
            this.os = (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux')) ? 'android' : '';
        }
    }

    public start():void{
        if(this.run)return;
        this.run=true;
        window.addEventListener('deviceorientation', this.orient, false);
        window.addEventListener('orientationchange', this.change, false);
    }

    public stop():void{
        this.run=false;
        window.removeEventListener('deviceorientation', this.orient, false);
        window.removeEventListener('orientationchange', this.change, false);
    }

    changeDirectionTo(direction:string|number){
        this.direction = direction;
    }

    orient=(event:DeviceOrientationEvent)=>{
        if(!this.run)return;
        switch (this.os) {
            case 'ios':
                switch (this.direction) {
                    case 0:
                        this.lon = event.alpha + event.gamma;
                        if (event.beta > 0) this.lat = event.beta - 90;
                        break;
                    case 90:
                        if (event.gamma < 0) {
                            this.lon = event.alpha - 90;
                        } else {
                            this.lon = event.alpha - 270;
                        }
                        if (event.gamma > 0) {
                            this.lat = 90 - event.gamma;
                        } else {
                            this.lat = -90 - event.gamma;
                        }
                        break;
                    case -90:
                        if (event.gamma < 0) {
                            this.lon = event.alpha - 90;
                        } else {
                            this.lon = event.alpha - 270;
                        }
                        if (event.gamma < 0) {
                            this.lat = 90 + event.gamma;
                        } else {
                            this.lat = -90 + event.gamma;
                        }
                        break;
                }
                break;
            case 'android':
                switch (this.direction) {
                    case 0:
                        this.lon = event.alpha + event.gamma + 30;
                        if (event.gamma > 90) {
                            this.lat = 90 - event.beta;
                        } else {
                            this.lat = event.beta - 90;
                        }
                        break;
                    case 90:
                        this.lon = event.alpha - 230;
                        if (event.gamma > 0) {
                            this.lat = 270 - event.gamma;
                        } else {
                            this.lat = -90 - event.gamma;
                        }
                        break;
                    case -90:
                        this.lon = event.alpha - 180;
                        this.lat = -90 + event.gamma;
                        break;
                }
                break;
        }

        this.lon += this.fix;
        this.lon %= 360;
        if (this.lon < 0) this.lon += 360;

        this.lon = Math.round(this.lon);
        this.lat = Math.round(this.lat);

        let params:IOrientChangeParams={
            alpha: Math.round(event.alpha),
            beta: Math.round(event.beta),
            gamma: Math.round(event.gamma),
            lon: this.lon,
            lat: this.lat,
            direction: this.direction
        };

        this.dispatchEvent({type:LHFWebGLEvents.ORIENT_CHANGE_EVENT,orient:params});
    };

    change=()=>{
        if(!this.run)return;
        this.direction=window.orientation;
        this.dispatchEvent({type:LHFWebGLEvents.DIRECTION_CHANGE_EVENT,direction:this.direction});
    }

}

interface IOrientChangeParams{
    alpha:number;
    beta:number;
    gamma:number;
    lon:number;
    lat:number;
    direction:string|number;
}

export {Orienter,IOrientChangeParams}