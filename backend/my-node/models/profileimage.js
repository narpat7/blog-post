import mongoose from 'mongoose';

const ProfileImageSchema = new mongoose.Schema({
  image: { type: String, required: true },
}, { timestamps: true });  // ✅ ye zaroori hai for latest image

const ProfileImage = mongoose.model('ProfileImage', ProfileImageSchema);
export default ProfileImage;
