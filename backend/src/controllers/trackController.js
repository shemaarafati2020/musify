const { prisma } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

async function getAllTracks(req, res, next) {
  try {
    const { page = 1, limit = 20, search, artistId, albumId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { artist: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (artistId) where.artistId = artistId;
    if (albumId) where.albumId = albumId;

    const [tracks, total] = await Promise.all([
      prisma.track.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          artist: { select: { id: true, name: true, imageUrl: true } },
          album: { select: { id: true, name: true, imageUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.track.count({ where }),
    ]);

    res.json({
      tracks,
      pagination: {
        page: parseInt(page), limit: parseInt(limit), total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getTrackById(req, res, next) {
  try {
    const track = await prisma.track.findUnique({
      where: { id: req.params.id },
      include: {
        artist: { select: { id: true, name: true, imageUrl: true } },
        album: { select: { id: true, name: true, imageUrl: true } },
      },
    });
    if (!track) throw new AppError('Track not found', 404);
    res.json({ track });
  } catch (err) {
    next(err);
  }
}

async function createTrack(req, res, next) {
  try {
    const { name, artistId, albumId, duration, imageUrl, audioUrl, previewUrl } = req.body;
    const artist = await prisma.artist.findUnique({ where: { id: artistId } });
    if (!artist) throw new AppError('Artist not found', 404);

    const track = await prisma.track.create({
      data: { name, artistId, albumId, duration, imageUrl, audioUrl, previewUrl },
      include: {
        artist: { select: { id: true, name: true } },
        album: { select: { id: true, name: true } },
      },
    });
    res.status(201).json({ track });
  } catch (err) {
    next(err);
  }
}

async function updateTrack(req, res, next) {
  try {
    const { name, duration, imageUrl, audioUrl, previewUrl } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (duration !== undefined) data.duration = duration;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (audioUrl !== undefined) data.audioUrl = audioUrl;
    if (previewUrl !== undefined) data.previewUrl = previewUrl;

    const track = await prisma.track.update({
      where: { id: req.params.id },
      data,
      include: {
        artist: { select: { id: true, name: true } },
        album: { select: { id: true, name: true } },
      },
    });
    res.json({ track });
  } catch (err) {
    if (err.code === 'P2025') return next(new AppError('Track not found', 404));
    next(err);
  }
}

async function deleteTrack(req, res, next) {
  try {
    await prisma.track.delete({ where: { id: req.params.id } });
    res.json({ message: 'Track deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return next(new AppError('Track not found', 404));
    next(err);
  }
}

async function recordPlay(req, res, next) {
  try {
    const trackId = req.params.id;
    await Promise.all([
      prisma.track.update({ where: { id: trackId }, data: { plays: { increment: 1 } } }),
      req.user
        ? prisma.playHistory.create({ data: { userId: req.user.id, trackId } })
        : Promise.resolve(),
    ]);
    res.json({ message: 'Play recorded' });
  } catch (err) {
    next(err);
  }
}

async function likeTrack(req, res, next) {
  try {
    const existing = await prisma.likedTrack.findUnique({
      where: { userId_trackId: { userId: req.user.id, trackId: req.params.id } },
    });
    if (existing) {
      await prisma.likedTrack.delete({ where: { id: existing.id } });
      return res.json({ liked: false, message: 'Track unliked' });
    }
    await prisma.likedTrack.create({
      data: { userId: req.user.id, trackId: req.params.id },
    });
    res.json({ liked: true, message: 'Track liked' });
  } catch (err) {
    next(err);
  }
}

async function getLikedTracks(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [likedTracks, total] = await Promise.all([
      prisma.likedTrack.findMany({
        where: { userId: req.user.id },
        skip,
        take: parseInt(limit),
        include: {
          track: {
            include: {
              artist: { select: { id: true, name: true } },
              album: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { likedAt: 'desc' },
      }),
      prisma.likedTrack.count({ where: { userId: req.user.id } }),
    ]);

    res.json({
      tracks: likedTracks.map((lt) => ({ ...lt.track, likedAt: lt.likedAt })),
      pagination: {
        page: parseInt(page), limit: parseInt(limit), total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTracks, getTrackById, createTrack, updateTrack, deleteTrack,
  recordPlay, likeTrack, getLikedTracks,
};
