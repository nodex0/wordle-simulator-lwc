import { LightningElement, api } from 'lwc';
import { WORD_LENGTH } from 'logic/constants';

const LETTER_CSS_CLASS = 'letter';

const RESULT_TO_LETTER_CSS_CLASS = {
    '-': ['letter-solved', 'letter-miss'],
    'x': ['letter-solved', 'letter-oop'],
    'o': ['letter-solved', 'letter-hit'],
    '#': ['letter-empty']
};

const RESULT_ORDER = ['-', 'x', 'o'];

const NBSP = '\u00A0';

const stringReplaceAt = (string, index, character) => {
    return string.substr(0, index) + character + string.substr(index + 1);
};

export default class WordDisplay extends LightningElement {

    // Public properties

    @api get word() {
        return this._word;
    }
    set word(value) {
        this._word = value;
        this._fireChangeEvent();
    }
    @api get result() {
        return this._result;
    }
    set result(value) {
        this._result = value;
        this._fireChangeEvent();
    }
    @api isEditable = false;
    @api characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    @api reset() {
        this.word = '#'.repeat(WORD_LENGTH);
        this.result = '#'.repeat(WORD_LENGTH);
    }

    // Private properties

    _word;
    _result;

    // Lifecycle hooks

    connectedCallback() {
        if (this.isEditable) {
            this.reset();
        }
    }

    get renderableWord() {
        const resultPerChar = this.result.split('');
        return this.word.split('').map((character, index) => ({
            index,
            character: character === '#' ? (this.isEditable ? '' : NBSP) : character,
            isMiss: resultPerChar[index] === '-',
            isOop: resultPerChar[index] === 'x',
            isHit: resultPerChar[index] === 'o',
            isEmpty: resultPerChar[index] === '#',
            classes: [LETTER_CSS_CLASS].concat(RESULT_TO_LETTER_CSS_CLASS[resultPerChar[index]]).join(' ')
        }));
    }

    get _characterSet() {
        return new Set(this.characters.split(''));
    }

    // Private methods

    _focusInput(index) {
        const nextInput = this.template.querySelector(`[data-index="${index}"]`);
        if (nextInput) {
            nextInput.focus();
        }
    }

    _fireChangeEvent() {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                word: this.word,
                result: this.result
            }
        }));
    }

    // Events

    handleBeforeInput(event) {
        const data = event.data ? event.data.toUpperCase() : event.data;
        const index = parseInt(event.target.dataset.index);
        if (data === null || data === '') {
            if (this.word[index] === '#') {
                this._focusInput(index - 1);
            } else {
                this.word = stringReplaceAt(this.word, index, '#');
            }
        } else if(this._characterSet.has(data)) {
            this.word = stringReplaceAt(this.word, index, data);
            this._focusInput(index + 1);
        } else {
            event.preventDefault();
        }
    }

    handleChange(event) {
        const allInputs = Array.from(this.template.querySelectorAll('[data-index]'));
        const existingWord = allInputs.map(input => input.value === '' ? '#' : input.value);
        this.word = existingWord.join('');
    }

    handleClick(event) {
        const index = parseInt(event.target.dataset.index);
        const hasFocus = event.target === this.template.activeElement;
        if (this.isEditable && hasFocus) {
            const nextResult = RESULT_ORDER[(RESULT_ORDER.indexOf(this.result[index]) + 1) % RESULT_ORDER.length];
            this.result = stringReplaceAt(this.result, index, nextResult);
        }
    }

}