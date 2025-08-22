"use client";
import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import styles from "./header.module.css";

export default function Header() {
    const [theme, setTheme] = useState("dark"); // valor inicial padrão

    // Efeito para carregar o tema do localStorage ou do sistema
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
            document.body.classList.add(savedTheme);
        } else {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            const defaultTheme = prefersDark ? "dark" : "light";
            setTheme(defaultTheme);
            document.body.classList.add(defaultTheme);
        }
    }, []);

    // Alterna entre light e dark
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);

        document.body.classList.remove("light", "dark");
        document.body.classList.add(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img
                    className={styles.logo}
                    src="/assets/logo.png"
                    alt="logo"
                />
                <h1>Biblia da hora</h1>
            </div>
            <button className={styles.themeButton} onClick={toggleTheme}>
                {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
        </header>
    );
}
