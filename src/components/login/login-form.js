import React, { useState } from 'react';
import { API_BASE_URL  } from "../../config";
import { Redirect } from 'react-router-dom';
import './index.css'

export const LoginForm = () => {
    const [username, setUsername] = useState(""); // test123
    const [password, setPassword] = useState(""); // trish123
    // eslint-disable-next-line no-unused-vars
    const [authToken, setAuthToken] = useState("")
    const [loggedIn, setLoggedIn] = useState(true)
    const [authError, setAuthError] = useState(false)

    const handleSubmit = e => {
        e.preventDefault(e);

        // set Login and Logout on local storage
        setUsername(username)
        setLoggedIn(loggedIn)
        localStorage.removeItem("logout")

        // Fetch via `${API_BASE_URL}/auth/signin` and return the auth token, which will then get set on localStorage of browser
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
                return res.json()
            })
            .then((auth) => {
                const { message, code, name } = auth;
                if (code === 401 || message === 'Unauthorized' || name === 'AuthenticationError') {
                    setAuthError(true)
                    localStorage.setItem("error", name)
                }

                if (auth.hasOwnProperty("authToken")) {
                    localStorage.setItem("user", username);
                    localStorage.setItem("loggedIn", loggedIn);
                    localStorage.setItem("authToken", auth.authToken);
                    localStorage.removeItem("error")
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
            })
    };

    /* ==== RENDER VALIDATION ERROR MESSAGE ==== */
    let errorMessage;
    if (authError && username.length > 0) {
        errorMessage = <p>Login Failed. Check your credentials and resubmit.</p>
        setInterval(function () { localStorage.removeItem('error') }, 2000);
    } else if (localStorage.error) {
        errorMessage = <p>Login Failed. Check your credentials and resubmit.</p>
        setInterval(function () { localStorage.removeItem('error') }, 2000);
    } else {
        errorMessage = <p></p>
    }

    return(
        <section className='signup-container'>
            {errorMessage}
            {
                localStorage.loggedIn ? (
                    <Redirect to="/dashboard" />
                ) : (
                    <article className="login-modal">
                        <h1>Login to Slack Clone</h1>
                        <form className='signup-form'
                            onSubmit={handleSubmit}
                        >
                            <input
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="enter username"
                                type="text"
                                name="username"
                                id="login-username"
                                required
                                aria-labelledby="signup-username"
                            />
                            <input
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="enter password"
                                type="password"
                                name="password"
                                required
                                id="login-password"
                                aria-labelledby="signup-password"
                            />
                            <button type="submit" className="signup-submit">
                                Submit
                            </button>
                        </form>
                    </article>
                )
            }
        </section>
    )
}

export default LoginForm;