// client/src/components/auth/Login.js
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";
import { connect } from "react-redux";
import { login, googleLogin } from "../../actions/auth";
import { setAlert } from "../../actions/alert";

const Login = ({ login, googleLogin, setAlert }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [captchaValue, setCaptchaValue] = useState(null);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      setAlert("Please complete the captcha", "danger");
      return;
    }
    login(email, password, captchaValue);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
    } catch (err) {
      setAlert("Google login failed", "danger");
    }
  };

  const handleGoogleError = () => {
    setAlert("Google login failed", "danger");
  };

  return (
    <div className="login-container">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
          />
        </div>
        <div className="form-group">
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            onChange={(value) => setCaptchaValue(value)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <div className="google-login-container">
        <p className="lead">Or sign in with Google</p>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
        />
      </div>
    </div>
  );
};

export default connect(null, { login, googleLogin, setAlert })(Login);
