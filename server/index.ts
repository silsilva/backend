import "dotenv/config";
import * as cors from "cors";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import * as crypto from "crypto";
import { sequelize } from "./models/db";
import {
  checkUser,
  newUser,
  getToken,
  getUser,
  newAuth,
  authToken,
  updatePassword,
} from "./controllers/auth-controller";

import {
  deletePet,
  getPet,
  getUserPets,
  modifyPet,
  reportPet,
  searchPetsAround,
} from "./controllers/pets-controller";
import { msg } from "./lib/sendgrid";

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(
  express.json({
    limit: "50mb",
  })
);

function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}
// sequelize.sync({ force: true }).then((res) => {
//   console.log(res);
// });
const SECRET = process.env.SECRET;
const frontEndPath = path.resolve(__dirname, "../dist");

//authorization middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const data = jwt.verify(token, SECRET);
    req._user = data;
    next();
  } catch {
    res.status(401).json({ error: "middleware" });
  }
}

//sign up
app.post("/auth", async (req, res) => {
  const { email, password, name } = req.body;
  const newUsers = await newUser(name, email);
  const userId = await newUsers.user.get("id");
  const passwordHasheado = getSHA256ofString(password);
  const auth = await newAuth(userId, email, passwordHasheado);
  res.json(newUsers);
});
//obtener token de usuario registrado
app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;
  const passwordHasheado = getSHA256ofString(password);
  const auth = await authToken(email, passwordHasheado);
  if (auth) {
    const token = jwt.sign({ id: auth.get("user_id") }, SECRET);
    res.status(200).json({ token });
  } else {
    res.status(400).json({ error: "contraseña o email incorrecto" });
  }
});
//cheequea si el emil es correcto
app.post("/check", async (req, res) => {
  const { email } = req.body;
  const userExist = await checkUser(email);
  res.json({
    user: userExist,
  });
});

//me trae MI datita
app.get("/me", authMiddleware, async (req, res) => {
  const userId = req._user.id;
  const userProfile = await getUser(userId);
  res.json(userProfile);
});

//modifica el password
app.put("/me", authMiddleware, async (req, res) => {
  const { password } = req.body;
  const passwordHasheado = getSHA256ofString(password);
  const update = await updatePassword(req._user.id, passwordHasheado);
  res.json(update);
});
//
//
//
//
//crea una mascota
app.post("/pets", authMiddleware, async (req, res) => {
  const { petName, pictureUrl, lat, lng, zone } = req.body;
  const userId = req._user.id;
  const pet = await reportPet(userId, {
    zone,
    petName,
    pictureUrl,
    lat,
    lng,
  });
  res.json(pet);
});
//Modifica UNA mascota
app.put("/pets/:id", authMiddleware, async (req, res) => {
  const pet = await modifyPet(req.body, req.params.id);
  res.json({ pet });
});
//Mis mascotas
app.get("/me/pets", authMiddleware, async (req, res) => {
  const userId = req._user.id;
  const pets = await getUserPets(userId);
  res.json({ pets });
});
//Obtiene la data de una mascota x su id
app.get("/pets/:id", authMiddleware, async (req, res) => {
  const pet = await getPet(req.params.id).catch((err) => {
    res.status(400).json({
      message: err,
    });
  });
  res.json(pet);
});
//Elimina una mascota
app.delete("/pets/:id", authMiddleware, async (req, res) => {
  const pet = await deletePet(req.params.id);
  res.json(pet);
});

//Mascotas cerca de un lugar
app.get("/pets-around", async (req, res) => {
  const { lat, lng } = req.query;
  const lostPets = await searchPetsAround(lat, lng);
  res.json({ lostPets });
});

//reporte
app.post("/report", async (req, res) => {
  const { menssage } = req.body;
  const reporte = await msg(menssage);
  res.json({ reporte });
});

app.use(express.static(path.resolve(__dirname, "../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
