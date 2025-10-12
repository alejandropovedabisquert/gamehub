import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameService } from '../../services/GameService/game-service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Game, GameResult } from '../../interfaces/game';

@Component({
  selector: 'app-game-list',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './game-list.html',
  styleUrl: './game-list.scss',
  standalone: true,
})
// TODO: El load more no aplica correctamente.
// Parece que al hacer el load more con el observer implementa 2 veces el mismo array
export class GameList implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('observableGameList') observableGameList!: ElementRef;
  // eslint-disable-next-line
  @Input() filters: any;
  private gameService: GameService = inject(GameService);
  private intersectionObserver: IntersectionObserver | undefined;
  private firstValueChange = true;
  private next: string | null = null;
  private resultsSubject = new BehaviorSubject<GameResult[]>([]);
  private gameResults$!: Observable<Game>;
  private isLoadingMoreSubject = new BehaviorSubject<boolean>(false);
  currentResults$ = this.resultsSubject.asObservable();
  isLoadingMore$ = this.isLoadingMoreSubject.asObservable();

  constructor() {
    this.gameResults$ = new Observable<Game>();
  }

  // Carga inicial de juegos y configuración del IntersectionObserver
  ngAfterViewInit() {
    if (!this.intersectionObserver) {
      this.loadMoreGames();
    }
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const nextPage = this.next || null;
            if (!nextPage) {
              return;
            }
            this.isLoadingMoreSubject.next(true);
            this.loadMoreGames({ nextPage });
          }
        });
      },
      { threshold: 1.0 }
    );
    this.intersectionObserver.observe(this.observableGameList.nativeElement);
  }

  // Limpia el IntersectionObserver al destruir el componente
  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.firstValueChange) {
      this.firstValueChange = false;
      return;
    }
    if (changes['filters']) {
      const prev = changes['filters'].previousValue;
      const curr = changes['filters'].currentValue;     
      if (
        curr &&
        Object.keys(curr).length > 0 &&
        JSON.stringify(prev) !== JSON.stringify(curr)
      ) {
        // Reinicia la lista y carga juegos con los nuevos filtros
        this.resultsSubject.next([]);
        this.next = null;

        this.loadMoreGames(curr);
      } else if (Object.keys(curr).length === 0 && Object.keys(prev).length !== 0) {
        // Si los filtros están vacíos, reinicia la lista y carga sin filtros
        this.resultsSubject.next([]);
        this.next = null;
        this.loadMoreGames();
      }
    }
  }

  // eslint-disable-next-line
  private loadMoreGames(filters?: any) {
    this.gameResults$ = this.gameService.getGames(filters);
    this.gameResults$.subscribe((games: Game) => {
      const current = this.resultsSubject.value;
      this.resultsSubject.next([...current, ...games.results]);
      this.next = games.next;
      this.isLoadingMoreSubject.next(false);
    });
  }
}
