import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/header";

function App() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        document.body.classList.toggle("dark-theme", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };
    return (
        <div className="App">
            <Header toggleTheme={toggleTheme} currentTheme={theme}/>
            
            {/* <button */}
                {/* onClick={toggleTheme} */}
                {/* className="theme-toggle-button" */}
            {/* > */}
                {/* Switch to {theme === "light" ? "Dark" : "Light"} Mode */}
            {/* </button> */}

        </div>
    );
}

export default App;
