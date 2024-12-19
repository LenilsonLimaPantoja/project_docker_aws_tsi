import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrls } from "../../../../apiUrls";

function AlterarCertificado() {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();
    const [certificado, setCertificado] = useState({});
    const [arquivo, setArquivo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [validade, setValidade] = useState('');

    const handleCertificado = async () => {
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            };

            const response = await axios.get(`${apiUrls.certificadosUrl}/${params.certificado_id}/${params.usuario_id}`, requestOptions);

            setCertificado(response.data.registros[0]);
            setDescricao(response.data.registros[0]?.descricao || '');
            setDataEmissao(response.data.registros[0]?.data_emissao?.substring(0, 10) || '');
            setValidade(response.data.registros[0]?.validade?.substring(0, 10) || '');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(error.response?.data?.retorno?.mensagem || "Erro ao carregar o certificado.");
            navigation(`/lista-certificados/${params?.usuario_id}`);
        }
    };

    useEffect(() => {
        handleCertificado();
    }, [params.certificado_id, params.usuario_id]);

    const handleArquivo = (e) => {
        setArquivo(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!arquivo || !descricao || !dataEmissao || !validade) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        const formData = new FormData();
        formData.append("file", arquivo);
        formData.append("descricao", descricao);
        formData.append("data_emissao", dataEmissao);
        formData.append("validade", validade);

        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                },
                withCredentials: true
            };
            const response = await axios.put(`${apiUrls.certificadosUrl}/${params.certificado_id}`, formData, requestOptions);
            alert(response.data.retorno.mensagem);
            setArquivo(''); // Limpa o arquivo após o envio
            navigation(-1); // Redireciona para a página anterior
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(error.response?.data?.retorno?.mensagem || "Erro ao enviar o arquivo.");
            setArquivo(''); // Limpa o arquivo em caso de erro
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
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', rowGap: 10, width: 500 }}>
                <input value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ padding: 10 }} type="text" name="descricao" placeholder="Descrição" required />
                <label style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 15, textAlign: 'left' }}>Data de Emissão</span>
                    <input value={dataEmissao} onChange={(e) => setDataEmissao(e.target.value)} style={{ padding: 10, maxWidth: '100%' }} type="date" name="data_emissao" required />
                </label>
                <label style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 15, textAlign: 'left' }}>Data de Validade</span>
                    <input value={validade} onChange={(e) => setValidade(e.target.value)} style={{ padding: 10, maxWidth: '100%' }} type="date" name="validade" required />
                </label>
                <label htmlFor="arquivo" style={{ backgroundColor: '#fff', borderRadius: 3, display: 'flex', padding: 10, cursor: 'pointer' }}>
                    <span style={{ color: '#000', fontSize: 15 }}>{arquivo.name || "Selecione um arquivo"}</span>
                    <input
                        type="file"
                        id="arquivo"
                        placeholder="Selecione um arquivo"
                        style={{ padding: 10, display: 'none' }}
                        onChange={handleArquivo}
                        name="arquivo"
                        accept="application/pdf"
                    />
                </label>
                <input type="submit" value="Enviar" style={{ padding: 10 }} />
            </form>
        </div>
    );
}

export default AlterarCertificado;
