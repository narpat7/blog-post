// import mongoose from 'mongoose';

// const homeImageSchema = new mongoose.Schema({
//   // image: { type: String, required: true },
//   images: [
//     {
//       data: Buffer,
//       contentType: String
//     }
//   ],
// }, { timestamps: true });  // ✅ ye zaroori hai for latest image

// const HomeImage = mongoose.model('HomeImage', homeImageSchema);
// export default HomeImage;
  

import mongoose from "mongoose";

const homeImageSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String,
  },
}, { timestamps: true });

export default mongoose.model("HomeImage", homeImageSchema);
