import React from "react";
import { cleanup, fireEvent, render, waitForDomChange, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserSignupPage from "./UserSignuppage";

describe("UserSignupPage", () => {
  describe("Layout", () => {
    it("has header of Sign Up", () => {
      const { container } = render(<UserSignupPage />);
      const header = container.querySelector("h1");
      expect(header).toHaveTextContent("Sign Up");
    });

    it("has input for display name", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const displayNameInput = queryByPlaceholderText("Your display name");
      expect(displayNameInput).toBeInTheDocument();
    });
    it("has input for username", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const usernameInput = queryByPlaceholderText("Your username");
      expect(usernameInput).toBeInTheDocument();
    });
    it("has input for password", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput.type).toBe("password");
    });
    it("has input for password repeat", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordInput = queryByPlaceholderText("Repeat your password");
      expect(passwordInput).toBeInTheDocument();
    });
    it("has password type for password repeat input", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordInput = queryByPlaceholderText("Repeat your password");
      expect(passwordInput.type).toBe("password");
    });
    it("has submit button", () => {
      const { container } = render(<UserSignupPage />);
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });
  describe("Interactions", () => {
    const changeEvent = (content) => {
      return {
        target: {
          value: content,
        },
      };
    };
    const mockAsyncDelayed = () => {
      return jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          // make this promise slower to resolve
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
    };
    let button, displayNameInput, usernameInput, passwordInput, passwordRepeatInput;
    const setupForSubmit = (props) => {
      const rendered = render(<UserSignupPage {...props} />);

      const { container, queryByPlaceholderText } = rendered;

      displayNameInput = queryByPlaceholderText("Your display name");
      usernameInput = queryByPlaceholderText("Your username");
      passwordInput = queryByPlaceholderText("Your password");
      passwordRepeatInput = queryByPlaceholderText("Repeat your password");

      fireEvent.change(displayNameInput, changeEvent("my-display-name"));
      fireEvent.change(usernameInput, changeEvent("my-user-name"));
      fireEvent.change(passwordInput, changeEvent("my-password"));
      fireEvent.change(passwordRepeatInput, changeEvent("my-password"));

      button = container.querySelector("button");

      return rendered;
    };
    it("sets the displayName value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const displayNameInput = queryByPlaceholderText("Your display name");

      fireEvent.change(displayNameInput, changeEvent("my-display-name"));

      expect(displayNameInput).toHaveValue("my-display-name");
    });
    it("sets the username value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const usernameInput = queryByPlaceholderText("Your username");

      fireEvent.change(usernameInput, changeEvent("my-user-name"));

      expect(usernameInput).toHaveValue("my-user-name");
    });
    it("sets the password value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordInput = queryByPlaceholderText("Your password");

      fireEvent.change(passwordInput, changeEvent("my-password"));

      expect(passwordInput).toHaveValue("my-password");
    });
    it("sets the password repeat value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordRepeatInput = queryByPlaceholderText("Repeat your password");

      fireEvent.change(passwordRepeatInput, changeEvent("my-password"));

      expect(passwordRepeatInput).toHaveValue("my-password");
    });

    it("calls postSignup when fields are valid and actions are provided in props", () => {
      const actions = {
        postSignup: jest.fn().mockResolvedValueOnce({}),
      };
      setupForSubmit({ actions });
      fireEvent.click(button);
      expect(actions.postSignup).toHaveBeenCalledTimes(1);
    });

    it("does not throw exception when clicking the button when actions are not provided in props", () => {
      setupForSubmit();

      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it("calls post with user body when the fields are valid", () => {
      const actions = {
        postSignup: jest.fn().mockResolvedValueOnce({}),
      };
      setupForSubmit({ actions });
      fireEvent.click(button);
      const expectedUserObject = {
        username: "my-user-name",
        displayName: "my-display-name",
        password: "my-password",
      };
      expect(actions.postSignup).toHaveBeenCalledWith(expectedUserObject);
    });

    it("does not allow user to click the Sign up button when there is an ongoing call", () => {
      const actions = {
        postSignup: mockAsyncDelayed(),
      };
      setupForSubmit({ actions });
      // click multiple times
      fireEvent.click(button);
      fireEvent.click(button);
      // when click multiple times, we expect we only postSingup for 1 time
      expect(actions.postSignup).toHaveBeenCalledTimes(1);
    });
    it("displays spinner when there is an ongoing api call", () => {
      const actions = {
        postSignup: mockAsyncDelayed(),
      };
      const { queryByText } = setupForSubmit({ actions });

      fireEvent.click(button);

      const spinner = queryByText("Loading...");
      expect(spinner).toBeInTheDocument();
    });
    it("hide spinner after api calls finishes successfully", async () => {
      const actions = {
        postSignup: mockAsyncDelayed(),
      };
      const { queryByText } = setupForSubmit({ actions });

      fireEvent.click(button);

      await waitForDomChange();

      const spinner = queryByText("Loading...");
      expect(spinner).not.toBeInTheDocument();
    });
    it("hide spinner after api calls finishes with error", async () => {
      const actions = {
        postSignup: jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            // make this promise slower to resolve
            setTimeout(() => {
              reject({
                response: { data: {} },
              });
            }, 300);
          });
        }),
      };
      const { queryByText } = setupForSubmit({ actions });

      fireEvent.click(button);

      await waitForDomChange();

      const spinner = queryByText("Loading...");
      expect(spinner).not.toBeInTheDocument();
    });

    it("enables the signup button when password and repeat password have same value", () => {
      setupForSubmit();
      expect(button).not.toBeDisabled();
    });

    it("disables the signup button when password repeat does not match password", () => {
      setupForSubmit();
      fireEvent.change(passwordRepeatInput, changeEvent("does-not-match"));
      expect(button).toBeDisabled();
    });
    it("disables the signup button when password does not match password repeat", () => {
      setupForSubmit();
      fireEvent.change(passwordInput, changeEvent("does-not-match"));
      expect(button).toBeDisabled();
    });
    it("displays error style for password repeat input when password repeat mismatch", () => {
      const { queryByText } = setupForSubmit();
      fireEvent.change(passwordRepeatInput, changeEvent("does-not-match"));
      const mismatchWarning = queryByText("Does not match the password");
      expect(mismatchWarning).toBeInTheDocument();
    });
    it("displays error style for password input when password input mismatch", () => {
      const { queryByText } = setupForSubmit();
      fireEvent.change(passwordInput, changeEvent("does-not-match"));
      const mismatchWarning = queryByText("Does not match the password");
      expect(mismatchWarning).toBeInTheDocument();
    });

    it("hides the validation error when user changes the content of the displayName", async () => {
      const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                displayName: "Cannot be null",
              },
            },
          },
        }),
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);
      await waitForElement(() => queryByText("Cannot be null"));

      fireEvent.change(displayNameInput, changeEvent("name updated"));
      const errorMessage = queryByText("Cannot be null");
      expect(errorMessage).not.toBeInTheDocument();
    });

    it("hides the validation error when user changes the content of the username", async () => {
      const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                username: "Username cannot be null",
              },
            },
          },
        }),
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);
      await waitForElement(() => queryByText("Username cannot be null"));

      fireEvent.change(usernameInput, changeEvent("name updated"));
      const errorMessage = queryByText("Username cannot be null");
      expect(errorMessage).not.toBeInTheDocument();
    });

    it("hides the validation error when user changes the content of the password", async () => {
      const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                username: "Cannot be null",
              },
            },
          },
        }),
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);
      await waitForElement(() => queryByText("Cannot be null"));

      fireEvent.change(passwordInput, changeEvent("name updated"));
      const errorMessage = queryByText("Cannot be null");
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
});
