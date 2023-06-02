const STORAGE = localStorage;

export default class Storage {
    static LoadState = () => {
        try {
            const localState = STORAGE.getItem('state') || {};
            const state = Object.assign({}, JSON.parse(localState));
            return state;
        } catch (error) {
            const params = {
                tasks: [],
            };
            return Object.assign({}, params);
        }
    };

    static SaveState = (state = {}) => {
        try {
            STORAGE.clear();
            const localState = state;
            STORAGE.setItem('state', JSON.stringify(localState));
        } catch (error) {
            return error;
        }
    }
}