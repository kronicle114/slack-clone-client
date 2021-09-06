import React from 'react';
import SignupForm from './signup-form';
import './index.css'

export function SignupPage() {
    return (
        <div className="signup-page">
            <h1>Register for SlackClone</h1>
            <SignupForm />
        </div>
    );
}

export default SignupPage;
