import {Module} from 'framework';

class Sub2Module extends Module  {

  constructor(){
  	this.yourName = 'Dragon';
  	this.on('sub2:hi').then((name)=> {
  		alert('Hi ' + name);
  	})
  }

  sayHi(){
  	this.trigger('sub2:hi', this.yourName);
  }

}

export default Sub2Module;