import app from 'durandal/app';
import dialog from 'plugins/dialog';
import {RouteBuilder} from './route-builder';
import {ModuleLoader} from '../core/module-loader';
import {annotate, TransientScope} from 'di';

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

  static showInstance(moduleId, activationData){
    if(typeof moduleId == 'string'){
      moduleId = RouteBuilder.prepareModuleId(moduleId);
    }
    return dialog.show(moduleId, activationData);
  }

}

// annotate(Widget, new TransientScope);