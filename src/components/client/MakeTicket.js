import React, { Component } from "react";
import axios from "axios";
import { withFormik } from "formik";
import categories from "./categories.js";
import formType from "./formType.js";
import * as Yup from "yup";
import Select from "react-select";
import jwtDecode from "jwt-decode";

import { disableEnterButton } from "../helper";
import makeAnimated from "react-select/lib/animated";
import "../../css/form.css";

// Validation Scheme with Yup //
const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    topics: Yup.array()
      .min(1, "Pick at least 1 category")
      .of(
        Yup.object().shape({
          label: Yup.string().required(),
          value: Yup.string().required()
        })
      ),
    title: Yup.string().required("Title Required!"),
    description: Yup.string().required("Description Required!"),
    formType: Yup.string().required("What is this feedback primarily for?")
  }),
  mapPropsToValues: props => ({
    createdBy: props.userEmail,
    topics: [],
    title: "",
    description: "",
    formType: "bug",
    history: props.history
  }),
  handleSubmit: (values, { setSubmitting }) => {
    const history = values.history;
    const payload = {
      ...values,
      topics: values.topics.map(t => t.value),
      statusToClient: "Pending Admin",
      statusToAdmin: "Pending Admin",
      dateOfCreation: new Date(),
      priority: Number.MAX_SAFE_INTEGER,
      notified: false,
      tasks: []
    };
    delete payload.history;

    // email content
    const title = values.title;
    const description = values.description;
    const client = values.createdBy;
    const email = "admin@conductor.com";
    const target = "admin";

    axios.post("http://localhost:4000/ticket/add", payload)
      .then(res => {
        console.log("Adding new ticket");
        console.log(res.data);
      })
      .catch(res => console.log(res));
    
    axios.post("/api/notify", {
      email,
      title,
      description,
      client,
      target
      });

    setTimeout(() => {
      setSubmitting(false);
      history.push("/dashboard");
    }, 1000);
  },
  displayName: "Ticket Form"
});

// Form //
const MyForm = props => {
  const {
    values,
    touched,
    dirty,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setFieldValue,
    setFieldTouched,
    isSubmitting
  } = props;
  return (
    <form
      id="make-ticket-form"
      onSubmit={handleSubmit}
      onKeyPress={disableEnterButton}
    >
      <h1 className="subtitle">Ticket Form</h1>
      <div className="radio-group">
        <label>Ticket Type</label>
        <div className="radio-container">
          {formType.map(option => (
            <React.Fragment key={option}>
              <div className="radio-item">
                <label htmlFor={option}>
                  {option}
                  <input
                    type="radio"
                    name="formType"
                    id={option}
                    value={option}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    checked={values.formType === option}
                  />
                </label>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <MySelect
        value={values.topics}
        onChange={setFieldValue}
        onBlur={setFieldTouched}
        error={errors.topics}
        touched={touched.topics}
      />
      <label htmlFor="name" style={{ display: "block" }}>
        Title
      </label>
      <input
        id="title"
        placeholder="Summary of the issue"
        type="text"
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <label htmlFor="description" style={{ display: "block" }}>
        Your Message
      </label>
      <textarea
        id="description"
        placeholder="Tell us more about the issue"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div>
        <button
          type="button"
          id="reset"
          className="form-button"
          onClick={handleReset}
          disabled={!dirty || isSubmitting}
        >
          Reset
        </button>
        <button
          type="submit"
          className="form-button"
          id="submit"
          disabled={isSubmitting}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

// React-select component modified to fit Formik
export class MySelect extends React.Component {
  handleChange = value => {
    // this is going to call setFieldValue and manually update values.topcis
    this.props.onChange("topics", value);
  };

  handleBlur = () => {
    // this is going to call setFieldTouched and manually update touched.topcis
    this.props.onBlur("topics", true);
  };

  render() {
    return (
      <div>
        <label htmlFor="topic">Category of issue</label>
        <Select
          id="category-select"
          options={categories}
          isMulti
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
          closeMenuOnSelect={false}
          components={makeAnimated()}
        />
        {!!this.props.error && this.props.touched && (
          <div style={{ color: "red", marginTop: ".5rem" }}>
            {this.props.error}
          </div>
        )}
      </div>
    );
  }
}

const CreateTicketForm = formikEnhancer(MyForm);

export default class TicketForm extends Component {
  constructor(props) {
    super(props);
    //start of TODO
    let idToken = jwtDecode(localStorage.getItem("id_token"));
    var email = idToken.email;
    //end of TODO

    // still working on retrieving user info
    this.state = {
      userEmail: email
    };
  }

  render() {
    return (
      <div>
        <CreateTicketForm
          userEmail={this.state.userEmail}
          history={this.props.history}
        />
      </div>
    );
  }
}
