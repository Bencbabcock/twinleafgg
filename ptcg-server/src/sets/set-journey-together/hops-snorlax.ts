import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';


export class HopsSnorlax extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.HOPS];

  public cardType: CardType = C;

  public hp: number = 150;

  public weakness = [{ type: F }];

  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Big Belly',
    powerType: PowerType.ABILITY,
    text: 'The attacks of your Hop\'s Pokémon do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance). The effect of Big Belly doesn\'t stack.'
  }];

  public attacks = [
    {
      name: 'Dynamic Press',
      cost: [C, C, C],
      damage: 140,
      text: 'This Pokémon also does 80 damage to itself.'
    }
  ];

  public regulationMark = 'I';

  public set: string = 'JTG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '117';

  public name: string = 'Hop\'s Snorlax';

  public fullName: string = 'Hop\'s Snorlax JTG';

  public bigBellyApplied: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 80);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    if (effect instanceof DealDamageEffect && StateUtils.isPokemonInPlay(effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hopsPokemon = player.active.getPokemonCard();

      // Count number of Hop's Snorlax in play
      let snorlaxCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Hop\'s Snorlax') {
          snorlaxCount++;
        }
      });

      // Only proceed if there's at least one Snorlax
      if (snorlaxCount === 0) {
        return state;
      }

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      // Apply the effect only once, regardless of how many Snorlax are in play
      if (hopsPokemon && hopsPokemon.tags.includes(CardTag.HOPS) &&
        effect.target === opponent.active &&
        !effect.damageIncreased) {
        effect.damage += 30;
        effect.damageIncreased = true;
      }
    }
    return state;
  }
}