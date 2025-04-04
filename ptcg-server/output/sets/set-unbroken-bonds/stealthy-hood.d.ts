import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class StealthyHood extends TrainerCard {
    trainerType: TrainerType;
    name: string;
    fullName: string;
    set: string;
    setNumber: string;
    cardImage: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
