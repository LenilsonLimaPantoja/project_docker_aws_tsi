import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginGoogle from "./LoginGoogle";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Cookies from 'js-cookie'; // Importando a biblioteca para manipular cookies
import { apiUrls } from "../../apiUrls";
import './Login.scss'
import { alertaErro, alertaSucesso } from '../../global/alertas/Alertas.js';
import DescriptionHeader from "../descriptionHeader/DescriptionHeader.js";
import Loading from "../loading/Loading.js";
const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);

        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            setLoading(true);
            const response = await axios.post(apiUrls.loginAdmUrl, formValues, requestOptions);

            // Armazenar o token no cookie
            Cookies.set('token', response.data.retorno.registros.token, { expires: 2, secure: true, sameSite: 'Strict' });

            // Redirecionar para a página inicial
            alertaSucesso(response.data.retorno.mensagem);
            navigation('/home');
            // setLoading(false);

        } catch (error) {
            setLoading(false);
            console.log(error.response.data);
            alertaErro(error.response.data.retorno.mensagem);
        }
    };

    if (loading) {
        return (
            <Loading/>
        );
    }

    return (
        <div className="body-login">
            <div className="container-login">
                <div className="area-login">
                    <DescriptionHeader descricao="Autenticação de acesso - Administrativo"/>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">
                            <apan>Email</apan>
                            <input type="email" id="email" required name="email" />
                        </label>
                        <label htmlFor="senha">
                            <apan>Senha</apan>
                            <input type="password" id="senha" name="senha" />
                        </label>
                        <input type="submit" className="btn" value="Entrar" />
                    </form>
                    <DescriptionHeader descricao="Autenticação de acesso - Estudante"/>
                    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} >
                        <LoginGoogle setLoading={setLoading} />
                    </GoogleOAuthProvider>
                </div>
            </div>
        </div>
    );
};

export default Login;
