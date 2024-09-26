import mongoose, { Document, Schema } from "mongoose";

export interface IFixture {

}

export interface IFixtureModel extends IFixture, Document {}

const FixtureSchema: Schema = new Schema(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    date: { type: Date, required: true },
    result: { type: String, default: '' },
    homeResult: { type: String, default: '' },
    awayResult: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'completed', 'in-progress'], default: 'pending' },
    uniqueLink: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



// Index the combination of homeTeam, awayTeam, and date for faster querying
FixtureSchema.index({ homeTeam: 1, awayTeam: 1, date: 1 }, { unique: true });


export default mongoose.model<IFixtureModel>("fixtures", FixtureSchema);