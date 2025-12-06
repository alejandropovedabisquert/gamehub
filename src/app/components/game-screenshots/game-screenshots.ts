import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { GameService } from '../../services/GameService/game-service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { ScreenshotResponse } from '../../interfaces/screenshot';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-screenshots',
  imports: [AsyncPipe, SlicePipe],
  templateUrl: './game-screenshots.html',
  styleUrl: './game-screenshots.scss',
})
export class GameScreenshots implements OnInit, OnDestroy {
  @Input() principalImage!: string;
  private gameService: GameService = inject(GameService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  gameScreenshots$: Observable<ScreenshotResponse>;
  allImages: string[] = [];
  isModalOpen = false;
  selectedIndex = 0;
  skeletonArray: any[] = [];

  constructor() {
    this.skeletonArray = Array(5).fill(0);
    this.gameScreenshots$ = new Observable<ScreenshotResponse>();
    
  }

  ngOnInit(): void {
    this.gameScreenshots$ = this.gameService.getGameScreenshots(this.route.snapshot.params['slug']);
    this.gameScreenshots$.subscribe((data) => {
      if (this.principalImage) {
        this.allImages = [this.principalImage];
      }
      this.allImages = this.allImages.concat(data.results.map(screenshot => screenshot.image));
    });
  }

  private clampIndex(i: number) {
    const len = this.allImages?.length || 0;
    if (len === 0) return 0;
    return (i + len) % len;
  }

  close() {
    this.isModalOpen = false;
    document.body.style.overflow = '';
  }

  prev() {
    if (!this.allImages || this.allImages.length === 0) return;
    this.selectedIndex = this.clampIndex(this.selectedIndex - 1);
  }

  next() {
    if (!this.allImages || this.allImages.length === 0) return;
    this.selectedIndex = this.clampIndex(this.selectedIndex + 1);
  }

  get selectedImage(): string | null {
    return this.allImages && this.allImages.length ? this.allImages[this.selectedIndex] : null;
  }
  
  open(index: number) {
    if (!this.allImages || this.allImages.length === 0) return;
    this.selectedIndex = this.clampIndex(index);
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }
}