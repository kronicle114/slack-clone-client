import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { Link } from 'react-router-dom';
import './index.css'

export const Dashboard = (props) => {
    console.log('Render Dashboard')
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");

    const storeUser = async (userId, name) => {
        const res = await fetch(
            `${API_BASE_URL}/users/?search=${localStorage.user}`
        );

        // Pull out the data from response
        const [user] = await res.json();

        // Store user info on localStorage
        localStorage.setItem('userId', user.id)
        setUserId(user.id)
        userId = user.id

        localStorage.setItem('name', user.name)
        setName(user.name)
        name = user.name

        return user;
    }

    useEffect(() => {
        setUsername(localStorage.user);
        storeUser(userId, name);
    }, []);

    return(
        <main className='dashboard'>
            <section className="logout-div">
                <Link to="/" id='logout-link'>
                    <button className="logout" onClick={() => {
                        props.logout()
                        localStorage.setItem("logout", true)
                    }}>
                        Logout
                    </button>
                </Link >
            </section>
            <section className="dashboard-greeting">
                <p className="greeting-text">hey there, {username}</p>
            </section>
        </main>
    )
}

export default Dashboard;