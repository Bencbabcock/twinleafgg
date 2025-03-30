"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lycanrocex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lycanrocex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rockruff';
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 260;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Rock Throw',
                cost: [F],
                damage: 40,
                text: ''
            },
            {
                name: 'Scary Fangs',
                cost: [F, C, C],
                damage: 140,
                text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack (even if it is Knocked Out), put 10 damage counters on the Attacking Pokémon.'
            },
        ];
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '117';
        this.name = 'Lycanroc ex';
        this.fullName = 'Lycanroc ex PAL';
        this.SCARY_FANGS_MARKER = 'SCARY_FANGS_MARKER';
        this.CLEAR_SCARY_FANGS_MARKER = 'CLEAR_SCARY_FANGS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            prefabs_1.ADD_MARKER(this.SCARY_FANGS_MARKER, cardList, this);
            prefabs_1.ADD_MARKER(this.CLEAR_SCARY_FANGS_MARKER, opponent, this);
        }
        // This seems weird but its what worked on magby so I'm just rolling with it
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.DealDamageEffect) && prefabs_1.HAS_MARKER(this.SCARY_FANGS_MARKER, effect.target, this)) {
            effect.source.damage += 50;
        }
        prefabs_1.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, this.CLEAR_SCARY_FANGS_MARKER, this.SCARY_FANGS_MARKER, this);
        return state;
    }
}
exports.Lycanrocex = Lycanrocex;
