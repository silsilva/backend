"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPetsAround = exports.getUserPets = exports.deletePet = exports.getPet = exports.modifyPet = exports.reportPet = void 0;
const models_1 = require("../models");
const algolia_1 = require("../lib/algolia");
const cloudinary_1 = require("../lib/cloudinary");
async function reportPet(userId, params) {
    const image = await cloudinary_1.cloudinary.uploader.upload(params.pictureUrl, {
        resource_type: "image",
        discard_original_filename: true,
        width: 1000,
    });
    const user = await models_1.User.findByPk(userId);
    if (user) {
        const newPet = await models_1.Pet.create({
            ...params,
            pictureUrl: image.secure_url,
            userId: user.get("id"),
        });
        const algoliaRes = await algolia_1.indexPets.saveObject({
            objectID: newPet.get("id"),
            _geoloc: {
                lat: newPet.get("lat"),
                lng: newPet.get("lng"),
            },
        });
        return { newPet, algoliaRes };
    }
    else {
        throw "usuario no encontrado";
    }
}
exports.reportPet = reportPet;
function bodyToIndex(body, id) {
    const respuesta = {};
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
async function modifyPet(params, petId) {
    if (!params) {
        throw "faltan datos de la mascota ";
    }
    if (params.newPicture) {
        const image = await cloudinary_1.cloudinary.uploader.upload(params.pictureUrl, {
            resource_type: "image",
            discard_original_filename: true,
            width: 1000,
        });
        const petData = {
            ...params,
            pictureUrl: image.secure_url,
        };
        const modifyPet = await models_1.Pet.update(petData, {
            where: {
                id: petId,
            },
        });
        const indexItem = bodyToIndex(petData, petId);
        algolia_1.indexPets.partialUpdateObject(indexItem);
        return modifyPet;
    }
    else {
        const modifyPet = await models_1.Pet.update(params, {
            where: {
                id: petId,
            },
        });
        const indexItem = bodyToIndex(params, petId);
        algolia_1.indexPets.partialUpdateObject(indexItem);
        return modifyPet;
    }
}
exports.modifyPet = modifyPet;
async function getPet(petId) {
    const pet = await models_1.Pet.findByPk(petId);
    if (pet) {
        return pet;
    }
    else {
        throw "pet not found";
    }
}
exports.getPet = getPet;
async function deletePet(petId) {
    const pet = await models_1.Pet.destroy({
        where: {
            id: petId,
        },
    });
    return pet;
}
exports.deletePet = deletePet;
async function getUserPets(userId) {
    const pets = await models_1.Pet.findAll({
        where: {
            userId,
        },
    });
    return pets;
}
exports.getUserPets = getUserPets;
async function searchPetsAround(lat, lng) {
    const { hits } = await algolia_1.indexPets.search("", {
        aroundLatLng: [lat, lng].join(","),
        aroundRadius: 500000,
    });
    let pets = [];
    for (const hit of hits) {
        const pet = await models_1.Pet.findByPk(hit.objectID);
        if (pet) {
            pets.push(pet);
        }
    }
    return pets;
}
exports.searchPetsAround = searchPetsAround;
