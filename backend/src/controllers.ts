import { FastifyRequest, FastifyReply } from 'fastify';
import * as repository from './repository';
import { TokenPayload, UserDatabaseModel } from './types';
import { ROLE_SALES_PERSON } from './auth';

const generateFreshTokens = async (
  userId: string,
  userRole: string,
  reply: FastifyReply
): Promise<any> => {
  const payload: TokenPayload = {
    user_id: userId,
    role: userRole,
    type: '', 
  };

  const newAccessToken = await reply.jwtSign(
    { ...payload, type: 'access' },
    { expiresIn: '60s' }
  );
  const newRefreshToken = await reply.jwtSign(
    { ...payload, type: 'refresh' },
    { expiresIn: '10y' }
  );

  return {
    access_token: newAccessToken,
    refresh_token: newRefreshToken,
  };
};

export const refreshToken = async (req: FastifyRequest, res: FastifyReply) => {
  const body = req.body as any;

  if (!body || !body.refresh_token) {
    return res.status(400).send({ message: 'Refresh token is required' });
  }

  const { refresh_token } = body;

  const decoded = req.server.jwt.decode<TokenPayload>(refresh_token);

  if (!decoded || decoded.type !== 'refresh') {
    return res.status(401).send({ message: 'Invalid refresh token' });
  }

  const user = await repository.findUserById(decoded.user_id);

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  
  const tokenRole = user.role === 'admin' ? 'admin' : ROLE_SALES_PERSON;
  const tokens = await generateFreshTokens(user._id, tokenRole, res);

  res.status(200).send({ ...tokens, user });
};


export const login = async (req: FastifyRequest, res: FastifyReply) => {
  const body = req.body as any;

  if (!body) {
    return res.status(400).send({ message: 'Request body is required' });
  }

  const { username, password } = body;

  if (!username || !password) {
    return res
      .status(400)
      .send({ message: 'Username and password are required' });
  }

  const user = await repository.findUserByUsername(username);

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  const isPasswordValid = password === user.password;

  if (!isPasswordValid) {
    return res.status(401).send({ message: 'Invalid password' });
  }

  
  const tokenRole = user.role === 'admin' ? 'admin' : ROLE_SALES_PERSON;
  const tokens = await generateFreshTokens(user._id, tokenRole, res);

  res.status(201).send({ ...tokens, user });
};

export const getAllUsers = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const users = await repository.getAllUsers();
    // gömmer lösenord 
    const sanitized = users.map(u => {
      const { password, ...rest } = u as any;
      return rest;
    });
    res.status(200).send(sanitized);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch users' });
  }
};

export const getUserByAuth0 = async (req: FastifyRequest, res: FastifyReply) => {
  const { auth0Id } = req.params as { auth0Id: string };

  if (!auth0Id) {
    return res.status(400).send({ message: 'auth0Id is required' });
  }

  try {
    const user = await repository.findUserByAuth0Id(auth0Id);
    if (!user) {
      return res.status(404).send({});
    }
    const { password, ...rest } = user as any;
    res.status(200).send(rest);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch user' });
  }
};

export const createUserFromAuth0 = async (req: FastifyRequest, res: FastifyReply) => {
  const { auth0Id, username, email } = req.body as any;

  if (!auth0Id || !username) {
    return res
      .status(400)
      .send({ message: 'auth0Id and username are required' });
  }

  try {
    const existing = await repository.findUserByAuth0Id(auth0Id);
    if (existing) {
      return res.status(400).send({ message: 'User already exists' });
    }

    await repository.createUserFromAuth0(auth0Id, username, email);
    res.status(201).send({ message: 'User created' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to create user' });
  }
};

export const signUp = async (req: FastifyRequest, res: FastifyReply) => {
  const body = req.body as any;

  if (!body) {
    return res.status(400).send({ message: 'Body is required' });
  }

  const { username, phone, email, password } = body;

  if (!username || !phone || !email || !password) {
    return res
      .status(400)
      .send({ message: 'Required fields: username, phone, email, password' });
  }

  const existingUser = await repository.findUserByUsername(username);

  if (existingUser) {
    return res.status(400).send({ message: 'User already exists' });
  }

  const user: UserDatabaseModel = {
    _id: crypto.randomUUID(),
    email,
    password,
    username,
    role: 'user',
    phone,
    created_at: new Date().toISOString(),
  };

  await repository.insertUser(user);


  const tokenRole = user.role === 'admin' ? 'admin' : ROLE_SALES_PERSON;
  const tokens = await generateFreshTokens(user._id, tokenRole, res);

  res.status(201).send({ ...tokens, user });
};


  const updates: {
    username?: string;
    description?: string;
    price?: number;
    category?: string;
    image?: string;
  } = {};



export const getCurrentUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const userId = (req as any).user.user_id;
    const user = await repository.findUserById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    
    const { password, ...userData } = user;
    res.status(200).send(userData);
  } catch (error) {
    res.status(500).send({ message: 'Failed to get user data' });
  }
};

export const updateUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const userId = (req as any).body.user._id;
    const { email, phone, password } = req.body as any;

    const updateData: any = {};
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (password) {
      updateData.password = password;
    }

    const updatedUser = await repository.updateUserById(req.body.user._id, updateData);

    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

  
    const { password: _, ...userData } = updatedUser;
    res.status(200).send(userData);
  } catch (error) {
    res.status(500).send({ message: 'Failed to update user' });
  }
};
