import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Registration.css";
import validator from "validator";

interface RegistrationInputs {
    name: string;
    surname: string;
    email: string;
    password: string;
}

const initReg: RegistrationInputs = {
    name: "",
    surname: "",
    email: "",
    password: "",
};

const optionValidatorEmpty = { ignore_whitespace: false };

export default function Registration() {
    const [inputsValues, setInputsValues] =
        useState<RegistrationInputs>(initReg);
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
            validator.isEmpty(inputsValues.name, optionValidatorEmpty) ||
            validator.isEmpty(inputsValues.surname, optionValidatorEmpty) ||
            validator.isEmpty(inputsValues.password, optionValidatorEmpty)
        ) {
            console.log("Error");
            setError(true);
        } else {
            console.log("All inputs are valid");

            try {
                const resp = await fetch("/api/registration", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inputsValues),
                });

                const data = await resp.json();

                if (data.status === "Success") {
                    console.log("Everything is success!");

                    // location.replace("/");
                    // location.reload();
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
            <div>registration</div>
            <div className="form">
                <h1>Join our community</h1>

                <p>
                    Registration ||
                    {/* <Link to="/login"> Log in </Link> */}
                </p>
                <div className="error">
                    {error && <p>oops, something went wrong</p>}
                </div>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    required
                ></input>
                <input
                    type="text"
                    name="surname"
                    placeholder="Surname"
                    onChange={handleChange}
                    required
                ></input>
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
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </>
    );
}
