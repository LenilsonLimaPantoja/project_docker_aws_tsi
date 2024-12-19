import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../../../apiUrls";

function NovoCertificado() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();
    const [arquivo, setArquivo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [validade, setValidade] = useState('');

    const handleArquivo = (e) => {
        setArquivo(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!arquivo) {
            alert("Nenhum arquivo foi selecionado.");
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
            const response = await axios.post(apiUrls.certificadosUrl, formData, requestOptions);
            console.log(response.data);
            alert(response.data.retorno.mensagem)
            navigation(-1); // Descomente se necessário para redirecionar
            setLoading(false);
        } catch (error) {
            console.log(error.response?.data || error.message);
            setLoading(false);
            alert(error.response?.data?.retorno?.mensagem || "Erro ao enviar o arquivo.");
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
                <input defaultValue={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ padding: 10 }} type="text" name="descricao" placeholder="Descrição" required />
                <label style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 15, textAlign: 'left' }}>Data de Emissão</span>
                    <input defaultValue={dataEmissao} onChange={(e) => setDataEmissao(e.target.value)} style={{ padding: 10, maxWidth: '100%' }} type="date" name="data_emissao" required />
                </label>
                <label style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 15, textAlign: 'left' }}>Data de Validade</span>
                    <input defaultValue={validade} onChange={(e) => setValidade(e.target.value)} style={{ padding: 10, maxWidth: '100%' }} type="date" name="validade" required />
                </label>
                <label htmlFor="arquivo" style={{ backgroundColor: '#fff', borderRadius: 3, display: 'flex', padding: 10, cursor: 'pointer' }}>
                    <span style={{ color: '#000', fontSize: 15 }}>{arquivo.name || "seleione um arquivo"}</span>
                    <input
                        type="file"
                        id="arquivo"
                        placeholder="Selecione um arquivo"
                        style={{ padding: 10, display: 'none' }}
                        required
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

export default NovoCertificado;
