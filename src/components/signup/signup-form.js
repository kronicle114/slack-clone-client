import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

export const SignupForm = () => {
    // split state into different declarations
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("")
    const [confirmEmail, setConfirmEmail] = useState("")
    // eslint-disable-next-line no-unused-vars
    const [authToken, setAuthToken] = useState("")
    const [loggedIn, setLoggedIn] = useState(true)
    const [validUsername, SetValidUsername] = useState('')
    const [validPasswordLength, SetValidPasswordLength] = useState(false)
    const [validPasswordCharacters, SetValidPasswordCharacters] = useState(false)

    /* ====== LOGIN USER AFTER SUCCESSFUL REGISTRATION ====== */
    const logIn = data => {
        setUsername(username)
        setLoggedIn(loggedIn)
        localStorage.removeItem("logout")

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        return fetch(`${API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                username,
                password
            })
        })
            .then(res => {
                return res.json();
            })
            .then((auth) => {
                if (auth.hasOwnProperty("authToken")) {
                    localStorage.setItem("user", username);
                    localStorage.setItem("loggedIn", loggedIn);
                    localStorage.setItem("authToken", auth.authToken);
                    setAuthToken(auth)
                }
                return auth;
            })
            .catch(err => {
                const { code } = err;
                const message = code === 401 ? 'Incorrect username or password' : 'Unable to login, please try again';

                return Promise.reject(
                    new Error({
                        _error: message
                    })
                )
            });
    }

    /* ====== USERNAME VALIDATION ====== */
    const validateUsername = async (username) => {
        // send username to server on Change of `username` state
        // server should check if username exists 

        const res = await fetch(
            `${API_BASE_URL}/users/?search=${username}`
        );

        // Pull out the data from response
        const _username = await res.json();

        // if the username exists in the DB
        if (_username.length > 0 && validUsername !== '') {
            localStorage.setItem('validUsername', `Username "${_username[0].username}" taken. Pick another.`)
            SetValidUsername(false)
            return _username
        }

        localStorage.setItem('validUsername', 'Valid Username')
        SetValidUsername(true)
        return _username;
    }

    /* ====== PASSWORD VALIDATION ====== */
    const re = /(.*[A-Z].*)/; //positive look ahead for atleast 1 capital char
    const validateChar = (password) => {
        if (re.test(password)) {
            SetValidPasswordCharacters(true)
        } else {
            SetValidPasswordCharacters(false)
        }
    }

    const validatePasswordLength = (password) => {
        if (password.length && password.length >= 8 && password.length <= 72) {
            SetValidPasswordLength(true)
        } else {
            SetValidPasswordLength(false)
        }
    }

    /* ====== USEEFFECT ====== */
    useEffect(() => {
        validateChar(password);
        validatePasswordLength(password);
        validateUsername(username);
    }, [username, password])

    /* ====== HANDLE FORM SUBMIT ====== */
    const handleSubmit = e => {
        e.preventDefault();

        setUsername(username);
        setPassword(password);
        setConfirmPassword(confirmPassword);
        setEmail(email);
        setConfirmEmail(confirmEmail);

        return fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name,
                username,
                password,
                confirmPassword,
                email,
                confirmEmail
            })
        })
            .then(res => {
                localStorage.setItem("registered", true)
                return res.json();
            })
            .then(data => {
                logIn(data)
            })
            .catch(err => {
                if (err === 'TypeError: Failed to fetch') {
                    return Promise.reject(err)
                }
            })
    };

    /* ====== JSX USERNAME VALIDATION ====== */
    let usernameValidation;

    if (validUsername === '') {
        usernameValidation = <p></p>
    } else if (!validUsername) {
        usernameValidation = <p>{localStorage.validUsername}</p>
    }

    /* ====== JSX PASSWORD VALIDATION ====== */
    let passwordValidation;
    if (password === '') {
        passwordValidation = null
    } else if (validPasswordLength && validPasswordCharacters) {
        passwordValidation = (
            <div>
                <p className="valid-password">
                    <span><svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>8 characters minimum</span>
                </p>
                <p className="valid-password test1">
                    <span><svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>Atleast 1 capital letter</span>
                </p>
            </div>
        )
    } else if (validPasswordLength && !validPasswordCharacters) {
        passwordValidation = (
            <div>
                <p className="valid-password">
                    <span><svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>8 characters minimum</span>
                </p>
                <p className="invalid-password test3">
                    Atleast 1 Capital Letter
                </p>
            </div>
        )
    } else if (validPasswordLength) {
        passwordValidation = (
            <div>
                <p className="valid-password">
                    <span><svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>8 characters minimum</span>
                </p>
                <p className="invalid-password">
                    Atleast 1 capital letter
                </p>
            </div>
        )
    } else if (validPasswordCharacters) {
        passwordValidation = (
            <div>
                <p className="invalid-password">
                    8 characters minimum
                </p>
                <p className="valid-password test4">
                    <span><svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>Atleast 1 capital letter</span>
                </p>
            </div>
        )
    } else {
        passwordValidation = (
            <div>
                <p className="invalid-password">
                    8 characters minimum
                </p>
                <p className="invalid-password">
                    Atleast 1 capital letter
                </p>
            </div>
        )
    }

    /* ====== RENDER JSX ====== */
    return (
        <section className="registration">
            {
                localStorage.loggedIn ? (
                    <Redirect to="/dashboard" />
                ) : (
                    <article className="registration-form">
                        <form className="registration-form"
                            onSubmit={handleSubmit}
                        >
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="optional nickname"
                                type="text"
                                name="name"
                                aria-label="name"
                            />

                            {/* ====== USERNAME VALIDATION ====== */}
                            {usernameValidation}

                            <label htmlFor="register-username" />
                            <input
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="enter username"
                                type="text"
                                name="username"
                                id="register-username"
                                required
                                aria-label="username"
                            />

                            {/* ====== PASSWORD VALIDATION ====== */}
                            {passwordValidation}

                            <fieldset className="registration-form-group">
                                <input
                                    className="registration-password-input"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    id="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="enter password"
                                    required
                                    pattern="(?=.*[A-Z]).{8,}$"
                                    title="Must contain at least one uppercase letter and at least 8 or more characters"
                                    aria-label="password"
                                />

                            </fieldset>

                            <input
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="confirm password"
                                type="password"
                                name="passwordConfirm"
                                required
                                pattern={password}
                                title={`password: "${password}" & confirmPassword: "${confirmPassword}" must match`}
                                aria-label="confirm Password"
                            />
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="enter email"
                                type="email"
                                name="email"
                                pattern="^([\w\-\.]+)@((\[([0-9]{1,3}\.){3}[0-9]{1,3}\])|(([\w\-]+\.)+)([a-zA-Z]{2,4}))$"
                                required
                                aria-label="email"
                            />
                            <input
                                value={confirmEmail}
                                onChange={e => setConfirmEmail(e.target.value)}
                                placeholder="confirm email"
                                type="email"
                                name="emailConfirm"
                                pattern={email}
                                title={`email: "${email}" & confirmEmail: "${confirmEmail}" must match`}
                                required
                                aria-label="confirm email"
                            />
                            <button
                                waves="light "
                                type="submit"
                                aria-label="submit button registration form"
                                className="registration-submit"
                                disabled={!username || !password || !validUsername}
                            >
                                Submit
                            </button>
                            <Link
                                to="/"
                                className="registration-link"
                                aria-label="go back link to landing page"
                            >
                                Go Back
                            </Link>
                        </form>
                    </article>
                )}
        </section>
    );
}

export default SignupForm;