import axios from "axios";
import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../apiUrls";
import { ContextGlobal } from "../../../context/GlobalContext";
import "./ListarUsuarios.scss";
import { MdDeleteOutline, MdOutlineEdit, MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { GrDocumentPdf } from "react-icons/gr";
import DescriptionHeader from "../descriptionHeader/DescriptionHeader";
import Loading from "../loading/Loading";

const HomeGlobal = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [tipoUser, setTipoUser] = useState(0);
    const { camposId, registrosPorPagina } = useContext(ContextGlobal);
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString || dateString === "0000-00-00T00:00:00.000Z") return "Não registrado";
        const date = new Date(dateString);
        return date.toLocaleString("pt-BR");
    };

    const handleDados = useCallback(async () => {
        setLoading(true);
        const requestOptions = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        try {
            const url = camposId > 0
                ? `${apiUrls.userUrl}?campos_id=${camposId}&tipo_user_filter=${tipoUser}&page=${paginaAtual}&limit=${registrosPorPagina}`
                : `${apiUrls.userUrl}?tipo_user_filter=${tipoUser}&page=${paginaAtual}&limit=${registrosPorPagina}`;

            const { data } = await axios.get(url, requestOptions);

            setUsers(data.registros || []);
            setTotalRegistros(data.totalRegistros || 0);
            setTotalPaginas(data.totalPaginas || 0);
        } catch (error) {
            console.error("Erro ao carregar dados:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }, [camposId, tipoUser, paginaAtual, registrosPorPagina]);

    useEffect(() => {
        handleDados();
    }, [handleDados]);

    const editar = (usuario_id) => navigate(`/usuario/update/${usuario_id}`);

    const remove = async (usuario_id) => {
        const confirmDelete = window.confirm("Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.");
        if (!confirmDelete) return;

        setLoading(true);
        const requestOptions = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        try {
            const { data } = await axios.delete(`${apiUrls.userUrl}/${usuario_id}`, requestOptions);
            alert(data.retorno.mensagem || "Usuário excluído com sucesso!");
            handleDados(); // Recarrega os dados após exclusão
        } catch (error) {
            console.error("Erro ao excluir usuário:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => paginaAtual < totalPaginas && setPaginaAtual(paginaAtual + 1);
    const handlePrevPage = () => paginaAtual > 1 && setPaginaAtual(paginaAtual - 1);

    if (loading) return <Loading/>;

    return (
        <div className="container-listar-user">
            <div className="area-listar-user">
                <DescriptionHeader descricao="Listagem de Usuários"/>
                <select onChange={(e) => setTipoUser(Number(e.target.value))} value={tipoUser}>
                    <option value="0">Aluno</option>
                    <option value="1">Administrador</option>
                </select>

                <div className="table-listar-user-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Tipo</th>
                                <th>Turma</th>
                                <th>Curso</th>
                                <th>Campos</th>
                                <th>Horas Complementares</th>
                                <th>Último Login</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <p>{item.nome}</p>
                                        <p>{item.cpf}</p>
                                    </td>
                                    <td>{item.email}</td>
                                    <td>{item.tipo > 0 ? "Adm" : "Aluno"}</td>
                                    <td>{item.turma_nome}</td>
                                    <td>{item.curso_nome}</td>
                                    <td>{item.campos_nome}</td>
                                    <td>{item.horas_complementares} hrs</td>
                                    <td>{formatDate(item.last_login)}</td>
                                    <td>
                                        <div className="opcoes">
                                            <button onClick={() => editar(item.id)}>
                                                <MdOutlineEdit />
                                            </button>
                                            <button onClick={() => remove(item.id)}>
                                                <MdDeleteOutline />
                                            </button>
                                            <button onClick={() => navigate(`/certificado/read/${item.id}`)}>
                                                <GrDocumentPdf />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-controls">
                    <button onClick={handlePrevPage} disabled={paginaAtual <= 1}>
                        <MdKeyboardArrowLeft />
                    </button>
                    <span>{paginaAtual} de {totalPaginas} ({totalRegistros} registros)</span>
                    <button onClick={handleNextPage} disabled={paginaAtual >= totalPaginas}>
                        <MdKeyboardArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomeGlobal;
