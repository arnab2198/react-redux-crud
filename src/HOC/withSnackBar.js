import { Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";


const withSnackBar = (WrappedComponent) => {
    return (props) => {

        const [state, setState] = useState({
            open: false,
            message: '',
            duration: 4000,
            severity: 'success'
        });

        const { duration, message, open, severity } = state;

        const showMessage = (message, severity = "success", duration = 4000) => {
            setState((prev) => ({ ...prev, message, severity, open: true, duration }));
        };

        const handleClose = (event, reason) => {
            if (reason === "clickaway") {
                return;
            }
            setState((prev) => ({ ...prev, open: false }));
        };

        return (
            <>
                <WrappedComponent {...props} setToast={showMessage} />
                <Snackbar
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    autoHideDuration={duration}
                    open={open}
                    onClose={handleClose}
                >
                    <Alert variant="filled" onClose={handleClose} severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
            </>
        );
    };
};

export default withSnackBar;