import { Component } from '@angular/core';
import { GameList } from '../game-list/game-list';
import { SidebarFilters } from '../sidebar-filters/sidebar-filters';

@Component({
  selector: 'app-games',
  imports: [SidebarFilters, GameList],
  templateUrl: './games.html',
  styleUrl: './games.scss',
})
export class Games {
  // eslint-disable-next-line
  filters: any = null;
  // eslint-disable-next-line
  onFiltersChanged(newFilters: any) {
    this.filters = newFilters;
  }
}
