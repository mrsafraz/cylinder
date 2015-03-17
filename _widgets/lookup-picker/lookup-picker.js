import {Widget} from 'framework';
import {DataService} from 'framework';
import {Observer} from 'framework';

class LookupPicker extends Widget  {

  constructor(dataService: DataService){
    this.dataService = dataService;
    this.label = null;
    this.valueObservable = null;
    this.lookups = [];
    this.newEntity = null;
    this.entityType = null;
  }

  get addMode(){
    return this.newEntity !== null;
  }

  addNew(){
    this.newEntity = this.dataService.create(this.entityType.shortName);
  }

  cancelNew(){
    this.newEntity = null;
  }

  saveNew(){
    var newEntity = this.newEntity;
    this.lookups.push(newEntity);
    this.valueObservable(newEntity);
    this.newEntity = null;
  }

  setType(entity, propertyPath){
    console.log('Lookp Enity', entity);

//    var metadataStore = this.dataService.entityManager.metadataStore; 
    var entityType = entity.entityType;
    var property = entityType.getProperty(propertyPath);
    console.log('Lookp Enity PROP', property);
//    this.dataService.findAll(property.entityType.shortName).then(results => {
//      this.lookups = results;
//    });
    this.entityType = property.entityType;
    this.lookups = this.dataService.getAll(property.entityType.shortName);

  }

  activate(settings){
    if(settings.label){
      this.label = settings.label;
    }
    this.setType(settings.entity, settings.property);
    this.valueObservable = Observer.getObservable(settings.entity, settings.property);
//    this.valueObservable = settings.entity[settings.property] && settings.entity[settings.property].id;
//        console.log('NAVIGATION VALUE', this.valueObservable);
//    Observer.observe(this, 'valueObservable', valueObservable => {
//      alert(valueObservable);
//      settings.entity[settings.property + 'Id'] = valueObservable;
//    });
  }

}

export default LookupPicker;