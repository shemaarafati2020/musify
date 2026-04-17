const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin'), userController.getAllUsers);
router.get('/:id', param('id').isUUID(), validate, userController.getUserById);

router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('username').optional().isLength({ min: 3, max: 30 }),
    body('theme').optional().isIn(['dark', 'light']),
    body('language').optional().isString(),
    body('volume').optional().isFloat({ min: 0, max: 1 }),
  ],
  validate,
  userController.updateUser
);

router.put(
  '/change-password',
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ],
  validate,
  userController.changePassword
);

router.patch(
  '/:id/status',
  authorize('admin'),
  [
    param('id').isUUID(),
    body('status').isIn(['active', 'suspended', 'inactive']),
  ],
  validate,
  userController.updateUserStatus
);

router.delete(
  '/:id',
  authorize('admin'),
  param('id').isUUID(),
  validate,
  userController.deleteUser
);

module.exports = router;
