import styles from './footer.module.css'

export default function Footer(){
    return (
        <footer className={styles.footer}>
          <span>
            Desenvolvido por <a href="https://github.com/ezequielwish">Ezequiel Almeida</a>
          </span>
        </footer>
    )
}