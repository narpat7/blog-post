import mongoose from "mongoose";
import bcrypt from "bcrypt";

const OwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true,  },
  email: { type: String, required: true , unique: true, },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

// // 2. Password hash hook
OwnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 3. Compare password method
OwnerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 4. Model export
const Owner = mongoose.model("Owner", OwnerSchema);
export default Owner;
// 5. Export the model