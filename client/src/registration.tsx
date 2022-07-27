import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Registration.css";

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

export default function Registration() {
    const [inputsValues, setInputsValues] =
        useState<RegistrationInputs>(initReg);
    const [error, setError] = useState<boolean>(false);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setInputsValues({
            ...inputsValues,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit() {
        console.log("Handle the submit, inputsValues:", inputsValues);

        // try {
        //     const resp = await fetch("/registration.json", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(inputsValues),
        //     });

        //     const data = await resp.json();

        //     if (data.status === "Success") {
        //         // location.replace("/");
        //         // location.reload();
        //     } else {
        //         setError(true);
        //     }
        // } catch {
        //     setError(true);
        // }
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
                <form>
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
                        placeholder="Email"
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
                </form>
            </div>
        </>
    );
}
