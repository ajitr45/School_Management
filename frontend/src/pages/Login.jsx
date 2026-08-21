import { useState } from "react";
import axios from "axios";
import api from "../services/api"

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await api.post(
            "accounts/login/",
            {
                username,
                password
            }
        );

        const { access, refresh, user } = response.data;

        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Login successful:", user);


        // Test protected api

        const Response = await api.get("students/");

        console.log(response.data);


    } catch (error) {
        console.log(error.response?.data);
    }
};

    return (
        <>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">
                    Login
                </button>

            </form>
        </>
    );
}

export default Login;