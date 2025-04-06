import { StateUtils } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';


export class Yveltal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Amazing Destruction',
      cost: [R, P, D, C, C],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is Knocked Out.'
    }
  ];

  public regulationMark = 'D';
  public set: string = 'SHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Yveltal';
  public fullName: string = 'Yveltal SHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Amazing Destruction
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.damage += 999;
    } 

    return state;
  }

}