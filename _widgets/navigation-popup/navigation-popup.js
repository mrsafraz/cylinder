import {Widget, Dialog, Observer, DataService} from 'framework';
import $ from 'jquery';
import {PropertyResolver} from '../entity-grid/_lib/PropertyResolver';

class NavigationPicker extends Dialog  {

  constructor(dataService: DataService, propertyResolver: PropertyResolver){
    super();
    this.propertyResolver = propertyResolver;
    this.dataService = dataService;
    this.entity = null;
    this.property = null;
    this.navProperty = null;
    this.criteria = {};
    this.options = {};
    this.entities = [];
    this.optionsText = ()=> {};
    this.searchText = '';
    this.editMode = true;
    this.view = null;
    this.navigationEntityType = null;
    // Observer.observe(this, 'searchText', 'applyFilter');
    this.caption = '-- Select --';
    this.multiple = false;
    this.manyToMany = false;
  }

  attached(view){
    this.view = view;
  }

  startEditing(){
    this.editMode = true;
    window.setTimeout(()=> {
      $(this.view).find('.form-control').focus();
    }, 10);
  }

  stopEditing(){
    window.setTimeout(()=> {
      this.editMode = false;
      this.searchText = '';
    }, 100);
  }

  dismiss(){
    this.editMode = false;
    this.searchText = '';
  }

  reset(){
    // alert('col');
    this.searchText = '';
    window.setTimeout(()=> {
      this.startEditing();
    }, 101);
  }

  selectValue(value){
//    alert(this.valueObservable());
    if(this.multiple){
      var singleValue = value;
      if(this.manyToMany){
        console.log('VALUE BEFORE', singleValue);
        singleValue = this.getManyToManyValue(value);
        console.log('VALUE AFTER', singleValue);
      }
      var index = this.valueObservable.indexOf(singleValue);
      if(index !== -1){
        // value.entityAspect.setDeleted();
        this.valueObservable.splice(index, 1);
        return;
      }
      try {
        if(!singleValue){
          singleValue = this.getManyToManyValue(value, true);
        }
        this.valueObservable.push(singleValue);
      }
      catch(e){
        console.log('ERROR for ', singleValue);
        console.log(e.stack);
      }
      return;
    }
    if(this.valueObservable() === value){
      this.valueObservable(null);
      return;
    }
    this.valueObservable(value);
    if(this.selectedValueObservable){
    	this.selectedValueObservable(this.getSelectedValue());
    }
    this.dismiss();
  }

  getSelectedValue(){
    var value = this.getSelectedRawValue();
    if(!value || (this.multiple && !value.length)){
      return this.caption;
    }
    if(this.multiple){
      var options = [], singleValue;
      for(var i = 0; i < value.length; i++){
        singleValue = value[i];
        if(this.manyToMany){
          // console.log('SINGLE VALUE BEFORE', singleValue);
          // singleValue = this.getManyToManyValue(singleValue);
          singleValue = singleValue[this.manyToMany];
          // console.log('SINGLE VALUE AFTER', singleValue);
        }
        options.push(singleValue[this.optionsText]);
      }
      return options.join(', ');
    }
    return value[this.optionsText];
  }

  getSelectedRawValue(){
    var value = this.propertyResolver.getRawValue(this.entity, this.property);
    this.multiple = Array.isArray(value);
    if(!value || (this.multiple && !value.length)){
      // return this.caption;
    }
    if(this.multiple){
      // return value.join(', ');
    }
    return value;
    var props = this.property.split('.');
    var value = this.entity;
    for(var i = 0; i < props.length; i++){
      if(!value){
        value = this.caption;
        break;
      }
      value = value[props[i]];
    }
    return value;
  }

  getManyToManyValue(value, alsoCreate = false){
    var props = this.property.split('.');
    var manyToManyId = this.entity.entityType.getProperty(props[0] + '.' + props[1]).foreignKeyNames[0];
    var criteria = {[this.navProperty.inverse.foreignKeyNames[0]]: this.entity.id, [manyToManyId]: value.id};
    var entity = this.dataService.getOne(this.navProperty.entityType.shortName, criteria);
    // alert([this.navProperty.inverse.foreignKeyNames[0]] + ' : ' + manyToManyId);
    if(!entity && alsoCreate){
      // alert('No entity?!');
      entity = this.dataService.create(this.navProperty.entityType.shortName, criteria);
    }
    return entity;
  }

  isOptionSelected(option){
    // console.log('All options', this.getSelectedValue());
    // console.log('Current Option', option[this.optionsText]);
    var selectedValue = this.getSelectedRawValue();
    // console.log('NAVPROP,', this.multiple, option, this.manyToMany);
    if(this.multiple){
      if(this.manyToMany){
        // alert(this.manyToMany + ' : ' + this.entity.id + ' : ' + option.id);
        option = this.getManyToManyValue(option);
        // console.log('OPTION...', option, selectedValue);
      }
      return selectedValue && selectedValue.indexOf(option) !== -1;
    }
    return selectedValue === option;
  }

  quickFilter(searchText){
  	return this.applyFilter(this.searchText);
  }

  applyFilter(searchText){
//    this.entities = this.dataService.getAll(this.navigationEntityType, {
//      [this.optionsText]: {$contains: searchText},
//    });
    var criteria = {};
    for(var key in this.criteria){
      criteria[key] = this.criteria[key];
    }
    if(!(searchText === '' || searchText === null || searchText === undefined)){
      criteria[this.optionsText] = {$contains: searchText};
    }
    var options = {};
    for(var key in this.options){
      options[key] = this.options[key];
    }
//    options.limit: 10;
    options.sort = {[this.optionsText]: 1};
    this.dataService.findAll(this.navigationEntityType, criteria, options).then(results => {
      this.entities = results;
    });
  }

  activate(settings){

    // this.multiple = true;

    this.entity = settings.entity;
    this.property = settings.property;

    var entityType = this.entity.entityType;
    var props = this.property.split('.');
    var property = entityType.getProperty(props[0]);
    this.navProperty = property;
    this.optionsText = props[props.length - 1];
    if(props.length > 2){
      this.manyToMany = props[1];
    }
    // this.multiple = settings.multiple;
    if(settings.caption){
      this.caption = settings.caption;
    }
    if(settings.criteria){
      this.criteria = settings.criteria;
    }
    if(settings.options){
      this.options = settings.options;
    }
    this.valueObservable = settings.valueObservable || Observer.getObservable(settings.entity, property.name);
    this.selectedValueObservable = settings.selectedValueObservable;
    if(this.selectedValueObservable){
    	this.selectedValueObservable(this.getSelectedValue());
    }
    if(this.manyToMany){
      var navProperty = entityType.getProperty(props[0] + '.' + props[1]);
      this.navigationEntityType = navProperty.entityType.shortName;
    }
    else {
      this.navigationEntityType = property.entityType.shortName;
    }
    this.entities = this.dataService.getAll(this.navigationEntityType, {}, {sort: {[this.optionsText]: 1}});
    if(settings.preload){
      this.applyFilter('');
    }
//    this.dataService.findAll(this.navigationEntityType, {}, {limit: 10, sort: {[this.optionsText]: 1}}).then(results => {
//      this.entities = results;
//    });
  }

}

export default NavigationPicker;