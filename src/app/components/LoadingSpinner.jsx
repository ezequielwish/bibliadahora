import "./LoadingSpinner.css";

export default function LoadingSpinner({ text = "Carregando..." }) {
    return (
        <div className="loading-wrapper">
            <div className="spinner"></div>
            {text}
        </div>
    );
}
