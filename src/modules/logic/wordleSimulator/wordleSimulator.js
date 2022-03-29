export class WordleSimulator {
	_allChars;
	_wordLength;
	_dictionary;
	_state;
	constructor(dictionary, wordLength = 5, characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
		this._wordLength = wordLength;
		this._dictionary = dictionary;
		this._allChars = characterSet.split('');
		this.reset();
	}
	reset() {
		this._state = {
			pool: Array.from(this._dictionary),
			moves: [],
			letterFrequencies: this._allChars.reduce((prev, cur) => Object.assign(prev, {[cur]: { quantity: 0, orMore: true }}), {}),
			letterPredicitions: Array(this._wordLength).fill(false).map(el => new Set(this._allChars))
		};
		return this;
	}
	addMove({ word, result }) {
		word = word.toUpperCase();
		result = result.toLowerCase();
		this._state.moves.push({ word, result });
		this._calculateFrequencies({ word, result });
		this._calculatePredictions({ word, result });
		this._filterPool({ word, result });
		return this;
	}
	get wordsLeft() {
		return Array.from(this._state.pool);
	}
	get moves() {
		return Array.from(this._state.moves);
	}
	/*get bestWord() {
		const previousState = JSON.parse(JSON.stringify(this._state));
		const poolToTest = this._state.pool.reduce((obj, word) => Object.assign(obj, {[word]: 0}), {});
		for (const word of poolToTest) {
			this.addMove();
		}
	}*/
	_calculateFrequencies({ word, result }) {
		const localFrequencies = this._allChars.reduce((prev, cur) => Object.assign(prev, {[cur]: 0}), {});
		for (let index = 0; index < result.length; index++) {
			const char = word[index];
			if (result[index] === 'o' || result[index] === 'x') {
				this._state.letterFrequencies[char].quantity = Math.max(++localFrequencies[char], this._state.letterFrequencies[char].quantity);
			} else if (result[index] === '-') {
				this._state.letterFrequencies[char].orMore = false;
			}
		}
	}
	_calculatePredictions({ word, result }) {
		for (let index = 0; index < result.length; index++) {
			if (result[index] === 'o') {
				this._state.letterPredicitions[index] = new Set(word[index]);
			} else if (result[index] === 'x') {
				this._state.letterPredicitions[index].delete(word[index]);
			} else if (result[index] === '-') {
				// Nothing
			}
		}
	}
	_filterPool() {
		for (var i = this._state.pool.length - 1; i >= 0; i--) {
			if (!this._isValidWord(this._state.pool[i])) { 
				this._state.pool.splice(i, 1);
			}
		}
	}
	_isValidWord(word) {
		// Validate frequencies first
		for (const letter of Object.keys(this._state.letterFrequencies)) {
			const letterFrequency = this._state.letterFrequencies[letter];
			const letterCount = WordleSimulator.countLetters(word, letter);
			if ((!letterFrequency.orMore && letterCount !== letterFrequency.quantity) || 
				(letterFrequency.orMore && letterCount < letterFrequency.quantity)) {
				return false;
			}
		}
		// Validate positions after
		return Array(this._wordLength).fill(false).map((_, i) => this._state.letterPredicitions[i].has(word[i])).every(val => val);
	}
	static countLetters(word, letter) {
		return word.split('').reduce((total, current) => total + (current === letter ? 1 : 0), 0);
	}
}