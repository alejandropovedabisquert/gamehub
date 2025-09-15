import { Component } from '@angular/core';
import { SidebarFilters } from './components/sidebar-filters/sidebar-filters';
import { GameList } from "./components/game-list/game-list";

@Component({
  selector: 'app-root',
  imports: [SidebarFilters, GameList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'gamehub';
}
