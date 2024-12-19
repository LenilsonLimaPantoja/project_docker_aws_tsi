import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrls } from "../../../../apiUrls";

function AlterarCampos() {
    const [loading, setLoading] = useState(false);
    const [campos, setCampos] = useState([]);
    const navigation = useNavigate();
    const params = useParams();

    const getOneCampos = async () => {
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        };

        try {
            setLoading(true);
            const response = await axios.get(`${apiUrls.camposUrl}/${params?.campos_id}`, requestOptions);
            setCampos(response.data.registros[0])
            setLoading(false);
        } catch (error) {
            console.log(error.response.data);
            setLoading(false);
            alert(error.response.data.retorno.mensagem)
        }
    }

    useEffect(() => {
        getOneCampos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            };
            const response = await axios.put(`${apiUrls.camposUrl}/${params?.campos_id}`, formValues, requestOptions);
            console.log(response.data);
            alert(response.data.retorno.mensagem);
            navigation('/campos');
            setLoading(false);

        } catch (error) {
            console.log(error.response.data);
            setLoading(false);
            alert(error.response.data.retorno.mensagem)
        }
    }
    if (loading) {
        return (
            <div>
                <p>carregando dados, aguarde...</p>
            </div>
        )
    }
    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', rowGap: 10, width: 500 }}>
                <input type="text" placeholder="Nome" style={{ padding: 10 }} required name="nome" defaultValue={campos?.nome} />
                <input type="text" placeholder="Descrição" style={{ padding: 10 }} name="descricao" defaultValue={campos?.descricao} />
                <input type="submit" style={{ padding: 10 }} />
            </form>
        </div>
    );
}

export default AlterarCampos;
