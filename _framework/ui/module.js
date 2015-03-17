import router from 'plugins/router';
import {RouteBuilder} from './route-builder';
import ko from 'knockout';
import app from 'durandal/app';

var cachedRouters = {};

export class Module {

  showModal(moduleId, activationData){
    var idSplit = moduleId.split('/');
    idSplit.push('' + idSplit[idSplit.length-1]);
    var moduleIdReal = idSplit.join('/');
    moduleIdReal = this.__moduleBaseId__ + '/' + moduleIdReal;
    return app.showModal(moduleIdReal, activationData);
    // alert(moduleIdReal);
  }

  showDialog(...params){
    return this.showModal(...params);
  }

  get __moduleBaseId__(){
    var idSplit = this.__moduleId__.split('/');
    if(idSplit.length > 1 && idSplit[idSplit.length - 1]
       === idSplit[idSplit.length - 2]){
      idSplit.pop();
    }
    var baseId = idSplit.join('/');
    return baseId;
  }

	canActivate(){
		this.registerRoutes();
		return true;
	}

  get navigation(){
      var navs = [];
      for(var route of ko.unwrap(this.router.navigationModel)){
          route.href = route.hash;
          navs.push(route);
      }
      return navs;
  }

  get title(){
    if(this.router.activeInstruction()){
      return this.router.activeInstruction().config.title;
    }
  }

  findRouter(baseId){
    if(baseId){

      var parentRouter;

      if(baseId.indexOf('/') !== -1){
        var parentId = baseId.replace(/(.+)\/.+/, '$1');
        parentRouter = cachedRouters[parentId];
      }

      return (parentRouter || router).createChildRouter()
                  .makeRelative({
                    moduleId: baseId,
                    fromParent: true
                  });
    }

    return router;
  }

  buildRoutes(routes, includeRoutePrefix = false) {
    var preparedRoutes = [];
    for(var route of routes) {
      route = RouteBuilder.buildRouteConfig(route, includeRoutePrefix);
      preparedRoutes.push(route);
    }
    return preparedRoutes;
  }

  registerRoutes(){
    var idSplit = this.__moduleId__.split('/');
    if(idSplit.length > 1 && idSplit[idSplit.length - 1]
       === idSplit[idSplit.length - 2]){
      idSplit.pop();
    }
    var baseId = idSplit.join('/');
    var cacheId = baseId;
    var _router = cachedRouters[cacheId];
    if(!_router && this.routes){
      _router = this.findRouter(baseId);
      _router.map(this.buildRoutes(this.routes)).buildNavigationModel();
      if(baseId){
        cachedRouters[cacheId] = _router;
      }
    }
    this.router = _router;
  }
}

export class RootModule extends Module {

  registerRoutes(){
    super.registerRoutes();
  }

  findRouter(baseId){
    return super.findRouter(false);
  }

  buildRoutes(routes, includeRoutePrefix = false) {
    return super.buildRoutes(routes, includeRoutePrefix);
  }

  activate(){
    return this.router.activate();
  }

}
