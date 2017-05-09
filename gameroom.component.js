import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gameroom',
  templateUrl: './gameroom.component.html',
  styleUrls: ['./gameroom.component.css']
})

export class GameroomComponent implements OnInit {
  
  @Input() playerNames;
  @Input() gameLoad;
  pointsByPlayer = {pp1:int, pp2:int, pp3:int, pp4:int} ;
  allHands:any;
  /* allHands=[{
				fHand: {cards:[...],
						handType:'One Pair',
						handValue:1,
						handSubValue:1141404},				
				mHand: {cards:[...],
						handType:'Straight',
						handValue:4,
						handSubValue:40908070605},				
				lHand: {cards:[{image:'https...', value:'Ace', suit:'HEARTS', code:'AH'},
							   {image:'https...', value:'King', suit:'HEARTS', code:'KH'},
							   {image:'https...', value:'Queen', suit:'HEARTS', code:'QH'},
							   {image:'https...', value:'Jack', suit:'HEARTS', code:'QH'},  
							   {image:'https...', value:'10', suit:'HEARTS', code:'10H'}],
						handType:'Straight Flush',
						handValue:8,
						handSubValue:81413121110},
				num:1,
				name:'SomeName1'},
				{...},{...},{...}]
  */
  
  ngOnInit() {
	this.allHands = false;
	this.pointsByPlayer = {pp1:0, pp2:0, pp3:0, pp4:0} ;
  }
  
  showResults(allHandsDelivered) {
	this.allHands = allHandsDelivered.sort( a,b => a.num - b.num );  
	this.gameLoad = false;
  }
  
  playAgain(pointsByPlayer) {
	this.gameLoad = true;
	this.allHands = false;
	this.pointsByPlayer = pointsByPlayer; 
  }
}