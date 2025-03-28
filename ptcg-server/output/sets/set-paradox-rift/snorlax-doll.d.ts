import { TrainerCard, TrainerType, Stage, CardType, PokemonType, Power, StoreLike, State, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class SnorlaxDoll extends TrainerCard {
    trainerType: TrainerType;
    stage: Stage;
    cardType: CardType;
    cardTypez: CardType;
    movedToActiveThisTurn: boolean;
    pokemonType: PokemonType;
    evolvesFrom: string;
    cardTag: CardTag[];
    tools: never[];
    archetype: never[];
    hp: number;
    weakness: never[];
    retreat: never[];
    resistance: never[];
    attacks: never[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    regulationMark: string;
    powers: Power[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
