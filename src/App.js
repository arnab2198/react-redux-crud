import './App.css';
import { Fab, IconButton, InputAdornment, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Fragment, useEffect, useState } from 'react';
import TaskDialog from './Components/TaskDialog';
import { Map, getCSVFile, importCSVFile, uuid } from './Helpers';
import { CreateTask, DeleteTask, UpdateTask } from './Redux/Actions';
import { connect } from 'react-redux';
import DataTable from './Components/DataTable';
import { actions, ACTION_TYPES, filters, headers, PRIORITY_LIST, STATUS_LIST } from './Constants';
import TaskDialogView from './Components/TaskDialogView';
import SelectListField from './Components/SelctList';
import moment from 'moment';
import ConfirmModal from './Components/ConfirmModal';
import CloseIcon from '@mui/icons-material/Close';
import withSnackBar from './HOC/withSnackBar';
import noImage from './noImage.png';
import ImageDialog from './Components/ImageDialog';


function App(props) {

  const { tasks, dispatch, setToast } = props;

  const [state, setState] = useState({
    open: false,
    allTasks: [],
    selectedTask: {},
    isEditing: false,
    isViewing: false,
    isDeleting: false,
    priorityFilterValue: '',
    statusFilterValue: '',
    imageWindowOpen: false,
    showImage: '',
    checkedTasks: [],
  })

  const { open, allTasks, selectedTask, isEditing, isViewing, isDeleting, priorityFilterValue, statusFilterValue, imageWindowOpen, showImage,
    checkedTasks
  } = state;

  useEffect(() => {
    if (JSON.stringify(allTasks) !== JSON.stringify(tasks))
      updateTasksList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  const updateTasksList = () =>
    setState((prev) => ({ ...prev, allTasks: tasks.sort((a, b) => (new Date(a.created_at) - new Date(b.created_at))).reverse() }));


  const handleToggleDialog = (type) => {
    if (type === 'CREATE')
      setState((prev) => ({ ...prev, open: !open, isEditing: false }))
    else if (type === 'UPDATE')
      setState((prev) => ({ ...prev, isEditing: !isEditing, selectedTask: !isEditing ? {} : selectedTask, isViewing: false }));
    else if (type === 'VIEW')
      setState((prev) => ({ ...prev, isViewing: !isViewing, selectedTask: !isViewing ? {} : selectedTask, isEditing: false }));
    else
      setState((prev) => ({ ...prev, selectedTask: {}, isViewing: false, isEditing: false, isDeleting: false }));
  };

  const handleSubmit = (newTask) => {
    if (newTask.id && isEditing) {
      dispatch(UpdateTask(newTask))
      setToast('Task updated successfully');
    } else if (newTask && !newTask.id) {
      newTask.id = uuid();
      let allTasksArr = [];
      allTasksArr = [...allTasks, newTask];
      dispatch(CreateTask(allTasksArr));
      setToast('Task added successfully');
    }
  };

  const onActionClick = (action, item) => {
    const { key } = action;
    switch (key) {
      case ACTION_TYPES.VIEW:
        setState((prev) => ({ ...prev, selectedTask: item, isEditing: false, open: false, isViewing: true, isDeleting: false }));
        break;
      case ACTION_TYPES.EDIT:
        setState((prev) => ({ ...prev, selectedTask: item, isEditing: true, open: false, isViewing: false, isDeleting: false }));
        break;
      case ACTION_TYPES.DELETE:
        setState((prev) => ({ ...prev, selectedTask: item, isEditing: false, open: false, isViewing: false, isDeleting: true }));
        break;
      default:
        return;
    }
  }

  const addCustomField = () => {
    const modifiedHeaders = Map(headers, (head) => {
      if (head.key === 'image') {
        head.render = (item) =>
          <>
            <Tooltip placement="right" arrow title={item.image ? 'Click to see the image' : 'No image found'}>
              <img onClick={item.image ? () => openImageWindow(item) : undefined}
                className="tableImg" src={item.image ? item.image : noImage} alt="taskImg" />
            </Tooltip>
          </>
      }
      if (head.key === 'priority.name') {
        head.render = (item) => {
          return (
            <SelectListField
              name="priority"
              placeholder="Priority"
              valueField="value"
              labelField="label"
              items={PRIORITY_LIST}
              value={item.priority.value}
              onChange={(event) => handleCustomFieldUpdate(event, item, 'PRIORITY')}
            />
          )
        }
        return head;
      } else if (head.key === 'status.name') {
        head.render = (item) => {
          return (
            <SelectListField
              name="status"
              placeholder="Status"
              valueField="value"
              labelField="label"
              items={STATUS_LIST}
              value={item.status.value}
              onChange={(event) => handleCustomFieldUpdate(event, item, 'STATUS')}
            />
          )
        }
        return head;
      } else {
        return head;
      }
    });
    return modifiedHeaders;
  }

  const openImageWindow = (data) => {
    setState((prev) => ({ ...prev, imageWindowOpen: true, showImage: data.image }));
  }

  const modifiedHeaders = addCustomField();

  const handleCustomFieldUpdate = (event, item, type) => {
    const newValue = event.target.value;
    let updatedtask = item;
    if (type === 'PRIORITY') {
      const priorityObj = PRIORITY_LIST.find((prioRty) => prioRty.value === newValue);
      updatedtask.priority = { name: priorityObj.label, value: priorityObj.value };
    } else if (type === 'STATUS') {
      const statusObj = STATUS_LIST.find((staTus) => staTus.value === newValue);
      updatedtask.status = { name: statusObj.label, value: statusObj.value };
    }
    updatedtask.updated_at = moment(Date.now()).format();
    dispatch(UpdateTask(updatedtask));
    setToast('Task updated successfully');
  }

  const handleDeleteTask = () => {
    if (isDeleting)
      dispatch(DeleteTask(selectedTask));
    setState((prev) => ({ ...prev, isDeleting: false }));
    setToast('Task deleted successfully');
  }

  const modifyFilters = () => {
    const modifiedFilters = Map(filters, (filter) => {
      if (filter.key === 'priority') {
        filter.render = (filter) => {
          return (
            <SelectListField
              name="priority"
              label="Filter priority"
              valueField="value"
              labelField="label"
              items={PRIORITY_LIST}
              value={priorityFilterValue}
              onChange={handleFilter}
              InputProps={{
                endAdornment: (
                  <Fragment>
                    {priorityFilterValue &&
                      <InputAdornment sx={{ margin: '20px' }} position="end">
                        <IconButton onClick={() => setState((prev) => ({ ...prev, priorityFilterValue: '', allTasks: tasks }))}>
                          <CloseIcon />
                        </IconButton>
                      </InputAdornment>}
                  </Fragment>
                ),
              }}
            />
          )
        }
        return filter;
      } else if (filter.key === 'status') {
        filter.render = (filter) => {
          return (
            <SelectListField
              name="status"
              label="Filter status"
              valueField="value"
              labelField="label"
              items={STATUS_LIST}
              value={statusFilterValue}
              onChange={handleFilter}
              InputProps={{
                endAdornment: (
                  <Fragment>
                    {statusFilterValue &&
                      <InputAdornment sx={{ margin: '20px' }} position="end">
                        <IconButton onClick={() => setState((prev) => ({ ...prev, statusFilterValue: '', allTasks: tasks }))}>
                          <CloseIcon />
                        </IconButton>
                      </InputAdornment>}
                  </Fragment>
                ),
              }}
            />
          )
        }
        return filter;
      } else {
        return filter;
      }
    })
    return modifiedFilters;
  }

  const modifiedFilters = modifyFilters();

  const handleFilter = (event) => {
    const { value, name } = event.target;
    const filterTask = tasks.filter((task) => task[name].value === value);
    if (name === 'status') {
      setState((prev) => ({ ...prev, allTasks: filterTask, statusFilterValue: value }));
    } else {
      setState((prev) => ({ ...prev, allTasks: filterTask, priorityFilterValue: value }));
    }
  }

  const manageCustomCsvData = (item, key, dataIndex, result) => {
    const blockedValues = [undefined, null, ''];
    let newKey = key.includes('.') ? key.split('.')[0] : key;
    if (newKey === 'sr_no')
      result += dataIndex + 1
    else if (newKey === 'start_date' || newKey === 'end_date')
      result += moment(item[newKey]).format('DD-MM-YYYY')
    else
      result += blockedValues.includes(item[newKey]) ? 'N/A' : (typeof item[newKey] === 'object' ? item[newKey]['name'] : item[newKey]);
    return result;
  }

  const exportToCSVFile = () => {
    let csvData = '';
    const customKeys = ['Sr. No', 'Task Name', 'Task Description', 'Start Date', 'End date', 'Priority', 'Status'];
    // eslint-disable-next-line
    const exportCSVFields = headers.map((head) => { if (head.exportCSV) return head.key }).filter(hD => typeof hD !== 'undefined')
    csvData = getCSVFile({ data: checkedTasks }, exportCSVFields, customKeys, manageCustomCsvData);
    let link = document.createElement('a')
    link.id = 'download-csv'
    link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvData));
    link.setAttribute('download', `${Date.now()}_tasks.csv`);
    document.body.appendChild(link)
    document.querySelector('#download-csv').click()
    setToast('CSV exported successfully');
    document.body.removeChild(link);
  }

  const checkboxSelect = (e, data) => {
    const { name, checked } = e.target;
    let checkedTask = [];
    checkedTask = [...checkedTasks];
    if (name === 'select-all') {
      if (checked) checkedTask = allTasks;
      else checkedTask = [];
    } else {
      const index = checkedTask.findIndex((task) => task.id === data.id);

      if (index > -1) {
        checkedTask.splice(index, 1);
      } else {
        checkedTask.push(data);
      }
    }
    setState((prev) => ({ ...prev, checkedTasks: checkedTask }));
  }

  const importCSV = () => {
    const element = document.createElement('input');
    element.type = 'file';
    element.accept = 'text/csv';
    element.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'text/csv') {
        importCSVFile(file, getCSVdata);
      } else {
        setToast('File must be CSV / XLSX', 'error')
      }
    });
    element.click();
  }

  const getCSVdata = (data) => {
    if (data && Array.isArray(data) && data.length > 0) {
      allTasks.forEach((task) => {
        data = data.filter((objData) =>
          objData.task_name !== task.task_name
          && objData.task_description !== task.task_description
        )
      })
    }

    data = data.map((newObj) => {
      const priority = PRIORITY_LIST.find((prioRty) => prioRty.value === newObj['priority'].split(' ').join('_').toUpperCase());
      let newPriority = {};
      Object.assign(newPriority, priority);

      newPriority['name'] = newPriority['label'];
      delete newPriority['key'];
      delete newPriority['label'];

      const status = STATUS_LIST.find((sttS) => sttS.value === newObj['status'].split(' ').join('_').toUpperCase());
      let newStatus = {};
      Object.assign(newStatus, status);

      newStatus['name'] = newStatus['label'];
      delete newStatus['key'];
      delete newStatus['label'];

      newObj['created_at'] = moment(Date.now()).format();
      newObj['updated_at'] = null;
      newObj['image'] = null;
      newObj['priority'] = newPriority;
      newObj['status'] = newStatus;
      delete newObj['sr_no'];
      return newObj;
    })

    if (data.length > 0) {
      let allTasksArr = [...allTasks, ...data];
      dispatch(CreateTask(allTasksArr));
      setToast('CSV imported successfully');
    } else setToast('Nothing to import from CSV', 'error');
  }

  return (
    <div className="App">
      <Tooltip title="Add Task" placement='top' arrow>
        <Fab onClick={() => handleToggleDialog('CREATE')} color="info" sx={{ position: 'fixed', bottom: '40px', right: '40px', }} >
          <Add />
        </Fab>
      </Tooltip>

      <DataTable
        items={allTasks}
        headers={modifiedHeaders}
        actions={actions}
        onActionClick={onActionClick}
        canSearch
        canFilter
        canExportCsv
        canImportCsv
        filters={modifiedFilters}
        exportToCSV={exportToCSVFile}
        handleCheckboxSelect={checkboxSelect}
        checkedTasks={checkedTasks}
        importCSV={importCSV}
      />

      {open && <TaskDialog open={open} onClose={() => handleToggleDialog('CREATE')} onSubmit={handleSubmit} />}

      {isEditing &&
        <TaskDialog
          open={isEditing}
          canEdit={isEditing}
          previousValue={isEditing ? selectedTask : {}}
          onClose={() => handleToggleDialog('UPDATE')}
          onSubmit={handleSubmit}
        />
      }

      {isViewing &&
        <TaskDialogView
          open={isViewing}
          value={isViewing ? selectedTask : {}}
          onClose={() => handleToggleDialog('VIEW')}
        />
      }

      {isDeleting &&
        <ConfirmModal
          open={isDeleting}
          onClose={() => handleToggleDialog('DELETE')}
          title="Are you sure"
          description='you want to delete this task ?'
          handleDelete={handleDeleteTask}
        />
      }

      {imageWindowOpen &&
        <ImageDialog
          open={imageWindowOpen}
          onClose={() => setState((prev) => ({ ...prev, imageWindowOpen: false }))}
          image={showImage}
        />
      }

    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks,
  };
};

const connectedApp = connect(mapStateToProps)(App);

export default withSnackBar(connectedApp);
