import React, { Fragment, useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormHelperText } from '@mui/material';
import moment from 'moment';
import SelectListField from './SelctList';
import { PRIORITY_LIST, STATUS_LIST } from '../Constants';
import { Close } from '@mui/icons-material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import ImageUploadButton from './ImageUpload';
import { getBase64 } from '../Helpers';

export default function TaskDialog(props) {
    const { open, onClose, onSubmit, canEdit, previousValue } = props;

    const [form, setForm] = useState({
        image: '',
        task_name: '',
        task_description: '',
        start_date: moment(Date.now()),
        end_date: moment(Date.now()),
        priority: '',
        status: ''
    })

    useEffect(() => {
        if (canEdit && previousValue) {
            getValuesForEditing();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canEdit]);

    const getValuesForEditing = () => {
        const { image, task_name, task_description, start_date, end_date, priority, status } = previousValue;
        setForm((prev) => ({
            ...prev,
            image,
            task_name,
            task_description,
            start_date: moment(start_date),
            end_date: moment(end_date),
            priority: priority.value,
            status: status.value
        }));
    }

    const [count, setCount] = useState(0);

    const [formErr, setFormErr] = useState({
        image: '',
        task_name: '',
        task_description: '',
        start_date: '',
        end_date: '',
        priority: '',
        status: ''
    });

    const { image, task_name, task_description, start_date, end_date, priority, status } = form;

    let hasErrors = Object.keys(formErr).some((err) => formErr[err]);
    let hasValues = Object.keys(form).filter((item) => item !== 'image').every((val) => form[val]);

    const handleChange = (event) => {
        const { name, value, placeholder } = event.target;
        let newPlaceholder = placeholder;
        if (name === 'priority' || name === 'status')
            newPlaceholder = name === 'priority' ? 'Priority' : 'Status';

        validateField(name, value, newPlaceholder);

        if (name !== 'start_date' || name !== 'end_date') {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    }

    const validateField = (name, value, placeholder) => {
        if (name && placeholder) {
            setFormErr((prev) => ({ ...prev, [name]: '' }));

            if (value === null || value === '') {
                setFormErr((prev) => ({ ...prev, [name]: `${placeholder} is required` }));
            }
            if (value) {
                if ((name === 'start_date' || name === 'end_date') && value !== typeof Date)
                    setFormErr((prev) => ({ ...prev, [name]: `${placeholder} must be date` }));
                if ((name === 'task_name' || name === 'task_description') && !(/^\S.*/.test(value)))
                    setFormErr((prev) => ({ ...prev, [name]: 'First letter can not be space' }))
            }
            if (name === 'image') setFormErr((prev) => ({ ...prev, image: '' }));
        }
    }

    const helperTextError = (name, customStyle = '') => {
        let hasError = false;
        if (formErr[name]) {
            hasError = true;
            return (
                <FormHelperText id={`error_${name}`} style={{ fontSize: 14, marginTop: 0, ...customStyle }} error={hasError}>
                    {formErr[name]}
                </FormHelperText>
            );
        } else {
            hasError = false;
            return (
                <FormHelperText error={hasError}>{''}</FormHelperText>
            );
        }
    }

    const handleTaskSubmit = (event) => {
        event.preventDefault();
        const clickCount = count + 1;
        const fields = ['INPUT', 'TEXTAREA'];
        const formEle = event.target;
        const formFields = [...formEle.elements];
        let filterFields = [];
        formFields.forEach((field) => {
            let fieldName = field.name;
            let fieldPlaceholder = field.placeholder;
            let fieldValue = field.value;
            if (fields.includes(field.tagName) && field.id)
                filterFields = [...filterFields, field];
            validateField(fieldName, fieldValue, fieldPlaceholder);
        })

        const shouldValidate = clickCount > 0 ? !hasErrors : hasErrors;

        if (shouldValidate && hasValues) {
            const startDate = start_date.format();
            const endDate = end_date.format();
            const priorityObj = PRIORITY_LIST.find((prioRty) => prioRty.value === priority);
            const statusObj = STATUS_LIST.find((staTus) => staTus.value === status);
            const newTask = {
                id: canEdit ? previousValue.id : null,
                image,
                start_date: startDate,
                end_date: endDate,
                task_description,
                task_name,
                priority: { name: priorityObj.label, value: priorityObj.value },
                status: { name: statusObj.label, value: statusObj.value },
                created_at: canEdit ? previousValue.created_at : moment(Date.now()).format(),
                updated_at: canEdit ? moment(Date.now()).format() : null
            };
            onSubmit(newTask);
            onClose();
        }
        setCount(clickCount);
    }

    const onImageUpload = (file, statusCode) => {
        setFormErr((prev) => ({ ...prev, image: '' }));
        if (file) {
            if (statusCode === 200) {
                getBase64(file).then(base64 => {
                    setForm((prev) => ({ ...prev, image: base64 }));
                });
            } else if (statusCode === 422) {
                setFormErr((prev) => ({ ...prev, image: 'File must be a JPG, JPEG or PNG' }));
            }
        }
    }

    const onImageDelete = () => {
        setForm((prev) => ({ ...prev, image: null }));
    }

    return (
        <Fragment>
            <Dialog fullWidth open={open} onClose={onClose}>
                <Box component='form' onSubmit={handleTaskSubmit}>
                    <Box>
                        <Box display='flex' justifyContent='space-between'>
                            <DialogTitle>{canEdit ? 'Update' : 'Create'} Task</DialogTitle>
                            <Button onClick={onClose} sx={{ borderRadius: '50%' }}>
                                <Close />
                            </Button>
                        </Box>
                        <DialogContent>
                            <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' gap='25px' margin='15px 0'>
                                <Box width='160px' height="160px" marginBottom={formErr['image'] ? " 20px" : 0}>
                                    <ImageUploadButton
                                        image={image}
                                        acceptFiles={["image/png", "image/jpeg", "image/jpg"]}
                                        onChange={onImageUpload}
                                        onDelete={onImageDelete}
                                    />
                                    {helperTextError('image', { width: '240px', marginLeft: '-30px', marginTop: '10px' })}
                                </Box>
                                <Box width='100%' className="fieldBox">
                                    <label className='fieldLabel'>Task Name</label>
                                    <TextField
                                        id='task_name'
                                        error={formErr['task_name'] ? true : false}
                                        fullWidth
                                        name='task_name'
                                        variant="outlined"
                                        value={task_name}
                                        placeholder="Task name"
                                        onBlur={handleChange}
                                        onChange={handleChange}
                                    />
                                    {helperTextError('task_name')}
                                </Box>
                                <Box width='100%' className="fieldBox">
                                    <label className='fieldLabel'>Task Description</label>
                                    <TextField
                                        error={formErr['task_description'] ? true : false}
                                        id='task_description'
                                        fullWidth
                                        multiline
                                        name='task_description'
                                        placeholder="Task description"
                                        variant="outlined"
                                        value={task_description}
                                        onBlur={handleChange}
                                        onChange={handleChange}
                                    />
                                    {helperTextError('task_description')}
                                </Box>
                                <Box width='100%' className="fieldBoxDouble">
                                    <Box className="fieldBox" style={{ width: '260px' }}>
                                        <label className='fieldLabel'>Select Start Date</label>
                                        <MobileDatePicker
                                            placeholder="Start date"
                                            slotProps={{ textField: { id: 'start_date' } }}
                                            name="start_date"
                                            sx={{ width: '100%' }}
                                            onBlur={handleChange}
                                            onChange={(newDate) => setForm((prev) => ({ ...prev, start_date: newDate }))}
                                            onError={(error) => {
                                                if (error === 'maxDate') setFormErr({ start_date: 'Start date cannot be more than end date' })
                                                else setFormErr({ start_date: '' })
                                            }}
                                            format='DD-MM-YYYY'
                                            value={start_date}
                                        />
                                        {helperTextError('start_date')}
                                    </Box>
                                    <Box className="fieldBox" style={{ width: '260px' }}>
                                        <label className='fieldLabel'>Select End Date</label>
                                        <MobileDatePicker
                                            disableHighlightToday
                                            placeholder="End date"
                                            name="end_date"
                                            sx={{ width: '100%' }}
                                            onBlur={handleChange}
                                            onChange={(newDate) => setForm((prev) => ({ ...prev, end_date: newDate }))}
                                            onError={(error) => {
                                                if (error === 'minDate') setFormErr({ end_date: 'End date cannot be les than end date' })
                                                else setFormErr({ end_date: '' })
                                            }}
                                            slotProps={{ textField: { id: 'end_date' } }}
                                            format='DD-MM-YYYY'
                                            value={end_date}
                                            minDate={moment(start_date, 'DD-MM-YYYY')}
                                        />
                                        {helperTextError('end_date')}
                                    </Box>
                                </Box>
                                <Box width='100%' className="fieldBox">
                                    <label className='fieldLabel'>Selct Priority</label>
                                    <SelectListField
                                        error={formErr['priority'] ? true : false}
                                        items={PRIORITY_LIST}
                                        id='priority'
                                        defaultSelectText='Select priority'
                                        placeholder="Priority"
                                        valueField="value"
                                        labelField="label"
                                        name='priority'
                                        value={priority}
                                        onBlur={handleChange}
                                        onChange={handleChange}
                                    />
                                    {helperTextError('priority')}
                                </Box>
                                <Box width='100%' className="fieldBox">
                                    <label className='fieldLabel'>Selct Status</label>
                                    <SelectListField
                                        error={formErr['status'] ? true : false}
                                        items={STATUS_LIST}
                                        id='status'
                                        placeholder="Status"
                                        valueField="value"
                                        labelField="label"
                                        name='status'
                                        value={status}
                                        onBlur={handleChange}
                                        onChange={handleChange}
                                    />
                                    {helperTextError('status')}
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ margin: '16px' }}>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button disabled={hasErrors} type='submit' variant="contained">{canEdit ? 'Update' : 'Create'}</Button>
                        </DialogActions>
                    </Box>
                </Box>
            </Dialog>
        </Fragment>
    );
}