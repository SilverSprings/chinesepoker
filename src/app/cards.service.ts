import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CardsService {
	private headers = new Headers({'Content-Type': 'application/json'});
	constructor(private http: Http) { }

	// Shuffle a new deck from http://deckofcardsapi.com/
	newDeck() {
	return this.http.get('/api/newdeck').map(r => r.json());
	}
	newHand(deck) {
	return this.http.post('/api/newhand',deck).map(r => r.json());
	}
}
