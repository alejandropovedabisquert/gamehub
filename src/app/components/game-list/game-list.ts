import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameService } from '../../services/GameService/game-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './game-list.html',
  styleUrl: './game-list.scss',
  standalone: true,
})
// TODO: Rehacer forma de obtener los datos de los juegos, imitar a como hace game-screenshots
export class GameList implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('observableGameList') observableGameList!: ElementRef;
  // eslint-disable-next-line
  @Input() filters: any;
  // eslint-disable-next-line
  private resultsSubject = new BehaviorSubject<any[]>([]);
  private cdr = inject(ChangeDetectorRef);
  private intersectionObserver: IntersectionObserver | undefined;
  // eslint-disable-next-line
  private filtersTimeout: any;
  private firstValueChange = true;

  gameService: GameService = inject(GameService);
  results$ = this.resultsSubject.asObservable();
  next: string | null = null;
  isLoading = true;
  isLoadingMore = false;

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
            if (this.filtersTimeout) {
              clearTimeout(this.filtersTimeout);
            }
            this.isLoadingMore = true;
            this.cdr.detectChanges();
            this.filtersTimeout = setTimeout(() => {
              this.loadMoreGames({ nextPage });
            }, 1000);
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
      return; // Ignora el primer valueChanges (vacío)
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
      } else if (!curr || Object.keys(curr).length === 0) {
        // Si los filtros están vacíos, reinicia la lista y carga sin filtros
        this.resultsSubject.next([]);
        this.next = null;
        this.loadMoreGames();
      }
    }
  }

  // eslint-disable-next-line
  private loadMoreGames(filters?: any) {
    this.gameService.getGames(filters).subscribe((games) => {
      const current = this.resultsSubject.value;
      this.resultsSubject.next([...current, ...games.results]);
      this.next = games.next;
      this.isLoading = false;
      this.isLoadingMore = false;
      this.cdr.detectChanges();
    });
  }
}
