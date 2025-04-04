"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEmergingPowers = void 0;
const bianca_1 = require("./bianca");
const other_prints_1 = require("./other-prints");
const cheren_1 = require("./cheren");
const max_potion_1 = require("./max-potion");
const tornadus_1 = require("./tornadus");
exports.setEmergingPowers = [
    new bianca_1.Bianca(),
    new cheren_1.Cheren(),
    new other_prints_1.CrushingHammerEPO(),
    new max_potion_1.MaxPotion(),
    new other_prints_1.RecycleEPO(),
    new tornadus_1.Tornadus(),
];
