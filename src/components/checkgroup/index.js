import * as React from "react";
import { Checkbox, Paper, Stack, Grid, Box, Typography } from '@mui/material';
import { ValidatorComponent } from 'react-material-ui-form-validator';

class CheckBoxValidator extends ValidatorComponent {

    renderValidatorComponent() {
        const { mode, label, errorMessages, validators, requiredError, validatorListener, ...rest } = this.props;

        return (
            <>
                <Box sx={{ width: '100%', m: 0, p: 0 }}>
                    <Box sx={{
                        display: "flex", alignItems: "center", flexDirection: "row", columnGap: 1,
                        "& span": { padding: 0, margin: 0 }
                    }}>
                        <Checkbox
                            {...rest}
                            ref={(r) => { this.input = r; }}
                        />
                        <Typography nowrap="true" sx={{ textAlign: "left" }}
                            variant="labelheader">{label}</Typography>
                    </Box>
                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", flexDirection: "row" }}>
                        {this.errorText()}
                    </Box>
                </Box>
            </>
        );
    }

    errorText() {
        const { isValid } = this.state;

        if (isValid) {
            return null;
        }

        return (
            <div style={{ color: "#d32f2f" }}>
                {this.getErrorMessage()}
            </div>
        );
    }
}

const Component = (props) => {

    const { mode, id, name, value, label, editable, OnInputChange, validationMessages } = props;
    const [inputValue, setInputValue] = React.useState(value);

    let disabled = mode && mode === 'view' ? true : undefined;
    if (!disabled && !editable) disabled = true;

    const options = [{ id: 0, name: "Feature1" }, { id: 1, name: "Feature2" }, { id: 2, name: "Feature3" }, { id: 3, name: "Feature4" },
    { id: 4, name: "Feature5" }, { id: 5, name: "Feature6" }, { id: 6, name: "Feature7" }, { id: 7, name: "Feature8" }, { id: 8, name: "Feature8" }];

    const OnCheckChanged = (e) => {
        const { name, checked } = e.target;
        const value = checked;
        setInputValue(value);
        if (OnInputChange) OnInputChange({ name, value });
    }

    React.useEffect(() => {
        setInputValue(value);
    }, [value]);

    return (
        <>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ maxWidth: 400, m: "0px !important", gap: 1 }}>
                {options && options.length > 0 && options.map((x, index) => (
                    <Grid key={index} size={{ xs: 2, sm: 2, md: 2 }}>
                        <CheckBoxValidator
                            key={index}
                            id={`${id}_${x.id}`}
                            name={`${name}_${x.id}`}
                            size="medium"
                            onChange={(e) => OnCheckChanged(e)}
                            value={inputValue || "false"}
                            checked={inputValue || false}
                            validators={['isTruthy']}
                            errorMessages={validationMessages}
                            label={x.name}
                            disabled={disabled}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default Component;
