const { prisma } = require('../config/database');

async function search(req, res, next) {
  try {
    const { q, type = 'all', limit = 10 } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ tracks: [], artists: [], albums: [], playlists: [] });
    }

    const searchTerm = q.trim();
    const take = Math.min(parseInt(limit), 50);
    const results = {};

    const searchTypes = type === 'all' ? ['tracks', 'artists', 'albums', 'playlists'] : [type];

    const promises = [];

    if (searchTypes.includes('tracks')) {
      promises.push(
        prisma.track.findMany({
          where: {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { artist: { name: { contains: searchTerm, mode: 'insensitive' } } },
            ],
          },
          take,
          include: {
            artist: { select: { id: true, name: true } },
            album: { select: { id: true, name: true, imageUrl: true } },
          },
        }).then((tracks) => { results.tracks = tracks; })
      );
    }

    if (searchTypes.includes('artists')) {
      promises.push(
        prisma.artist.findMany({
          where: { name: { contains: searchTerm, mode: 'insensitive' } },
          take,
          include: { _count: { select: { albums: true, tracks: true } } },
        }).then((artists) => { results.artists = artists; })
      );
    }

    if (searchTypes.includes('albums')) {
      promises.push(
        prisma.album.findMany({
          where: {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { artist: { name: { contains: searchTerm, mode: 'insensitive' } } },
            ],
          },
          take,
          include: {
            artist: { select: { id: true, name: true } },
            _count: { select: { tracks: true } },
          },
        }).then((albums) => { results.albums = albums; })
      );
    }

    if (searchTypes.includes('playlists')) {
      promises.push(
        prisma.playlist.findMany({
          where: {
            isPublic: true,
            name: { contains: searchTerm, mode: 'insensitive' },
          },
          take,
          include: {
            owner: { select: { id: true, username: true } },
            _count: { select: { tracks: true } },
          },
        }).then((playlists) => { results.playlists = playlists; })
      );
    }

    await Promise.all(promises);
    res.json(results);
  } catch (err) {
    next(err);
  }
}

module.exports = { search };
