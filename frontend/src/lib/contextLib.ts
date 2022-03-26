import { useContext, createContext } from "react";

export const AppContext = createContext<{ isAuthenticated: boolean; userHasAuthenticated: any }>({ isAuthenticated: false, userHasAuthenticated: () => {} });

export function useAppContext() {
    return useContext(AppContext);
}