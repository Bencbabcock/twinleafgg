import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { Format, GamePhase, Player } from 'ptcg-server';
import { EMPTY, Observable, from } from 'rxjs';
import { finalize, switchMap, withLatestFrom } from 'rxjs/operators';

import { ApiError } from '../api/api.error';
import { DeckService } from '../api/services/deck.service';
import { GameService } from '../api/services/game.service';
import { AlertService } from '../shared/alert/alert.service';
import { CardsBaseService } from '../shared/cards/cards-base.service';
import { BoardInteractionService } from '../shared/services/board-interaction.service';
import { LocalGameState } from '../shared/session/session.interface';
import { SessionService } from '../shared/session/session.service';
import { GameOverPrompt } from './prompt/prompt-game-over/game-over.prompt';

@UntilDestroy()
@Component({
  selector: 'ptcg-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  public gameState: LocalGameState;
  public gameStates$: Observable<LocalGameState[]>;
  public clientId$: Observable<number>;
  public bottomPlayer: Player;
  public topPlayer: Player;
  public clientId: number;
  public loading: boolean;
  public waiting: boolean;
  public isAdmin: boolean;
  public isTO: boolean;
  private gameId: number;
  public showGameOver = false;
  public gameOverPrompt: GameOverPrompt;

  public formats = {
    [Format.STANDARD]: 'LABEL_STANDARD',
    [Format.STANDARD_NIGHTLY]: 'LABEL_STANDARD_NIGHTLY',
    [Format.GLC]: 'LABEL_GLC',
    [Format.UNLIMITED]: 'LABEL_UNLIMITED',
    [Format.EXPANDED]: 'LABEL_EXPANDED',
    [Format.RETRO]: 'LABEL_RETRO'
  };

  constructor(
    private alertService: AlertService,
    private gameService: GameService,
    private deckService: DeckService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private translate: TranslateService,
    private cardsBaseService: CardsBaseService,
    private boardInteractionService: BoardInteractionService
  ) {
    this.gameStates$ = this.sessionService.get(session => session.gameStates);
    this.clientId$ = this.sessionService.get(session => session.clientId);
    this.sessionService.get(session => {
      const loggedUserId = session.loggedUserId;
      const loggedUser = loggedUserId && session.users[loggedUserId];
      return loggedUser && loggedUser.roleId === 4;
    }).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
    this.sessionService.get(session => {
      const loggedUserId = session.loggedUserId;
      const loggedUser = loggedUserId && session.users[loggedUserId];
      return loggedUser && loggedUser.roleId === 5;
    }).subscribe(isTO => {
      this.isTO = isTO;
    });
  }

  ngOnInit() {
    // Ensure any active board selection is cleared when table initializes
    this.boardInteractionService.endBoardSelection();

    this.route.paramMap
      .pipe(
        withLatestFrom(this.gameStates$, this.clientId$),
        untilDestroyed(this)
      )
      .subscribe(([paramMap, gameStates, clientId]) => {
        this.gameId = parseInt(paramMap.get('gameId'), 10);
        this.gameState = gameStates.find(state => state.localId === this.gameId);
        this.updatePlayers(this.gameState, clientId);
      });

    this.gameStates$
      .pipe(
        untilDestroyed(this),
        withLatestFrom(this.clientId$)
      )
      .subscribe(([gameStates, clientId]) => {
        this.gameState = gameStates.find(state => state.localId === this.gameId);
        this.updatePlayers(this.gameState, clientId);
      });
  }

  ngOnDestroy() {
    // Make sure selection state is cleared when leaving the table view
    this.boardInteractionService.endBoardSelection();
  }

  public play() {
    this.loading = true;
    this.deckService.getListByFormat(this.gameState.format)
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this),
        switchMap(decks => {
          const options = decks
            .filter(deckEntry => deckEntry.isValid)
            .map(deckEntry => ({ value: deckEntry.id, viewValue: deckEntry.name }));

          if (options.length === 0) {
            this.alertService.alert(
              this.translate.instant('GAMES_NEED_DECK'),
              this.translate.instant('GAMES_NEED_DECK_TITLE')
            );
            return EMPTY;
          }

          return from(this.alertService.select({
            title: this.translate.instant('GAMES_YOUR_DECK_TITLE'),
            message: `${this.translate.instant('GAMES_FORMAT')}: ${this.translate.instant(this.formats[this.gameState.format])}`,
            placeholder: this.translate.instant('GAMES_YOUR_DECK'),
            options,
            value: options[0].value
          }));
        }),
        switchMap(deckId => {
          return deckId !== undefined
            ? this.deckService.getDeck(deckId)
            : EMPTY;
        })
      )
      .subscribe({
        next: deckResponse => {
          const deck = deckResponse.deck.cards;
          this.gameService.play(this.gameState.gameId, deck);
        },
        error: (error: ApiError) => { }
      });
  }

  private updatePlayers(gameState: LocalGameState, clientId: number) {
    this.bottomPlayer = undefined;
    this.topPlayer = undefined;
    this.waiting = false;
    this.clientId = clientId;

    if (!gameState || !gameState.state) {
      this.router.navigate(['/games']);
      return;
    }

    const state = gameState.state;
    if (state.players.length >= 1) {
      if (state.players[0].id === clientId) {
        this.bottomPlayer = state.players[0];
      } else {
        this.topPlayer = state.players[0];
      }
    }

    if (state.players.length >= 2) {
      if (this.bottomPlayer === state.players[0]) {
        this.topPlayer = state.players[1];
      } else {
        this.bottomPlayer = state.players[1];
      }

      if (gameState.switchSide) {
        const tmp = this.topPlayer;
        this.topPlayer = this.bottomPlayer;
        this.bottomPlayer = tmp;
      }

      if (gameState.replay !== undefined) {
        this.clientId = this.bottomPlayer.id;
      }

      const prompts = state.prompts.filter(p => p.result === undefined);

      const isPlaying = state.players.some(p => p.id === this.clientId);
      const isReplay = !!this.gameState.replay;
      const isObserver = isReplay || !isPlaying;
      const waitingForOthers = prompts.some(p => p.playerId !== clientId);
      const waitingForMe = prompts.some(p => p.playerId === clientId);
      const notMyTurn = state.players[state.activePlayer].id !== clientId
        && state.phase === GamePhase.PLAYER_TURN;
      this.waiting = (notMyTurn || waitingForOthers) && !waitingForMe && !isObserver;
    }

    // Check if the game is in the FINISHED phase and update the game over state
    if (state.phase === GamePhase.FINISHED && !gameState.gameOver) {
      this.gameOverPrompt = new GameOverPrompt(clientId, state.winner);
      this.showGameOver = true;
    } else {
      this.showGameOver = false;
    }
  }

  private updateGameState(state: LocalGameState) {
    this.gameState = state;

    // Show game over screen when the game is finished
    if (state && state.state && state.state.phase === GamePhase.FINISHED && !state.gameOver) {
      this.showGameOver = true;
      this.gameOverPrompt = new GameOverPrompt(this.clientId, state.state.winner);
    } else {
      this.showGameOver = false;
      this.gameOverPrompt = undefined;
    }

    // Update player information
    this.updatePlayers(state, this.clientId);
  }
}
