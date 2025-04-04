"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpShare = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ExpShare extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '174';
        this.name = 'Exp. Share';
        this.fullName = 'Exp. Share SVI';
        this.text = 'When your Active Pokemon is Knocked Out by damage from an opponent\'s ' +
            'attack, you may move 1 basic Energy card that was attached to that ' +
            'Pokemon to the Pokemon this card is attached to.';
        this.EXP_SHARE_MARKER = 'EXP_SHARE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Only process the effect when it's a KnockOutEffect and the target is the player's active
        if (!(effect instanceof game_effects_1.KnockOutEffect) || effect.target !== effect.player.active) {
            return state;
        }
        const player = effect.player;
        const opponent = state_utils_1.StateUtils.getOpponent(state, player);
        const active = effect.target;
        if (prefabs_1.IS_TOOL_BLOCKED(store, state, player, this)) {
            return state;
        }
        // Do not activate between turns, or when it's not opponents turn.
        if (state.phase !== state_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
            return state;
        }
        if (active.marker.hasMarker(this.EXP_SHARE_MARKER)) {
            return state;
        }
        let expShareCount = 0;
        const blockedTo = [];
        player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            if (cardList === effect.target) {
                return;
            }
            if (cardList.tool instanceof ExpShare) {
                expShareCount++;
            }
            else {
                blockedTo.push(target);
            }
        });
        if (expShareCount === 0) {
            return state;
        }
        // Add marker, do not invoke this effect for other exp. share
        active.marker.addMarker(this.EXP_SHARE_MARKER, this);
        // Make copy of the active pokemon cards,
        // because they will be transfered to discard shortly
        const activeCopy = new pokemon_card_list_1.PokemonCardList();
        activeCopy.cards = player.active.cards.slice();
        // Don't prevent default knockout behavior yet
        // effect.preventDefault = true;
        state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, activeCopy, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true, min: 1, max: expShareCount, differentTargets: true, blockedTo }), transfers => {
            transfers = transfers || [];
            active.marker.removeMarker(this.EXP_SHARE_MARKER);
            for (const transfer of transfers) {
                const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                player.discard.moveCardTo(transfer.card, target);
            }
            // Now prevent the default knockout behavior after prize cards are handled
            effect.preventDefault = true;
        });
        return state;
    }
}
exports.ExpShare = ExpShare;
