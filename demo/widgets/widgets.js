import {Module} from 'framework';

class Color {
	constructor(name){
		this.name = name;
	}
}

class WidgetsModule extends Module  {

  constructor(){
    this.colors = [
      new Color('Red'),
      new Color('Blue'),
      new Color('White'),
      new Color('Orange'),
      new Color('Black')
    ];
  	this.optionDemo = {
    	selectedColor: null,
      darkColors: [this.colors[0], this.colors[1], this.colors[4]],
  	};
    this.entityDemo = {
      selectedBranch: null,
    }
  }

  activate(settings){
    
  }

}

export default WidgetsModule;