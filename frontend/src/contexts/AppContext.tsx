import React, { useContext, useState } from "react";
import Toast from "../Components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client"

// Typescript types
type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}

type AppContext = {
    showToast: (toastMessage: ToastMessage) => void
    isLoggedIn: boolean;
}


// Creates context with initial value of undefined the firdt time the app runs
const AppContext = React.createContext<AppContext | undefined>(undefined);


// Wraps the children with the context provider
export const AppContextProvider = ({
    children
} : {
    children: React.ReactNode;
    }) => {
    
    // Setting undefined as starting value
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined)
    
    const { isError } = useQuery("validateToken", apiClient.validateToken, {
        retry: false,
    });

    return (
        // Provides showToast and isLoggedIn to childen components
        // Renders The Toast Component when there is a toast message
        // onClose clears the toast message so that new toast can be displayed when needed
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                setToast(toastMessage);
            },
            isLoggedIn: !isError
        }}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(undefined)}
                />
            )}
            {children}
        </AppContext.Provider>
    );
};


// Allows for easy access to context values within components
export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContext;
}