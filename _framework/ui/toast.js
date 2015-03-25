import toastr from 'toastr';


//*
toastr.options.iconClass = 'alert';
var classPrefix = 'custom alert alert-';
toastr.options.iconClasses = {
    error: classPrefix + 'danger',
    info: classPrefix + 'info',
    success: classPrefix + 'success',
    warning: classPrefix + 'warning'
};
toastr.options.positionClass = 'toast-bottom-right';
// toastr.options.positionClass = 'toast-bottom-left';
toastr.options.timeOut = 5000;
//
//    toastr.options.tapToDismiss = false;
//    toastr.options.closeButton = true;
//    toastr.options.closeHtml = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';

//*/


export class Toast {
  static show(...params){
    toastr.info(...params);
  }
  static showPositive(...params){
    return toastr.success(...params);
  }
  static showNegative(...params){
    return toastr.error(...params);
  }
}