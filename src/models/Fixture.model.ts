import mongoose, { Document, Schema } from 'mongoose';

export interface IFixture {
  homeTeam: string;
  awayTeam: string;
  date: String;
  homeResult?: string;
  awayResult?: string;
  status?: string; // pending, completed, in-progress
  uniqueLink: string;
  isDeleted?: boolean;
  isDeletedAt?: Date;
}

export interface IFixtureModel extends IFixture, Document {}

const FixtureSchema: Schema = new Schema(
  {
    homeTeam: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'teams',
    },
    awayTeam: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'teams',
    },
    date: { type: String, required: true },
    homeResult: { type: String, default: '' },
    awayResult: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'in-progress'],
      default: 'pending',
    },
    uniqueLink: { type: String },
    isDeleted: { type: Boolean, default: false },
    isDeletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Index the combination of homeTeam, awayTeam, and date for faster querying
FixtureSchema.index(
  {
    homeTeam: 1,
    awayTeam: 1,
    date: 1,
  },
  { unique: true },
);

// Additional indexes for frequently queried fields
FixtureSchema.index({ status: 1 });
FixtureSchema.index({ uniqueLink: 1 }, { unique: true });

export default mongoose.model<IFixtureModel>(
  'fixtures',
  FixtureSchema,
);
