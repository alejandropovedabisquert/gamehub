import { inject, Injectable } from '@angular/core';
import { Genre } from '../../interfaces/genre';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Platform } from '../../interfaces/platform';
import { Observable } from 'rxjs';
import { Game } from '../../interfaces/game';
import { GameDetailInterface } from '../../interfaces/game-detail';
import { ScreenshotResponse } from '../../interfaces/screenshot';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiKey = process.env.NG_APP_API_KEY;
  http: HttpClient = inject(HttpClient);
  baseUrl = 'https://api.rawg.io/api';

  getGenres(): Observable<Genre> {
    return this.http.get<Genre>(`${this.baseUrl}/genres?key=${this.apiKey}`);
  }
  getPlatforms(): Observable<Platform> {
    return this.http.get<Platform>(
      `${this.baseUrl}/platforms?key=${this.apiKey}`
    );
  }
  // eslint-disable-next-line
  getGames(filters?: any): Observable<Game> {
    // When filters are provided, construct the query parameters
    // console.log('getGames called without filters:', filters);
    if (filters?.nextPage) {
      return this.http.get<Game>(filters.nextPage);
    }
    let params = new HttpParams().set('key', this.apiKey ?? '');
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (
          filters[key] !== undefined &&
          filters[key] !== null &&
          key !== 'nextPage'
        ) {
          params = params.set(key, filters[key]);
        }
      });
    }

    const url = `${this.baseUrl}/games`;
    // console.log('Fetching games:', url + '?' + params.toString());
    return this.http.get<Game>(url, { params });
  }

  getGameDetails(slug: string): Observable<GameDetailInterface> {
    return this.http.get<GameDetailInterface>(
      `${this.baseUrl}/games/${slug}?key=${this.apiKey}`
    );
  }

  getGameScreenshots(slug: string): Observable<ScreenshotResponse> {
    return this.http.get<ScreenshotResponse>(
      `${this.baseUrl}/games/${slug}/screenshots?key=${this.apiKey}`
    );
  }
  // eslint-disable-next-line
  getGameTrailers(slug: string): Observable<any> {
    // eslint-disable-next-line
    return this.http.get<any>(
      `${this.baseUrl}/games/${slug}/movies?key=${this.apiKey}`
    );
  }
}
