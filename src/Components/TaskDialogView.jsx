import React, { Fragment } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import moment from 'moment';
import { Close } from '@mui/icons-material';

export default function TaskDialogView(props) {
    const { open, onClose, value } = props;

    const { id, task_name, task_description, priority, end_date, start_date, updated_at, status, image } = value;

    return (
        <Fragment>
            <Dialog fullWidth open={open} onClose={onClose}>
                <Box>
                    <Box display='flex' justifyContent='space-between'>
                        <DialogTitle>View Task</DialogTitle>
                        <Button onClick={onClose} sx={{ borderRadius: '50%' }}>
                            <Close />
                        </Button>
                    </Box>
                    <DialogContent>
                        <Box display='flex' alignItems='flex-start' justifyContent='center' flexDirection='column' gap='25px' margin='10px 0'>
                            {image &&
                                <Box className='viewContentBox' width='100%' component='span'>
                                    <img className='imgViewSmall' src={image} />
                                </Box>
                            }
                            <Box className='viewContentBox' component='span'>
                                <Typography className='boldText'>Task ID:</Typography>
                                <Typography className='contentText' component='h4'>{id}</Typography>
                            </Box>
                            <Box className='viewContentBox' component='span'>
                                <Typography className='boldText'>Task Name:</Typography>
                                <Typography className='contentText' component='p'>{task_name}</Typography>
                            </Box>
                            <Box className='viewContentBox' component='span'>
                                <Typography className='boldText'>Task Description:</Typography>
                                <Typography className='contentText' component='p'>{task_description}</Typography>
                            </Box>
                            <Box className='viewContentBox' component='span'>
                                <Typography className='boldText'>Priority:</Typography>
                                <Typography className='contentText' component='p'>{priority.name}</Typography>
                            </Box>
                            <Box className='viewContentBox' component='span'>
                                <Typography className='boldText'>Status:</Typography>
                                <Typography className='contentText' component='p'>{status.name}</Typography>
                            </Box>
                            <Box className='viewContentBox' component='span'>
                                <Typography className='boldText'>Start Date:</Typography>
                                <Typography className='contentText' component='p'>{moment(start_date).format('DD-MM-YYYY HH:mm:ss')}</Typography>
                            </Box>
                            <Box className='viewContentBox' component='span'>
                                <Typography className='boldText'>End Date:</Typography>
                                <Typography className='contentText' component='p'>{moment(end_date).format('DD-MM-YYYY HH:mm:ss')}</Typography>
                            </Box>
                            <Box className='viewContentBox' component='span'>
                                <Typography className='boldText'>Last Updated:</Typography>
                                <Typography className='contentText' component='p'>{updated_at ? moment(updated_at).format('DD-MM-YYYY HH:mm:ss') : 'N/A'}</Typography>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ margin: '16px' }}>
                        <Button onClick={onClose}>Cancel</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Fragment>
    );
}