import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Crea il context
const NotificationContext = createContext();

// Hook per usare il context
export const useNotification = () => useContext(NotificationContext);

// Provider per avvolgere l'app con il context
export const NotificationProvider = ({ children }) => {
    const [error, setError] = useState(null);

    const handleError = (err) => {
        let errorMsg = 'Unknown error occurred'; // Messaggio predefinito

        // Cerca di estrarre il messaggio di errore da varie strutture
        if (err.response && err.response.data) {
            const errorData = err.response.data;
            errorMsg = errorData.detail || errorData.message || errorData.title || JSON.stringify(errorData);
        } else if (err.detail) {
            errorMsg = err.detail;
        } else if (err.errors && err.errors[0]?.msg) {
            errorMsg = err.errors[0].msg;
        } else if (err.message) {
            errorMsg = err.message;
        }

        // Imposta il messaggio di errore nel context
        setError(errorMsg);
        toast.error(errorMsg); // Mostra il toast con il messaggio
    };

    const handleSuccess = (message) => {
        const successMsg = message || 'Operation completed successfully';
        toast.success(successMsg); // Mostra il toast con il messaggio
    };

    const resetError = () => setError(null);

    return (
        <NotificationContext.Provider value={{ error, handleError, handleSuccess, resetError }}>
            {children}
        </NotificationContext.Provider>
    );
};
