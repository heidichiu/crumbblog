import React, { Component } from "react";

class UserSignupPage extends Component {
  state = {
    displayName: "",
    username: "",
    password: "",
    passwordRepeat: "",
    pendingApiCall: false,
  };

  onChangeDisplayName = (event) => {
    const value = event.target.value;
    this.setState({ displayName: value });
  };

  onChangeUsername = (event) => {
    const value = event.target.value;
    this.setState({ username: value });
  };
  onChangePassword = (event) => {
    const value = event.target.value;
    this.setState({ password: value });
  };
  onChangePasswordRepeat = (event) => {
    const value = event.target.value;
    this.setState({ passwordRepeat: value });
  };

  onClickSignup = () => {
    const user = {
      username: this.state.username,
      displayName: this.state.displayName,
      password: this.state.password,
    };
    this.setState({ pendingApiCall: true });
    this.props.actions
      .postSignup(user)
      .then((response) => {
        this.setState({ pendingApiCall: false });
      })
      .catch((error) => {
        this.setState({ pendingApiCall: false });
      });
  };

  render() {
    return (
      <div className="container">
        <h1 className="text-center">Sign Up</h1>
        <div className="col-12 mb-3">
          <label>Display Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Your display name"
            value={this.state.displayName}
            onChange={this.onChangeDisplayName}
          />
        </div>
        <div className="col-12 mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Your username"
            value={this.state.username}
            onChange={this.onChangeUsername}
          />
        </div>
        <div className="col-12 mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Your password"
            value={this.state.password}
            onChange={this.onChangePassword}
          />
        </div>
        <div className="col-12 mb-3">
          <label>Repeat your password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Repeat your password"
            value={this.state.passwordRepeat}
            onChange={this.onChangePasswordRepeat}
          />
        </div>
        <div className="text-center">
          <button className="btn btn-primary" onClick={this.onClickSignup} disabled={this.state.pendingApiCall}>
            {this.state.pendingApiCall && (
              <div className="spinner-border spinner-border-sm mr-2" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
            Sign Up
          </button>
        </div>
      </div>
    );
  }
}

UserSignupPage.defaultProps = {
  actions: {
    postSignup: () =>
      new Promise((resolve, reject) => {
        resolve({});
      }),
  },
};

export default UserSignupPage;
