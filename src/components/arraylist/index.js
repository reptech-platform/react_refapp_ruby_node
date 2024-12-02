import * as React from "react";
import { TextValidator } from 'react-material-ui-form-validator';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { IconButton, Typography, Table, TableBody, TableRow, TableCell, Tooltip } from '@mui/material';
import Helper from "shared/helper";

const Component = (props) => {

    const { mode, type, id, name, editable, placeHolder, value, OnInputChange, style, sx, validators, validationMessages } = props;

    const [values, setValues] = React.useState(['']);

    const handleChange = (e, index) => {
        const _value = e.target.value;
        let newValues = [...values];
        newValues[index] = _value;
        setValues(newValues);
        OnUpdateValue();
    }

    const OnAddMoreClicked = (e) => {
        if (e) e.preventDefault();
        setValues([...values, '']);
        OnUpdateValue();
    }

    const OnDeleteClicked = (e, index) => {
        if (e) e.preventDefault();
        const newItems = values.filter((_, i) => i !== index);
        setValues(newItems);
        OnUpdateValue();
    }

    const OnUpdateValue = () => {
        if (OnInputChange) OnInputChange({ name, values });
    }

    const GetPaddingBottom = (index) => {
        if (values.length === 0) return 0;
        if (values.length > 0 && values.length - 1 === index) return 0;
        return 1;
    }

    if (mode && mode === 'view') {
        return <Typography nowrap="true">{value}</Typography>
    }

    React.useEffect(() => {
        // This helper dependecy has to be removed later
        if (Helper.IsArrayNull(value)) {
            setValues(['']);
        } else {
            setValues(value);
        }
    }, [value])

    return (
        <>
            <Table sx={{ display: 'table', width: '100%', p: 0, m: 0, border: 0, ...sx }}>
                <TableBody>
                    {values && values.length > 0 && values.map((x, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ p: 0, m: 0, pb: GetPaddingBottom(index), border: 0, ...sx }}>
                                <TextValidator
                                    onChange={(e) => handleChange(e, index)}
                                    autoComplete="off"
                                    id={id}
                                    size="small"
                                    type={type}
                                    name={name}
                                    value={x || ""}
                                    validators={validators}
                                    errorMessages={validationMessages}
                                    InputLabelProps={{ shrink: false }}
                                    placeholder={placeHolder}
                                    disabled={!editable ? true : false}
                                    style={{
                                        minWidth: 250,
                                        ...style
                                    }}
                                    sx={{
                                        "& label": {
                                            display: "none"
                                        },
                                        ...sx
                                    }}
                                />
                            </TableCell>
                            <TableCell sx={{ padding: "0px 0px 0px 5px", m: 0, pb: GetPaddingBottom(index), border: 0, whiteSpace: "nowrap" }}>

                                {values.length - 1 === index && (
                                    <Tooltip title="Add more">
                                        <IconButton
                                            variant="contained"
                                            size="small"
                                            edge="start"
                                            aria-label="add more"
                                            onClick={(e) => OnAddMoreClicked(e)}>
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}

                                {values.length > 1 && (
                                    <Tooltip title="Delete">
                                        <IconButton
                                            variant="contained"
                                            size="small"
                                            edge="start"
                                            aria-label="delete one"
                                            onClick={(e) => OnDeleteClicked(e, index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </TableCell>
                        </TableRow>

                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default Component;
