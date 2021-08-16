import React, { useState } from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { register } from "../_redux/authCrud";

const initialValues = {
  fullname: "",
  birthdate: "",
  phone: "",
  password: "",
  changepassword: "",
  refferalcode: "",
  // acceptTerms: false,
};

function Registration(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const RegistrationSchema = Yup.object().shape({
    fullname: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    birthdate: Yup.date()
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    phone: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, "Minimum 10 symbols")
      .max(10, "Maximum 10 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    changepassword: Yup.string()
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      )
      .when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Password and Confirm Password didn't match"
        ),
      }),
    // acceptTerms: Yup.bool().required(
    //   "You must accept the terms and conditions"
    // ),
    refferalcode: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setSubmitting(true);
      enableLoading();
      register(values.birthdate, values.fullname, values.phone, values.password)
        .then(({ data: { accessToken } }) => {
          props.register(accessToken);
          disableLoading();
          setSubmitting(false);
        })
        .catch(() => {
          setSubmitting(false);
          setStatus(
            intl.formatMessage({
              id: "AUTH.VALIDATION.INVALID_LOGIN",
            })
          );
          disableLoading();
        });
    },
  });

  return (
    <div className="login-form login-signin" style={{ display: "block" }}>
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.REGISTER.TITLE" />
        </h3>
        <p className="text-muted font-weight-bold">
          Vui lòng nhập tên và mật khẩu
        </p>
      </div>

      <form
        id="kt_login_signin_form"
        className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
        onSubmit={formik.handleSubmit}
      >
        {/* begin: Alert */}
        {formik.status && (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}
        {/* end: Alert */}

        {/* begin: Fullname */}
        <div className="form-group fv-plugins-icon-container">
          <label className="text-dark">Họ và tên *</label>
          <input
            placeholder=""
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "fullname"
            )}`}
            name="fullname"
            {...formik.getFieldProps("fullname")}
          />
          {formik.touched.fullname && formik.errors.fullname ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.fullname}</div>
            </div>
          ) : null}
        </div>
        {/* end: Fullname */}

        <div className="form-group fv-plugins-icon-container d-flex justify-content-between">
          {/* begin: birthdate */}
          <div className="mr-2">
            <label className="text-dark">Ngày sinh *</label>
            <input
              placeholder=""
              type="text"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "birthdate"
              )}`}
              name="birthdate"
              {...formik.getFieldProps("birthdate")}
            />
            {formik.touched.birthdate && formik.errors.birthdate ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.birthdate}</div>
              </div>
            ) : null}
          </div>
          {/* end: birthdate */}

          {/* begin: phone */}
          <div>
            <label className="text-dark">Điện thoại *</label>
            <input
              placeholder=""
              type="text"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "phone"
              )}`}
              name="phone"
              {...formik.getFieldProps("phone")}
            />
            {formik.touched.phone && formik.errors.phone ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.phone}</div>
              </div>
            ) : null}
          </div>
          {/* end: phone */}
        </div>

        <div className="form-group fv-plugins-icon-container d-flex justify-content-between">
          {/* begin: Password */}
          <div className="mr-2">
            <label className="text-dark">Mật khẩu</label>
            <input
              placeholder=""
              type="password"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "password"
              )}`}
              name="password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.password}</div>
              </div>
            ) : null}
          </div>
          {/* end: Password */}

          {/* begin: Confirm Password */}
          <div>
            <label className="text-dark">Xác nhận mật khẩu</label>
            <input
              placeholder=""
              type="password"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "changepassword"
              )}`}
              name="changepassword"
              {...formik.getFieldProps("changepassword")}
            />
            {formik.touched.changepassword && formik.errors.changepassword ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formik.errors.changepassword}
                </div>
              </div>
            ) : null}
          </div>
          {/* end: Confirm Password */}
        </div>

        {/* begin: Referral code */}
        <div className="form-group fv-plugins-icon-container">
          <label className="text-dark">Mã giới thiệu</label>
          <input
            placeholder=""
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "refferalcode"
            )}`}
            name="refferalcode"
            {...formik.getFieldProps("refferalcode")}
          />
          {formik.touched.refferalcode && formik.errors.refferalcode ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.refferalcode}
              </div>
            </div>
          ) : null}
        </div>
        {/* end: Referral code */}

        {/* begin: Terms and Conditions */}
        {/* <div className="form-group">
          <label className="checkbox">
            <input
              type="checkbox"
              name="acceptTerms"
              className="m-1"
              {...formik.getFieldProps("acceptTerms")}
            />
            <Link
              to="/terms"
              target="_blank"
              className="mr-1"
              rel="noopener noreferrer"
            >
              I agree the Terms & Conditions
            </Link> 
            <span />
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.acceptTerms}</div>
            </div>
          ) : null}
        </div> */}
        {/* end: Terms and Conditions */}
        <div className="form-group d-flex flex-wrap flex-row-reverse">
          <button
            type="submit"
            disabled={
              formik.isSubmitting ||
              !formik.isValid 
              // !formik.values.acceptTerms
            }
            className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
          >
            <span>Đăng ký</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>

          {/* <Link to="/auth/login">
            <button
              type="button"
              className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
            >
              Cancel
            </button>
          </Link> */}
        </div>
      </form>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Registration));
