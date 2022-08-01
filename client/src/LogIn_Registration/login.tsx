import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Registration.css";
import validator from "validator";

interface LogInInputs {
    email: string;
    password: string;
}

const initReg: LogInInputs = {
    email: "",
    password: "",
};

const optionValidatorEmpty = { ignore_whitespace: false };

export default function LogIn() {
    let navigate = useNavigate();
    const [inputsValues, setInputsValues] = useState<LogInInputs>(initReg);
    const [error, setError] = useState<boolean>(false);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setInputsValues({
            ...inputsValues,
            [event.target.name]: event.target.value.trim(),
        });
    }

    async function handleSubmit() {
        console.log("Handle the submit, inputsValues:", inputsValues);

        // Lets Valid the input before sending them to the server.
        if (
            !validator.isEmail(inputsValues.email) ||
            validator.isEmpty(inputsValues.password, optionValidatorEmpty)
        ) {
            console.log("Error");
            setError(true);
        } else {
            console.log("All inputs are valid");

            try {
                const resp = await fetch("/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inputsValues),
                });

                const data = await resp.json();

                if (data.status === "Success") {
                    console.log("Everything is success!");
                    // eslint-disable-next-line no-restricted-globals
                    location.replace("/");
                    // navigate("/");
                } else {
                    setError(true);
                }
            } catch {
                setError(true);
            }
        }
    }

    return (
        <>
            <div className="form">
                <h1>Log In</h1>

                <p>
                    <Link to="/"> Registration </Link> || Log in
                </p>

                <div className="error">
                    {error && <p>oops, something went wrong</p>}
                </div>

                <input
                    type="email"
                    name="email"
                    placeholder="Email@email.com"
                    onChange={handleChange}
                    required
                ></input>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                ></input>
                <button onClick={handleSubmit}>Accept</button>
            </div>
        </>
    );
}
function useHistory() {
    throw new Error("Function not implemented.");
}
