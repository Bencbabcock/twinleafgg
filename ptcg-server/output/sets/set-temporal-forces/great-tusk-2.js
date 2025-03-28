"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreatTusk2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class GreatTusk2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Lunge Out',
                cost: [F, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Wrathful Charge',
                cost: [F, C, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If your Benched Pokémon have any damage counters on them, this attack does 80 more damage.'
            },
        ];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Great Tusk';
        this.fullName = 'Great Tusk TEF2';
    }
    reduceEffect(store, state, effect) {
        // Wrathful Charge
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Check if any benched Pokémon has damage
            const hasDamagedBench = player.bench.some(pokemon => pokemon.damage > 0);
            if (hasDamagedBench) {
                effect.damage += 80;
            }
        }
        return state;
    }
}
exports.GreatTusk2 = GreatTusk2;
