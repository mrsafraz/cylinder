import system from 'durandal/system';
import dialog from 'plugins/dialog';
import {RouteBuilder} from './route-builder';
import {ModuleLoader} from '../core/module-loader';
import {annotate, TransientScope} from 'di';


function ensureDialogInstance(objOrModuleId) {
  return system.defer(function (dfd) {
      if (system.isString(objOrModuleId)) {
          system.acquire(objOrModuleId).then(function (module) {
              dfd.resolve(system.resolveObject(module));
          }).fail(function (err) {
              system.error('Failed to load dialog module (' + objOrModuleId + '). Details: ' + err.message);
          });
      } else {
          dfd.resolve(objOrModuleId);
      }
  }).promise();
}

export class Dialog {

  // static closeAll(){
  // }

  show(activationData, options = {}){
    var context;
    if(options.size){
      this.size = options.size;
    }
    if(options.autoclose !== undefined){
      this.autoclose = options.autoclose;
    }
    if(options.overlay !== undefined){
      this.overlay = options.overlay;
    }
    if(options.popover){
      context = 'popup';
      this.target = options.target || options.popover;
      if(options.position){
        this.position = options.position;
      }
    }
    return dialog.show(this, activationData, context);
  }

  close(result){
    return dialog.close(this, result);
  }

  static closeInstance(...params){
    return dialog.closeInstance(...params);
  }

  static showInstance(moduleId, activationData, options = {}){
    if(typeof moduleId == 'string'){
      moduleId = RouteBuilder.prepareModuleId(moduleId);
    }
    return new Promise((resolve, reject)=> {
      ensureDialogInstance(moduleId).then(function(instance) {
        if(instance instanceof Dialog){
          instance.show(activationData, options).then(resolve, reject);
        }
        else {
          dialog.show(instance, activationData).then(resolve, reject);
        }
      });
    });
  }

}

annotate(Dialog, new TransientScope);