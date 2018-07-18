const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits the create page', () => {
    describe('posts a new item', () => {
      const itemToCreate = buildItemObject();
      const updatedTitle = 'Updated title';
      it('and updates new item', () => {
        browser.url('/items/create');
        browser.setValue('#title-input', itemToCreate.title);
        browser.setValue('#description-input', itemToCreate.description);
        browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
        browser.click('#submit-button');
        browser.click('.image-overlay a');
        browser.click('a.update-button');
        browser.setValue('#title-input', updatedTitle);
        browser.click('#submit-button');
        assert.notInclude(browser.getText('body'), itemToCreate.title);
        assert.include(browser.getText('body'), updatedTitle);
      });
    });
});
