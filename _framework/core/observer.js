import observable from 'plugins/observable';

export class Observer {
  static observe(obj, prop, fn){
    observable(obj, prop).subscribe(function(newValue){
      if(typeof fn === "function"){
        fn.apply(obj, [newValue]);
      }
      else {
        obj[fn](newValue);
      }
    });
  }
  static getObservable(obj, prop){
    return observable(obj, prop);
  }
}