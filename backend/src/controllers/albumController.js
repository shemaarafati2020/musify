const { prisma } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

async function getAllAlbums(req, res, next) {
  try {
    const { page = 1, limit = 20, search, artistId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { artist: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (artistId) where.artistId = artistId;

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          artist: { select: { id: true, name: true, imageUrl: true } },
          _count: { select: { tracks: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.album.count({ where }),
    ]);

    res.json({
      albums,
      pagination: {
        page: parseInt(page), limit: parseInt(limit), total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getAlbumById(req, res, next) {
  try {
    const album = await prisma.album.findUnique({
      where: { id: req.params.id },
      include: {
        artist: { select: { id: true, name: true, imageUrl: true } },
        tracks: {
          include: { artist: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!album) throw new AppError('Album not found', 404);
    res.json({ album });
  } catch (err) {
    next(err);
  }
}

async function createAlbum(req, res, next) {
  try {
    const { name, artistId, imageUrl, releaseDate } = req.body;
    const artist = await prisma.artist.findUnique({ where: { id: artistId } });
    if (!artist) throw new AppError('Artist not found', 404);

    const album = await prisma.album.create({
      data: { name, artistId, imageUrl, releaseDate },
      include: { artist: { select: { id: true, name: true } } },
    });
    res.status(201).json({ album });
  } catch (err) {
    next(err);
  }
}

async function updateAlbum(req, res, next) {
  try {
    const { name, imageUrl, releaseDate } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (releaseDate !== undefined) data.releaseDate = releaseDate;

    const album = await prisma.album.update({
      where: { id: req.params.id },
      data,
      include: { artist: { select: { id: true, name: true } } },
    });
    res.json({ album });
  } catch (err) {
    if (err.code === 'P2025') return next(new AppError('Album not found', 404));
    next(err);
  }
}

async function deleteAlbum(req, res, next) {
  try {
    await prisma.album.delete({ where: { id: req.params.id } });
    res.json({ message: 'Album deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return next(new AppError('Album not found', 404));
    next(err);
  }
}

module.exports = { getAllAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum };
