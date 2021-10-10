import mongoose from "mongoose";

export interface RepoMetadata extends mongoose.Document {
  name: string;
  updatedAt?: Date;
  s3Location?: string;
}

const schema = new mongoose.Schema<RepoMetadata>({
  name: {
    type: String,
    unique: true,
    index: true,
  },
  updatedAt: Date,
  s3Location: String,
});

const RepoMetadataModel = mongoose.model<RepoMetadata>(
  "RepositoryMetadata",
  schema
);

export async function getOrCreateMetadata(
  name: string
): Promise<?RepoMetadata> {
  let record = await RepoMetadataModel.findOne({ name: name }).exec();

  if (!record) {
    record = new RepoMetadataModel();
    record.name = name;
    record.updatedAt = null;
    record.s3Location = null;
    await record.save();
  }

  return record;
}

export async function updateMetadata(
  name: string,
  s3Location: string
): Promise<void> {
  const record = await RepoMetadataModel.findOne({ name: name }).exec();
  if (!record) return;
  record.updatedAt = new Date();
  record.s3Location = s3Location;
  await record.save();
  return;
}
