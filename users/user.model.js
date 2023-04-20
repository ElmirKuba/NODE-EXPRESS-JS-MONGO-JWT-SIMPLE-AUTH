import { Schema, model } from 'mongoose';

const userSchematic = new Schema({
  username: { type: String, unique: true, requireed: true },
  password: { type: String, requireed: true },
  roles: [{ type: String, ref: 'Role' }],
});

export default model(
  'User', // Название сущности
  userSchematic, // Ссылка на схему
  'Users' // Название коллекции в mongo db
);
