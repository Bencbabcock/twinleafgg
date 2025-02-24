import { Attack, CardType, GameError, GameMessage, PokemonCard, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { REMOVE_MARKER_AT_END_OF_TURN, REPLACE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Lombre extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Lotad';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness: Weakness[] = [{ type: L }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    { name: 'Aqua Slash', cost: [W, W], damage: 70, text: 'During your next turn, this Pokémon can\'t attack.' },
  ];

  public set: string = 'SV9';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Lombre';
  public fullName: string = 'Lombre SV9';

  private readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  private readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);

    if (effect instanceof AttackEffect) {
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this) || effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
    }

    return state;
  }
}