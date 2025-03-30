"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rockruff = void 0;
const game_1 = require("../../game");
class Rockruff extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Rock Throw',
                cost: [F],
                damage: 10,
                text: ''
            },
            {
                name: 'Bite',
                cost: [F, C, C],
                damage: 40,
                text: ''
            },
        ];
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '116';
        this.name = 'Rockruff';
        this.fullName = 'Rockruff PAL';
    }
}
exports.Rockruff = Rockruff;
