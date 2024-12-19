import { createContext, useEffect, useState } from "react";
import { apiUrls } from "../modules/apiUrls";
import axios from "axios";

export const ContextGlobal = createContext({});

const GlobalContext = ({ children }) => {
    const [campos, setCampos] = useState([]);
    const [camposId, setCamposId] = useState(0);
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

    const handleDadosCampos = async () => {
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // Ensure cookies are sent with the request
        };

        try {
            const response = await axios.get(apiUrls.camposUrl, requestOptions);
            setCampos(response.data.registros);
        } catch (error) {
            console.log(error.response.data);
        }
    };
    useEffect(() => {
        handleDadosCampos();
    }, []);
    return (
        <ContextGlobal.Provider value={{ campos, camposId, setCamposId, registrosPorPagina, setRegistrosPorPagina }}>
            {children}
        </ContextGlobal.Provider>
    )
}
export default GlobalContext;