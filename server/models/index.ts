import { User } from "./users";
import { Pet } from "./pets";

User.hasMany(Pet);
Pet.belongsTo(User);

export { User, Pet };
