import React from 'react';
import SignupForm from './signup-form';

export function SignupPage() {
    return (
        <div className="registration-page">
            <h1>Register for SlackClone</h1>
            <div className='reg-h5'>
                <h5 id="reg-h5">I am a placeholder text</h5>
            </div>
            <SignupForm />
        </div>
    );
}

export default SignupPage;
