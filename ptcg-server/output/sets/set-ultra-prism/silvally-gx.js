"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilvallyGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SilvallyGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Type: Null';
        this.tags = [game_1.CardTag.POKEMON_GX];
        this.cardType = C;
        this.hp = 210;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Gyro Unit',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your Basic Pokémon in play have no Retreat Cost.'
            }];
        this.attacks = [
            {
                name: 'Turbo Drive',
                cost: [C, C, C],
                damage: 120,
                text: 'Attach a basic Energy card from your discard pile to 1 of your Benched Pokémon.'
            },
            {
                name: 'Rebel-GX',
                cost: [C, C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 damage for each of your opponent\'s Benched Pokémon. (You can\'t use more than 1 GX attack in a game.)',
                gxAttack: true
            }
        ];
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '116';
        this.name = 'Silvally-GX';
        this.fullName = 'Silvally-GX UPR';
    }
    reduceEffect(store, state, effect) {
        // Gyro Unit
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            const active = effect.player.active.getPokemonCard();
            if (owner !== player || active === undefined) {
                return state;
            }
            let isSilvallyGXInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isSilvallyGXInPlay = true;
                }
            });
            if (!isSilvallyGXInPlay) {
                return state;
            }
            if (!prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this) && active.stage === game_1.Stage.BASIC) {
                effect.cost = [];
            }
            return state;
        }
        // Turbo Drive
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            let energyInDiscard = false;
            player.discard.cards.forEach(card => {
                if (card instanceof game_1.EnergyCard && card.energyType === game_1.EnergyType.BASIC) {
                    energyInDiscard = true;
                }
            });
            if (!energyInDiscard) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                return state;
            });
        }
        // Rebel-GX
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (player.usedGX) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            let benchedPokemon = 0;
            opponent.bench.forEach(slot => {
                if (slot.cards.length > 0) {
                    benchedPokemon++;
                }
            });
            effect.damage = benchedPokemon * 50;
        }
        return state;
    }
}
exports.SilvallyGX = SilvallyGX;
