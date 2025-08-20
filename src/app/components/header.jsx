"use client";
import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import styles from "./header.module.css";

export default function Header() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        document.body.classList.remove("light", "dark");
        document.body.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <header className={styles.header}>
            <h1>Biblia da hora</h1>
            <button className={styles.themeButton} onClick={toggleTheme}>
                {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
        </header>
    );
}