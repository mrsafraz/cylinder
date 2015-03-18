import {Module} from 'framework';

class Branches extends Module {
  get data(){
    return {
      entityType: 'Branch',
      title: 'Branch',
      pluralTitle: 'Branches',
      properties: [
        {name: 'branchType.name', label: 'Branch Type'},
        {name: 'code', label: 'Code'},
        {name: 'name', label: 'Name'},
        {name: 'branchCourses.course.name', label: 'Courses'},
      ],
    };
  }
}

export default Branches;