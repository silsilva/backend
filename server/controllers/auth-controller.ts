import { User } from "../models";
import { Auth } from "../models/auth";
import * as crypto from "crypto";
import * as jtw from "jsonwebtoken";

type NewUser = {
  email: string;
  password: string;
  name: string;
};
type UserData = {
  email: string;
  password: string;
};

const SECRET = process.env.SECRET;
function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

//APROBADOS
export async function newUser(name: string, email: string) {
  const [user, created] = await User.findOrCreate({
    where: {
      email: email,
    },
    defaults: {
      name: name,
      email: email,
    },
  });
  return {
    user,
    created,
  };
}
export async function authToken(email, password) {
  const res = await Auth.findOne({
    where: { email: email, password: password },
  });
  return res;
}
export async function newAuth(userId, email, password) {
  const [auth, authCreated] = await Auth.findOrCreate({
    where: { user_id: userId },
    defaults: {
      email: email,
      password: password,
      user_id: userId,
    },
  });

  return {
    auth,
    authCreated,
  };
}
export async function getUser(userId: number) {
  const user = await User.findByPk(userId);
  return user;
}

//SIN REVISAR

export async function checkUser(email: string) {
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (user) {
    return true;
  } else {
    return false;
  }
}

export async function updatePassword(userId, password) {
  const auth = await Auth.findByPk(userId);
  await auth.update({ password });
  return auth;
}

export async function getToken(UserData: UserData) {
  const auth = await Auth.findOne({
    where: {
      email: UserData.email,
      password: getSHA256ofString(UserData.password),
    },
  });

  if (auth) {
    const token = jtw.sign({ id: auth.get("user_id") }, SECRET);
    return token;
  } else {
    return false;
  }
}
