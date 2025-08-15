"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Paciente } from "../interfaces";

interface GlobalContextType {
  currentPatient: Paciente | null;
  setCurrentPatient: (patient: Paciente | null) => void;
  currentResultId: string | null;
  setCurrentResultId: (id: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [currentPatient, setCurrentPatient] = useState<Paciente | null>(null);
  const [currentResultId, setCurrentResultId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <GlobalContext.Provider 
      value={{ 
        currentPatient,
        setCurrentPatient,
        currentResultId,
        setCurrentResultId,
        loading,
        setLoading
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext debe usarse dentro de GlobalProvider");
  }
  return context;
};