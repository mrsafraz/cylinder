import {Widget} from 'framework';
import {Paginator} from 'framework';

import DetailDialog from './detail/detail';
import {PropertyResolver} from './_lib/PropertyResolver';
import {Property} from './_lib/Property';

class EntityGrid extends Widget  {

  constructor(paginator: Paginator, detailDialog: DetailDialog, propertyResolver: PropertyResolver){
    this.entities = [];
    this.settings = {};
    this.propertyResolver = propertyResolver;
    this.paginator = paginator.create(null, {}, {}, (results)=> {
      this.entities = results;
      // this.editEntity(this.entities[0]);
    });
    this.detailDialog = detailDialog;
  }

  addEntity(){
    this.editEntity();
  }

  editEntity(entity){
    var settings = this.settings;
    settings.entity = entity;
    this.detailDialog.show(settings).then((entity)=> {
      if(entity){
        this.paginator.refresh();
//        this.entitys.push(entity);
      }
      else if(entity === false){
        // deleted
      }
    });
  }
  
  getValue(entity, property){
    if(property.displayText){
      return property.displayText(this.propertyResolver.getRawValue(entity, property));
    }
    return this.propertyResolver.getValue(entity, property);
  }
  
  getSearchProperties(){
    var props = [];
    for(var i = 0; i < this.settings.properties.length; i++){
      var prop = this.settings.properties[i];
      if(prop.searchable !== false){
        props.push(prop.name);
      }
    }
    return props;
  }

  activate(settings){
    var data = settings.data || settings;
    this.settings = data;
//    this.prepareSettings();
    var properties = [];
    for(var i = 0; i < this.settings.properties.length; i++){
      properties.push(Property.create(this.settings.properties[i]));
    }
    this.settings.properties = properties;
    this.paginator.entityType = this.settings.entityType;
    if(this.settings.criteria){
      this.paginator.criteria = this.settings.criteria;
    }
    if(this.settings.options){
      this.paginator.options = this.settings.options;
    }
    this.paginator.activate();
    // this.addEntity();
  }

}

export default EntityGrid;