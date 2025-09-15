import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Game } from '../../interfaces/game';
import { GameService } from '../../services/GameService/game-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-list',
  imports: [CommonModule],
  templateUrl: './game-list.html',
  styleUrl: './game-list.scss',
  standalone: true,
})
export class GameList implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('observableGameList') observableGameList!: ElementRef;
  gameService: GameService = inject(GameService);
  private resultsSubject = new BehaviorSubject<any[]>([]);
  results$ = this.resultsSubject.asObservable();
  next: string | null = null;
  private intersectionObserver: IntersectionObserver | undefined;
  ngOnInit() {
    this.loadMoreGames();
  }

  // Set up IntersectionObserver to load more games when the user scrolls to the bottom
  ngAfterViewInit() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadMoreGames({ nextPage: this.next || undefined });
          }
        });
      },
      { threshold: 1.0 }
    );
    this.intersectionObserver.observe(this.observableGameList.nativeElement);
  }

  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private loadMoreGames(nextPage?: { nextPage?: string }) {
    // Implement logic to load more games, e.g., by updating the filters or pagination
    this.gameService.getGames(nextPage).subscribe((games) => {
      const current = this.resultsSubject.value;
      this.resultsSubject.next([...current, ...games.results]);
      this.next = games.next;
    });
  }
}
