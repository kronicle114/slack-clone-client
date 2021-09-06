import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

export const SignupForm = () => {
    // split state into different declarations
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("")
    // eslint-disable-next-line no-unused-vars
    const [authError, setAuthError] = useState(false)
    const [authToken, setAuthToken] = useState("")
    const [loggedIn, setLoggedIn] = useState(true)
    const [validUsername, SetValidUsername] = useState('')

    /* ====== LOGIN USER AFTER SUCCESSFUL signup ====== */
    const logIn = data => {
        // set Login and Logout on local storage
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

    /* ====== USEEFFECT ====== */
    useEffect(() => {
        validateUsername(username);
    }, [username])

    /* ====== HANDLE FORM SUBMIT ====== */
    const handleSubmit = e => {
        e.preventDefault();

        setUsername(username);
        setPassword(password);
        setEmail(email);

        return fetch(`${API_BASE_URL}/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                email
            })
        })
            .then(res => {
                localStorage.setItem("registered", true)
                return res.json();
            })
            .then(data => 
                logIn(data)
            )
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

    /* ====== RENDER JSX ====== */
    return (
        <section className="signup">
            {
                localStorage.loggedIn ? (
                    <Redirect to="/dashboard" />
                ) : (
                    <article className="signup-form">
                        <form className="signup-form"
                            onSubmit={handleSubmit}
                        >
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

                            <fieldset className="signup-form-group">
                                <input
                                    className="signup-password-input"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    id="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="enter password"
                                    required
                                    aria-label="password"
                                />

                            </fieldset>
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
                            <button
                                type="submit"
                                aria-label="submit button signup form"
                                className="signup-submit"
                                disabled={!username || !password || !validUsername}
                            >
                                Submit
                            </button>
                            <Link
                                to="/"
                                className="signup-link"
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