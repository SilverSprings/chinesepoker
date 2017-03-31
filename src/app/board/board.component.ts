import { Component, OnInit } from '@angular/core';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  deck:any;
  hands: any = [];  
  allPlayersReady = false;
  player1Ready = false;
  player2Ready = false;
  player3Ready = false;
  player4Ready = false;
  
  constructor(private cardsService: CardsService) { }

  ngOnInit() {
	// Retrieve a new deck from the API
    this.cardsService.newDeck().subscribe(deck => {
		// Player 1 hand
		this.cardsService.newHand(deck).subscribe(hand => {
			this.hands[0]=hand;
			// Player 2 hand
			this.cardsService.newHand(deck).subscribe(hand => {
				this.hands[1]=hand;
				// Player 3 hand
				this.cardsService.newHand(deck).subscribe(hand => {
					this.hands[2]=hand;
					// Player 4 hand
					this.cardsService.newHand(deck).subscribe(hand => {
						this.hands[3]=hand;
						// All hands have been drawn
						this.deck=deck;
					});
				});
			});
		});
	});		
  }
  
  handReadyPlayer1(handPlayer1) {
	this.player1Ready = true;
	console.log('in handReadyPlayer1',handPlayer1, this.player1Ready  );
  }
  
  handReadyPlayer2(handPlayer2) {
	this.player2Ready = true;
	console.log('in handReadyPlayer2',handPlayer2, this.player2Ready  );
  }

  handReadyPlayer3(handPlayer3) {
	this.player3Ready = true;
	console.log('in handReadyPlayer3',handPlayer3, this.player3Ready  );
  }  

  handReadyPlayer4(handPlayer4) {
	this.player4Ready = true;
	console.log('in handReadyPlayer4',handPlayer4, this.player4Ready  );
  } 
  
  ngDoCheck() {
	if (this.player1Ready == true && this.player2Ready == true && this.player3Ready == true ) {
		this.allPlayersReady = true;
	}
  
  }
  
  }