"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexPets = void 0;
const algoliasearch_1 = require("algoliasearch");
const client = (0, algoliasearch_1.default)(process.env.ALGOLIA_USER, process.env.ALGOLIA_KEY);
const indexPets = client.initIndex("pets");
exports.indexPets = indexPets;
