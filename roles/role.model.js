import { Schema, model } from 'mongoose';

const roleSchematic = new Schema({
  value: { type: String, unique: true, default: 'user' },
});

export default model('Role', roleSchematic, 'Roles');
