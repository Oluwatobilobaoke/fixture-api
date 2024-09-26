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
TeamSchema.index({ name: 1 });

export default mongoose.model<ITeamModel>('teams', TeamSchema);
