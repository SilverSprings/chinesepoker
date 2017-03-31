export class Card {

constructor(
	public image: string = 'http://127.0.0.1:8000/static/img/blank.png',
	public value: string = '',
	public suit: string = '',
	public code: string = '',
	public dropped: boolean = false,
	public numOrder: number = 0
) {
}
}