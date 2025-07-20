import mongoose from "mongoose";
import bcrypt from "bcrypt";

// 1. Schema define
const OwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true,  },
  email: { type: String, required: true , unique: true, },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{10,}$/.test(value);
      },
      message:
        "Password must be at least 10 characters long and include uppercase, lowercase, number, and special character.",
    },
  },
   resetOtp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },
});

// 2. Password hash hook
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