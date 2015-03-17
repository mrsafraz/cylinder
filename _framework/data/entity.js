import observable from 'plugins/observable';

export class Entity {
  defineProperty(property, getter, setter){
    var evaluator = getter;
    if(setter){
      evaluator = {
        read: getter,
        write: setter
      };
    }
    observable.defineProperty(this, property, evaluator);
  }
}