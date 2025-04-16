import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game';

export class TeamSkullGrunt extends TrainerCard {
  
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'SUM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '133';
  public name: string = 'Team Skull Grunt';
  public fullName: string = 'Team Skull Grunt SUM';

  public text: string = 'Your opponent reveals their hand. Discard 2 Energy cards from it.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle playing the card
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      if (opponent.hand.cards.length == 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: 2 }
      ), selectedCard => {
        const selected = selectedCard || [];
        if (selectedCard === null || selected.length === 0) {
          return;
        }

        opponent.hand.moveCardsTo(selected, opponent.discard);

        player.supporter.moveCardTo(this, player.discard);
      });
    }

    return state;
  }
}
