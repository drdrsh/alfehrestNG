import { AlfehrestNG2Page } from './app.po';

describe('alfehrest-ng2 App', () => {
  let page: AlfehrestNG2Page;

  beforeEach(() => {
    page = new AlfehrestNG2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
