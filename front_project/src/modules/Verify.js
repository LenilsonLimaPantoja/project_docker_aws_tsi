import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ContextGlobal } from '../context/GlobalContext';
import AlunoRotas from '../modules/aluno/routes/AlunoRotas';
import AdmRotas from '../modules/administrador/routes/AdmRotas';
import { jwtDecode } from "jwt-decode";
import './Veryfi.scss';
const HeaderNavigation = ({ tipo, onLogout, onNavigate, usuario_id }) => {
    const adminButtons = [
        { label: 'Home', path: '/home' },
        { label: 'Turmas', path: '/turma/read' },
        { label: 'Cursos', path: '/curso/read' },
        { label: 'Campos', path: '/campos/read' },
        { label: 'Perfil', path: '/home' },
    ];

    const commonButtons = [
        { label: 'Home', path: '/home' },
        { label: 'Certificados', path: `/certificado/read/${usuario_id}` },
        { label: 'Perfil', path: '/home' },
    ];

    const buttons = tipo === 1 ? adminButtons : commonButtons;

    return (
        <ul style={{ display: 'flex', columnGap: 15, listStyle: 'none', color: '#83c483', padding: 5 }}>
            {buttons.map((btn, index) => (
                <li style={{ cursor: 'pointer' }}><a style={{ color: '#83c483', fontSize: 14 }} onClick={() => onNavigate(btn.path)}>{btn.label}</a></li>
            ))}
            <li style={{ cursor: 'pointer' }}><a style={{ color: '#83c483', fontSize: 14 }} onClick={onLogout}>Sair</a></li>
        </ul>
    );
};

const Verify = () => {
    const [decoded, setDecoded] = useState({});
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigation = useNavigate();
    const { campos, setCamposId, camposId, registrosPorPagina, setRegistrosPorPagina } = useContext(ContextGlobal);

    const handleLogout = () => {
        Cookies.remove('token');
        navigation('/');
    };

    const decodeJwt = () => {
        const token = Cookies.get('token');
        if (token) {
            try {
                setLoading(true);
                const decodedData = jwtDecode(token);
                setDecoded(decodedData);
            } catch (error) {
                console.error("Erro ao decodificar token:", error);
                setDecoded({ tipo: 0 });
            } finally {
                setLoading(false);
            }
        } else {
            setDecoded({ tipo: 0 });
        }
    };

    useEffect(() => {
        decodeJwt();
    }, [location]);

    if (loading) {
        return <p>Validando credenciais, aguarde...</p>;
    }

    return (
        <div className='container-verify'>
            <div className="header-topo">
                <div className='area-header-topo'>
                    <p>Instituto Federal de Mato Grosso do Sul</p>
                    <span>Gerenciemanto de Atividade Complementares</span>
                </div>
                <div className='verify-filter'>
                    <div className='verify-filter-area'>
                        {decoded?.tipo === 1 && (
                            <>
                                <select onChange={(e) => setCamposId(e.target.value)} value={camposId}>
                                    <option>- selecione um campos -</option>
                                    {campos?.map((item) => (
                                        <option value={item?.id} key={item?.id}>{item.nome}</option>
                                    ))}
                                </select>
                                <select onChange={(e) => setRegistrosPorPagina(e.target.value)} value={registrosPorPagina} className='select-qtd-registros'>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="200">200</option>
                                    <option value="300">300</option>
                                </select>
                            </>
                        )}
                    </div>
                    {Cookies.get('token') && (
                        <HeaderNavigation
                        usuario_id={decoded?.usuario_id}
                            tipo={decoded?.tipo}
                            onLogout={handleLogout}
                            onNavigate={(path) => navigation(path)}
                        />
                    )}
                </div>
            </div>



            <div className='area-verify'>
                {decoded?.tipo === 1 ? (
                    <>

                        <AdmRotas />
                    </>
                ) : (
                    <AlunoRotas />
                )}
            </div>
        </div >
    );
};

export default Verify;
