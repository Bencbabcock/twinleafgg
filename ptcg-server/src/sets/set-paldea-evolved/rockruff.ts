import { Attack, CardType, PokemonCard, Stage, Weakness } from '../../game';

export class Rockruff extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness: Weakness[] = [{ type: G }];
  public retreat = [C];

  public attacks: Attack[] = [
    {
    name: 'Rock Throw',
    cost: [F],
    damage: 10,
    text: ''
    },
    {
    name: 'Bite',
    cost: [F, C, C],
    damage: 40,
    text: ''
    },
  ];

  public set: string = 'PAL';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '116';
  public name: string = 'Rockruff';
  public fullName: string = 'Rockruff PAL';

}