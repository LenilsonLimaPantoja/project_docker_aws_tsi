import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrls } from "../../../../apiUrls";

const ListarCertificados = () => {
    const [certificados, setCertificados] = useState([]);

    const params = useParams();
    const navigation = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDados = async () => {
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // Ensures that cookies are sent with the request
        };

        try {
            setCertificados([]);
            setLoading(true);
            const response = await axios.get(`${apiUrls.certificadosUrl}/${params.usuario_id}`, requestOptions);
            setCertificados(response.data.registros);
            console.log(response.data.registros);
            setLoading(false);
        } catch (error) {
            console.log(error.response.data);
            setLoading(false);
        }
    };

    useEffect(() => {
        handleDados();
    }, []);

    const editar = (certificado_id, usuario_id) => {
        navigation(`/alterar-certificado/${certificado_id}/${usuario_id}`);
    };

    const remove = async (certificado_id) => {
        // Exibir uma mensagem de confirmação
        const confirmDelete = window.confirm("Tem certeza de que deseja excluir este certificado? Esta ação não pode ser desfeita.");

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
            const response = await axios.delete(`${apiUrls.certificadosUrl}/${certificado_id}`, requestOptions);
            alert(response.data.retorno.mensagem);
            setLoading(false);
            handleDados();
        } catch (error) {
            console.log(error.response.data);
            alert(error.response.data.retorno.mensagem);
            setLoading(false);
            handleDados();
        }
    };

    if (loading) {
        return (
            <div>
                <p>carregando dados, aguarde...</p>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => navigation('/novo-certificado')} style={{ height: 50, width: 50, borderRadius: 50, border: 'none', cursor: 'pointer', position: 'fixed', bottom: 50, right: 50, fontSize: 25 }}>+</button>
            {certificados?.length > 0 ? (
                <table style={{ width: 1200, textAlign: "left", borderCollapse: 'collapse', border: 'solid 1px' }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>id</th>
                            <th style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>descricao</th>
                            <th style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>user</th>
                            <th style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>data_emissao</th>
                            <th style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>validade</th>
                            <th style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>status</th>
                            <th style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>upload</th>
                            <th style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>tipo</th>
                            <th style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificados?.map((item, index) => (
                            <tr key={item?.id} style={{ backgroundColor: index % 2 == 0 ? "#fff" : "#f2f2f2", color: "#000" }}>
                                <td style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>{item?.id}</td>
                                <td style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>{item?.descricao}</td>
                                <td style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>{item?.usuarios_nome}</td>
                                <td style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>{String(item?.data_emissao).substring(0, 10).split('-').reverse().join('/')}</td>
                                <td style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>{String(item?.validade).substring(0, 10).split('-').reverse().join('/')}</td>
                                <td style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>{item?.status === 0 && 'pendente'}{item?.status === 1 && 'aprovado'}{item?.status === 2 && 'rejeitado'}</td>
                                <td style={{ fontSize: 12, textAlign: 'center', padding: 5 }}>{String(item?.created_at).substring(0, 10).split('-').reverse().join('/')}</td>
                                <td style={{ fontSize: 12, textAlign: 'center', padding: 5 }}><a href={item?.s3_url} target="_blank" rel="noopener noreferrer">abrir</a></td>
                                <td style={{ padding: 5 }}>
                                    <button
                                        style={{
                                            padding: "5px 10px",
                                            border: "none",
                                            backgroundColor: "orange",
                                            color: "white",
                                            cursor: "pointer",
                                            borderRadius: "3px"
                                        }}
                                        onClick={() => null}
                                    >
                                        lançar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>nenhuma informação foi localizada</p>
            )}
        </div>
    );
};

export default ListarCertificados;
