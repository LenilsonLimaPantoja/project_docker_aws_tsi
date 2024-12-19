import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // Importando a biblioteca js-cookie
import { apiUrls } from '../../apiUrls';
import { alertaErro, alertaSucesso } from '../alertas/Alertas';

const LoginGoogle = ({ setLoading }) => {
  const navigation = useNavigate();

  const handleLogin = async (response) => {
    // Enviar o token do Google para o backend para validação
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);
      const result = await axios.post(apiUrls.loginAlunoUrl, { token: response.credential }, requestOptions);

      // Verifique se a resposta contém o token e armazene no cookie
      if (result.data?.retorno?.registros?.token) {
        // Armazenar o token no cookie com opções de segurança
        Cookies.set('token', result.data.retorno.registros.token, {
          expires: 7, // Expira em 7 dias
          secure: true, // Garante que o cookie seja enviado apenas via HTTPS
          sameSite: 'Strict', // Previne o envio do cookie em requisições de outros sites
        });
        alertaSucesso(result.data?.retorno?.mensagem);
        // setLoading(false);
        navigation('/home');
      } else {
        throw new Error("Token não encontrado na resposta.");
      }
    } catch (error) {
      setLoading(false);

      // Melhor tratamento de erros
      const errorMessage = error?.response?.data?.retorno?.mensagem || "Ocorreu um erro. Tente novamente mais tarde.";
      alertaErro(errorMessage);
      console.log(error);
    }
  }

  return (
    <GoogleLogin
      onSuccess={handleLogin}
      onError={() => {
        console.log('Login Failed');
        alertaErro('Login Falhou');
      }}
      shape='circle'
    />
  );
};

export default LoginGoogle;
