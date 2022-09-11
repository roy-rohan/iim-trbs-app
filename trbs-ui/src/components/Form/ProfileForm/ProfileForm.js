import Button from "@material-ui/core/Button";
import clsx from "clsx";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import axios from "../../../axios-iim";
import * as actions from "../../../store/actions/auth";
import classes from "./ProfileForm.module.css";

import {
    FormControl,
    FormHelperText,
    Grid, InputAdornment,
    InputLabel,
    makeStyles,
    OutlinedInput,
    Select
} from "@material-ui/core";
import {
    AccountCircle,
    Call,
    Drafts,
    Home,
    School
} from "@material-ui/icons";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";

const useStyles = makeStyles((theme) => ({
    input: {
        margin: theme.spacing(2),
    },
    fieldError: {
        color: "red",
    },
}));

const ProfileForm = (props) => {
    const theme = useStyles();
    let { addToast } = useToasts();

    const [touchMap, setTouchMap] = React.useState({
        first_name: false,
        last_name: false,
        email_id: false,
        mobile_no: false,
        address: false,
        year: false,
    });

    const initialValues = {
        first_name: "",
        last_name: "",
        email_id: "",
        mobile_no: "",
        college_id: 0,
        college_name: null,
        year: 0,
        address: "",
        state_id: 0,
        profile_image_id: -1,
        role: "user",
        login_id: "",
        is_active: 1,
    };

    const validationSchema = Yup.object({
        first_name: Yup.string().required("Required"),
        email_id: Yup.string().required("Required").email("Not a valid email."),
        mobile_no: Yup.string()
            .required("Required")
            .matches(/^[6-9][0-9]{9}$/, "Not a valid phone number."),
        year: Yup.number().min(1, "Invalid Year"),
    });

    let submitContent = useRef();

    const onSubmit = (values, form) => {
        values.login_id = values.email_id;
        form.setSubmitting(true);
        submitContent.current.textContent = "submitting...";
        props.onProfileUpdate(props.token, values, () => onSuccessfulUpdate(form));
    };

    const onSuccessfulUpdate = (form) => {
        form.setSubmitting(false);
        submitContent.current.textContent = "Submit";
    }

    const onSubmitClick = (formik) => {
        if (JSON.stringify(formik.errors) === "{}") {
            return;
        }
        let newTouchMap = {};
        for (let key in formik.values) {
            newTouchMap[key] = true;
        }
        setTouchMap({ ...newTouchMap });
    };

    const [statesDropdown, setStatesDropdown] = useState([
        { key: "Select an option", value: null },
    ]);

    const [collegesDropdown, setCollegesDropdown] = useState([
        { key: "Select an option", value: null },
        { key: "Other", value: "-99" },
    ]);

    useEffect(() => {
        window.scrollTo(0, 0);
        axios
            .post(
                "/colleges/read.php",
                JSON.stringify({
                    filters: [],
                    filter_op: "",
                    sort: [],
                })
            )
            .then((res) => {
                const fetchedColleges = [];
                for (let key in res.data) {
                    fetchedColleges.push({
                        value: res.data[key].college_id,
                        key: res.data[key].name,
                    });
                }
                setCollegesDropdown((prevState) => [...prevState, ...fetchedColleges]);
            });

        axios
            .post(
                "/states/read.php",
                JSON.stringify({
                    filters: [],
                    filter_op: "",
                    sort: [],
                })
            )
            .then((res) => {
                const fetchedStates = [];
                for (let key in res.data) {
                    fetchedStates.push({
                        value: res.data[key].state_id,
                        key: res.data[key].name,
                    });
                }
                setStatesDropdown((prevState) => [...prevState, ...fetchedStates]);
            });
    }, []);

    return (
        <div className={classes.ProfileForm}>
            <h1 className={classes.Form}>Edit Profile</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {(formik) => (
                    <Form className={classes.Form}>
                        <Grid container spacing={2}>
                            <Grid item lg={6} xs={12}>
                                <div className={classes.MaterialUIWrapper}>
                                    <FormControl
                                        fullWidth
                                        className={clsx(theme.input)}
                                        variant="outlined"
                                    >
                                        <InputLabel htmlFor="outlined-adornment-first_name">
                                            First Name
                                        </InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-first_name"
                                            name="first_name"
                                            type="text"
                                            value={formik.values.first_name}
                                            onChange={formik.handleChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <AccountCircle></AccountCircle>
                                                </InputAdornment>
                                            }
                                            labelWidth={70}
                                            error={
                                                touchMap.first_name && Boolean(formik.errors.first_name)
                                            }
                                            onTouchEnd={() =>
                                                setTouchMap({ ...touchMap, first_name: true })
                                            }
                                        />
                                        {touchMap.first_name && formik.errors.first_name ? (
                                            <FormHelperText className={theme.fieldError}>
                                                {formik.errors.first_name}
                                            </FormHelperText>
                                        ) : null}
                                    </FormControl>
                                </div>
                            </Grid>
                            <Grid item lg={6} xs={12}>
                                <div className={classes.MaterialUIWrapper}>
                                    <FormControl
                                        fullWidth
                                        className={clsx(theme.input)}
                                        variant="outlined"
                                    >
                                        <InputLabel htmlFor="outlined-adornment-last_name">
                                            Last Name
                                        </InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-last_name"
                                            name="last_name"
                                            type="text"
                                            value={formik.values.last_name}
                                            onChange={formik.handleChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <AccountCircle></AccountCircle>
                                                </InputAdornment>
                                            }
                                            labelWidth={70}
                                            error={
                                                touchMap.last_name && Boolean(formik.errors.last_name)
                                            }
                                            onTouchEnd={() =>
                                                setTouchMap({ ...touchMap, last_name: true })
                                            }
                                        />
                                        {touchMap.last_name && formik.errors.last_name ? (
                                            <FormHelperText className={theme.fieldError}>
                                                {formik.errors.last_name}
                                            </FormHelperText>
                                        ) : null}
                                    </FormControl>
                                </div>
                            </Grid>
                        </Grid>
                        <div className={classes.MaterialUIWrapper}>
                            <FormControl
                                fullWidth
                                className={clsx(theme.input)}
                                variant="outlined"
                            >
                                <InputLabel htmlFor="outlined-adornment-email_id">
                                    Email Id
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-email_id"
                                    name="email_id"
                                    type="email"
                                    value={formik.values.email_id}
                                    disabled
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <Drafts></Drafts>
                                        </InputAdornment>
                                    }
                                    labelWidth={70}
                                    error={touchMap.email_id && Boolean(formik.errors.email_id)}
                                    onTouchEnd={() =>
                                        setTouchMap({ ...touchMap, email_id: true })
                                    }
                                />
                                {touchMap.email_id && formik.errors.email_id ? (
                                    <FormHelperText className={theme.fieldError}>
                                        {formik.errors.email_id}
                                    </FormHelperText>
                                ) : null}
                            </FormControl>
                        </div>
                        <div className={classes.MaterialUIWrapper}>
                            <FormControl
                                fullWidth
                                className={clsx(theme.input)}
                                variant="outlined"
                            >
                                <InputLabel htmlFor="outlined-adornment-mobile_no">
                                    Mobile
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-mobile_no"
                                    name="mobile_no"
                                    type="text"
                                    value={formik.values.mobile_no}
                                    onChange={formik.handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <Call></Call>
                                        </InputAdornment>
                                    }
                                    labelWidth={70}
                                    error={touchMap.mobile_no && Boolean(formik.errors.mobile_no)}
                                    onTouchEnd={() =>
                                        setTouchMap({ ...touchMap, mobile_no: true })
                                    }
                                />
                                {touchMap.mobile_no && formik.errors.mobile_no ? (
                                    <FormHelperText className={theme.fieldError}>
                                        {formik.errors.mobile_no}
                                    </FormHelperText>
                                ) : null}
                            </FormControl>
                        </div>
                        <div className={classes.MaterialUIWrapper}>
                            <FormControl
                                fullWidth
                                className={clsx(theme.input)}
                                variant="outlined"
                            >
                                <InputLabel htmlFor="outlined-adornment-address">
                                    Address
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    name="address"
                                    type="text"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <Home></Home>
                                        </InputAdornment>
                                    }
                                    labelWidth={70}
                                    error={touchMap.address && Boolean(formik.errors.address)}
                                    onTouchEnd={() => setTouchMap({ ...touchMap, address: true })}
                                />
                                {touchMap.address && formik.errors.address ? (
                                    <FormHelperText className={theme.fieldError}>
                                        {formik.errors.address}
                                    </FormHelperText>
                                ) : null}
                            </FormControl>
                        </div>
                        <div className={classes.MaterialUIWrapper}>
                            <FormControl
                                variant="outlined"
                                className={clsx(theme.input)}
                                fullWidth
                            >
                                <InputLabel htmlFor="outlined-age-native-state_id">
                                    State
                                </InputLabel>
                                <Select
                                    id="outlined-age-native-state_id"
                                    native
                                    value={formik.values.state_id}
                                    name="state_id"
                                    onChange={formik.handleChange}
                                    label="State"
                                >
                                    {statesDropdown.map((option, i) => {
                                        return (
                                            <option key={i} value={option.value}>
                                                {option.key}
                                            </option>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </div>
                        <div className={classes.MaterialUIWrapper}>
                            <FormControl
                                variant="outlined"
                                className={clsx(theme.input)}
                                fullWidth
                            >
                                <InputLabel htmlFor="outlined-age-native-college_id">
                                    College
                                </InputLabel>
                                <Select
                                    id="outlined-age-native-college_id"
                                    native
                                    value={formik.values.college_id}
                                    name="college_id"
                                    onChange={formik.handleChange}
                                    label="college"
                                >
                                    {collegesDropdown.map((option, i) => {
                                        return (
                                            <option key={i} value={option.value}>
                                                {option.key}
                                            </option>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </div>
                        {formik.values.college_id === "-99" ? (
                            <div className={classes.MaterialUIWrapper}>
                                <FormControl
                                    fullWidth
                                    className={clsx(theme.input)}
                                    variant="outlined"
                                >
                                    <InputLabel htmlFor="outlined-adornment-college_name">
                                        Your College Name
                                    </InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-college_name"
                                        name="college_name"
                                        type="text"
                                        value={formik.values.college_name}
                                        onChange={formik.handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <School></School>
                                            </InputAdornment>
                                        }
                                        labelWidth={70}
                                    />
                                </FormControl>
                            </div>
                        ) : null}
                        <div className={classes.MaterialUIWrapper}>
                            <FormControl
                                fullWidth
                                className={clsx(theme.input)}
                                variant="outlined"
                            >
                                <InputLabel htmlFor="outlined-adornment-year">Year</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-year"
                                    name="year"
                                    type="number"
                                    value={formik.values.year}
                                    onChange={formik.handleChange}
                                    labelWidth={70}
                                    error={touchMap.year && Boolean(formik.errors.year)}
                                    onTouchEnd={() => setTouchMap({ ...touchMap, year: true })}
                                />
                                {touchMap.year && formik.errors.year ? (
                                    <FormHelperText className={theme.fieldError}>
                                        {formik.errors.year}
                                    </FormHelperText>
                                ) : null}
                            </FormControl>
                        </div>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            className={clsx(theme.input)}
                            onClick={() => onSubmitClick(formik)}
                            ref={submitContent}
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onProfileUpdate: (token, user, cb) => dispatch(actions.updateUser(token, user, cb)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileForm);
