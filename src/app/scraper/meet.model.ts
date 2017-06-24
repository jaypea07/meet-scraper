import { Director } from './director.model';
import { Location } from './location.model';
import { StateList } from '../core/states';

export class Meet {
  name: string = '';
  date: Date;
  type: string = '';
  location: Location;
  sanction: string = '';
  director: Director;
  federation: string = '';
  htmlLink: string = '';

  // Should probably add a link for more info

  constructor(event) {
    this.name = event.name;
    this.date = new Date(event.date);
    this.type = event.type;
    this.location = this.constructLocationFromString(event.location);
    this.sanction = event.sanction;
    this.director = new Director(event.director);
    this.federation = event.federation;
    this.htmlLink = event.htmlLink;
  }

  constructLocationFromString(location) {
    const stateList = new StateList().states;
    let eventState;

    stateList.map(state => {
      if (location.indexOf(state.name) >= 0 || location.indexOf(state.abbreviation) >= 0) {
        eventState = state.abbreviation;
      }
    });

    const locationObject = new Location({
      address: location,
      state: eventState
    });

    return locationObject;
  }
}
