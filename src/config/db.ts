import mongoose from 'mongoose';

async function setupMongo(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log(err.message);
  }
}

export default setupMongo;
