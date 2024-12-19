import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrls } from "../../../../apiUrls";

function AlterarCurso() {
    const [loading, setLoading] = useState(false);
    const [campos, setCampos] = useState([]);
    const [curso, setCurso] = useState({});
    const navigation = useNavigate();
    const params = useParams();

    const getOneCursos = async () => {
        setCampos([]);
        setCurso([]);
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        };

        try {
            setLoading(true);
            const response = await axios.get(`${apiUrls.cursosUrl}/${params?.curso_id}`, requestOptions);
            setCurso(response.data.registros[0])
        } catch (error) {
            console.log(error.response.data);
            setLoading(false);
            alert(error.response.data.retorno.mensagem)
        } finally {
            fetchCampos();
        }
    }

    useEffect(() => {
        getOneCursos();
    }, []);

    const fetchCampos = async () => {
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            };
            const response = await axios.get(apiUrls.camposUrl, requestOptions);
            setCampos(response.data.registros); // Supondo que a resposta venha como { registros: [] }
        } catch (error) {
            console.log('Erro ao buscar cursos:', error);
        }
        finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);

        const ano_inicio = parseInt(formValues.ano_inicio);

        const anoValid = Number.isInteger(ano_inicio) && ano_inicio > 0 && ano_inicio <= new Date().getFullYear();
        if (!anoValid) {
            alert('Ano de inicio invalido');
            return
        }

        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            };
            const response = await axios.put(`${apiUrls.cursosUrl}/${params?.curso_id}`, formValues, requestOptions);
            console.log(response.data);
            alert(response.data.retorno.mensagem);
            navigation('/cursos');
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
        );
    }
    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', rowGap: 10, width: 500 }}>
                <input type="text" placeholder="Nome" style={{ padding: 10 }} required name="nome" defaultValue={curso?.nome} />
                <input type="number" placeholder="Horas Complementares" style={{ padding: 10 }} name="horas_complementares" defaultValue={curso?.horas_complementares} />
                <input type="number" placeholder="ano_inicio" style={{ padding: 10 }} name="ano_inicio" defaultValue={curso?.ano_inicio} />
                <select style={{ padding: 10 }} name="campos_id" required defaultValue={curso?.campos_id}>
                    <option value="">Selecione o campos</option>
                    {campos.map(campo => (
                        <option key={campo.id} value={campo.id}>
                            {campo.nome}
                        </option>
                    ))}
                </select>
                <input type="submit" style={{ padding: 10 }} />
            </form>
        </div>
    );
}

export default AlterarCurso;
