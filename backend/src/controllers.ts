import { FastifyRequest, FastifyReply } from 'fastify';
import * as repository from './repository';
import { OutfitDatabaseModel, Rating, TokenPayload, UserDatabaseModel } from './types';
import { ROLE_SALES_PERSON } from './auth';

const generateFreshTokens = async (
  userId: string,
  userRole: string,
  reply: FastifyReply
): Promise<any> => {
  const payload: TokenPayload = {
    user_id: userId,
    role: userRole,
    type: '', // Will be set below
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

  // Map 'user' role to 'sales-person' for backward compatibility
  const tokenRole = user.role === 'admin' ? 'admin' : ROLE_SALES_PERSON;
  const tokens = await generateFreshTokens(user._id, tokenRole, res);

  res.status(200).send({ ...tokens, user });
};

export const getProducts = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const products = await repository.getAllProducts();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch products' });
  }
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

  // Map 'user' role to 'sales-person' for backward compatibility
  const tokenRole = user.role === 'admin' ? 'admin' : ROLE_SALES_PERSON;
  const tokens = await generateFreshTokens(user._id, tokenRole, res);

  res.status(201).send({ ...tokens, user });
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

  // Map 'user' role to 'sales-person' for backward compatibility
  const tokenRole = user.role === 'admin' ? 'admin' : ROLE_SALES_PERSON;
  const tokens = await generateFreshTokens(user._id, tokenRole, res);

  res.status(201).send({ ...tokens, user });
};

export const updateProduct = async (req: FastifyRequest, res: FastifyReply) => {
  const body = req.body as any;

  if (!body) {
    return res.status(400).send({ message: 'Request body is required' });
  }

  const { productId } = req.params as { productId: string };
  const { username, description, price, category, image } = body;

  if (!productId) {
    return res.status(400).send({ message: 'Product ID is required' });
  }

  const productIdNum = parseInt(productId, 10);
  if (isNaN(productIdNum)) {
    return res.status(400).send({ message: 'Invalid product ID format' });
  }

  // Check if product exists
  const existingProduct = await repository.findProductById(productIdNum);
  if (!existingProduct) {
    return res.status(404).send({ message: 'Product not found' });
  }

  // Build update object with only provided fields
  const updates: {
    username?: string;
    description?: string;
    price?: number;
    category?: string;
    image?: string;
  } = {};

  if (username !== undefined) updates.username = username;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      return res
        .status(400)
        .send({ message: 'Price must be a positive number' });
    }
    updates.price = price;
  }
  if (category !== undefined) updates.category = category;
  if (image !== undefined) updates.image = image;

  if (Object.keys(updates).length === 0) {
    return res
      .status(400)
      .send({ message: 'At least one field to update is required' });
  }

  try {
    const result = await repository.updateProduct(productIdNum, updates);

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Product not found' });
    }

    const updatedProduct = await repository.findProductById(productIdNum);
    res.status(200).send({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).send({ message: 'Failed to update product' });
  }
};

// Outfit related controllers

export const createOutfit = async (req: FastifyRequest, res: FastifyReply) => {
  const body = req.body as Partial<OutfitDatabaseModel>;

  if (!body) {
    return res.status(400).send({ message: 'Request body is required' });
  }

  const { username, top_id, bottom_id, skin } = body;


  if (!username || !top_id || !bottom_id) {
    return res.status(400).send({
      message: 'Required fields: username, top_id, bottom_id',
    });
  }

  // Ensure skin is always set to either "dark" or "light"
  const outfitSkin: "dark" | "light" = (skin === "light" || skin === "dark") ? skin : "dark";

  const outfit: OutfitDatabaseModel = {
    _id: crypto.randomUUID(),
    username,
    top_id,
    bottom_id,
    skin: outfitSkin,
    ratings: [],
    created_at: new Date().toISOString(),
  };

  // Enforce a single outfit per user: remove all existing, then insert the new one
  await repository.deleteOutfitsByUsername(username);
  await repository.insertOutfit(outfit);

  res.status(201).send(outfit);
};

export const getOutfits = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const outfits = await repository.getAllOutfits();
    res.status(200).send(outfits);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch outfits' });
  }
};

export const getOutfitsByUserId = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { userId } = req.params as { userId: string };

  if (!userId) {
    return res.status(400).send({ message: 'User ID is required' });
  }

  try {
    // Return all outfits for this user
    const outfits = await repository.getOutfitsByUserId(userId);
    res.status(200).send(outfits);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch outfits for user' });
  }
};

export const deleteOutfit = async (req: FastifyRequest, res: FastifyReply) => {
  const { outfitId } = req.params as { outfitId: string };

  if (!outfitId) {
    return res.status(400).send({ message: 'Outfit ID is required' });
  }

  try {
    const result = await repository.deleteOutfitById(outfitId);
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Outfit not found' });
    }
    res.status(200).send({ message: 'Outfit deleted' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete outfit' });
  }
};

export const updateOutfit = async (req: FastifyRequest, res: FastifyReply) => {
  const body = req.body as Partial<OutfitDatabaseModel>;
  const { outfitId } = req.params as { outfitId: string };

  if (!body) {
    return res.status(400).send({ message: 'Request body is required' });
  }

  if (!outfitId) {
    return res.status(400).send({ message: 'Outfit ID is required' });
  }

  const { top_id, bottom_id } = body;

  const updates: { top_id?: string; bottom_id?: string } = {};
  if (top_id !== undefined) updates.top_id = top_id;
  if (bottom_id !== undefined) updates.bottom_id = bottom_id;

  if (Object.keys(updates).length === 0) {
    return res
      .status(400)
      .send({ message: 'At least one field to update is required' });
  }

  const existingOutfit = await repository.findOutfitById(outfitId);
  if (!existingOutfit) {
    return res.status(404).send({ message: 'Outfit not found' });
  }

  try {
    const result = await repository.updateOutfit(outfitId, updates);

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Outfit not found' });
    }

    const updatedOutfit = await repository.findOutfitById(outfitId);
    res.status(200).send({
      message: 'Outfit updated successfully',
      outfit: updatedOutfit,
    });
  } catch (error) {
    res.status(500).send({ message: 'Failed to update outfit' });
  }
};

export const rateOutfit = async (req: FastifyRequest, res: FastifyReply) => {
  const { outfitId } = req.params as { outfitId: string };
  const body = req.body as Partial<Rating>;

  if (!body) {
    return res.status(400).send({ message: 'Request body is required' });
  }

  if (!outfitId) {
    return res.status(400).send({ message: 'Outfit ID is required' });
  }

  const { grade, username } = body;

  if (
    grade === undefined ||
    typeof grade !== 'number' ||
    grade < 0 ||
    grade > 5
  ) {
    return res
      .status(400)
      .send({ message: 'Grade must be a number between 0 and 5' });
  }

  if (!username) {
    return res.status(400).send({ message: 'Username is required' });
  }

  const existingOutfit = await repository.findOutfitById(outfitId);
  if (!existingOutfit) {
    return res.status(404).send({ message: 'Outfit not found' });
  }

  const rating: Rating = { grade, username };

  try {
    const result = await repository.rateOutfit(outfitId, rating);

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Outfit not found' });
    }

    const updatedOutfit = await repository.findOutfitById(outfitId);
    res.status(200).send({
      message: 'Outfit rated successfully',
      outfit: updatedOutfit,
    });
  } catch (error) {
    res.status(500).send({ message: 'Failed to rate outfit' });
  }
};

export const getCurrentUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const userId = (req as any).user.user_id;
    const user = await repository.findUserById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Return user data without password
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

    // Return updated user data without password
    const { password: _, ...userData } = updatedUser;
    res.status(200).send(userData);
  } catch (error) {
    res.status(500).send({ message: 'Failed to update user' });
  }
};
