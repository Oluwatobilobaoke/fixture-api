import mongoose, { Document, Schema } from "mongoose";

export interface ITeam {
  name: string;
  city: string;
  description?: string;
}

export interface ITeamModel extends ITeam, Document {}

const TeamSchema: Schema = new Schema(
  {
    description: { type: String},
    city: { type: String, required: true },
    name: { type: String, required: true, minlength: 3, maxlength: 25  },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


// Index the `name` field to optimize search by name
TeamSchema.index({ name: 1 });

export default mongoose.model<ITeamModel>("teams", TeamSchema);