import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Power } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Electrode extends PokemonCard {
    name: string;
    set: string;
    fullName: string;
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    cardImage: string;
    setNumber: string;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    powers: Power[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    provides: CardType[];
    chosenEnergyType: CardType | undefined;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
