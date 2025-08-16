import styles from "./header.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Biblia da hora</h1>
        </header>
    );
}
