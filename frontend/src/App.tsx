import { useState, useEffect } from "react";
import "./index.css";
import Header from "./components/header";
import Dashboard from "./pages/Dashboard";

function App() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
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
