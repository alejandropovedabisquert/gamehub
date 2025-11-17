import { Component, OnInit, Output, EventEmitter, inject, Host, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GameService } from '../../services/GameService/game-service';
import { Genre } from '../../interfaces/genre';
import { Platform } from '../../interfaces/platform';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-sidebar-filters',
  templateUrl: './sidebar-filters.html',
  imports: [AsyncPipe, ReactiveFormsModule],
  styleUrls: ['./sidebar-filters.scss'],
})
export class SidebarFilters implements OnInit {
  // eslint-disable-next-line
  @Output() filtersChanged = new EventEmitter<any>();
  private fb: FormBuilder = inject(FormBuilder);
  private gameService: GameService = inject(GameService);
  private firstValueChange = true;
  private _active = { genres: false, platforms: false };
  filtersForm: FormGroup;
  genres$!: Observable<Genre>;
  platforms$!: Observable<Platform>;
  genresLoaded = false;
  platformsLoaded = false;
  skeletonFilters: any[] = [];

  constructor() {
    this.skeletonFilters = Array(10).fill(0);
    // Inicializa el formulario con FormBuilder
    this.filtersForm = this.fb.group({
      search: [''],
      genres: this.fb.group({}),
      platforms: this.fb.group({}),
    });
    this.genres$ = new Observable<Genre>();
    this.platforms$ = new Observable<Platform>();
  }

  ngOnInit(): void {
    this.genres$ = this.gameService.getGenres();
    // Cuando los géneros estén disponibles, agrega controles al formulario
    this.genres$.subscribe((genres: Genre) => {
      // Por cada género, agrega un nuevo control al FormGroup de géneros
      const genresGroup = this.filtersForm.get('genres') as FormGroup;
      genres.results.forEach((genre) => {
        genresGroup.addControl(genre.slug, this.fb.control(false));
      });
      this.genresLoaded = true;
    });

    this.platforms$ = this.gameService.getPlatforms();
    this.platforms$.subscribe((platforms: Platform) => {
      const platformsGroup = this.filtersForm.get('platforms') as FormGroup;
      platforms.results.forEach((platform) => {
        platformsGroup.addControl(String(platform.id), this.fb.control(false));
      });
      this.platformsLoaded = true;
    });

    // Escucha los cambios en el formulario y emite los filtros procesados
    this.filtersForm.valueChanges
      .pipe(tap(() => this.toTop()), debounceTime(500), distinctUntilChanged(), tap(() => this.close('genres')), tap(() => this.close('platforms')))
      .subscribe((formValue) => {
        if (this.firstValueChange) {
          this.firstValueChange = false;
          return; // Ignora el primer valueChanges (vacío)
        }
        const processedFilters = this.processFilters(formValue);
        this.filtersChanged.emit(processedFilters);
      });
  }

  toggle(section: 'genres' | 'platforms') {
    this._active[section] = !this._active[section];
  }

  isActive(section: 'genres' | 'platforms') {
    return this._active[section];
  }

  public close(section: 'genres' | 'platforms') {
    if (this._active[section]) {
      this._active[section] = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.genres_container')) {
      this.close('genres');
    }

    if (!target.closest('.platforms_container')) {
      this.close('platforms');
    }
  }

  // Transforma el formulario en parámetros de API
  // eslint-disable-next-line
  private processFilters(formValue: any): any {
    // eslint-disable-next-line
    const apiParams: any = {};
    if (formValue.search) {
      apiParams.search = formValue.search;
    }

    const selectedGenres = Object.keys(formValue.genres).filter(
      (slug) => formValue.genres[slug] === true
    );

    if (selectedGenres.length > 0) {
      apiParams.genres = selectedGenres.join(',');
    }

    const selectedPlatforms = Object.keys(formValue.platforms).filter(
      (slug) => formValue.platforms[slug] === true
    );

    if (selectedPlatforms.length > 0) {
      apiParams.platforms = selectedPlatforms.join(',');
    }

    return apiParams;
  }

  private toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
