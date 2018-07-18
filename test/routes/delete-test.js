const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /items/:itemId/delete', () => {
  const itemToCreate = buildItemObject();
  let itemId = '';

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

    describe('POST', () => {
      it('creates and saves a new item', async () => {
        const response = await request(app)
          .post('/items/create')
          .type('form')
          .send(itemToCreate);
        const createdItem = await Item.findOne(itemToCreate);
        itemId = createdItem._id;
        assert.isOk(createdItem, 'Item was not created successfully in the database');
      });
      it('redirects home', async () => {
        const response = await request(app)
          .post('/items/create')
          .type('form')
          .send(itemToCreate);
        assert.equal(response.status, 302);
        assert.equal(response.headers.location, '/');
      });
      it('deletes new item', async () => {
        const response = await request(app)
          .post('/items/'+itemId+'/delete')
          .type('form')
          .send();
        assert.equal(response.status, 302);
        assert.equal(response.headers.location, '/');
      });
  });
});
