import mongoose, { Document, Schema } from 'mongoose';

export interface IFixture {
  homeTeam: string;
  awayTeam: string;
  date: String;
  result?: string;
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
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    date: { type: String, required: true },
    result: { type: String, default: '' },
    homeResult: { type: String, default: '' },
    awayResult: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'in-progress'],
      default: 'pending',
    },
    uniqueLink: { type: String, },
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
  { homeTeam: 1, awayTeam: 1, date: 1 },
  // { unique: true },
);

export default mongoose.model<IFixtureModel>(
  'fixtures',
  FixtureSchema,
);
