// import {Module, Observer} from 'framework';
import {Module} from 'framework';
import {DataProvider} from '../data-provider';

class SingleModule extends Module  {

  constructor(dataProvider: DataProvider){
    this.dataProvider = dataProvider;
  }

}

export default SingleModule;