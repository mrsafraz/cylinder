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
      try {
        return property.displayText.call(entity, this.propertyResolver.getRawValue(entity, property));
      }
      catch(e){
        return ''; // silently fail invalid displayText function
      }
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
    var canAttr = 'edit';
    if(this.entity.entityAspect.entityState.isAdded()){
      canAttr = 'add';
    }
    return this.editMode && (!property.can || property.can[canAttr] !== false);
  }

  canShow(property){
    var showAttr = 'view';
    if(this.editMode){
      showAttr = 'edit';
      if(this.entity.entityAspect.entityState.isAdded()){
        showAttr = 'add';
      }
    }
    return !property.show || property.show[showAttr] !== false;
  }

  activate(settings){
    this.settings = settings.data;
    this.entity = settings.entity;
    this.editMode = settings.editMode;
    // this.editMode = true;
  }

}

export default EntityDetailWidget;