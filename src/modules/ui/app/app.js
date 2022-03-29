import { LightningElement, wire, track } from 'lwc';
import { WordleSimulator } from 'logic/wordleSimulator';
import getDirectory from 'wires/wireGetDirectoryProvider';
import getDictionary from 'wires/wireGetDictionaryProvider';
import { WORD_LENGTH } from 'logic/constants';
import strings from 'ui/strings';

export default class App extends LightningElement {

    // Private properties

    labels = strings;
    
    _dictionaryFile;
    _inputMove;

    _simulator;
    directory;

    _language;
    get language() {
        return this._language;
    }
    set language(value) {
        console.log(`Language set to ${value}`);
        this._language = value;
        if (value) {
            this._dictionaryFile = this.directory[this.language].filename;
        }
    }

    _moves = [];
    get moves() {
        const renderableMoves = this._moves.concat(new Array(6 - this._moves.length).fill({
            word: '#'.repeat(WORD_LENGTH),
            result: '#'.repeat(WORD_LENGTH)
        }));
        return renderableMoves.map(
            (move, index) => ({ 
                index, 
                word: move.word,
                result: move.result
            })
        );
    }

    _pool;
    get pool() {
        return this._moves && this._moves.length > 0 ? this._pool : null;
    }

    get _isMoveAddable() {
        return this._inputMove && !this._inputMove.word.includes('#') && !this._inputMove.result.includes('#');
    }

    get isAddMoveDisabled() {
        return !this._isMoveAddable;
    }

    get characters() {
        return this.directory && this.language ? this.directory[this.language].characterSet : null;
    }

    get languages() {
        return this.directory ? Object.keys(this.directory).map(key => ({
            label: this.directory[key].label,
            value: key
        })) : [];
    }

    // Wires

    @wire(getDirectory)
    _directoryWire(directory) {
        this.directory = directory;
        this.language = Object.keys(directory)[0];
    };

    @wire(getDictionary, { file: '$_dictionaryFile' })
    _dictionaryWire(dictionary) {
        console.log(`Loaded dictionary for ${this.language}`);
        console.log(dictionary);
        this._simulator = new WordleSimulator(dictionary, WORD_LENGTH, this.characters);
        this._refreshSimulatorUi();
    };

    // Main logic

    addMove() {
        const inputWord = this.template.querySelector('.new-word ui-word-display');
        this._simulator.addMove(this._inputMove);
        inputWord.reset();
        this._refreshSimulatorUi();
    }

    _refreshSimulatorUi() {
        this._moves = this._simulator.moves;
        this._pool = this._simulator.wordsLeft;
    }

    // Events

    handleLanguageChange(event) {
        console.log(event);
        this.language = event.target.value;
    }

    handleInputWordChange(event) {
        this._inputMove = {
            word: event.detail.word,
            result: event.detail.result
        };
    }
}
