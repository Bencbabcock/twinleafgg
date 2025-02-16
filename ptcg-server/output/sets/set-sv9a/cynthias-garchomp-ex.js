"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiasGarchompex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class CynthiasGarchompex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Cynthia\'s Gabite';
        this.tags = [card_types_1.CardTag.CYNTHIAS, card_types_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 330;
        this.weakness = [{ type: G }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Corkscrew Dive',
                cost: [F],
                damage: 100,
                text: 'You may draw cards until you have 6 cards in your hand.'
            },
            {
                name: 'Dragon Blaster',
                cost: [F, F],
                damage: 260,
                text: 'Discard all Energy from this Pokémon.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.setNumber = '44';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cynthia\'s Garchomp ex';
        this.fullName = 'Cynthia\'s Garchomp ex SV9a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.hand.cards.length >= 6) {
                return state;
            }
            if (player.deck.cards.length === 0) {
                return state;
            }
            while (player.hand.cards.length < 6) {
                if (player.deck.cards.length === 0) {
                    break;
                }
                player.deck.moveTo(player.hand, 1);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.CynthiasGarchompex = CynthiasGarchompex;
