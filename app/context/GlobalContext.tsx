import { createContext, useContext, useState, ReactNode } from "react";

interface GlobalContextType {
  globalString: string;
  setGlobalString: (value: string) => void;
  filePath: string;
  setFilePath: (value: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [globalString, setGlobalString] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");

  return (
    <GlobalContext.Provider value={{ globalString, setGlobalString, filePath, setFilePath }}>
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
