const router = require('express').Router();
const Item = require('../models/item');

router.get('/', async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {items});
});

router.get('/items/create', async (req, res, next) => {
  res.render('create');
});

router.get('/items/:itemId', async (req, res, next) => {
  const itemId = req.params.itemId;
  const singleItem = await Item.findById(itemId);
  res.render('single', {singleItem});
});

router.get('/update/:itemId', async (req, res, next) => {
  const itemId = req.params.itemId;
  const singleItem = await Item.findById(itemId);
  res.render('update', {singleItem, itemId});
});

router.post('/items/create', async (req, res, next) => {
  const {title, description, imageUrl} = req.body;
  const newItem = new Item({title, description, imageUrl});
  newItem.validateSync();
  if (newItem.errors) {
    res.status(400).render('create', {newItem: newItem});
  } else {
    await newItem.save();
    res.redirect('/');
  }
});

router.get('/items/:itemId/update', async (req, res, next) => {
  res.redirect('/');
});

router.get('/items/:itemId/delete', async (req, res, next) => {
  res.redirect('/');
});


router.post('/items/:itemId/update', async (req, res, next) => {
  const itemId = req.params.itemId;
  const {title, description, imageUrl} = req.body;
  const updatedItem = await Item.findOneAndUpdate({'_id':itemId},{'title': title, 'description': description, 'imageUrl':imageUrl});

  if (updatedItem.errors) {
    res.status(400).render('update/'+itemId, {singleItem: updatedItem});
  } else {
    res.redirect('/');
  }
});

router.post('/items/:itemId/delete', async (req, res, next) => {
  const itemId = req.params.itemId;
  const deleteItem = await Item.deleteOne({'_id':itemId});
  if (deleteItem.errors) {
    res.status(400).render('/');
  } else {
    res.redirect('/');
  }
})

module.exports = router;
