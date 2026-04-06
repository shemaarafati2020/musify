const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const { prisma } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, username: user.username },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, tokenId: uuidv4() },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
}

async function signup({ email, username, password }) {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existingUser) {
    throw new AppError(
      existingUser.email === email
        ? 'Email already registered'
        : 'Username already taken',
      409
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }
  if (user.status === 'suspended') {
    throw new AppError('Account suspended', 403);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
}

async function refreshAccessToken(token) {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const accessToken = generateAccessToken(storedToken.user);
    const newRefreshToken = generateRefreshToken(storedToken.user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: { token: newRefreshToken, userId: storedToken.user.id, expiresAt },
    });

    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Invalid refresh token', 401);
  }
}

async function logout(userId, refreshToken) {
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  } else {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }
}

module.exports = { signup, login, refreshAccessToken, logout };
