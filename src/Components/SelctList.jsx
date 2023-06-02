import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import { GetValue, Map } from '../Helpers';

const SelectListField = (props) => {
    const {
        items = [],
        fullWidth,
        valueField = 'value',
        labelField = 'label',
        defaultValue,
        defaultChecked,
        multiple = false,
        error,
        id,
        defaultSelectText,
        ...restProps
    } = props;
    return (
        <TextField
            defaultValue={""}
            error={error}
            SelectProps={{ multiple }}
            inputProps={{ id: id }}
            select
            fullWidth={fullWidth || true}
            {...restProps}
        >
            <MenuItem value="" disabled>
                <em>{defaultSelectText || 'Select value'}</em>
            </MenuItem>
            {items && items.length > 0 ? (
                Map(items, (option, index) => (
                    <MenuItem
                        key={index}
                        defaultValue={defaultValue || ''}
                        defaultChecked={defaultChecked || true}
                        value={GetValue(option, valueField) || ''}
                    >
                        {GetValue(option, labelField)}
                    </MenuItem>
                ))
            ) : (
                <MenuItem sx={{ pointerEvents: 'none', color: '#000' }} disabled>
                    No data found
                </MenuItem>
            )}
        </TextField>
    );
};
export default SelectListField;