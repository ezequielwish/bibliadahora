import styles from "./footer.module.css";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <a href="https://github.com/ezequielwish" target="_blank" rel="noopener noreferrer">
                <span>Desenvolvido por Ezequiel Almeida</span>
                <FaGithub />
            </a>
        </footer>
    );
}
