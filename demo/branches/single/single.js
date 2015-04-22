// import {Module, Observer} from 'framework';
import {Module} from 'framework';
import {DataProvider} from '../data-provider';

class SingleModule extends Module  {

  constructor(dataProvider: DataProvider){
  	super();
    this.dataProvider = dataProvider;
  }

}

export default SingleModule;