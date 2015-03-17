export class Property {
  constructor(){
  	this.formType = 'text';
  }
  static create(data){
    if(typeof data === 'string'){
      data = {name: data};
    }
    var property = new Property();
    for(var key in data){
    	property[key] = data[key];
    }
    if(property.name.indexOf('.') !== -1){
    	property.formType = 'navigation';
    }
    if(property.name == 'picture'){
    	property.formType = 'image';
    }
    return property;
  }
}