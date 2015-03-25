export class Icon {
  constructor(data){
    this.name = data.name;
    this.id = data.id;
    this.unicode = data.unicode;
    this.created = data.created;
    this.aliases = data.aliases;
    this.categories = data.categories;
    this.isActive = true;
  }

  get isHidden(){
    return !this.isActive;
  }

  static create(data){
    var icon = new Icon(data);
    for(var key in data){
      icon[key] = data[key];
    }
    return icon;
  }
}