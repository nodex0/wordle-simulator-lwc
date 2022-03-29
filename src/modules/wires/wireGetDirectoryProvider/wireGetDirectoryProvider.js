import { DIRECTORY_PATH } from 'logic/constants';

export default class getDirectory {
    connected = false;
    directory;

    constructor(dataCallback) {
        this.dataCallback = dataCallback;
    }

    connect() {
        this.connected = true;
        this.refreshData();
    }

    disconnect() {
        this.connected = false;
    }

    update() {
        this.refreshData();
    }

    async refreshData() {
        if (this.connected) {
            if (!this.directory) {
                this.directory = await (await fetch(DIRECTORY_PATH)).json();
            }
            this.dataCallback(this.directory);
        }
    }
}