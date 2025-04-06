import { GameMessage, PlayerType, PokemonCardList, SelectPrompt, SlotType, StateUtils } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Power, PowerType } from '../../game/store/card/pokemon-types';
import { checkState } from '../../game/store/effect-reducers/check-effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Electrode extends PokemonCard {

  public name = 'Electrode';

  public set = 'BS';

  public fullName = 'Electrode BS';

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Voltorb';

  public cardType = CardType.LIGHTNING;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '21';

  public hp = 80;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers: Power[] = [
    {
      powerType: PowerType.POKEMON_POWER,
      useWhenInPlay: true,
      name: 'Buzzap',
      text: 'At any time during your turn (before your attack), you may Knock Out Electrode and attach it to 1 of your other Pokémon. If you do, choose a type of Energy. Electrode is now an Energy card (instead of a Pokémon) that provides 2 energy of that type. You can\'t use this power if Electrode is Asleep, Confused, or Paralyzed.',
    }
  ];

  public attacks = [
    {
      name: 'Electric Shock',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
      damage: 50,
      text: 'Flip a coin. If tails, Electrode does 10 damage to itself.'
    }
  ];

  // Which energies this provides when attached as an energy
  public provides: CardType[] = [];
  public chosenEnergyType: CardType | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.includes(SpecialCondition.ASLEEP) ||
        cardList.specialConditions.includes(SpecialCondition.CONFUSED) ||
        cardList.specialConditions.includes(SpecialCondition.PARALYZED)) {
        return state;
      }

      cardList.damage = 999;
      state = checkState(store, state);


      if (store.hasPrompts()) {
        state = store.waitPrompt(state, () => { });
      }

      // Then handle energy type selection and attachment
      const options = [
        { value: CardType.COLORLESS, message: 'Colorless' },
        { value: CardType.DARK, message: 'Dark' },
        { value: CardType.DRAGON, message: 'Dragon' },
        { value: CardType.FAIRY, message: 'Fairy' },
        { value: CardType.FIGHTING, message: 'Fighting' },
        { value: CardType.FIRE, message: 'Fire' },
        { value: CardType.GRASS, message: 'Grass' },
        { value: CardType.LIGHTNING, message: 'Lightning' },
        { value: CardType.METAL, message: 'Metal' },
        { value: CardType.PSYCHIC, message: 'Psychic' },
        { value: CardType.WATER, message: 'Water' }
      ];

      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGY_TYPE,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {

        // Inside PowerEffect block after selecting energy type
        const option = options[choice];

        if (!option) {
          return state;
        }

        // Set energy properties but keep the superType as POKEMON
        this.chosenEnergyType = option.value;
        this.provides = [option.value, option.value];

        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false }
        ), targets => {
          if (!targets || targets.length === 0) {
            return;
          }

          // Moving it onto the pokemon
          effect.preventDefault = true;
          player.discard.moveCardTo(this, targets[0]);

          // Reposition it to be with energy cards (at the beginning of the card list)
          targets[0].cards.unshift(targets[0].cards.splice(targets[0].cards.length - 1, 1)[0]);

          // Register this card as energy in the PokemonCardList
          targets[0].addPokemonAsEnergy(this);
        });
      });
    }

    // Provide energy when attached as energy and included in CheckProvidedEnergyEffect
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      // Check if this card is registered as an energy card in the PokemonCardList
      const pokemonList = effect.source;
      if (pokemonList.energyCards.includes(this)) {
        effect.energyMap.push({ card: this, provides: this.provides });
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return store.prompt(state, new CoinFlipPrompt(
        effect.player.id, GameMessage.FLIP_COIN
      ), (result) => {
        if (!result) {
          const selfDamage = new DealDamageEffect(effect, 10);
          selfDamage.target = effect.player.active;
          store.reduceEffect(state, selfDamage);
        }
      });
    }
    return state;
  }
}