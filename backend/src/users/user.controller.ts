import { FastifyReply, FastifyRequest } from 'fastify';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { sendError } from '../http/errors';
import { TokenPayload, UserDatabaseModel } from './types';
import * as userService from './user.service';

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
  delete safeUser.refresh_token_hash;
  delete safeUser.refresh_token_expires_at;
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
    { expiresIn: '7d' }
  );

  const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await userService.storeRefreshToken(userId, refresh_token, refreshExpiresAt);

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
    return sendError(res, 400, 'Refresh token is required', 'BAD_REQUEST');
  }

  let decoded: TokenPayload;

  try {
    decoded = await req.server.jwt.verify<TokenPayload>(body.refresh_token);
  } catch {
    return sendError(res, 401, 'Invalid refresh token', 'UNAUTHORIZED');
  }

  if (decoded.type !== 'refresh') {
    return sendError(res, 401, 'Invalid refresh token', 'UNAUTHORIZED');
  }

  const user = (await userService.findUserById(decoded.user_id)) as UserDatabaseModel | null;

  if (!user) {
    return sendError(res, 404, 'User not found', 'NOT_FOUND');
  }

  const isStoredTokenValid = await userService.verifyStoredRefreshToken(user, body.refresh_token);
  if (!isStoredTokenValid) {
    return sendError(res, 401, 'Invalid refresh token', 'UNAUTHORIZED');
  }

  return res.status(200).send(await createAuthResponse(user, res));
};

export const login = async (req: FastifyRequest, res: FastifyReply) => {
  const body = req.body as LoginBody;

  if (!body?.username || !body?.password) {
    return sendError(res, 400, 'Username and password are required', 'BAD_REQUEST');
  }

  const user = (await userService.findUserByUsername(body.username)) as UserDatabaseModel | null;

  if (!user) {
    return sendError(res, 404, 'User not found', 'NOT_FOUND');
  }

  if (!user.password) {
    return sendError(res, 400, 'This account uses Auth0. Please log in with Auth0.', 'BAD_REQUEST');
  }

  let isPasswordValid = false;

  try {
    isPasswordValid = await bcrypt.compare(body.password, user.password);
  } catch {
    isPasswordValid = body.password === user.password;
    if (isPasswordValid) {
      const migratedPassword = await bcrypt.hash(body.password, BCRYPT_SALT_ROUNDS);
      await userService.updateUserById(user._id, { password: migratedPassword });
    }
  }

  if (!isPasswordValid) {
    return sendError(res, 401, 'Invalid password', 'UNAUTHORIZED');
  }

  return res.status(200).send(await createAuthResponse(user, res));
};

export const signUp = async (req: FastifyRequest, res: FastifyReply) => {
  const body = req.body as SignUpBody;

  if (!body?.username || !body?.phone || !body?.email || !body?.password) {
    return sendError(res, 400, 'Required fields: username, phone, email, password', 'BAD_REQUEST');
  }

  const existingUser = await userService.findUserByUsername(body.username);

  if (existingUser) {
    return sendError(res, 400, 'User already exists', 'CONFLICT');
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

  await userService.insertUser(user);

  return res.status(201).send(await createAuthResponse(user, res));
};

export const getAllUsers = async (_req: FastifyRequest, res: FastifyReply) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).send(users.map((u) => sanitizeUser(u)));
  } catch {
    return sendError(res, 500, 'Failed to fetch users', 'INTERNAL_ERROR');
  }
};

export const getUserById = async (req: FastifyRequest, res: FastifyReply) => {
  const { userId } = req.params as { userId?: string };

  if (!userId) {
    return sendError(res, 400, 'userId is required', 'BAD_REQUEST');
  }

  try {
    const user = await userService.findUserById(userId);

    if (!user) {
      return sendError(res, 404, 'User not found', 'NOT_FOUND');
    }

    return res.status(200).send(sanitizeUser(user));
  } catch {
    return sendError(res, 500, 'Failed to fetch user', 'INTERNAL_ERROR');
  }
};

export const getUserByAuth0 = async (req: FastifyRequest, res: FastifyReply) => {
  const { auth0Id } = req.params as { auth0Id?: string };

  if (!auth0Id) {
    return sendError(res, 400, 'auth0Id is required', 'BAD_REQUEST');
  }

  try {
    const user = await userService.findUserByAuth0Id(auth0Id);
    if (!user) {
      return sendError(res, 404, 'User not found', 'NOT_FOUND');
    }

    return res.status(200).send(sanitizeUser(user));
  } catch {
    return sendError(res, 500, 'Failed to fetch user', 'INTERNAL_ERROR');
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

  if (!auth0Id || !username) {
    return sendError(res, 400, 'auth0Id and username are required', 'BAD_REQUEST');
  }

  try {
    const existingByAuth0Id = await userService.findUserByAuth0Id(auth0Id);
    if (existingByAuth0Id) {
      const trimmedUsername = username.trim();

      if (!trimmedUsername) {
        return sendError(res, 400, 'Username cannot be empty', 'BAD_REQUEST');
      }

      const existingByUsername = await userService.findUserByUsername(trimmedUsername);

      if (existingByUsername && existingByUsername._id !== existingByAuth0Id._id) {
        return sendError(res, 400, 'Username is already taken', 'CONFLICT');
      }

      const updateData: Record<string, unknown> = { username: trimmedUsername };
      if (email) {
        updateData.email = email;
      }

      const updatedUser = await userService.updateUserById(existingByAuth0Id._id, updateData);

      return res.status(200).send({
        message: 'User updated',
        user: updatedUser ? sanitizeUser(updatedUser) : sanitizeUser(existingByAuth0Id),
      });
    }

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return sendError(res, 400, 'Username cannot be empty', 'BAD_REQUEST');
    }

    const existingByUsername = await userService.findUserByUsername(trimmedUsername);

    if (existingByUsername) {
      return sendError(res, 400, 'Username is already taken', 'CONFLICT');
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
      : '';

    await userService.createUserFromAuth0(auth0Id, trimmedUsername, hashedPassword, email);
    const createdUser = await userService.findUserByAuth0Id(auth0Id);

    return res.status(201).send({
      message: 'User created',
      user: createdUser ? sanitizeUser(createdUser) : null,
    });
  } catch {
    return sendError(res, 500, 'Failed to create or link user', 'INTERNAL_ERROR');
  }
};

export const getCurrentUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const userId = (req as FastifyRequest & { user: TokenPayload }).user.user_id;
    const user = await userService.findUserById(userId);

    if (!user) {
      return sendError(res, 404, 'User not found', 'NOT_FOUND');
    }

    return res.status(200).send(sanitizeUser(user));
  } catch {
    return sendError(res, 500, 'Failed to get user data', 'INTERNAL_ERROR');
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
      return sendError(res, 400, 'user._id is required', 'BAD_REQUEST');
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

    const updatedUser = await userService.updateUserById(userId, updateData);

    if (!updatedUser) {
      return sendError(res, 404, 'User not found', 'NOT_FOUND');
    }

    return res.status(200).send(sanitizeUser(updatedUser));
  } catch {
    return sendError(res, 500, 'Failed to update user', 'INTERNAL_ERROR');
  }
};

export const updateUserById = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { userId } = req.params as { userId?: string };
    const body = req.body as {
      email?: string;
      phone?: string;
      password?: string;
    };

    if (!userId) {
      return sendError(res, 400, 'userId is required', 'BAD_REQUEST');
    }

    const updateData: {
      email?: string;
      phone?: string;
      password?: string;
    } = {};

    if (body?.email) updateData.email = body.email;
    if (body?.phone) updateData.phone = body.phone;
    if (body?.password) {
      updateData.password = await bcrypt.hash(body.password, BCRYPT_SALT_ROUNDS);
    }

    if (Object.keys(updateData).length === 0) {
      return sendError(res, 400, 'No fields to update', 'BAD_REQUEST');
    }

    const updatedUser = await userService.updateUserById(userId, updateData);

    if (!updatedUser) {
      return sendError(res, 404, 'User not found', 'NOT_FOUND');
    }

    return res.status(200).send(sanitizeUser(updatedUser));
  } catch {
    return sendError(res, 500, 'Failed to update user', 'INTERNAL_ERROR');
  }
};

export const deleteUserById = async (req: FastifyRequest, res: FastifyReply) => {
  const { userId } = req.params as { userId?: string };

  if (!userId) {
    return sendError(res, 400, 'userId is required', 'BAD_REQUEST');
  }

  try {
    const deletedCount = await userService.deleteUserById(userId);

    if (deletedCount === 0) {
      return sendError(res, 404, 'User not found', 'NOT_FOUND');
    }

    return res.status(200).send({ message: 'User deleted' });
  } catch {
    return sendError(res, 500, 'Failed to delete user', 'INTERNAL_ERROR');
  }
};

export const updateUserRole = async (req: FastifyRequest, res: FastifyReply) => {
  const { userId } = req.params as { userId?: string };
  const body = req.body as { role?: 'user' | 'admin' };

  if (!userId) {
    return sendError(res, 400, 'userId is required', 'BAD_REQUEST');
  }

  if (body?.role !== 'user' && body?.role !== 'admin') {
    return sendError(res, 400, 'role must be either user or admin', 'BAD_REQUEST');
  }

  try {
    const updatedUser = await userService.updateUserById(userId, { role: body.role });

    if (!updatedUser) {
      return sendError(res, 404, 'User not found', 'NOT_FOUND');
    }

    return res.status(200).send(sanitizeUser(updatedUser));
  } catch {
    return sendError(res, 500, 'Failed to update user role', 'INTERNAL_ERROR');
  }
};
