"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsDarmanitan = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class NsDarmanitan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.NS];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'N\'s Darumaka';
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.hp = 140;
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Backdraft',
                cost: [C, C],
                damage: 30,
                text: 'This attack does 30 damage for each Basic Energy card in your opponent\'s discard pile.'
            },
            {
                name: 'Darman-i-cannon',
                cost: [R, R, C],
                damage: 90,
                text: 'Discard all Energy from this Pokémon. This attack also does 90 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
        ];
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.set = 'JTG';
        this.setNumber = '27';
        this.name = 'N\'s Darmanitan';
        this.fullName = 'N\'s Darmanitan JTG';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let energyCount = 0;
            opponent.discard.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
                    energyCount += 1;
                }
            });
            effect.damage = energyCount * 30;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
            const max = Math.min(1);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: max, max, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 90);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
            });
        }
        return state;
    }
}
exports.NsDarmanitan = NsDarmanitan;
