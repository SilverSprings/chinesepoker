import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import {DndModule} from 'ng2-dnd';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { PlayerComponent } from './player/player.component';

import { CardsService } from './cards.service';
import { OtherPlayerComponent } from './other-player/other-player.component';

// Define the routes
const ROUTES = [
  {
    path: '',
    redirectTo: 'board',
    pathMatch: 'full'
  },
  {
    path: 'board',
    component: BoardComponent
  },
  {
    path: '**',
    component: BoardComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    PlayerComponent,
    OtherPlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
	RouterModule.forRoot(ROUTES),
    DndModule.forRoot()	
  ],
  providers: [CardsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
