import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { GameService } from '../../services/GameService/game-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { GameDetailInterface } from '../../interfaces/game-detail';

@Component({
  selector: 'app-game-detail',
  imports: [CommonModule],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.scss',
})
export class GameDetail implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private gameService: GameService = inject(GameService);
  route: ActivatedRoute = inject(ActivatedRoute);
  gameDetails$!: Observable<GameDetailInterface>;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.gameService.getGameDetails(slug).subscribe((gameDetails: GameDetailInterface) => {
        this.gameDetails$ = of(gameDetails);
        console.log(gameDetails);
        this.cdr.detectChanges();
      });
    });
  }
}
