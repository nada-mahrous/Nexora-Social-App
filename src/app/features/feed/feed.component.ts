import { Component } from '@angular/core';
import { LeftSideBarComponent } from './components/left-side-bar/left-side-bar.component';
import { RightSideBarComponent } from './components/right-side-bar/right-side-bar.component';
import { FeedContentComponent } from './components/feed-content/feed-content.component';

@Component({
  selector: 'app-feed',
  imports: [LeftSideBarComponent, RightSideBarComponent, FeedContentComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent {}
