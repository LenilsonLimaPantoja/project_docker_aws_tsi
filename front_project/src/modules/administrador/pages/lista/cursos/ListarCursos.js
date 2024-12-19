import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../../../apiUrls";
import { ContextGlobal } from "../../../../../context/GlobalContext";
import { MdDeleteOutline, MdOutlineEdit, MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import DescriptionHeader from '../../../../global/descriptionHeader/DescriptionHeader.js';
import Loading from "../../../../global/loading/Loading.js";

const ListarCursos = () => {
    const [cursos, setCursos] = useState([]);
    const navigation = useNavigate();
    const [loading, setLoading] = useState(false);
    const [reloading, setReLoading] = useState(false);
    // Página atual e número de registros por página
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const { camposId, registrosPorPagina } = useContext(ContextGlobal);

    const handleDados = async () => {
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // Ensures that cookies are sent with the request
        };

        try {
            setCursos([]);
            setLoading(true);
            const url = camposId > 0 ? `${apiUrls.cursosUrl}?campos_id=${camposId}&page=${paginaAtual}&limit=${registrosPorPagina}` : `${apiUrls.cursosUrl}?page=${paginaAtual}&limit=${registrosPorPagina}`;
            const response = await axios.get(url, requestOptions);
            setCursos(response.data.registros);
            console.log(response.data.registros);
            setLoading(false);
            setTotalRegistros(response.data.totalRegistros);  // Supõe que a API retorna o total de registros
            setTotalPaginas(response.data.totalPaginas);
        } catch (error) {
            console.log(error.response.data);
            setLoading(false);
        }
    };

    useEffect(() => {
        handleDados();
    }, [reloading, camposId, paginaAtual, registrosPorPagina]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [reloading, camposId, registrosPorPagina]);

    const remove = async (curso_id) => {
        // Exibir uma mensagem de confirmação
        const confirmDelete = window.confirm(`Tem certeza de que deseja excluir este curso ${curso_id}? Esta ação não pode ser desfeita.`);

        if (!confirmDelete) {
            // Se o usuário cancelar, interrompa a execução
            return;
        }

        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,  // Ensures that cookies are sent with the request
        };

        try {
            setLoading(true);
            const response = await axios.delete(`${apiUrls.cursosUrl}/${curso_id}`, requestOptions);
            alert(response.data.retorno.mensagem);
            setReLoading(!reloading);
        } catch (error) {
            console.log(error.response.data);
            alert(error.response.data.retorno.mensagem);
            setReLoading(!reloading);
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
                <DescriptionHeader descricao="Listagem de Cursos" />
                <button onClick={() => navigation('/curso/create')} style={{ height: 50, width: 50, borderRadius: 50, border: 'none', cursor: 'pointer', position: 'fixed', bottom: 50, right: 50, fontSize: 25 }}>+</button>
                {cursos?.length > 0 ? (
                    <>
                        <div className="table-listar-user-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>id</th>
                                        <th>nome</th>
                                        <th>ano_inicio</th>
                                        <th>horas_complementares</th>
                                        <th>campos</th>
                                        <th>ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cursos?.map((item, index) => (
                                        <tr key={item?.id}>
                                            <td>{item?.id}</td>
                                            <td>{item?.nome}</td>
                                            <td>{item?.ano_inicio}</td>
                                            <td>{item?.horas_complementares}hrs</td>
                                            <td>{item?.campos_nome}</td>
                                            <td style={{ padding: 5 }}>
                                                <div className="opcoes">
                                                    <button onClick={() => navigation(`/curso/update/${item?.id}`)}>
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
                    </>
                ) : (
                    <p>nenhum informação foi localizada</p>
                )}
            </div>
        </div>
    );
};

export default ListarCursos;