import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../../../apiUrls";
import { ContextGlobal } from "../../../../../context/GlobalContext";
import { MdDeleteOutline, MdOutlineEdit, MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import DescriptionHeader from '../../../../global/descriptionHeader/DescriptionHeader.js';
import Loading from "../../../../global/loading/Loading.js";

const ListarCampos = () => {
    const [campos, setCampos] = useState([]);
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
            setCampos([]);
            setLoading(true);
            const response = await axios.get(`${apiUrls.camposUrl}?page=${paginaAtual}&limit=${registrosPorPagina}`, requestOptions);
            setCampos(response.data.registros);
            console.log(response.data.registros);
            setTotalRegistros(response.data.totalRegistros);  // Supõe que a API retorna o total de registros
            setTotalPaginas(response.data.totalPaginas);
            setLoading(false);
        } catch (error) {
            console.log(error.response.data);
            setLoading(false);
        }
    };

    useEffect(() => {
        handleDados();
    }, [reloading, paginaAtual, registrosPorPagina]);
    useEffect(() => {
        setPaginaAtual(1);
    }, [reloading, registrosPorPagina]);
    const remove = async (campos_id) => {
        // Exibir uma mensagem de confirmação
        const confirmDelete = window.confirm(`Tem certeza de que deseja excluir este campo ${campos_id}? Esta ação não pode ser desfeita.`);

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
            const response = await axios.delete(`${apiUrls.camposUrl}/${campos_id}`, requestOptions);
            alert(response.data.retorno.mensagem);
            setLoading(false);
            setReLoading(!reloading);
        } catch (error) {
            console.log(error.response.data);
            alert(error.response.data.retorno.mensagem);
            setLoading(false);
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
                <DescriptionHeader descricao="Listagem de Campos" />
                <button onClick={() => navigation('/campos/create')} style={{ height: 50, width: 50, borderRadius: 50, border: 'none', cursor: 'pointer', position: 'fixed', bottom: 50, right: 50, fontSize: 25 }}>+</button>
                {campos?.length > 0 ? (
                    <>
                        <div className="table-listar-user-scroll">
                            <table style={{ width: 1200, textAlign: "left", borderCollapse: 'collapse', border: 'solid 1px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                                        <th style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>id</th>
                                        <th style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>nome</th>
                                        <th style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>descricao</th>
                                        <th style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campos?.map((item, index) => (
                                        <tr key={item?.id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2", color: "#000" }}>
                                            <td style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>{item?.id}</td>
                                            <td style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>{item?.nome}</td>
                                            <td style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>{item?.descricao}</td>
                                            <td style={{ padding: 5 }}>
                                                <div className="opcoes">
                                                    <button onClick={() => navigation(`/campos/update/${item?.id}`)}>
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

export default ListarCampos;
