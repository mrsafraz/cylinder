import app from 'durandal/app';
import dialog from 'plugins/dialog';
import {RouteBuilder} from './route-builder';

export class Dialog {

  // static closeAll(){
  // }

  show(...params){
    return dialog.show(this, params);
  }

  showAsPopover(...params){
    return dialog.showActionsheet(this, params);
  }

  close(result){
    return dialog.close(this, result);
  }

  static show(moduleId, activationData){
    var idSplit = moduleId.split('/');
    idSplit.push('' + idSplit[idSplit.length-1]);
    var moduleIdReal = idSplit.join('/');
    moduleIdReal = RouteBuilder.getRoutePrefix() + moduleIdReal;
    return dialog.show(moduleIdReal, activationData);
  }

}