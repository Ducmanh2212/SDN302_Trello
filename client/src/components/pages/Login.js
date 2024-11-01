import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../actions/auth";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Copyright from "../other/Copyright";
import useStyles from "../../utils/formStyles";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const classes = useStyles();
  const [captchaValue, setCaptchaValue] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const { email, password } = formData;

  useEffect(() => {
    document.title = "TrelloClone | Sign In";
  }, []);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      alert("Please complete the CAPTCHA");
      return;
    }

    // Optional: Add a backend request for CAPTCHA verification before login
    try {
      const response = await fetch("/api/verifyCaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captcha: captchaValue }),
      });

      const result = await response.json();
      if (result.success) {
        dispatch(login(email, password));
      } else {
        alert("Verification failed");
      }
    } catch (error) {
      console.error("Error verifying CAPTCHA:", error);
      alert("Error verifying CAPTCHA. Please try again.");
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          TrelloClone
        </Typography>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={onChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={onChange}
          />
          <ReCAPTCHA
            sitekey="6LeBrXIqAAAAALnRyMa7nT-mLcSf9AaAGi_uJeka"
            onChange={handleCaptchaChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/register" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Login;
