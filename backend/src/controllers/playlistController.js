const { prisma } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

async function getAllPlaylists(req, res, next) {
  try {
    const { page = 1, limit = 20, search, ownerId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isPublic: true };
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (ownerId) where.ownerId = ownerId;
    if (req.user) {
      delete where.isPublic;
      where.OR = [{ isPublic: true }, { ownerId: req.user.id }];
    }

    const [playlists, total] = await Promise.all([
      prisma.playlist.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          owner: { select: { id: true, username: true, avatar: true } },
          _count: { select: { tracks: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.playlist.count({ where }),
    ]);

    res.json({
      playlists,
      pagination: {
        page: parseInt(page), limit: parseInt(limit), total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getPlaylistById(req, res, next) {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, username: true, avatar: true } },
        tracks: {
          include: {
            track: {
              include: {
                artist: { select: { id: true, name: true } },
                album: { select: { id: true, name: true, imageUrl: true } },
              },
            },
          },
          orderBy: { position: 'asc' },
        },
      },
    });
    if (!playlist) throw new AppError('Playlist not found', 404);
    if (!playlist.isPublic && (!req.user || req.user.id !== playlist.ownerId)) {
      throw new AppError('Playlist is private', 403);
    }
    res.json({ playlist });
  } catch (err) {
    next(err);
  }
}

async function createPlaylist(req, res, next) {
  try {
    const { name, description, imageUrl, isPublic = true } = req.body;
    const playlist = await prisma.playlist.create({
      data: { name, description, imageUrl, isPublic, ownerId: req.user.id },
      include: {
        owner: { select: { id: true, username: true } },
        _count: { select: { tracks: true } },
      },
    });
    res.status(201).json({ playlist });
  } catch (err) {
    next(err);
  }
}

async function updatePlaylist(req, res, next) {
  try {
    const existing = await prisma.playlist.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Playlist not found', 404);
    if (existing.ownerId !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized', 403);
    }

    const { name, description, imageUrl, isPublic } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (isPublic !== undefined) data.isPublic = isPublic;

    const playlist = await prisma.playlist.update({
      where: { id: req.params.id },
      data,
      include: {
        owner: { select: { id: true, username: true } },
        _count: { select: { tracks: true } },
      },
    });
    res.json({ playlist });
  } catch (err) {
    next(err);
  }
}

async function deletePlaylist(req, res, next) {
  try {
    const existing = await prisma.playlist.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Playlist not found', 404);
    if (existing.ownerId !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized', 403);
    }
    await prisma.playlist.delete({ where: { id: req.params.id } });
    res.json({ message: 'Playlist deleted successfully' });
  } catch (err) {
    next(err);
  }
}

async function addTrackToPlaylist(req, res, next) {
  try {
    const { trackId } = req.body;
    const playlist = await prisma.playlist.findUnique({ where: { id: req.params.id } });
    if (!playlist) throw new AppError('Playlist not found', 404);
    if (playlist.ownerId !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized', 403);
    }

    const track = await prisma.track.findUnique({ where: { id: trackId } });
    if (!track) throw new AppError('Track not found', 404);

    const maxPos = await prisma.playlistTrack.aggregate({
      where: { playlistId: req.params.id },
      _max: { position: true },
    });

    const playlistTrack = await prisma.playlistTrack.create({
      data: {
        playlistId: req.params.id,
        trackId,
        position: (maxPos._max.position || 0) + 1,
      },
      include: {
        track: {
          include: { artist: { select: { id: true, name: true } } },
        },
      },
    });
    res.status(201).json({ playlistTrack });
  } catch (err) {
    if (err.code === 'P2002') {
      return next(new AppError('Track already in playlist', 409));
    }
    next(err);
  }
}

async function removeTrackFromPlaylist(req, res, next) {
  try {
    const playlist = await prisma.playlist.findUnique({ where: { id: req.params.id } });
    if (!playlist) throw new AppError('Playlist not found', 404);
    if (playlist.ownerId !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized', 403);
    }

    await prisma.playlistTrack.deleteMany({
      where: { playlistId: req.params.id, trackId: req.params.trackId },
    });
    res.json({ message: 'Track removed from playlist' });
  } catch (err) {
    next(err);
  }
}

async function getMyPlaylists(req, res, next) {
  try {
    const playlists = await prisma.playlist.findMany({
      where: { ownerId: req.user.id },
      include: {
        _count: { select: { tracks: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ playlists });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllPlaylists, getPlaylistById, createPlaylist, updatePlaylist,
  deletePlaylist, addTrackToPlaylist, removeTrackFromPlaylist, getMyPlaylists,
};
