import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  auth0_id: string;
  email: string;
  username?: string;
  created_at: Date;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  auth0_id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  username: { type: String },
  created_at: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;