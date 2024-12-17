import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, IconButton, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Container from "screens/container";
import { DataTable } from '../childs';
import * as Api from "shared/services2";

import { SearchInput, CustomDialog } from "components";
import Helper from "shared/helper";
import { Add as AddBoxIcon } from '@mui/icons-material';

const columns = [
    { headerName: "Trip Name", field: "name", sortField: "name", flex: 1 },
    { headerName: "Description", field: "description", sortField: "description", flex: 1 },
    { headerName: "Start Date", field: "startAt", sortField: "startAt", flex: 1 },
    { headerName: "Start Time", field: "startTime", sortField: "startTime", flex: 1 },
    { headerName: "End Date", field: "endsAt", sortField: "endsAt", flex: 1 },
    { headerName: "End Time", field: "endTime", sortField: "endTime", flex: 1 },
    { headerName: "Budget", field: "budget", sortField: "budget", flex: 1 },
    { headerName: "Cost", field: "cost", sortField: "cost", flex: 1 },
];

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [sortBy, setSortBy] = useState(null);
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [deletedId, setDeletedId] = useState(0);

    const NavigateTo = useNavigate();

    const FetchResults = async () => {
        let query = null;
        setRows([]);
        setRowsCount(0);
        setDeletedId(0);
        setShowConfirm(false);

        global.Busy(true);

        if (!Helper.IsNullValue(searchStr)) {
            let _filter = [];
            ['firstName', 'middleName', 'lastName'].forEach(x => {
                _filter.push({ name: x, value: searchStr, condition: "like" });
            });

            if (_filter.length > 0) {
                query = { ...query, filter: _filter };
            }
        }

        if (!Helper.IsJSONEmpty(sortBy)) {
            query = { ...query, sort: [{ name: sortBy.field, order: sortBy.sort }] };
        }

        query = { ...query, pagination: { size: pageInfo.pageSize, page: pageInfo.page } };

        let _rows = [];
        await Api.GetSearch('trips', query)
            .then(async (res) => {
                if (res.status) {
                    let data = res.values || { count: 0, data: [] };
                    setRowsCount(parseInt(data.count));
                    _rows = data.data;
                    if (_rows.length > 0) {
                        _rows.forEach(x => {
                            x.id = Helper.GetGUID();
                        });
                    }
                } else {
                    console.log(res.statusText);
                }
            });

        setRows(_rows);
        global.Busy(false);
        return _rows;
    }

    const OnViewChanged = (e) => {
        let _route;
        if (e === 'DETAILS') _route = `/products`;
        if (e === 'TILES') _route = `/producttiles`;
        if (e === 'CONTENT') _route = `/productcontent`;
        if (e === 'LIST') _route = `/productlist`;
        if (_route) NavigateTo(_route);
    }

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const OnSortClicked = (e) => { setSortBy(e); }

    const OnPageClicked = (e) => {
        if (e) {
            setPageInfo(e);
        } else {
            setPageInfo({ page: 0, pageSize: 5 });
        }
    }

    const OnDeleteClicked = (e) => { setDeletedId(e); }

    const OnCloseClicked = async (e) => {
        /* if (e) {
            const rslt = await Api.SetProduct({ Product_id: deletedId, Deleted: true });
            if (rslt.status) {
                setInitialize(true);
                global.AlertPopup("success", "Record is deleted successful.!");
            } else {
                const msg = rslt.statusText || defaultError;
                global.AlertPopup("error", msg);
            }
        } else {
            setDeletedId(0);
            setShowConfirm(false);
        } */
    }

    const OnActionClicked = (id, type) => {
        let _route;
        if (type === 'edit') _route = `/products/edit/${id}`;
        if (type === 'view') _route = `/products/view/${id}`;
        if (type === 'delete') setDeletedId(id);;
        if (_route) NavigateTo(_route);
    }

    if (initialize) {
        setInitialize(false);
        FetchResults();
    }

    useEffect(() => { setInitialize(true); }, [sortBy, pageInfo, searchStr]);

    useEffect(() => { setInitialize(true); }, []);

    useEffect(() => { if (deletedId > 0) setShowConfirm(true); }, [deletedId]);

    return (

        <>
            <Container {...props}>
                <Box style={{ width: '100%', paddingBottom: 5 }}>
                    <Typography noWrap variant="subheader" component="div">
                        {title}
                    </Typography>
                    <Stack direction="row">
                        <Grid container sx={{ justifyContent: 'flex-end' }}>
                            <SearchInput searchStr={searchStr} onSearchChanged={OnSearchChanged} />
                            <IconButton
                                size="medium"
                                edge="start"
                                color="inherit"
                                aria-label="Add"
                                sx={{
                                    marginLeft: "2px",
                                    borderRadius: "4px",
                                    border: theme.borderBottom
                                }}
                                onClick={() => NavigateTo("/trips/create")}
                            >
                                <AddBoxIcon />
                            </IconButton>
                        </Grid>
                    </Stack>
                </Box>
                <Box style={{ width: '100%' }}>
                    <DataTable keyId={'Product_id'} columns={columns} rowsCount={rowsCount} rows={rows} sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                        onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} />
                </Box>
                <CustomDialog open={showConfirm} action={'delete'} title={"Confirmation"} onCloseClicked={OnCloseClicked}>
                    <Typography gutterBottom>
                        Are you sure? You want to delete?
                    </Typography>
                </CustomDialog>
            </Container>
        </>

    );

};

export default Component;