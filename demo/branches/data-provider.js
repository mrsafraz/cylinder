import * as data from './data';

export class DataProvider {
	constructor(){
		this.selectedModel = null;
		this.categories = data.categories;
		this.models = data.models;
	}
	// get models(){
	// 	return data.models;
	// }
	// get categories(){
	// 	return data.categories;
	// }

  buildRoutes(models){
    var routes = [];
    for(var i = 0; i < models.length; i++){
      var model = models[i];
      routes.push({
        pattern: i == 0 ? [model.entityType, ''] : model.entityType,
        title: model.pluralTitle,
        moduleId: 'single',
        nav: true,
      });
    }
    return routes;
  }
  getRoutes(){
    return this.buildRoutes(this.models);
  }
  selectEntityType(entityType){
    entityType = entityType || '';
    entityType = entityType.replace(/\//g, '');
    var model;
    if(!entityType){
      model = this.models[0];
    }
    else {
      for(var i = 0; i < this.models.length; i++){
        if(this.models[i].entityType == entityType){
          model = this.models[i];
        }
      }
    }
    this.selectedModel = model;
  }
}