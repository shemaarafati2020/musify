const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);
  const guestPassword = await bcrypt.hash('guest', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@musify.com' },
    update: {},
    create: {
      email: 'admin@musify.com',
      username: 'admin',
      password: adminPassword,
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      theme: 'dark',
      explicitContent: true,
      autoplay: true,
      volume: 0.8,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@musify.com' },
    update: {},
    create: {
      email: 'user@musify.com',
      username: 'musiclover',
      password: userPassword,
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      volume: 0.6,
    },
  });

  const guest = await prisma.user.upsert({
    where: { email: 'guest@musify.com' },
    update: {},
    create: {
      email: 'guest@musify.com',
      username: 'guest',
      password: guestPassword,
      role: 'guest',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
    },
  });

  console.log('Users created:', { admin: admin.id, user: user.id, guest: guest.id });

  // Create artists
  const artistsData = [
    { name: 'The Weeknd', imageUrl: 'https://picsum.photos/seed/artist1/300/300', followers: 75432123 },
    { name: 'Ed Sheeran', imageUrl: 'https://picsum.photos/seed/artist2/300/300', followers: 83210987 },
    { name: 'Adele', imageUrl: 'https://picsum.photos/seed/artist3/300/300', followers: 65432109 },
    { name: 'Dua Lipa', imageUrl: 'https://picsum.photos/seed/artist4/300/300', followers: 70234567 },
    { name: 'Harry Styles', imageUrl: 'https://picsum.photos/seed/artist5/300/300', followers: 52678901 },
    { name: 'Olivia Rodrigo', imageUrl: 'https://picsum.photos/seed/artist6/300/300', followers: 40123456 },
  ];

  const artists = [];
  for (const data of artistsData) {
    const artist = await prisma.artist.create({ data });
    artists.push(artist);
  }
  console.log(`${artists.length} artists created`);

  // Create albums
  const albumsData = [
    { name: 'After Hours', artistId: artists[0].id, imageUrl: 'https://picsum.photos/seed/album1/300/300', releaseDate: '2020' },
    { name: '÷ (Divide)', artistId: artists[1].id, imageUrl: 'https://picsum.photos/seed/album2/300/300', releaseDate: '2017' },
    { name: '21', artistId: artists[2].id, imageUrl: 'https://picsum.photos/seed/album3/300/300', releaseDate: '2011' },
    { name: 'Future Nostalgia', artistId: artists[3].id, imageUrl: 'https://picsum.photos/seed/album4/300/300', releaseDate: '2020' },
    { name: 'Fine Line', artistId: artists[4].id, imageUrl: 'https://picsum.photos/seed/album5/300/300', releaseDate: '2019' },
    { name: 'SOUR', artistId: artists[5].id, imageUrl: 'https://picsum.photos/seed/album6/300/300', releaseDate: '2021' },
  ];

  const albums = [];
  for (const data of albumsData) {
    const album = await prisma.album.create({ data });
    albums.push(album);
  }
  console.log(`${albums.length} albums created`);

  // Create tracks
  const tracksData = [
    { name: 'Blinding Lights', artistId: artists[0].id, albumId: albums[0].id, duration: 200, imageUrl: 'https://picsum.photos/seed/track1/300/300' },
    { name: 'Shape of You', artistId: artists[1].id, albumId: albums[1].id, duration: 233, imageUrl: 'https://picsum.photos/seed/track2/300/300' },
    { name: 'Someone Like You', artistId: artists[2].id, albumId: albums[2].id, duration: 285, imageUrl: 'https://picsum.photos/seed/track3/300/300' },
    { name: 'Save Your Tears', artistId: artists[0].id, albumId: albums[0].id, duration: 215, imageUrl: 'https://picsum.photos/seed/track11/300/300' },
    { name: 'Levitating', artistId: artists[3].id, albumId: albums[3].id, duration: 203, imageUrl: 'https://picsum.photos/seed/track5/300/300' },
    { name: 'Watermelon Sugar', artistId: artists[4].id, albumId: albums[4].id, duration: 174, imageUrl: 'https://picsum.photos/seed/track6/300/300' },
    { name: 'Good 4 U', artistId: artists[5].id, albumId: albums[5].id, duration: 178, imageUrl: 'https://picsum.photos/seed/track9/300/300' },
    { name: 'Montero', artistId: artists[5].id, albumId: albums[5].id, duration: 137, imageUrl: 'https://picsum.photos/seed/track10/300/300' },
    { name: 'Starboy', artistId: artists[0].id, albumId: albums[0].id, duration: 230, imageUrl: 'https://picsum.photos/seed/track4/300/300' },
    { name: 'Peaches', artistId: artists[1].id, albumId: albums[1].id, duration: 198, imageUrl: 'https://picsum.photos/seed/track8/300/300' },
    { name: 'Stay', artistId: artists[4].id, albumId: albums[4].id, duration: 141, imageUrl: 'https://picsum.photos/seed/track7/300/300' },
    { name: 'Kiss Me More', artistId: artists[3].id, albumId: albums[3].id, duration: 209, imageUrl: 'https://picsum.photos/seed/track12/300/300' },
  ];

  const tracks = [];
  for (const data of tracksData) {
    const track = await prisma.track.create({ data });
    tracks.push(track);
  }
  console.log(`${tracks.length} tracks created`);

  // Create playlists
  const playlistsData = [
    { name: 'Liked Songs', description: 'Your favorite songs', ownerId: user.id },
    { name: 'Daily Mix 1', description: 'The Weeknd, Dua Lipa, and more', ownerId: admin.id },
    { name: 'Chill Hits', description: 'Kick back to the best chill hits', ownerId: admin.id },
    { name: 'Focus Flow', description: 'Uptempo beats to stay focused', ownerId: user.id },
    { name: 'Workout', description: 'Keep the energy high', ownerId: user.id },
  ];

  for (const data of playlistsData) {
    const playlist = await prisma.playlist.create({ data });
    // Add some tracks to each playlist
    const shuffled = tracks.sort(() => 0.5 - Math.random()).slice(0, 4);
    for (let i = 0; i < shuffled.length; i++) {
      await prisma.playlistTrack.create({
        data: { playlistId: playlist.id, trackId: shuffled[i].id, position: i + 1 },
      });
    }
  }
  console.log(`${playlistsData.length} playlists created with tracks`);

  // Add liked tracks for user
  for (let i = 0; i < 6; i++) {
    await prisma.likedTrack.create({
      data: { userId: user.id, trackId: tracks[i].id },
    });
  }
  console.log('Liked tracks added for user');

  console.log('Seeding complete!');
}

seed()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
