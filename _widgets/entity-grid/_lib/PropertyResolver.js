export class PropertyResolver {

  getRawValue(entity, property, defaultValue = null){
    property = property.name || property;
    if(property.indexOf('.') !== -1){
      var props = property.split('.');
      props.splice(-1, 1);
      if(props.length > 1){
        props.splice(-1, 1);
      }
      property = props.join('.');
    }
    return entity[property];
  }

  getValue(entity, property, defaultValue = null){
    var property = property.name || property;
    if(property.indexOf('.') !== -1){
      var props = property.split('.');
      var value = entity;
      for(var i = 0; i < props.length; i++){
        if(!value){
          value = defaultValue;
          break;
        }
        value = value[props[i]];
        if(i == 0 && props.length == 2 && Array.isArray(value)){
          var arrValue = [];
          for(var x = 0; x < value.length; x++){
            arrValue.push(value[x][props[i+1]]);
          }
          // return arrValue;
          return arrValue.join(', ');
        }
      }
      return value;
    }
    return entity[property];
  }
}