const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const artistController = require('../controllers/artistController');

const router = Router();

router.get('/', artistController.getAllArtists);
router.get('/:id', param('id').isUUID(), validate, artistController.getArtistById);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  [body('name').notEmpty().trim().withMessage('Artist name is required')],
  validate,
  artistController.createArtist
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  param('id').isUUID(),
  validate,
  artistController.updateArtist
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  param('id').isUUID(),
  validate,
  artistController.deleteArtist
);

module.exports = router;
