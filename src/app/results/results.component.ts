import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() allHands:any;
  constructor() { }

  ngOnInit() {
	var urlToReplace = 'http://deckofcardsapi.com';
	var urlOfServer = 'http://127.0.0.1:8000';
	for (let _i = 0; _i < 3; _i++) { 
		this.allHands.player2Hand.fHand.cards[_i].image = this.allHands.player2Hand.fHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player3Hand.fHand.cards[_i].image = this.allHands.player3Hand.fHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player4Hand.fHand.cards[_i].image = this.allHands.player4Hand.fHand.cards[_i].image.replace(urlToReplace, urlOfServer);		
	}
	for (let _i = 0; _i < 5; _i++) { 
		this.allHands.player2Hand.mHand.cards[_i].image = this.allHands.player2Hand.mHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player3Hand.mHand.cards[_i].image = this.allHands.player3Hand.mHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player4Hand.mHand.cards[_i].image = this.allHands.player4Hand.mHand.cards[_i].image.replace(urlToReplace, urlOfServer);		
	}
	for (let _i = 0; _i < 5; _i++) { 
		this.allHands.player2Hand.lHand.cards[_i].image = this.allHands.player2Hand.lHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player3Hand.lHand.cards[_i].image = this.allHands.player3Hand.lHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player4Hand.lHand.cards[_i].image = this.allHands.player4Hand.lHand.cards[_i].image.replace(urlToReplace, urlOfServer);		
	}	
	console.log(this.allHands);
  }

}
