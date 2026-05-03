import { Types } from 'mongoose';
import connectDB from './db';
import User from '@/models/User';

const DEV_EMAIL = 'dev@hireloop.local';

export async function getCurrentUserId(): Promise<Types.ObjectId> {
  await connectDB();
  const user = await User.findOneAndUpdate(
    { email: DEV_EMAIL },
    { $setOnInsert: { email: DEV_EMAIL, name: 'Dev User' } },
    { upsert: true, returnDocument: 'after' }
  );
  return user._id;
}
