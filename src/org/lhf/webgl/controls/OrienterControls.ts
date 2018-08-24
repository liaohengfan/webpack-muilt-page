import {ILHFEventType, LHFEventDispatcher} from "../../core/LHFEventDispatcher";
import {IOrientChangeParams, Orienter} from "./Orienter";
import {LHFWebGLEvents} from "../events/LHFWebGLEvents";
import {ColorKeywords, Object3D, Spherical, Vector3} from "three";
import * as THREE from 'three';
import {TweenMana} from "../../swa/tween/TweenMana";
import {Tween} from "../../swa/tween/Tween";
import lavender = ColorKeywords.lavender;

/**
 * 定向控制器   陀螺仪 加鼠标 touch拖动旋转
 * @trans-author liaohengfan@yeah.net
 * @cover https://github.com/Aimee1608/3Drotate
 * 2018.08.23
 */
class OrienterControls extends LHFEventDispatcher{

    /**     * 定向器     */
    orienter:Orienter;

    /**     * 运行状态     */
    _enabled:boolean=false;

    new_longitude:number=0;
    move_longitude:number=0;
    new_latitude:number=0;
    move_latitude:number=0;

    last_longitude:number=0;
    last_latitude:number=0;

    is_touch:boolean=false;

    lon:number=0;
    lat:number=0;

    isUserInteracting:boolean=false;
    onPointerDownLon:number= 0.0;
    onPointerDownPointerX:number = 0;//经度
    onPointerDownLat:number= 0.0;
    onPointerDownPointerY:number = 0;//纬度

    targetObject:Object3D;
    targetSpherical:Spherical;
    targetPoint:Vector3=new Vector3();
    domElement:HTMLDocument|HTMLElement;

    tween:Tween=null;

    get enabled():boolean{
        return this._enabled;
    }
    set enabled(val:boolean){
        this._enabled=val;
        if(val)this.orienter.start();
        else this.orienter.stop();
    }

    constructor(object_:Object3D,dom_:HTMLElement){
        super();
        this.targetObject=object_;
        this.domElement=dom_||document;
        this.init();
    }

    private init() {
        this.orienter= new Orienter();
        this.orienter.addEventListener(LHFWebGLEvents.ORIENT_CHANGE_EVENT,this.onOrientChangeHandler);
        this.createEventHandler();

        this.targetSpherical=new Spherical(10,0,0);
        this.tween=new Tween(this.targetSpherical);
        this.tween.onUpdate(this.updateObjectLookAt);

        this.orienter.start();
    }

    /**     * 刷新锁定     */
    private updateObjectLookAt=()=>{
        console.log('updateObjectLookAt');
        this.targetPoint.setFromSpherical(this.targetSpherical);
        this.targetObject.lookAt(this.targetPoint);
    };


    /**     * 创建事件监听     */
    private createEventHandler():void{
        this.domElement.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
        this.domElement.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
        this.domElement.addEventListener( 'mouseup', this.onDocumentMouseUp, false );

        this.domElement.addEventListener( 'touchstart', this.onDocumentTouchDown, false );
        this.domElement.addEventListener( 'touchmove', this.onDocumentTouchMove, false );
        this.domElement.addEventListener( 'touchend', this.onDocumentTouchUp, false );
    }

    onDocumentMouseDown=( event:MouseEvent )=>{
        if(!this._enabled)return;
        event.preventDefault();
        this.isUserInteracting = true;
        this.onPointerDownPointerX = event.clientX;
        this.onPointerDownPointerY = event.clientY;
        this.onPointerDownLon = this.lon;
        this.onPointerDownLat = this.lat;
    };

    onDocumentMouseMove=( event:MouseEvent )=>{
        if(!this._enabled)return;
        if(!this.isUserInteracting)return;
        this.lon = this.onPointerDownLon - ( this.onPointerDownPointerX - event.clientX ) * 0.1;
        this.lat = ( event.clientY - this.onPointerDownPointerY ) * 0.1 + this.onPointerDownLat;
        console.log('lat lon：',this.lat,'|',this.lon);
        this.lat>90?this.lat=90:this.lat;
        this.lat<=-90?this.lat=-90:this.lat;
    };
    onDocumentMouseUp=( event:MouseEvent )=>{
        if(!this._enabled)return;
        this.isUserInteracting = false;
    };

    //  touch event start
    onDocumentTouchDown=( event:TouchEvent )=> {
        if(!this._enabled)return;
        this.is_touch=true;
        event.preventDefault();
        this.isUserInteracting = true;
        this.onPointerDownPointerX = event.touches[ 0 ].clientX;
        this.onPointerDownPointerY = event.touches[ 0 ].clientY;
        this.onPointerDownLon = this.lon;
        this.onPointerDownLat = this.lat;
    };

    onDocumentTouchMove=( event:TouchEvent )=> {
        if(!this._enabled)return;
        if(!this.isUserInteracting)return;
        event.preventDefault();
        event.stopPropagation();
        this.lon = this.onPointerDownLon-( this.onPointerDownPointerX - event.touches[ 0 ].clientX ) * 0.1;
        this.lat = ( event.touches[ 0 ].clientY - this.onPointerDownPointerY ) * 0.1 + this.onPointerDownLat;
        this.lat>90?this.lat=90:this.lat;
    };
    onDocumentTouchUp=( event:TouchEvent )=> {
        this.is_touch=false;
    };

    /**     * 设备有移动旋转     */
    onOrientChangeHandler=(event:ILHFEventType)=>{
        let orientParams:IOrientChangeParams=event.orient as IOrientChangeParams;
        if(!orientParams) return;
        if(!this._enabled)return;
        this.new_longitude = orientParams.lon;
        this.move_longitude=this.new_longitude-this.last_longitude;

        //最新纬度
        this.new_latitude = orientParams.lat;
        this.move_latitude = this.new_latitude-this.last_latitude;

        //判断经纬度
        if(this.move_longitude>=300){
            this.move_longitude=this.move_longitude-361;
        }else if(this.move_longitude<=-300){
            this.move_longitude=this.move_longitude+359;
        }


        if(this.move_latitude>=300){
            this.move_latitude=this.move_latitude-361;
        }else if(this.move_latitude<=-300){
            this.move_latitude=this.move_latitude+359;
        }

        if( this.is_touch ){
            this.move_longitude=0;
            this.move_latitude=0;
        }else{
            this.move_longitude=this.move_longitude*0.6;
            this.move_latitude=this.move_latitude*0.6;
        }
        //计算得出重力感应的经纬度
        this.lon=this.lon+this.move_longitude;
        this.last_longitude = orientParams.lon;
        this.lat = this.lat+this.move_latitude;
        this.last_latitude = orientParams.lat;
    };

    update(){
        if(!this._enabled)return;
        let phi:number = THREE.Math.degToRad( 90 - this.lat );
        let theta:number = THREE.Math.degToRad( this.lon );
        this.targetSpherical.phi=phi;
        this.targetSpherical.theta=theta;
        /*this.targetPoint.x =  500 * Math.sin( phi ) * Math.cos( theta );//X轴的坐标
        this.targetPoint.y = 500 * Math.cos( phi );//y轴的坐标
        this.targetPoint.z =  500 * Math.sin( phi ) * Math.sin( theta ) ;//z轴的坐标*/
        this.tween.stop();
        this.tween.to({
            phi:phi,
            theta:theta
        },500);
        this.tween.start();
        //this.updateObjectLookAt();
    }
}

export {OrienterControls};