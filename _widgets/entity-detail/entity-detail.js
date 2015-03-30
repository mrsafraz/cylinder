import {Widget} from 'framework';
import {Observer} from 'framework';
import {PropertyResolver} from '../entity-grid/_lib/PropertyResolver';

class EntityDetailWidget extends Widget  {

  constructor(propertyResolver: PropertyResolver){
    this.settings = {};
    this.propertyResolver = propertyResolver;
    this.editMode = false;
  }

  getValue(entity, property){
    if(property.displayText){
      return property.displayText(this.propertyResolver.getRawValue(entity, property));
    }
    var value = this.propertyResolver.getValue(entity, property);
    if(Array.isArray(value)){
      return value.join(', ');
    }
    return value;
  }

  getRawValue(entity, property){
    return Observer.getObservable(entity, property.name);
    return entity[property.name];
    var value = this.propertyResolver.getValue(entity, property);
    return value;
  }

  isEditable(property){
    return this.editMode && property.canEdit !== false;
  }

  activate(settings){
    this.settings = settings.data;
    this.entity = settings.entity;
    this.editMode = settings.editMode;
    // this.editMode = true;
  }

}

export default EntityDetailWidget;