// sidebar-filters.component.ts
import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GameService } from '../../services/GameService/game-service';
import { Genre } from '../../interfaces/genre';
import { Platform } from '../../interfaces/platform';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar-filters',
  templateUrl: './sidebar-filters.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./sidebar-filters.scss']
})
export class SidebarFilters implements OnInit {

  @Output() filtersChanged = new EventEmitter<any>();
  private fb: FormBuilder = inject(FormBuilder);
  private gameService: GameService = inject(GameService);

  filtersForm: FormGroup;
  genres$!: Observable<Genre>;
  platforms$!: Observable<Platform>;

  constructor(
  ) {
    // Initialice the form with empty groups for genres and platforms
    this.filtersForm = this.fb.group({
      search: [''],
      genres: this.fb.group({}), // Create one FormGroup for genres
      platforms: this.fb.group({}) // Create another one for platforms
    });
  }

  ngOnInit(): void {
    // Obtain the genres from the service
    this.gameService.getGenres().subscribe((genres: Genre) => {
      this.genres$ = of(genres);
      // For each genre, add a new control to the genres FormGroup
      const genresGroup = this.filtersForm.get('genres') as FormGroup;
      genres.results.forEach(genre => {
        genresGroup.addControl(genre.slug, this.fb.control(false));
      });
    });

    // We do the same for platforms
    this.gameService.getPlatforms().subscribe((platforms: Platform) => {
      this.platforms$ = of(platforms);
      const platformsGroup = this.filtersForm.get('platforms') as FormGroup;
      platforms.results.forEach(platform => {
        platformsGroup.addControl(platform.slug, this.fb.control(false));
      });
    });

    // Listen to form changes
    this.filtersForm.valueChanges.pipe(
      debounceTime(500), // Wait 500ms after the last event before emitting last event
      distinctUntilChanged() // Only emit if the value has really changed
    ).subscribe(formValue => {
      // 4. Process the form value before emitting it

      const processedFilters = this.processFilters(formValue);
      console.log('Form Value:', processedFilters);
      this.filtersChanged.emit(processedFilters);
    });
  }

  // Transform the form value into the format expected by the API
  private processFilters(formValue: any): any {
    const apiParams: any = {};
    if (formValue.search) {
      apiParams.search = formValue.search;
    }

    const selectedGenres = Object.keys(formValue.genres)
      .filter(slug => formValue.genres[slug] === true);

    if (selectedGenres.length > 0) {
      apiParams.genres = selectedGenres.join(',');
    }

    const selectedPlatforms = Object.keys(formValue.platforms)
      .filter(slug => formValue.platforms[slug] === true);
    
    if (selectedPlatforms.length > 0) {
      apiParams.platforms = selectedPlatforms.join(',');
    }

    return apiParams;
  }
}