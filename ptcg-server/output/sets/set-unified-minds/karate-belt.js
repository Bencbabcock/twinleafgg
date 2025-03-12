"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KarateBelt = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class KarateBelt extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'UNM';
        this.name = 'Karate Belt';
        this.fullName = 'Karate Belt UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '201';
        this.text = 'If you have more Prize cards remaining than your opponent, the attacks of the Pokémon this card is attached to cost [F] less.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const index = effect.cost.indexOf(card_types_1.CardType.FIGHTING);
            if (prefabs_1.IS_TOOL_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            // No cost to reduce
            if (index === -1) {
                return state;
            }
            if (player.getPrizeLeft() > opponent.getPrizeLeft()) {
                effect.cost.splice(index, 1);
            }
            return state;
        }
        return state;
    }
}
exports.KarateBelt = KarateBelt;
