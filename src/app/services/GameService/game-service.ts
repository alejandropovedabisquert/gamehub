import { inject, Injectable } from '@angular/core';
import { Genre } from '../../interfaces/genre';
import { HttpClient } from '@angular/common/http';
import { Platform } from '../../interfaces/platform';
import { Observable } from 'rxjs';
import { Game } from '../../interfaces/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiKey = process.env.NG_APP_API_KEY;
  http: HttpClient = inject(HttpClient);
  baseUrl = 'https://api.rawg.io/api';

  getGenres(): Observable<Genre> {
    return this.http.get<Genre>(`${this.baseUrl}/genres?key=${this.apiKey}`);
  }
  getPlatforms(): Observable<Platform> {
    return this.http.get<Platform>(`${this.baseUrl}/platforms?key=${this.apiKey}`);
  }

  getGames(filters?: any): Observable<Game> {
    // TODO: Implement filtering logic
    if (filters?.nextPage) {
      // Apply pagination or other filters
      // console.log('Fetching games with filters:', filters?.nextPage);
      return this.http.get<Game>(filters.nextPage);
    }

    return this.http.get<Game>(`${this.baseUrl}/games?key=${this.apiKey}`);
  }

}
