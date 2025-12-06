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
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Game, GameResult } from '../../interfaces/game';

@Component({
  selector: 'app-game-list',
  imports: [AsyncPipe, RouterLink, DatePipe, CommonModule],
  templateUrl: './game-list.html',
  styleUrl: './game-list.scss',
  standalone: true,
})
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
  private isLoadingMoreSubject = new BehaviorSubject<boolean>(true);
  private isLoadingSubject = new BehaviorSubject<boolean>(true); // Nueva propiedad
  private isLoading = false;
  currentResults$ = this.resultsSubject.asObservable();
  isLoadingMore$ = this.isLoadingMoreSubject.asObservable();
  isInitialLoading$ = this.isLoadingSubject.asObservable(); // Nueva observable
  skeletonCardsArray: any[] = [];


  constructor() {
    this.skeletonCardsArray = Array(12).fill(0);
    this.gameResults$ = new Observable<Game>();
  }

  // Carga inicial de juegos y configuración del IntersectionObserver
  ngAfterViewInit() {
    setTimeout(() => {
      if (!this.intersectionObserver) {
        this.loadMoreGames();
      }
      this.setupIntersectionObserver();
    });
  }

  private setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isLoading) { // Verificar que no esté cargando
            const nextPage = this.next || null;
            if (!nextPage) {
              return;
            }
            this.loadMoreGames({ nextPage });
            this.isLoading = true;
            this.isLoadingMoreSubject.next(true);
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
      this.resultsSubject.next([]);
      this.isLoadingSubject.next(true);
      if (curr && Object.keys(curr).length > 0 && JSON.stringify(prev) !== JSON.stringify(curr)) {
        // Reinicia la lista y carga juegos con los nuevos filtros
        this.next = null;
        this.loadMoreGames(curr);
      } else if (curr && Object.keys(curr).length === 0 && Object.keys(prev).length !== 0) {
        // Si los filtros están vacíos, reinicia la lista y carga sin filtros
        this.next = null;
        this.loadMoreGames();
      }
    }
  }

  // eslint-disable-next-line
  private loadMoreGames(filters?: any) {
    if (this.isLoading) {
      return;
    }
    this.gameResults$ = this.gameService.getGames(filters);
    this.gameResults$.subscribe({
      next: (games: Game) => {
        const current = this.resultsSubject.value;
        this.resultsSubject.next([...current, ...games.results]);
        this.next = games.next;
        this.isLoadingSubject.next(false); // Marcar como cargado
      },
      complete: () => {
        this.isLoading = false;
        this.isLoadingMoreSubject.next(false);
      },
      error: () => {
        this.isLoading = false;
        this.isLoadingMoreSubject.next(false);
        this.isLoadingSubject.next(false); // También en caso de error
      }
    });
  }

  getMetacriticClass(score: number | null | undefined): string {
    if (score == null) return 'no-score';
    if (score >= 75) return 'good';
    if (score >= 50) return 'average';
    return 'poor';
  }
}
