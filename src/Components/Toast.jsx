import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

export default function Toast(props) {
    const { action, open, onClose, hideDuration = 6000, message = '', type = 'success' } = props;

    return (
        <div>
            <Snackbar
                open={open}
                autoHideDuration={hideDuration}
                onClose={onClose}
                action={action}
            >
                <Alert onClose={onClose} severity={type}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}