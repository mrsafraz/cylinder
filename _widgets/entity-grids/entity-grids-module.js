import {Module} from 'kingdom';

class EntityGridsModule extends Module {
  get routes(){
    var data = this.data;
    var routes = [
      
      {
        pattern: ['grns', ''],
        title: 'GRN',
        moduleId: 'grns',
        nav: true,
      },
    ];
    routes = [];
    for(var i = 0; i < data.models.length; i++){
      var model = data.models[i];
      routes.push({
        pattern: i == 0 ? [model.entityType, ''] : model.entityType,
        title: model.title,
        moduleId: 'model',
      });
    }
    return routes;
  }
}

export default EntityGridsModule; 