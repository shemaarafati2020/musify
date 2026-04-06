const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const trackController = require('../controllers/trackController');

const router = Router();

router.get('/', optionalAuth, trackController.getAllTracks);
router.get('/liked', authenticate, trackController.getLikedTracks);
router.get('/:id', param('id').isUUID(), validate, trackController.getTrackById);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').notEmpty().trim(),
    body('artistId').isUUID(),
    body('duration').optional().isInt({ min: 0 }),
  ],
  validate,
  trackController.createTrack
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  param('id').isUUID(),
  validate,
  trackController.updateTrack
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  param('id').isUUID(),
  validate,
  trackController.deleteTrack
);

router.post('/:id/play', optionalAuth, trackController.recordPlay);
router.post('/:id/like', authenticate, trackController.likeTrack);

module.exports = router;
