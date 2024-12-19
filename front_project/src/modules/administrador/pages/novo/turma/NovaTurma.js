import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../../../apiUrls";

function NovaTurma() {
    const [loading, setLoading] = useState(false);
    const [cursos, setCursos] = useState([]);
    const navigation = useNavigate();

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

    useEffect(() => {
        fetchCursos();
    }, []);

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
            const response = await axios.post(apiUrls.turmasUrl, formValues, requestOptions);
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
                <input type="text" placeholder="Nome" style={{ padding: 10 }} required name="nome" />
                <input type="number" placeholder="ano_inicio" style={{ padding: 10 }} name="ano_inicio" />
                <input type="number" placeholder="ano_fim" style={{ padding: 10 }} name="ano_fim" />
                <select style={{ padding: 10 }} name="periodo" required>
                    <option value="">Selecione o periodo</option>
                    <option value="M">Matutino</option>
                    <option value="T">Vespertino</option>
                    <option value="N">Noturno</option>
                </select>
                <select style={{ padding: 10 }} name="curso_id" required>
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

export default NovaTurma;
