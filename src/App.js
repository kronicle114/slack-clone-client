import React, { useState } from 'react';
import { Route, withRouter } from 'react-router-dom';
import Dashboard from './components/dashboard';
import LoginForm from './components/login/login-form';
import SignupPage from './components/signup/signup-page';
import './App.css';

export const App = () => {
  const [user, setUser] = useState({ username: null })

  const storeUser = user => {
    localStorage.getItem("user");
    setUser(user);
  };

  const logout = () => {
    localStorage.clear();
    setUser({ username: null });
  };

  return (
    <section className="app">
      {localStorage.user ? (
        <Route
          exact path="/dashboard"
          render={ (props) =>
            <Dashboard
              {...props}
              storeUser={storeUser}
              user={user.username}
              logout={logout}
              isAuthed={true}
            />
          }
        />
      ) : (
          <Route exact path="/signup" component={SignupPage} />
      )}
      <Route exact path="/" component={LoginForm} storeUser={storeUser} />
    </section>
  )
}

export default withRouter(App);

