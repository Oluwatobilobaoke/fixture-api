import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { Logger } from '../library/Logger';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  isDeleted?: boolean;
  isDeletedAt?: Date;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    isDeletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
// Index the `email` `username` field to optimize search by email, username
UserSchema.index({ email: 1 });

// Mongoose pre-hook to hash the password before saving
UserSchema.pre<IUserModel>('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    Logger.error(err);
  }
});

UserSchema.post<IUserModel>(
  'find',
  async function (docs: any[], next) {
    docs.forEach((doc: any) => {
      delete doc.password;
    });
    next();
  },
);

export default mongoose.model<IUserModel>('users', UserSchema);
