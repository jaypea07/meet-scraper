export class Location {
  address: string = '';
  city: string = '';
  state: string = '';

  constructor(location) {
    // this.city = location.city.trim();
    this.address = location.address;
    this.state = location.state;
  }
}
