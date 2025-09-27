import { Routes } from '@angular/router';
import { GameDetail } from './components/game-detail/game-detail';
import { Games } from './components/games/games';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'games',
    pathMatch: 'full',
  },
  {
    path: 'games',
    loadComponent: () => Games,
    title: 'GameHub',
  },
  {
    path: 'game/:slug',
    loadComponent: () => GameDetail,
    title: 'Game Details',
  },
  {
    path: '**',
    redirectTo: 'games',
    pathMatch: 'full',
  }
];
