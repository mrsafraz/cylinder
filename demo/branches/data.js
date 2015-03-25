export var categories = [];

export var models = [
	{
      entityType: 'Branch',
      title: 'Branch',
      pluralTitle: 'Branches',
      properties: [
        {name: 'branchType.name', label: 'Branch Type'},
        {name: 'code', label: 'Code'},
        {name: 'name', label: 'Name'},
        {name: 'branchCourses.course.name', label: 'Courses', searchable: false},
      ],
    },
	{
      entityType: 'Course',
      title: 'Course',
      pluralTitle: 'Courses',
      properties: [
        {name: 'code', label: 'Code'},
        {name: 'name', label: 'Name'},
      ],
    },
];