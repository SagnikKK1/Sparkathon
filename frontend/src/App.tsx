import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/header";
import Dashboard from "./pages/Dashboard";

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
            <Header toggleTheme={toggleTheme} currentTheme={theme} />
            <Dashboard />
        </div>
    );
}

export default App;
