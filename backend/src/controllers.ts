import { FastifyReply, FastifyRequest } from 'fastify';
import * as repository from './repository';
import crypto from 'crypto';
import { OutfitDatabaseModel, Rating, TokenPayload, UserDatabaseModel } from './types';
import bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 10;

type TokensResponse = {
  access_token: string;
  refresh_token: string;
};

type LoginBody = {
  username?: string;
  password?: string;
};

type SignUpBody = {
  username?: string;
  phone?: string;
  email?: string;
  password?: string;
};

const sanitizeUser = (user: unknown) => {
  const safeUser = { ...(user as Record<string, unknown>) };
  delete safeUser.password;
  return safeUser;
};

const generateFreshTokens = async (
  userId: string,
  userRole: string,
  reply: FastifyReply
): Promise<TokensResponse> => {
  const payload: TokenPayload = {
    user_id: userId,
    role: userRole,
    type: '',
  };

  const access_token = await reply.jwtSign(
    { ...payload, type: 'access' },
    { expiresIn: '60s' }
  );
  const refresh_token = await reply.jwtSign(
    { ...payload, type: 'refresh' },
    { expiresIn: '10y' }
  );

  return { access_token, refresh_token };
};

const createAuthResponse = async (user: UserDatabaseModel, res: FastifyReply) => {
  const tokens = await generateFreshTokens(user._id, user.role || 'user', res);
  return {
    ...tokens,
    user: sanitizeUser(user),
  };
};

export const refreshToken = async (req: FastifyRequest, res: FastifyReply) => {
  const body = req.body as { refresh_token?: string };

  if (!body?.refresh_token) {
    return res.status(400).send({ message: 'Refresh token is required' });
  }

  const decoded = req.server.jwt.decode<TokenPayload>(body.refresh_token);

  if (!decoded || decoded.type !== 'refresh') {
    return res.status(401).send({ message: 'Invalid refresh token' });
  }

  const user = (await repository.findUserById(decoded.user_id)) as UserDatabaseModel | null;

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  return res.status(200).send(await createAuthResponse(user, res));
};

export const login = async (req: FastifyRequest, res: FastifyReply) => {
  const body = req.body as LoginBody;

  if (!body?.username || !body?.password) {
    return res.status(400).send({ message: 'Username and password are required' });
  }

  const user = (await repository.findUserByUsername(body.username)) as UserDatabaseModel | null;

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  if (!user.password) {
    return res
      .status(400)
      .send({ message: 'This account uses Auth0. Please log in with Auth0.' });
  }

  let isPasswordValid = false;

  try {
    isPasswordValid = await bcrypt.compare(body.password, user.password);
  } catch {
    // Support legacy plaintext passwords during migration.
    isPasswordValid = body.password === user.password;
    if (isPasswordValid) {
      const migratedPassword = await bcrypt.hash(body.password, BCRYPT_SALT_ROUNDS);
      await repository.updateUserById(user._id, { password: migratedPassword });
    }
  }

  if (!isPasswordValid) {
    return res.status(401).send({ message: 'Invalid password' });
  }

  return res.status(200).send(await createAuthResponse(user, res));
};

export const signUp = async (req: FastifyRequest, res: FastifyReply) => {
  const body = req.body as SignUpBody;

  if (!body?.username || !body?.phone || !body?.email || !body?.password) {
    return res
      .status(400)
      .send({ message: 'Required fields: username, phone, email, password' });
  }

  const existingUser = await repository.findUserByUsername(body.username);

  if (existingUser) {
    return res.status(400).send({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(body.password, BCRYPT_SALT_ROUNDS);

  const user: UserDatabaseModel = {
    _id: crypto.randomUUID(),
    email: body.email,
    password: hashedPassword,
    username: body.username,
    role: 'user',
    phone: body.phone,
    created_at: new Date().toISOString(),
  };

  await repository.insertUser(user);

  return res.status(201).send(await createAuthResponse(user, res));
};

export const getAllUsers = async (_req: FastifyRequest, res: FastifyReply) => {
  try {
    const users = await repository.getAllUsers();
    return res.status(200).send(users.map((u) => sanitizeUser(u)));
  } catch {
    return res.status(500).send({ message: 'Failed to fetch users' });
  }
};

export const getUserByAuth0 = async (req: FastifyRequest, res: FastifyReply) => {
  const { auth0Id } = req.params as { auth0Id?: string };

  if (!auth0Id) {
    return res.status(400).send({ message: 'auth0Id is required' });
  }

  try {
    const user = await repository.findUserByAuth0Id(auth0Id);
    if (!user) {
      return res.status(404).send({});
    }

    return res.status(200).send(sanitizeUser(user));
  } catch {
    return res.status(500).send({ message: 'Failed to fetch user' });
  }
};

export const createUserFromAuth0 = async (req: FastifyRequest, res: FastifyReply) => {
  const body = req.body as {
    auth0Id?: string;
    username?: string;
    email?: string;
    password?: string;
  };
  const { auth0Id, username, email, password } = body || {};

  if (!auth0Id || !username || !password) {
    return res.status(400).send({ message: 'auth0Id, username and password are required' });
  }

  try {
    const existingByAuth0Id = await repository.findUserByAuth0Id(auth0Id);
    if (existingByAuth0Id) {
      return res.status(200).send({
        message: 'User already linked',
        user: sanitizeUser(existingByAuth0Id),
      });
    }

    const existingByUsername = await repository.findUserByUsername(username);

    if (existingByUsername) {
      return res.status(400).send({ message: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    await repository.createUserFromAuth0(auth0Id, username, hashedPassword, email);
    const createdUser = await repository.findUserByAuth0Id(auth0Id);

    return res.status(201).send({
      message: 'User created',
      user: createdUser ? sanitizeUser(createdUser) : null,
    });
  } catch {
    return res.status(500).send({ message: 'Failed to create or link user' });
  }
};

export const getCurrentUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const userId = (req as FastifyRequest & { user: TokenPayload }).user.user_id;
    const user = await repository.findUserById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    return res.status(200).send(sanitizeUser(user));
  } catch {
    return res.status(500).send({ message: 'Failed to get user data' });
  }
};

export const updateUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const body = req.body as {
      user?: { _id?: string };
      email?: string;
      phone?: string;
      password?: string;
    };

    const userId = body?.user?._id;

    if (!userId) {
      return res.status(400).send({ message: 'user._id is required' });
    }

    const updateData: {
      email?: string;
      phone?: string;
      password?: string;
    } = {};

    if (body.email) updateData.email = body.email;
    if (body.phone) updateData.phone = body.phone;
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, BCRYPT_SALT_ROUNDS);
    }

    const updatedUser = await repository.updateUserById(userId, updateData);

    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    return res.status(200).send(sanitizeUser(updatedUser));
  } catch {
    return res.status(500).send({ message: 'Failed to update user' });
  }
};

// export const createOutfit = async (req: FastifyRequest, res: FastifyReply) => {
//   const body = req.body as {
//     username?: string;
//     top_id?: string;
//     bottom_id?: string;
//     skin?: 'dark' | 'light';
//   };

//   if (!body?.username || !body?.top_id || !body?.bottom_id) {
//     return res.status(400).send({ message: 'username, top_id and bottom_id are required' });
//   }

//   const outfit: OutfitDatabaseModel = {
//     _id: crypto.randomUUID(),
//     username: body.username,
//     top_id: body.top_id,
//     bottom_id: body.bottom_id,
//     skin: body.skin,
//     ratings: [],
//     created_at: new Date().toISOString(),
//   };

//   // Keep exactly one saved outfit per user by replacing previous entries.
//   await repository.deleteOutfitsByUsername(body.username);
//   await repository.insertOutfit(outfit);
//   return res.status(201).send(outfit);
// };

// export const getOutfits = async (_req: FastifyRequest, res: FastifyReply) => {
//   try {
//     const outfits = await repository.getAllOutfits();
//     return res.status(200).send(outfits);
//   } catch {
//     return res.status(500).send({ message: 'Failed to fetch outfits' });
//   }
// };

// export const getOutfitsByUserId = async (req: FastifyRequest, res: FastifyReply) => {
//   const { userId } = req.params as { userId?: string };

//   if (!userId) {
//     return res.status(400).send({ message: 'userId is required' });
//   }

//   try {
//     const outfits = await repository.getOutfitsByUserId(userId);
//     return res.status(200).send(outfits);
//   } catch {
//     return res.status(500).send({ message: 'Failed to fetch outfits for user' });
//   }
// };

// export const updateOutfit = async (req: FastifyRequest, res: FastifyReply) => {
//   const { outfitId } = req.params as { outfitId?: string };
//   const body = req.body as { top_id?: string; bottom_id?: string };

//   if (!outfitId) {
//     return res.status(400).send({ message: 'outfitId is required' });
//   }

//   if (!body?.top_id && !body?.bottom_id) {
//     return res.status(400).send({ message: 'Nothing to update' });
//   }

//   await repository.updateOutfit(outfitId, {
//     top_id: body.top_id,
//     bottom_id: body.bottom_id,
//   });

//   const updated = await repository.findOutfitById(outfitId);
//   if (!updated) {
//     return res.status(404).send({ message: 'Outfit not found' });
//   }

//   return res.status(200).send({ message: 'Outfit updated successfully', outfit: updated });
// };

// export const rateOutfit = async (req: FastifyRequest, res: FastifyReply) => {
//   const { outfitId } = req.params as { outfitId?: string };
//   const body = req.body as { grade?: number; username?: string };

//   if (!outfitId) {
//     return res.status(400).send({ message: 'outfitId is required' });
//   }

//   if (!body?.username || typeof body.grade !== 'number') {
//     return res.status(400).send({ message: 'grade and username are required' });
//   }

//   const rating: Rating = {
//     grade: body.grade,
//     username: body.username,
//   };

//   await repository.rateOutfit(outfitId, rating);
//   const updated = await repository.findOutfitById(outfitId);

//   if (!updated) {
//     return res.status(404).send({ message: 'Outfit not found' });
//   }

//   return res.status(200).send(updated);
// };

// export const deleteOutfit = async (req: FastifyRequest, res: FastifyReply) => {
//   const { outfitId } = req.params as { outfitId?: string };

//   if (!outfitId) {
//     return res.status(400).send({ message: 'outfitId is required' });
//   }

//   const existing = await repository.findOutfitById(outfitId);
//   if (!existing) {
//     return res.status(404).send({ message: 'Outfit not found' });
//   }

//   await repository.deleteOutfitById(outfitId);
//   return res.status(204).send();
// };
