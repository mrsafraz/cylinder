class RepeatModule {
  constructor(){
    this.people = [
        { name: 'Bert' },
        { name: 'Charles' },
        { name: 'Denise' }
    ];
  }
  addPerson(){
    this.people.push({ name: "New at " + new Date() });
  }
  removePerson(person){
    this.people.splice(this.people.indexOf(person), 1);
  }
}

export default RepeatModule;