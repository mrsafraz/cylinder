import system from 'durandal/system';
import dialog from 'plugins/dialog';
import viewEngine from 'durandal/viewEngine';
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

  static showMessage(...params){
    return dialog.showMessage(...params);
  }

  static showConfirm(message, title, options, autoclose = false) {
    return new Promise((resolve, reject)=> {
      options = options || ['OK', 'Cancel'];
      title = title || 'Confirm';
      var okMessage = options[0];
      Dialog.showMessage(message, title, options, autoclose).then(function(result) {
          window.setTimeout(function(){
              if (result == okMessage) {
                  resolve(true);
              }
              else {
                  resolve(false);
              }
          }, 1);
      }, function(error) {
          reject(error);
      });
    });
  }

  static showActionSheet(actions, title, options){
    var model = new ActionSheetDialog();
    return Dialog.showInstance(model, {actions, title}, options);
  }

}


class ActionSheetDialog extends Dialog {
  constructor(){
    this.title = '';
    this.actions = [];
  }
  selectAction(action){
    this.close(action);
  }
  getView(){
    return viewEngine.processMarkup([
      '<section class="modal-content text-center">',
        '<div class="modal-header">',
          '<h3 class="modal-title">${title}</h3>',
        '</div>',
        '<div class="modal-body">',
          '<div class="list-group collapsed">',
            '<a href="#" class="list-group-item" repeat.for="action of actions" click.delegate="selectAction(action)">${action}</a>',
          '</div>',
        '</div>',
      '</section>',
      ].join('\n'));
    return viewEngine.processMarkup('<p data-bind="text: title"></p>'
             + '<ul data-bind="foreach: actions">'
            +'<li><a href="#" data-bind="text: $data, '
            + 'click: $parent.selectAction"></a></li></ul>');
  }
  activate(settings){
    this.title = settings.title;
    this.actions = settings.actions;
  }
}

annotate(Dialog, new TransientScope);