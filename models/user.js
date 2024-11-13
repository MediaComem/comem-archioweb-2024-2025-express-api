import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define the schema for users
const userSchema = new Schema({
  name: { type: String, unique: true },
  password: String
});

userSchema.set("toJSON", {
  transform: transformJsonUser
});

function transformJsonUser(doc, json, options) {
 // Remove the hashed password from the generated JSON.
 delete json.password;
 // Remove optimistic locking version field from the generated JSON.
 delete json.__v;
 return json;
}

// Create the model from the schema and export it
export default mongoose.model('User', userSchema);