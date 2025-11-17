import { Component, inject, Input, OnInit } from '@angular/core';
import { GameService } from '../../services/GameService/game-service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { ScreenshotResponse } from '../../interfaces/screenshot';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-screenshots',
  imports: [AsyncPipe, SlicePipe],
  templateUrl: './game-screenshots.html',
  styleUrl: './game-screenshots.scss',
})
// TODO: Implementar carrusel de imágenes
export class GameScreenshots implements OnInit {
  @Input() principalImage!: string ;
  private gameService: GameService = inject(GameService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  gameScreenshots$: Observable<ScreenshotResponse>;

  constructor() {
    this.gameScreenshots$ = new Observable<ScreenshotResponse>();
  }

  ngOnInit(): void {
    this.gameScreenshots$ = this.gameService.getGameScreenshots(this.route.snapshot.params['slug']);
    this.gameScreenshots$.subscribe((data) => {
      console.log('Game Screenshots:', data);
    });
  }
}