const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

async function getAllUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true, email: true, username: true, role: true, status: true,
          avatar: true, createdAt: true, lastLogin: true,
          _count: { select: { playlists: true, likedTracks: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, email: true, username: true, role: true, status: true,
        avatar: true, createdAt: true, lastLogin: true, theme: true,
        language: true, explicitContent: true, autoplay: true, volume: true,
        _count: { select: { playlists: true, likedTracks: true } },
      },
    });
    if (!user) throw new AppError('User not found', 404);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    if (req.user.id !== id && req.user.role !== 'admin') {
      throw new AppError('Not authorized to update this user', 403);
    }

    const { username, avatar, theme, language, explicitContent, autoplay, volume } = req.body;
    const data = {};
    if (username !== undefined) data.username = username;
    if (avatar !== undefined) data.avatar = avatar;
    if (theme !== undefined) data.theme = theme;
    if (language !== undefined) data.language = language;
    if (explicitContent !== undefined) data.explicitContent = explicitContent;
    if (autoplay !== undefined) data.autoplay = autoplay;
    if (volume !== undefined) data.volume = volume;

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true, email: true, username: true, role: true, status: true,
        avatar: true, createdAt: true, lastLogin: true, theme: true,
        language: true, explicitContent: true, autoplay: true, volume: true,
      },
    });
    res.json({ user });
  } catch (err) {
    if (err.code === 'P2025') return next(new AppError('User not found', 404));
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw new AppError('User not found', 404);

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new AppError('Current password is incorrect', 400);

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
}

async function updateUserStatus(req, res, next) {
  try {
    const { status } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status },
      select: { id: true, username: true, status: true },
    });
    res.json({ user });
  } catch (err) {
    if (err.code === 'P2025') return next(new AppError('User not found', 404));
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return next(new AppError('User not found', 404));
    next(err);
  }
}

module.exports = { getAllUsers, getUserById, updateUser, changePassword, updateUserStatus, deleteUser };
