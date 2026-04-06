const { prisma } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

async function getAllArtists(req, res, next) {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [artists, total] = await Promise.all([
      prisma.artist.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          _count: { select: { albums: true, tracks: true } },
        },
        orderBy: { followers: 'desc' },
      }),
      prisma.artist.count({ where }),
    ]);

    res.json({
      artists,
      pagination: {
        page: parseInt(page), limit: parseInt(limit), total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getArtistById(req, res, next) {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id: req.params.id },
      include: {
        albums: { include: { tracks: true } },
        tracks: {
          include: { album: { select: { id: true, name: true } } },
          orderBy: { plays: 'desc' },
          take: 10,
        },
        _count: { select: { albums: true, tracks: true } },
      },
    });
    if (!artist) throw new AppError('Artist not found', 404);
    res.json({ artist });
  } catch (err) {
    next(err);
  }
}

async function createArtist(req, res, next) {
  try {
    const { name, imageUrl, bio } = req.body;
    const artist = await prisma.artist.create({
      data: { name, imageUrl, bio },
    });
    res.status(201).json({ artist });
  } catch (err) {
    next(err);
  }
}

async function updateArtist(req, res, next) {
  try {
    const { name, imageUrl, bio } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (bio !== undefined) data.bio = bio;

    const artist = await prisma.artist.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ artist });
  } catch (err) {
    if (err.code === 'P2025') return next(new AppError('Artist not found', 404));
    next(err);
  }
}

async function deleteArtist(req, res, next) {
  try {
    await prisma.artist.delete({ where: { id: req.params.id } });
    res.json({ message: 'Artist deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return next(new AppError('Artist not found', 404));
    next(err);
  }
}

module.exports = { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist };
