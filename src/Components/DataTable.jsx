import { Button, IconButton, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { Fragment, useEffect, useState } from 'react'
import { GetValue, Map } from '../Helpers';
import CloseIcon from '@mui/icons-material/Close';
import { DATATABLE_ROWS_OPTIONS } from '../Constants';


const DataTable = (props) => {
    const { items, headers, actions, onActionClick, canSearch = false, canFilter = false, filters, exportToCSV } = props;

    const [state, setState] = useState({
        data: [],
        page: 0,
        searchQuery: '',
        order: 'asc',
        rowsPerPage: 5,
    });

    const { data, page, searchQuery, order, rowsPerPage } = state;

    useEffect(() => {
        if (JSON.stringify(items) !== JSON.stringify(data))
            getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    const getData = () => setState((prev) => ({ ...prev, data: items }));

    const handleActionClick = (action, item) => {
        if (onActionClick) onActionClick(action, item);
    }

    const handleChange = (e, newPage) => {
        setState((prev) => ({ ...prev, page: newPage }));
    };

    const sortHandler = (header) => {
        if (header.key) {
            if (order === 'asc') {
                const sortedData = [...data].sort((a, b) =>
                    GetValue(a, header.key).toLowerCase() > GetValue(b, header.key).toLowerCase() ? 1 : -1
                );
                setState((prev) => ({ ...prev, order: 'desc', data: sortedData }));
            } else if (order === 'desc') {
                const sortedData = [...data].sort((a, b) =>
                    GetValue(a, header.key).toLowerCase() < GetValue(b, header.key).toLowerCase() ? 1 : -1
                );
                setState((prev) => ({ ...prev, order: 'asc', data: sortedData }));
            }
        }
    }

    const handleSearch = (event) => {
        const { target: { name, value } } = event;
        setState((prev) => ({ ...prev, [name]: value, page: 0 }))
        const searchAbleKeys = headers.filter((header) => header.isSearchable === true).map((head) => head.key);
        let filteredData = [];
        filteredData = items.filter((task) =>
            searchAbleKeys.some((key) => GetValue(task, key).toLowerCase().includes(value.toLowerCase()))
        );
        setState((prev) => ({ ...prev, data: filteredData }));
    }

    const handleRowsPerPageChange = (event) => {
        const limit = parseInt(event.target.value, 10);
        setState((prev) => ({ ...prev, page: 0, rowsPerPage: limit }));
    }

    const handleBlockKey = (event) => {
        const { target: { value }, keyCode } = event;
        if ((value === null || value === '') && keyCode === 32) event.preventDefault();
    }

    return (
        <Box className='tableMainBox'>
            {canSearch &&
                <TextField
                    sx={{
                        marginTop: '30px',
                        width: '50%',
                        '& input': {
                            padding: '10px',
                            fontSize: '18px'
                        }
                    }}
                    name='searchQuery'
                    placeholder='Search here'
                    value={searchQuery}
                    onChange={handleSearch}
                    onKeyDown={handleBlockKey}
                    InputProps={{
                        endAdornment: (
                            <Fragment>
                                {searchQuery.length > 0 &&
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setState((prev) => ({ ...prev, searchQuery: '', data: items }))}>
                                            <CloseIcon />
                                        </IconButton>
                                    </InputAdornment>}
                            </Fragment>
                        ),
                    }}
                />}

            {filters.length > 0 &&
                <Box className="filterBoxMain">
                    {canFilter && filters.length > 0 && Map(filters, (filter, filterIndex) => (
                        <Fragment key={filterIndex}>
                            {filter.render ? filter.render(filter) : null}
                        </Fragment>
                    ))
                    }
                </Box>
            }

            {/* <Box className='exportCSVContainer'>
                {typeof exportToCSV === 'function' &&
                    <Button variant='contained' onClick={exportToCSV}>Export CSV</Button>
                }
            </Box> */}

            <TableContainer className='tableContainer'>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers && Map(headers, (head, headIndex) => (
                                <TableCell className='tableHead' key={headIndex}>
                                    {head.isSort ?
                                        <TableSortLabel direction={order} onClick={() => sortHandler(head)}>
                                            {head.label}
                                        </TableSortLabel>
                                        :
                                        head.label
                                    }
                                </TableCell>
                            ))}
                            {actions && actions.length > 0 &&
                                <TableCell className='tableHead'>
                                    Action
                                </TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.length > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, itemIndex) => (
                            <TableRow key={itemIndex}>
                                {headers && Map(headers, (head, headIndex) => (
                                    <TableCell key={headIndex}>
                                        {head.render ? head.render(item) : GetValue(item, head.key)}
                                    </TableCell>
                                ))}
                                {actions && actions.length > 0 &&
                                    <TableCell>
                                        {Map(actions, (action, actionIndex) => (
                                            <IconButton onClick={() => handleActionClick(action, item)} key={actionIndex}>
                                                <action.icon />
                                            </IconButton>
                                        ))}
                                    </TableCell>
                                }
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell sx={{ padding: '100px', textAlign: 'center' }} colSpan={8}>
                                    No Task Found
                                </TableCell>
                            </TableRow>)
                        }
                        <TableRow className='tablePaginationRow'>
                            <TablePagination
                                count={items.length}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={DATATABLE_ROWS_OPTIONS}
                                page={page}
                                onPageChange={handleChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                            />
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default DataTable