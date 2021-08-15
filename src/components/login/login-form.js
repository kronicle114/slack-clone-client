import React, { useState } from 'react';
import { API_BASE_URL  } from "../../config";

export const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = e => {
        // you'd want to fetch via `${API_BASE_URL}/auth/signin` and return the auth token, which will then get set on localStorage of browser
        return {}
    }

    return(
        <section className='signup-container'>
            <article className='signup-modal'>
                <form className='signup-form'
                    onSubmit={handleSubmit}
                >
                </form>
            </article>
            <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="enter username"
                type="text"
                name="username"
                pattern="[A-Za-z0-9_]{1,15}"
                title="Username should only contain letters, numbers and underscores; no more than 15 characters e.g. trisha_123"
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
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                required
                id="login-password"
                aria-labelledby="signup-password"
            />
            <button waves="teal" type="submit" className="signup-submit">
                Submit
            </button>
        </section>
    )
}

export default LoginForm;