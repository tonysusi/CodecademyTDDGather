const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:
  describe('GET', () => {
    it('item from database /items/:itemId', async () => {
      const item = await seedItemToDatabase();
      const response = await request(app)
        .get('/items/'+item._id);

      assert.equal(parseTextFromHTML(response.text, '#item-title').trim(), item.title);
      assert.equal(parseTextFromHTML(response.text, '#item-description').trim(), item.description);
    });
  });

});
