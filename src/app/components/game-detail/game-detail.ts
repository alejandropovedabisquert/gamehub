import { Component, inject, OnInit } from '@angular/core';
import { GameService } from '../../services/GameService/game-service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { GameDetailInterface } from '../../interfaces/game-detail';
import { GameScreenshots } from "../game-screenshots/game-screenshots";
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-game-detail',
  imports: [AsyncPipe, GameScreenshots],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.scss',
})
export class GameDetail implements OnInit {
  private gameService: GameService = inject(GameService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  gameDetails$!: Observable<GameDetailInterface>;

  constructor() {
    this.gameDetails$ = new Observable<GameDetailInterface>();
  }

  ngOnInit(): void {
    this.gameDetails$ = this.gameService.getGameDetails(this.route.snapshot.params['slug']);
  }  

}
