import app from 'durandal/app';
import dialog from 'plugins/dialog';
import {RouteBuilder} from './route-builder';
import {ModuleLoader} from '../core/module-loader';

export class Dialog {

  // static closeAll(){
  // }

  show(...params){
    return dialog.show(this, params);
  }

  showAsPopup(...params){
    return dialog.showPopup(this, params);
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