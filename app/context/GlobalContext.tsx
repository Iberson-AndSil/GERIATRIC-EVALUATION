"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Patient } from "../interfaces";

interface GlobalContextType {
  currentPatient: Patient | null;
  setCurrentPatient: (patient: Patient | null) => void;
  currentResultId: string | null;
  setCurrentResultId: (id: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
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
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};