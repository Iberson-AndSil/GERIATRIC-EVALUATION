import { createContext, useContext, useState, ReactNode } from "react";

interface Paciente {
  codigo: string;
  nombre: string;
  dni: string;
  edad: number;
  fecha_nacimiento:string;
  sexo: 'M' | 'F';
  zona_residencia:string;
  domicilio:string;
  nivel_educativo:string
  ocupacion:string;
  sistema_pension:string;
  ingreso_economico:number;
  con_quien_vive:string;
  relacion:string;
}

interface GlobalContextType {
  filePath: string;
  excelData: Paciente[]; 
  setFilePath: (value: string) => void;
  setExcelData: (data: Paciente[]) => void;
  fileHandle: FileSystemFileHandle | null;
  setFileHandle: (handle: FileSystemFileHandle | null) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [filePath, setFilePath] = useState<string>("");
  const [excelData, setExcelData] = useState<Paciente[]>([]);
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null); 

  return (
    <GlobalContext.Provider value={{ filePath, excelData, setFilePath, setExcelData, fileHandle, setFileHandle }}>
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