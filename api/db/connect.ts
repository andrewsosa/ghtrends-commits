import mongoose from "mongoose";

const { MONGODB_URL } = process.env;

export async function connectDB(): Promise<unknown> {
  if (!MONGODB_URL) throw new Error("MONGODB_URL is undefined");
  return await mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
}
