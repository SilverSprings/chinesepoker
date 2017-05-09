import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})

export class ScoresComponent implements OnInit {

  // data sent by gameon component (everytime a game ends)
  @Input() pointsByPlayer:any;
  // data sent by gameon component (only once)
  @Input() playerNames:any;
  
  firstLoadDone = false;
  arrayPointsByPlayer = [];
  totalByPlayer = {pp1:int, pp2:int, pp3:int, pp4:int} ;
  // pointsByPlayer = {pp1:int, pp2:int, pp3:int, pp4:int} ;
  // arrayPointsByPlayer = [{pp1:int, pp2:int, pp3:int, pp4:int}, 
  //                        {pp1:int, pp2:int, pp3:int, pp4:int},
  //                        {pp1:int, pp2:int, pp3:int, pp4:int}]
  // totalByPlayer = {pp1:int, pp2:int, pp3:int, pp4:int} ;
  ngOnInit() {
	this.totalByPlayer = {pp1:0, pp2:0, pp3:0, pp4:0} ;
	this.firstLoadDone = true;
  }

  ngOnChanges(changes: SimpleChanges) {
	console.log('', changes);
  	if (this.firstLoadDone) {
		this.arrayPointsByPlayer.push(changes.pointsByPlayer.currentValue);
		this.totalByPlayer = this.arrayPointsByPlayer.reduce(
			(tt, crt) => ( {pp1:tt.pp1+crt.pp1,
							pp2:tt.pp2+crt.pp2, 
							pp3:tt.pp3+crt.pp3, 
							pp4:tt.pp4+crt.pp4})
		);
	}
  }
}