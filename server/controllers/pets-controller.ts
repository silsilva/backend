import { Pet, User } from "../models";
import { indexPets } from "../lib/algolia";
import { cloudinary } from "../lib/cloudinary";

type PetData = {
  petName: string;
  pictureUrl: string;
  lat: number;
  lng: number;
  zone: string;
};

export async function reportPet(userId: number, params: PetData) {
  const image = await cloudinary.uploader.upload(params.pictureUrl, {
    resource_type: "image",
    discard_original_filename: true,
    width: 1000,
  });

  const user = await User.findByPk(userId);
  if (user) {
    const newPet = await Pet.create({
      ...params,
      pictureUrl: image.secure_url,
      userId: user.get("id"),
    });

    const algoliaRes = await indexPets.saveObject({
      objectID: newPet.get("id"),
      _geoloc: {
        lat: newPet.get("lat"),
        lng: newPet.get("lng"),
      },
    });
    return { newPet, algoliaRes };
  } else {
    throw "usuario no encontrado";
  }
}

function bodyToIndex(body, id?) {
  const respuesta: any = {};
  if (body.lat && body.lng) {
    respuesta._geoloc = {
      lat: body.lat,
      lng: body.lng,
    };
  }
  if (id) {
    respuesta.objectID = id;
  }
  return respuesta;
}

export async function modifyPet(params, petId: number) {
  if (!params) {
    throw "faltan datos de la mascota ";
  }

  if (params.newPicture) {
    const image = await cloudinary.uploader.upload(params.pictureUrl, {
      resource_type: "image",
      discard_original_filename: true,
      width: 1000,
    });

    const petData = {
      ...params,
      pictureUrl: image.secure_url,
    };

    const modifyPet = await Pet.update(petData, {
      where: {
        id: petId,
      },
    });
    const indexItem = bodyToIndex(petData, petId);
    indexPets.partialUpdateObject(indexItem);
    return modifyPet;
  } else {
    const modifyPet = await Pet.update(params, {
      where: {
        id: petId,
      },
    });
    const indexItem = bodyToIndex(params, petId);
    indexPets.partialUpdateObject(indexItem);

    return modifyPet;
  }
}

export async function getPet(petId: number) {
  const pet = await Pet.findByPk(petId);
  if (pet) {
    return pet;
  } else {
    throw "pet not found";
  }
}

export async function deletePet(petId: number) {
  const pet = await Pet.destroy({
    where: {
      id: petId,
    },
  });
  return pet;
}

export async function getUserPets(userId: number) {
  const pets = await Pet.findAll({
    where: {
      userId,
    },
  });
  return pets;
}

export async function searchPetsAround(lat, lng) {
  const { hits } = await indexPets.search("", {
    aroundLatLng: [lat, lng].join(","),
    aroundRadius: 500000,
  });

  let pets = [];
  for (const hit of hits) {
    const pet = await Pet.findByPk(hit.objectID);
    if (pet) {
      pets.push(pet);
    }
  }
  return pets;
}
