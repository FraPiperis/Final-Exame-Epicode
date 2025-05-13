
import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

// ✅ Usa mongoose.models per evitare OverwriteModelError
const AuthorModel = mongoose.models.Author || mongoose.model('Author', authorSchema);

export default AuthorModel;
