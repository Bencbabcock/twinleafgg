import { Attack, CardTag, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Lycanrocex extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: Weakness[];
    retreat: CardType.COLORLESS[];
    attacks: Attack[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly SCARY_FANGS_MARKER = "SCARY_FANGS_MARKER";
    readonly CLEAR_SCARY_FANGS_MARKER = "CLEAR_SCARY_FANGS_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
