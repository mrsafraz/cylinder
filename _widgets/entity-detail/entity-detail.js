import {Widget} from 'kingdom';
import {PropertyResolver} from '../entity-grid/_lib/PropertyResolver';

class EntityDetailWidget extends Widget  {

  constructor(propertyResolver: PropertyResolver){
    this.settings = {};
    this.propertyResolver = propertyResolver;
    this.editMode = false;
  }
  
  getValue(entity, property){
    var value = this.propertyResolver.getValue(entity, property);
    if(Array.isArray(value)){
      return value.join(', ');
    }
    return value;
  }

  activate(settings){
    this.settings = settings.data;
    this.entity = settings.entity;
    this.editMode = settings.editMode;
    // this.editMode = true;
  }

}

export default EntityDetailWidget;