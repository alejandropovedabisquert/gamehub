// sidebar-filters.component.ts
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
  filtersForm: FormGroup;
  genres$!: Observable<Genre>;
  platforms$!: Observable<Platform>;
  // TODO: Cuando seleccione algun filtro hacer un to top
  // TODO: Arreglar bug NG0100: ExpressionChangedAfterItHasBeenCheckedError
  constructor() {
    // Inicializa el formulario con FormBuilder
    this.filtersForm = this.fb.group({
      search: [''],
      genres: this.fb.group({}), // Crea un FormGroup para géneros
      platforms: this.fb.group({}), // Crea otro para plataformas
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
    });

    this.platforms$ = this.gameService.getPlatforms();
    this.platforms$.subscribe((platforms: Platform) => {
      const platformsGroup = this.filtersForm.get('platforms') as FormGroup;
      platforms.results.forEach((platform) => {
        platformsGroup.addControl(String(platform.id), this.fb.control(false));
      });
    });

    // Escucha los cambios en el formulario y emite los filtros procesados
    this.filtersForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((formValue) => {
        if (this.firstValueChange) {
          this.firstValueChange = false;
          return; // Ignora el primer valueChanges (vacío)
        }
        const processedFilters = this.processFilters(formValue);
        this.filtersChanged.emit(processedFilters);
      });
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
}
