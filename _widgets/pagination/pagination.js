import {Widget, DataService} from 'framework';

class PaginationWidget extends Widget {
  constructor(dataService: DataService){
    super();
    this.paginator = {};
    this.isLoading = false;
  }
  
  refresh(){
    this.isLoading = true;
    this.paginator.forceRefresh().then(()=> {
      this.isLoading = false;
    }, ()=> {
      this.isLoading = false;
    });
  }
  
  activate(settings){
    this.paginator = settings.paginator;
  }
}

export default PaginationWidget;