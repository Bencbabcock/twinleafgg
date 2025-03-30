import { Attack, CardTag, CardType, PokemonCard, PokemonCardList, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, HAS_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lycanrocex extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Rockruff';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 260;
  public weakness: Weakness[] = [{ type: G }];
  public retreat = [C, C];

  public attacks: Attack[] = [
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

  public set: string = 'PAL';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '117';
  public name: string = 'Lycanroc ex';
  public fullName: string = 'Lycanroc ex PAL';

  public readonly SCARY_FANGS_MARKER = 'SCARY_FANGS_MARKER';
  public readonly CLEAR_SCARY_FANGS_MARKER = 'CLEAR_SCARY_FANGS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      ADD_MARKER(this.SCARY_FANGS_MARKER, cardList, this);
      ADD_MARKER(this.CLEAR_SCARY_FANGS_MARKER, opponent, this);
    }

    // This seems weird but its what worked on magby so I'm just rolling with it
    if ((effect instanceof PutDamageEffect || effect instanceof DealDamageEffect) && HAS_MARKER(this.SCARY_FANGS_MARKER, effect.target, this)) {
      effect.source.damage += 50;
    }

    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, this.CLEAR_SCARY_FANGS_MARKER, this.SCARY_FANGS_MARKER, this);

    return state;
  }
}