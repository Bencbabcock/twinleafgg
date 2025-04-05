import { PokemonCard, Stage, CardType, CardTag, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsFlaaffy extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Team Rocket\'s Mareep';
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Thunder Shock',
      cost: [ L, C ],
      damage: 50,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    }
  ];

  public set: string = 'SV10';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Team Rocket\'s Flaaffy';
  public fullName: string = 'Team Rocket\'s Flaaffy SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thunder Shock
    if (WAS_ATTACK_USED(effect, 0, this)){
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) { ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this); }
      });
    }
    
    return state;
  }
}
