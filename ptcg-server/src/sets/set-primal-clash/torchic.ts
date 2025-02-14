import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, EnergyCard, GameError, ChooseCardsPrompt, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Torchic extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 50;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Barrage',
    powerType: PowerType.ANCIENT_TRAIT,
    barrage: true,
    text: 'This Pokémon may attack twice a turn. (If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.)'
  }];

  public attacks = [{
    name: 'Flare Bonus',
    cost: [CardType.FIRE],
    damage: 0,
    text: ' Discard a [R] Energy card from your hand. If you do, draw 2 cards. '
  },
  {
    name: 'Claw',
    cost: [CardType.FIRE],
    damage: 20,
    text: ' Flip a coin. If tails, this attack does nothing. '
  }];

  public set = 'PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name = 'Torchic';
  public fullName = 'Torchic PRC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect) {
      this.maxAttacksThisTurn = 2;
      this.allowSubsequentAttackChoice = true;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      //DO ATTACK

      let hasCardsInHand = false;
      const blocked: number[] = [];
      player.hand.cards.forEach((c, index) => {
        if (c instanceof EnergyCard) {
          if (c.provides.includes(CardType.FIRE)) {
            hasCardsInHand = true;
          } else {
            blocked.push(index);
          }
        }
      });

      if (hasCardsInHand === false) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: true, min: 1, max: 1, blocked }
      ), selected => {
        selected = selected || [];
        if (selected.length === 0) {
          return;
        }
        player.hand.moveCardsTo(selected, player.discard);
        player.deck.moveTo(player.hand, 2);
      });

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      // DO ATTACK

      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === false) {
          effect.damage = 0;
        }
      });

    }

    return state;
  }
}