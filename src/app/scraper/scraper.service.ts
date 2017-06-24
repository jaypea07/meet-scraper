import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Configuration } from '.././app.configuration';
import { Meet } from './meet.model';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class ScraperService {

  usaplEvents: Array<Meet> = [];
  uspaEvents: Array<Meet> = [];
  states: Array<string> = [];
  types: Array<string> = [];

  constructor (
    private http: Http,
    private config: Configuration
  ) {}

  getUSAPL(): Observable<any> {
    return this.http.get(this.config.USAPL_EVENTS_PATH)
      .map(res => {
        const rawEvents = res.text().match(/(?:<div class='event-name'>)((?:.*\n.){8}.*)/g);
        let eventsJSON = [];

        rawEvents.map(rawEvent => {
          const meet = new Meet({
            name: rawEvent.match(/(?:<div class='event-name'>)([^<]*)/)[1],
            date: rawEvent.match(/'event-date'>([^<]*)/)[1],
            type: rawEvent.match(/Type of Event: ([^<]*)/)[1],
            location: rawEvent.match(/Location: ([^<]*)/)[1],
            sanction: rawEvent.match(/Sanction: ([^<]*)/)[1],
            director: {
              name: rawEvent.match(/mailto:[^>]*>([^<]*)/)[1],
              email: rawEvent.match(/mailto:([^"]*)/)[1]
            },
            federation: 'USAPL',
            htmlLink: rawEvent.match(/event-button"><.*href="(.*)"/) ? rawEvent.match(/event-button"><.*href="(.*)"/)[1] : null
          });

          if (meet.type.toUpperCase() !== 'COACHING') eventsJSON.push(meet);
        });

        this.usaplEvents = eventsJSON;
        this.updateStates(this.usaplEvents);
        this.updateTypes(this.usaplEvents);
        return this.usaplEvents;
      });
  }

  getUSPA(): Observable<any> {
    return this.http.get(this.config.USPA_EVENTS_PATH)
      .map(res => {
        const rawEvents = res.json().items;
        let eventsJSON = [];
        const sanctionRegex = /Sanction *#*: *(\w*-*\w*)/;
        const directorNameRegex = /Meet Director:(?: *)((?:\w* *)*)/;
        const directorEmailRegex = /Email:(?: *)(\w*.*\w*@\w*-*\w*\.\w*)/;

        rawEvents.map(rawEvent => {
          const meet = new Meet({
            name: rawEvent.summary,
            date: rawEvent.start.date, // Need to address meets that span multiple days
            location: rawEvent.location,
            sanction: rawEvent.description.match(sanctionRegex) ? rawEvent.description.match(sanctionRegex)[1] : null,
            director: {
              name: rawEvent.description.match(directorNameRegex) ? rawEvent.description.match(directorNameRegex)[1] : null,
              email: rawEvent.description.match(directorEmailRegex) ? rawEvent.description.match(directorEmailRegex)[1] : null
            },
            federation: 'USPA',
            htmlLink: rawEvent.htmlLink
          });

          eventsJSON.push(meet);
        });

        this.uspaEvents = eventsJSON;
        return this.uspaEvents;
      });
  }

  updateStates(events: Array<Meet>): void {
    events.map(event => {
      const state = event.location.state;
      const stateIsNotInList = this.states.indexOf(state) < 0;
      const stateIsValid = state && state.length > 0;

      if (stateIsNotInList && stateIsValid) {
        this.states.push(state);
      }
    });

    this.states.sort();
  }

  updateTypes(events: Array<Meet>): void {
    events.map(event => {
      const type = event.type;
      const typeIsNotInList = this.types.indexOf(type) < 0;

      if (typeIsNotInList) {
        this.types.push(type);
      }
    });

    this.types.sort();
  }
}
