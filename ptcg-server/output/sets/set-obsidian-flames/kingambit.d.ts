import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Kingambit extends PokemonCard {
    regulationMark: string;
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    resistance: {
        type: CardType.GRASS;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.METAL | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
