
import { useNavigate } from 'react-router-dom';
import HomeGlobal from '../../../global/home/HomeGlobal.js';
const Home = () => {
    const navigation = useNavigate();
    
    return (
        <div>
            <button onClick={() => navigation('/novo-user')} style={{ height: 50, width: 50, borderRadius: 50, border: 'none', cursor: 'pointer', position: 'fixed', bottom: 50, right: 50, fontSize: 25, backgroundColor: '#107321', color: '#fff' }}>+</button>
            <HomeGlobal tipo="adm / listagem de usuários"/>
        </div>
    )
}
export default Home;