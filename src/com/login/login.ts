import '../../styles/common.scss';
import '../../styles/login.scss';
console.log("Login Page");
class Login{
    constructor(){

    }
    sayHello():void{
        console.log('Login say hello');
    }
}
let login:Login=new Login();
login.sayHello();