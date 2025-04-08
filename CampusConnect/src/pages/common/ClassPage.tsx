import { useParams } from "react-router-dom";

const ClassPage = () => {
    const { id } = useParams();

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center">Classe ID: {id}</h2>
            <p className="mt-4 text-center">
                Détails de la classe en cours de développement.
            </p>
        </div>
    );
};

export default ClassPage;
