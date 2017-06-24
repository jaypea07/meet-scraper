export class Director {
  name: string = '';
  email: string = '';

  constructor(person) {
    this.name = person.name;
    this.email = person.email;
  }
}
