import { Form, Formik } from "formik";
import React from "react";
import classes from "./ContactForm.module.css";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { useToasts } from "react-toast-notifications";
import axios from "../../../axios-iim";

const ContactForm = (props) => {
  const initialValues = {
    name: "",
    email_id: "",
    mobile_no: "",
    subject: "",
    message: "",
  };

  const { addToast } = useToasts();

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email_id: Yup.string().required("Required").email("Not a valid email."),
    mobile_no: Yup.string().matches(
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
      "Not a valid phone number."
    ),
    subject: Yup.string().required("Required"),
    message: Yup.string().required("Required"),
  });

  const onSubmit = (values, form) => {
    form.resetForm();
    axios
      .post(
        "/users/contact-us.php",
        JSON.stringify({
          name: values.name,
          email: values.email_id,
          mobile: values.mobile_no,
          subject: values.subject,
          message: values.message,
        })
      )
      .then((response) => {
        addToast("Thanks! Our team will get back to you soon!", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((err) => {
        addToast("Something went wrong.", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  return (
    <div className={classes.ContactForm}>
      <h1>Contact Now</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form className={classes.Form}>
            <div className={classes.MaterialUIWrapper}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                id="name"
                type="text"
                variant="outlined"
                className={classes.MaterialUIInput}
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </div>
            <div className={classes.MaterialUIWrapper}>
              <TextField
                fullWidth
                label="Email"
                name="email_id"
                id="email_id"
                type="email"
                variant="outlined"
                className={classes.MaterialUIInput}
                value={formik.values.email_id}
                onChange={formik.handleChange}
                error={
                  formik.touched.email_id && Boolean(formik.errors.email_id)
                }
                helperText={formik.touched.email_id && formik.errors.email_id}
              />
            </div>
            <div className={classes.MaterialUIWrapper}>
              <TextField
                fullWidth
                label="Mobile"
                name="mobile_no"
                id="mobile_no"
                type="text"
                variant="outlined"
                className={classes.MaterialUIInput}
                value={formik.values.mobile_no}
                onChange={formik.handleChange}
                error={
                  formik.touched.mobile_no && Boolean(formik.errors.mobile_no)
                }
                helperText={formik.touched.mobile_no && formik.errors.mobile_no}
              />
            </div>
            <div className={classes.MaterialUIWrapper}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                id="subject"
                type="text"
                variant="outlined"
                className={classes.MaterialUIInput}
                value={formik.values.subject}
                onChange={formik.handleChange}
                error={formik.touched.subject && Boolean(formik.errors.subject)}
                helperText={formik.touched.subject && formik.errors.subject}
              />
            </div>
            <div className={classes.MaterialUIWrapper}>
              <TextField
                fullWidth
                label="Message"
                name="message"
                id="message"
                multiline
                rows={5}
                variant="outlined"
                className={classes.MaterialUIInput}
                value={formik.values.message}
                onChange={formik.handleChange}
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={formik.touched.message && formik.errors.message}
              />
            </div>
            <Button type="submit" fullWidth variant="contained" color="primary">
              <FontAwesomeIcon icon={faRocket} />
              <p className={classes.BtnMessage}>Send Message</p>
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default ContactForm;
