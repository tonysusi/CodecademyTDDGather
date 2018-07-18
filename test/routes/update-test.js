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

describe('Server path: /items/:itemId/update', () => {
  const itemToCreate = buildItemObject();
  const itemToUpdate = buildItemObject({title:'Updated title'});

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

    describe('POST', () => {
      it('updates new item', async () => {
        const create = await request(app)
          .post('/items/create')
          .type('form')
          .send(itemToCreate);
        const createdItem = await Item.findOne(itemToCreate);
        itemToUpdate._id = createdItem._id;
        const response = await request(app)
          .post('/items/'+itemToUpdate._id+'/update')
          .type('form')
          .send(itemToUpdate);
        assert.equal(response.status, 302);
        assert.equal(response.headers.location, '/');
      });
  });
});
