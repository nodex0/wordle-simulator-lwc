const dictionary = require('./spanish.json')
	.map(word => word.toUpperCase().replace('Á','A').replace('É','E').replace('Í','I').replace('Ó','O').replace('Ú','U'));
    
const spanishCharacterSet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

const simulator = new WordleSimulator(dictionary, 5, spanishCharacterSet);

const wordsLeft = simulator.addMove({ word: 'MARIO', result: '-x-x-' }).addMove({ word: 'TUPES' , result: '-o--x' }).wordsLeft;

console.log(`Did 2 moves, MARIO and TUPES with -x-x- and -o--x results, the pool is now: ${wordsLeft.join(', ')}`);