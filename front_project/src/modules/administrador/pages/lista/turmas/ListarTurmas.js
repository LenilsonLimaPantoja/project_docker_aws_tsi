import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../../../apiUrls";
import { ContextGlobal } from "../../../../../context/GlobalContext";
import { MdDeleteOutline, MdOutlineEdit, MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import DescriptionHeader from '../../../../global/descriptionHeader/DescriptionHeader.js';
import Loading from "../../../../global/loading/Loading.js";

const ListarTurmas = () => {
    const [turmas, setTurmas] = useState([]);
    const navigation = useNavigate();
    const [loading, setLoading] = useState(true);
    const [reloading, setReLoading] = useState(false);
    const [cursos, setCursos] = useState([]);
    const [cursoId, setCursoId] = useState(0);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const { camposId, registrosPorPagina } = useContext(ContextGlobal);

    const handleDados = async () => {
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        };

        try {
            setTurmas([]);
            setLoading(true);
            const url = camposId > 0
                ? cursoId > 0
                    ? `${apiUrls.turmasUrl}?campos_id=${camposId}&curso_id=${cursoId}&page=${paginaAtual}&limit=${registrosPorPagina}`
                    : `${apiUrls.turmasUrl}?campos_id=${camposId}&page=${paginaAtual}&limit=${registrosPorPagina}`
                : cursoId > 0
                    ? `${apiUrls.turmasUrl}?curso_id=${cursoId}&page=${paginaAtual}&limit=${registrosPorPagina}`
                    : `${apiUrls.turmasUrl}?page=${paginaAtual}&limit=${registrosPorPagina}`;
            console.log(url);

            const response = await axios.get(url, requestOptions);
            setTurmas(response.data.registros);
            setTotalRegistros(response.data.totalRegistros);
            setTotalPaginas(response.data.totalPaginas);
        } catch (error) {
            console.log(error.response?.data || error);
        } finally {
            handleDadosCursos();
        }
    };

    const handleDadosCursos = async () => {
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        };

        try {
            const response = await axios.get(apiUrls.cursosUrl, requestOptions);
            setCursos(response.data.registros);
            setLoading(false);
        } catch (error) {
            console.log(error.response?.data || error);
            setLoading(false);
        }
    };

    useEffect(() => {
        handleDados();
    }, [reloading, camposId, cursoId, paginaAtual, registrosPorPagina]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [reloading, camposId, registrosPorPagina]);

    const remove = async (turma_id) => {
        const confirmDelete = window.confirm(`Tem certeza de que deseja excluir esta turma ${turma_id}? Esta ação não pode ser desfeita.`);
        if (!confirmDelete) return;

        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        };

        try {
            setLoading(true);
            const response = await axios.delete(`${apiUrls.turmasUrl}/${turma_id}`, requestOptions);
            alert(response.data.retorno.mensagem);
            setReLoading(!reloading);  // Força o reload
        } catch (error) {
            console.log(error.response?.data || error);
            alert(error.response?.data.retorno.mensagem);
            setReLoading(!reloading);  // Força o reload mesmo após erro
        }
    };

    const handleNextPage = () => {
        if (paginaAtual < totalPaginas) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    const handlePrevPage = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    if (loading) {
        return (
            <Loading/>
        );
    }

    return (
        <div className="container-listar-user">
            <div className="area-listar-user">
                <DescriptionHeader descricao="Listagem de Turmas"/>
                <button onClick={() => navigation('/turma/create')} style={{ height: 50, width: 50, borderRadius: 50, border: 'none', cursor: 'pointer', position: 'fixed', bottom: 50, right: 50, fontSize: 25 }}>+</button>
                <select onChange={(e) => setCursoId(e.target.value)} value={cursoId}>
                    <option>- Selecione um curso -</option>
                    {cursos?.map((item) => (
                        <option value={item?.id} key={item?.id}>{item.nome}</option>
                    ))}
                </select>
                <div className="table-listar-user-scroll">
                    <table>
                        {turmas?.length > 0 ?
                            <> <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Ano Início</th>
                                    <th>Ano Fim</th>
                                    <th>Período</th>
                                    <th>Curso</th>
                                    <th>Campos</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                                <tbody>
                                    {turmas?.map((item) => (
                                        <tr key={item?.id}>
                                            <td>{item?.nome}</td>
                                            <td>{item?.ano_inicio}</td>
                                            <td>{item?.ano_fim}</td>
                                            <td>
                                                {item?.periodo === 'M' && 'Matutino'}
                                                {item?.periodo === 'T' && 'Vespertino'}
                                                {item?.periodo === 'N' && 'Noturno'}
                                            </td>
                                            <td>{item?.curso_nome}</td>
                                            <td>{item?.campos_nome}</td>
                                            <td>
                                                <div className="opcoes">
                                                    <button onClick={() => navigation(`/turma/update/${item?.id}`)}>
                                                        <MdOutlineEdit />
                                                    </button>
                                                    <button onClick={() => remove(item.id)}>
                                                        <MdDeleteOutline />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                            :
                            <p>Nenhuma informação foi localizada</p>
                        }
                    </table>
                </div>
                {turmas?.length > 0 &&
                    <div className="pagination-controls">
                        <button onClick={handlePrevPage} disabled={paginaAtual <= 1}>
                            <MdKeyboardArrowLeft />
                        </button>
                        <span>{paginaAtual} de {totalPaginas} ({totalRegistros} registros)</span>
                        <button onClick={handleNextPage} disabled={paginaAtual >= totalPaginas}>
                            <MdKeyboardArrowRight />
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default ListarTurmas;
