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
  skeletonArray: any[] = [];
  gameDetails$!: Observable<GameDetailInterface>;

  constructor() {
    this.skeletonArray = Array(5).fill(0);
    this.gameDetails$ = new Observable<GameDetailInterface>();
  }

  ngOnInit(): void {
    this.gameDetails$ = this.gameService.getGameDetails(this.route.snapshot.params['slug']);
    this.gameDetails$.subscribe((data) => {
      console.log('Game Details:', data);
    });
  }

  hoverOnGraph(data: string) {
    console.log(data);
    const el = document.getElementById(data);
    if (el) {
      el.classList.add("active")
    }
  }
  leaveGraph(data: string) {
    const el = document.getElementById(data);
    if (el) {
      el.classList.remove("active");
    }
  }

}
