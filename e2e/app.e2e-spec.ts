import { MeetScraperPage } from './app.po';

describe('meet-scraper App', () => {
  let page: MeetScraperPage;

  beforeEach(() => {
    page = new MeetScraperPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
