export const TaskTypes = {
    CREATE_TASK: 'CREATE_TASK',
    UPDATE_TASK: 'UPDATE_TASK',
    DELETE_TASK: 'DELETE_TASK',
}

export const CreateTask = (payload) => {
    return {
        type: TaskTypes.CREATE_TASK,
        payload
    };
};

export const UpdateTask = (payload) => {
    return {
        type: TaskTypes.UPDATE_TASK,
        payload
    };
};

export const DeleteTask = (payload) => {
    return {
        type: TaskTypes.DELETE_TASK,
        payload
    };
};
