import moment from "moment";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PRIORITIES = {
    VERY_HIGH: 'VERY_HIGH',
    HIGH: 'HIGH',
    MEDIUM: 'MEDIUM',
    LOW: 'LOW',
    VERY_LOW: 'VERY_LOW'
}

const STATUS = {
    TO_DO: 'TO_DO',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED'
}

export const ACTION_TYPES = {
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    VIEW: 'VIEW'
}

export const PRIORITY_LIST = [
    { key: 100, label: 'Very High', value: PRIORITIES.VERY_HIGH },
    { key: 80, label: 'High', value: PRIORITIES.HIGH },
    { key: 60, label: 'Medium', value: PRIORITIES.MEDIUM },
    { key: 40, label: 'Low', value: PRIORITIES.LOW },
    { key: 20, label: 'Very Low', value: PRIORITIES.VERY_LOW },
]

export const STATUS_LIST = [
    { key: 0, label: 'To Do', value: STATUS.TO_DO },
    { key: 50, label: 'In Progress', value: STATUS.IN_PROGRESS },
    { key: 100, label: 'Completed', value: STATUS.COMPLETED },
]

export const headers = [
    { key: 'id', label: 'ID', isSort: true, exportCSV: true },
    { key: 'image', label: 'Image', isSort: false, exportCSV: false },
    {
        key: 'task_name', label: 'Name', isSort: true, isSearchable: true, exportCSV: true,
        render: (item) => item.task_name && item.task_name.length > 30 ? item.task_name.substring(0, 30) + '...' : item.task_name
    },
    {
        key: 'task_description', label: 'Description', isSort: true, isSearchable: true, exportCSV: true,
        render: (item) => item.task_description && item.task_description.length > 30 ? item.task_description.substring(0, 30) + '...' : item.task_description
    },
    { key: 'start_date', label: 'Start Date', render: (item) => moment(item.start_date).format('DD-MM-YYYY'), isSort: true, exportCSV: true },
    { key: 'end_date', label: 'End Date', render: (item) => moment(item.end_date).format('DD-MM-YYYY'), isSort: true, exportCSV: true },
    { key: 'priority.name', label: 'Priority', isSort: true, isSearchable: true, exportCSV: true },
    { key: 'status.name', label: 'Status', isSort: true, isSearchable: true, exportCSV: true },
    { key: 'created_at', label: 'Created At', render: (item) => moment(item.created_at).format('DD-MM-YYYY HH:mm:ss'), isSort: true, exportCSV: true },
    { key: 'updated_at', label: 'Last Updated', render: (item) => item.updated_at ? moment(item.updated_at).format('DD-MM-YYYY HH:mm:ss') : 'N/A', isSort: true, exportCSV: true },
];

export const actions = [
    { key: ACTION_TYPES.EDIT, icon: EditIcon },
    { key: ACTION_TYPES.DELETE, icon: DeleteIcon },
    { key: ACTION_TYPES.VIEW, icon: VisibilityIcon },
]

export const DATATABLE_ROWS_OPTIONS = [
    { value: 5, label: '5' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 70, label: '70' },
    { value: 100, label: '100' },
];

export const filters = [{ key: 'priority' }, { key: 'status' }]