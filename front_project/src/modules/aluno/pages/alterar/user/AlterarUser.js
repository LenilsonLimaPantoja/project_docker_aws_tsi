import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrls } from "../../../../apiUrls";

function AlterarUser() {
    const params = useParams();
    const [user, setUser] = useState({});
    const [turmas, setTurmas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigate();

    // Função para buscar os dados do usuário
    const handleUser = async () => {
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            };

            const response = await axios.get(`${apiUrls.userUrl}/${params?.usuario_id}`, requestOptions);
            setUser(response.data.registros[0]);
        } catch (error) {
            console.log(error.response.data);
        }
        finally {
            fetchTurmas();
        }
    }

    // Função para buscar as turmas disponíveis
    const fetchTurmas = async () => {
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            };
            const response = await axios.get(apiUrls.turmasUrl, requestOptions);
            setTurmas(response.data.registros); // Supondo que a resposta venha como { registros: [] }
            setLoading(false);
        } catch (error) {
            console.log('Erro ao buscar cursos:', error);
            setLoading(false);
        }
    }

    // Chama as funções de busca ao carregar o componente
    useEffect(() => {
        handleUser();
    }, []);

    // Função de envio do formulário
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
                withCredentials: true
            };
            const response = await axios.put(`${apiUrls.userUrl}/${params?.usuario_id}`, formValues, requestOptions);
            alert(response.data.retorno.mensagem);
            navigation('/home');
            setLoading(false);
        } catch (error) {
            console.log(error.response.data);
            setLoading(false);
            alert(error.response.data.retorno.mensagem);
        }
    }

    if (loading && user && turmas) {
        return (
            <div>
                <p>carregando dados, aguarde...</p>
            </div>
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', rowGap: 10, width: 500 }}>
                <input
                    type="text"
                    placeholder="Nome"
                    style={{ padding: 10 }}
                    required
                    name="nome"
                    defaultValue={user?.nome}
                />
                <input
                    type="email"
                    placeholder="Email"
                    style={{ padding: 10 }}
                    required
                    name="email"
                    defaultValue={user?.email}
                />
                <input
                    type="text"
                    placeholder="CPF"
                    style={{ padding: 10 }}
                    required
                    name="cpf"
                    defaultValue={user?.cpf}
                />
                <input
                    type="text"
                    placeholder="Matrícula"
                    style={{ padding: 10 }}
                    required
                    name="matricula"
                    defaultValue={user?.matricula}
                />
                <input
                    type="number"
                    placeholder="Semestre"
                    style={{ padding: 10 }}
                    required
                    name="semestre"
                    defaultValue={user?.semestre}
                />
                <input
                    type="text"
                    placeholder="RA"
                    style={{ padding: 10 }}
                    required
                    name="ra"
                    defaultValue={user?.ra}
                />
                <select style={{ padding: 10 }} name="is_active" required defaultValue={user?.is_active || ''}>
                    <option value={1}>Ativo</option>
                    <option value={0}>Inativo</option>
                </select>

                <select style={{ padding: 10 }} name="turma_id" required defaultValue={user?.turma_id || ''}>
                    <option value="">Selecione a Turma</option>
                    {turmas.map(turma => (
                        <option key={turma.id} value={turma.id}>
                            {turma.nome}
                        </option>
                    ))}
                </select>

                <input type="submit" style={{ padding: 10 }} />
            </form>
        </div>
    );
}

export default AlterarUser;
