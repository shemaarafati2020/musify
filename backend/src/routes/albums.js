const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const albumController = require('../controllers/albumController');

const router = Router();

router.get('/', albumController.getAllAlbums);
router.get('/:id', param('id').isUUID(), validate, albumController.getAlbumById);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').notEmpty().trim(),
    body('artistId').isUUID(),
  ],
  validate,
  albumController.createAlbum
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  param('id').isUUID(),
  validate,
  albumController.updateAlbum
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  param('id').isUUID(),
  validate,
  albumController.deleteAlbum
);

module.exports = router;
