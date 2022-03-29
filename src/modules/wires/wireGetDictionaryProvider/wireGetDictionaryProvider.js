import { DICTIONARIES_PATH } from 'logic/constants';

export default class getDictionary {
    connected = false;
    directory;

    constructor(dataCallback) {
        this.dataCallback = dataCallback;
    }

    connect() {
        this.connected = true;
    }

    disconnect() {
        this.connected = false;
    }

    update(config) {
        if (config.file) {
            this.refreshData(config.file);
        }
    }

    async refreshData(dictionary) {
        if (this.connected) {
            const content = await (await fetch(`${DICTIONARIES_PATH}/${dictionary}`)).json();
            this.dataCallback(content);
        }
    }
}