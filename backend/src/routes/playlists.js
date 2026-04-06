const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, optionalAuth } = require('../middleware/auth');
const playlistController = require('../controllers/playlistController');

const router = Router();

router.get('/', optionalAuth, playlistController.getAllPlaylists);
router.get('/mine', authenticate, playlistController.getMyPlaylists);
router.get('/:id', optionalAuth, param('id').isUUID(), validate, playlistController.getPlaylistById);

router.post(
  '/',
  authenticate,
  [body('name').notEmpty().trim().withMessage('Playlist name is required')],
  validate,
  playlistController.createPlaylist
);

router.put(
  '/:id',
  authenticate,
  param('id').isUUID(),
  validate,
  playlistController.updatePlaylist
);

router.delete(
  '/:id',
  authenticate,
  param('id').isUUID(),
  validate,
  playlistController.deletePlaylist
);

router.post(
  '/:id/tracks',
  authenticate,
  [
    param('id').isUUID(),
    body('trackId').isUUID().withMessage('Valid track ID required'),
  ],
  validate,
  playlistController.addTrackToPlaylist
);

router.delete(
  '/:id/tracks/:trackId',
  authenticate,
  [param('id').isUUID(), param('trackId').isUUID()],
  validate,
  playlistController.removeTrackFromPlaylist
);

module.exports = router;
