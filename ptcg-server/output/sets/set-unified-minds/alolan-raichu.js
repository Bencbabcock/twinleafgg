"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanRaichu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class AlolanRaichu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pikachu';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Electro Rain',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 0,
                text: 'Discard any amount of [L] Energy from this Pokémon. Then, for each Energy you discarded in this way, choose 1 of your opponent\'s Pokémon and do 30 damage to it. (You can choose the same Pokémon more than once.) This damage isn\'t affected by Weakness or Resistance. '
            },
            {
                name: 'Electric Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }];
        this.set = 'UNM';
        this.setNumber = '57';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Alolan Raichu';
        this.fullName = 'Alolan Raichu UNM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blocked = [];
            const cardEnergyCounts = new Map(); // Map card objects to their energy counts
            // Check energy provided by each card
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergy);
            player.active.cards.forEach((card, index) => {
                const providedEnergy = checkProvidedEnergy.energyMap.filter(em => em.card === card);
                // Count how many Lightning/Any energy are provided by this card
                let lightningCount = 0;
                providedEnergy.forEach(em => {
                    em.provides.forEach(type => {
                        if (type === card_types_1.CardType.LIGHTNING || type === card_types_1.CardType.ANY) {
                            lightningCount++;
                        }
                    });
                });
                // If the card doesn't provide any Lightning energy, block it
                if (lightningCount === 0) {
                    blocked.push(index);
                }
                else {
                    cardEnergyCounts.set(card, lightningCount);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, player.active, // Card source is target Pokemon
            { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, blocked }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    // Save energy counts before discarding
                    let totalEnergy = 0;
                    cards.forEach(card => {
                        if (cardEnergyCounts.has(card)) {
                            totalEnergy += cardEnergyCounts.get(card) || 0;
                        }
                    });
                    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                    discardEnergy.target = player.active;
                    store.reduceEffect(state, discardEnergy);
                    const damage = totalEnergy * 30;
                    const maxAllowedDamage = [];
                    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                        maxAllowedDamage.push({ target, damage: card.hp + damage });
                    });
                    return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false, damageMultiple: 30 }), targets => {
                        const results = targets || [];
                        for (const result of results) {
                            const target = game_1.StateUtils.getTarget(state, player, result.target);
                            const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
                            putCountersEffect.target = target;
                            store.reduceEffect(state, putCountersEffect);
                        }
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.AlolanRaichu = AlolanRaichu;
