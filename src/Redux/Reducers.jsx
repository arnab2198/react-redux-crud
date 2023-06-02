import { TaskTypes } from "./Actions";

const initialState = {
    tasks: []
};

const Task = (state = initialState, action = {}) => {
    const { type, payload } = action;
    switch (type) {
        case TaskTypes.CREATE_TASK:
            return {
                ...state,
                tasks: payload,
            };
        case TaskTypes.UPDATE_TASK:
            return {
                ...state,
                tasks: state.tasks.map((task) => {
                    if (task.id === payload.id)
                        task = payload;
                    return task;
                })
            };
        case TaskTypes.DELETE_TASK:
            return {
                ...state,
                tasks: state.tasks.filter((task) => task.id !== payload.id)
            };
        default:
            return state;
    }
};

export default Task;
