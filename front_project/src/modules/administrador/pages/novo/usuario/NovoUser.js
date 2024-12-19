import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../../../apiUrls";

function NovoUser() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();
    const [turmas, setTurmas] = useState([]);
    // Função para buscar as turmas disponíveis
    const fetchTurmas = async () => {
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            };
            const response = await axios.get(apiUrls.turmasUrl, requestOptions);
            setTurmas(response.data.registros); // Supondo que a resposta venha como { registros: [] }
            setLoading(false);
        } catch (error) {
            console.log('Erro ao buscar cursos:', error);
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchTurmas();
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
            const response = await axios.post(apiUrls.userUrl, formValues, requestOptions);
            console.log(response.data);
            alert(response.data.retorno.mensagem);
            navigation('/home');
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
                <input type="email" placeholder="Email" style={{ padding: 10 }} required name="email" />
                <input type="number" placeholder="CPF" style={{ padding: 10 }} required name="cpf" />
                <input type="password" placeholder="Senha" style={{ padding: 10 }} required name="senha" />
                <input type="text" placeholder="matricula" style={{ padding: 10 }} required name="matricula" />
                <input type="number" placeholder="semestre" style={{ padding: 10 }} required name="semestre" />
                <input type="text" placeholder="RA" style={{ padding: 10 }} required name="ra" />
                <select style={{ padding: 10 }} name="turma_id">
                    <option value="">Selecione a Turma</option>
                    {turmas.map(turma => (
                        <option key={turma.id} value={turma.id}>
                            {turma.nome}
                        </option>
                    ))}
                </select>
                <select style={{ padding: 10 }} name="tipo">
                    <option value={0}>Aluno</option>
                    <option value={1}>Administrador</option>
                </select>
                <input type="submit" style={{ padding: 10 }} />
            </form>
        </div>
    );
}

export default NovoUser;
