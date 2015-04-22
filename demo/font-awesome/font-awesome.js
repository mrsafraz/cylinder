import {Module} from 'framework';
import icons from './icons';
import $ from 'jquery';
import {Icon} from './_lib/Icon';

var _icons = [];
for(var icon of icons){
  _icons.push(Icon.create(icon));
}

class FontAwesomeModule extends Module  {

  constructor(){
    super();
    this.icons = [];
    this.searchResults = [];
    this.searchText = '';
    this.searchActive = false;
  }

  resetSearch(clear = true, focus = true){
    if(clear){
      this.searchText = '';
    }
    this.searchActive = false;
    this.searchResults = [];
    if(focus){
      $('.search-form .form-control').focus();
    }
  }

  instantSearch(){
    if(!this.searchText || this.searchText.length < 2){
      return this.resetSearch(false, false);
    }
    this.search();
  }

  searchBy(values){
    var searchText = this.searchText.toLowerCase();
    return ('' + values).toLowerCase().indexOf(searchText) !== -1;
    // var condition = false;
    // for(var i = 0; i < values.length; i++){
    //   condition = condition || values[i].indexOf(searchText) !== -1;
    // }
    // return condition;
    // if(
    //     || icon.id.indexOf(this.searchText) !== -1
    //     || icon.name.indexOf(this.searchText) !== -1
    //     || ('' + icon.categories).indexOf(this.searchText) !== -1) {

    // }
  }

  search(){
    // if(this.searchText == ''){
    //   return this.resetSearch(false, false);
    // }
    // this.searchResults = [];
    // var results = _.where(icons, {id: this.searchText});
    var results = [], values;
    for(var icon of _icons){
      values = [icon.id, icon.name].concat(icon.filter || []);
      if(icon.categories){
        values.push('' + icon.categories);
      }
      var condition = this.searchBy(values);
      if(condition){
        results.push(icon);
      }
    }
    this.searchResults = results;
    this.searchActive = true;
    window.setTimeout(()=> {
      var regex = new RegExp('(' + this.searchText + ')', "gi");
      $('.search-results .faid').each(function () {
        // this.innerHTML = this.innerHTML.replace(regex, function(matched) {
        //   return '<span class="higlight">' + matched + '</span>';
        // });
        $(this).html($(this).text().replace(regex, '<span class="higlight">$1</span>'));
        // this.innerHTML = this.innerHTML.replace(regex, '<span class="higlight">$1</span>');
      });
    }, 100);
  }

  activate(settings){
    this.icons = _icons;
  }

}

export default FontAwesomeModule;