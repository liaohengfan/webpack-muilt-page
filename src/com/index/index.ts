import '../../styles/common.scss';
import '../../styles/index.scss';
class Person{
    sayHello():void{
        console.log('Person say hello');
    }
}

let person:Person=new Person();
person.sayHello();
