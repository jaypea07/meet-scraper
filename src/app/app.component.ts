import { Component, OnInit } from '@angular/core';
import { ScraperService } from './scraper/scraper.service';
import { Meet } from './scraper/meet.model';
import { CheckboxState } from './filters/checkbox-state.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  events: Array<Meet> = [];
  filteredEvents: Array<Meet> = [];
  loading: boolean = true;
  states: Array<CheckboxState> = [];
  types: Array<CheckboxState> = [];

  constructor (private scraperService: ScraperService) {}

  ngOnInit() {
    Observable.forkJoin(
      this.scraperService.getUSAPL(),
      this.scraperService.getUSPA())

    .subscribe(data => {
      this.events = data[0].concat(data[1]);
      this.filteredEvents = this.sortEventsByDate(this.events);
      this.loading = false;

      // Should these be subscribes on observables?
      this.states = this.createCheckboxState(this.scraperService.states);
      this.types = this.createCheckboxState(this.scraperService.types);
    });
  }

  createCheckboxState(masterList: Array<string>): Array<CheckboxState> {
    let checkboxList = [];
    masterList.map(item => checkboxList.push(new CheckboxState(item)));
    return checkboxList;
  }

  // Can this be cleaned up?
  updateFilteredEvents() {
    let applicableEvents = this.filter({
      filter: this.states,
      events: this.events,
      property: 'location',
      subProperty: 'state'
    });
    applicableEvents = this.filter({
      filter: this.types,
      events: applicableEvents,
      property: 'type'
    });
    this.filteredEvents = applicableEvents;
  }

  filter(options: {
    filter: Array<CheckboxState>,
    events: Array<Meet>,
    property: string,
    subProperty?: string
  }): Array<Meet> {
    let filterCriteria = [];
    let returnedEvents = [];

    options.filter.map(item => { if (item.checked) filterCriteria.push(item.name); });

    options.events.map(event => {
      filterCriteria.map(filterItem => {
        const eventProperty = options.subProperty ? event[options.property][options.subProperty] : event[options.property];
        if (eventProperty === filterItem) {
          returnedEvents.push(event);
        }
      });
    });

    if (!filterCriteria.length) {
      returnedEvents = options.events;
    }

    return this.sortEventsByDate(returnedEvents);
  }

  sortEventsByDate(events: Array<Meet>): Array<Meet> {
    return events.sort((a: Meet, b: Meet) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  clearFilter(filter: Array<CheckboxState>): void {
    filter.map(checkbox => {
      checkbox.checked = false;
    });
    this.updateFilteredEvents();
  }
}
