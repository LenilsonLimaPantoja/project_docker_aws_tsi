import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrls } from "../../../../apiUrls";

function AlterarTurma() {
    const [loading, setLoading] = useState(false);
    const [cursos, setCursos] = useState([]);
    const [turma, setTurma] = useState([]);
    const navigation = useNavigate();
    const params = useParams();

    const getOneTurma = async () => {
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        };

        try {
            setLoading(true);
            const response = await axios.get(`${apiUrls.turmasUrl}/${params?.turma_id}`, requestOptions);
            setTurma(response.data.registros[0])
        } catch (error) {
            console.log(error.response.data);
            setLoading(false);
            alert(error.response.data.retorno.mensagem)
        } finally {
            fetchCursos();
        }
    }

    useEffect(() => {
        getOneTurma();
    }, []);

    const fetchCursos = async () => {
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            };
            const response = await axios.get(apiUrls.cursosUrl, requestOptions);
            setCursos(response.data.registros); // Supondo que a resposta venha como { registros: [] }
            setLoading(false);
        } catch (error) {
            console.log('Erro ao buscar cursos:', error);
            setLoading(false);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);

        const ano_inicio = parseInt(formValues.ano_inicio);
        const ano_fim = parseInt(formValues.ano_fim);
        const anoAtual = new Date().getFullYear();

        const anoInicioValid = Number.isInteger(ano_inicio) && ano_inicio > 0 && ano_inicio <= anoAtual;
        if (!anoInicioValid) {
            alert('Ano de início inválido');
            return;
        }

        const anoFimValid = Number.isInteger(ano_fim) && ano_fim > anoAtual && ano_fim <= (anoAtual + 10);
        if (!anoFimValid) {
            alert('Ano de fim inválido');
            return;
        }

        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            };
            const response = await axios.put(`${apiUrls.turmasUrl}/${params?.turma_id}`, formValues, requestOptions);
            console.log(response.data);
            alert(response.data.retorno.mensagem);
            navigation('/turmas');
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
                <input type="text" placeholder="Nome" style={{ padding: 10 }} required name="nome" defaultValue={turma?.nome} />
                <input type="number" placeholder="ano_inicio" style={{ padding: 10 }} name="ano_inicio" defaultValue={turma?.ano_inicio} />
                <input type="number" placeholder="ano_fim" style={{ padding: 10 }} name="ano_fim" defaultValue={turma?.ano_fim} />
                <select style={{ padding: 10 }} name="periodo" required defaultValue={turma?.periodo}>
                    <option value="">Selecione o periodo</option>
                    <option value="M">Matutino</option>
                    <option value="T">Vespertino</option>
                    <option value="N">Noturno</option>
                </select>
                <select style={{ padding: 10 }} name="curso_id" required defaultValue={turma?.curso_id}>
                    <option value="">Selecione o curso</option>
                    {cursos.map(campo => (
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

export default AlterarTurma;
