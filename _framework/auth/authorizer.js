import router from 'plugins/router';

var _routesGuarded = false;

export class Authorizer {

	authorize(){
		return new Promise((resolve, reject)=> {
			this.guardRoutes();
			resolve();
		});
	}

	canAccess(route){
		return true;
	}

	guardRoutes(){
		if(_routesGuarded){
		  return;
		}
		router.guardRoute = (instance, instruction) => {
			if(!this.canAccess(instruction.config)){
				window.setTimeout(() => {
					router.navigate('/', {replace: true, trigger: true});
				}, 1);
				return false;
			}
			return true;
		};
		_routesGuarded = true;
	}
}