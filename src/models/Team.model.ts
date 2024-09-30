import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam {
  name: string;
  city: string;
  nickname?: string;
  description?: string;
  isDeleted?: boolean;
  isDeletedAt?: Date;
}

export interface ITeamModel extends ITeam, Document {}

const TeamSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
      unique: true,
    },
    nickname: { type: String, minlength: 3, maxlength: 5 },
    city: { type: String, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    isDeletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Index the `name` field to optimize search by name
TeamSchema.index({ name: 1, city: 1 }, { unique: true });

// Create a separate index for nickname
TeamSchema.index({ nickname: 1 });

// Create a text index for name and description to enable text search
TeamSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<ITeamModel>('teams', TeamSchema);
