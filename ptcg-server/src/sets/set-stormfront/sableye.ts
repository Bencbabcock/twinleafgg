import { ChooseCardsPrompt, TrainerCard } from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { CardType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Sableye extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 60;

  public resistance = [{
    type: CardType.COLORLESS,
    value: -20
  }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Overeager',
    powerType: PowerType.POKEBODY,
    text: 'If Sableye is your Active Pokemon at the beginning of the game, ' +
      'you go first. (If each player\'s Active Pokemon has the Overreager ' +
      'Poke-Body, this power does nothing.)'
  }];

  public attacks = [
    {
      name: 'Impersonate',
      cost: [],
      damage: 0,
      text: 'Search your deck for a Supporter card and discard it. ' +
        'Shuffle your deck afterward. ' +
        'Then, use the effect of that card as the effect of this attack.'
    },
    {
      name: 'Overconfident',
      cost: [CardType.DARK],
      damage: 10,
      text: 'If the Defending Pokemon has fewer remaining HP than Sableye, ' +
        'this attack\'s base damage is 40.'
    }
  ];

  public set: string = 'SF';

  public name: string = 'Sableye';

  public fullName: string = 'Sableye SF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '48';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const itemCount = player.discard.cards.filter(c => {
        return c instanceof TrainerCard && c.trainerType === TrainerType.ITEM;
      }).length;

      if (itemCount === 0) {
        return state;
      }

      const max = Math.min(1, itemCount);
      const min = max;

      return store.prompt(state, [
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
          { min, max, allowCancel: false }
        )], selected => {
        const cards = selected || [];
        player.discard.moveCardsTo(cards, player.hand);
        
        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, player.hand);
          store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
        });
      });
    }
    
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      
      if (player.hand.cards.length === 0) {
        effect.damage += 90;
      }
    }

    return state;
  }

}
