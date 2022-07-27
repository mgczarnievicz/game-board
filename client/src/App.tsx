import React, { useEffect } from "react";
import "./App.css";

function App() {
    useEffect(() => {
        fetch("/test");
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <p>WellCome to my App</p>
            </header>
        </div>
    );
}

export default App;
