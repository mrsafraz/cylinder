import toastr from 'toastr';

export class Toast {
  show(...params){
    toastr.info(...params);
  }
  showPositive(...params){
    return toastr.success(...params);
  }
  showNegative(...params){
    return toastr.error(...params);
  }
}