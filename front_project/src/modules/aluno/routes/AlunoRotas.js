import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../../global/login/Login";
import Home from "../pages/home/Home";
import AlterarUser from "../pages/alterar/user/AlterarUser";
import ListarCertificados from "../pages/lista/certificados/ListarCertificados";
import NovoCertificado from "../pages/novo/certificado/NovoCertificado";
import AlterarCertificado from "../pages/alterar/certificado/AlterarCertificado";
import NotFound from "../components/NotFound";
import Cookies from "js-cookie";  // Importando a biblioteca js-cookie

// Componente para proteger rotas
function ProtectedRoute({ children }) {
    const token = Cookies.get("token");  // Verificando o token no cookie
    return token ? children : <Navigate to="/" />;  // Se houver token, permite o acesso à rota
}

// Rota inicial dinâmica
function InitialRoute() {
    const token = Cookies.get("token");  // Verificando o token no cookie
    return token ? <ProtectedRoute><Navigate to="/home" /></ProtectedRoute> : <Login />;
}

export default function AlunoRotas() {
    return (
        <Routes>
            {/* Rota pública */}
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<InitialRoute />} />

            {/* Rotas protegidas */}
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/usuario/update/:usuario_id"
                element={
                    <ProtectedRoute>
                        <AlterarUser />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/certificado/update/:certificado_id/:usuario_id"
                element={
                    <ProtectedRoute>
                        <AlterarCertificado />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/certificado/read/:usuario_id"
                element={
                    <ProtectedRoute>
                        <ListarCertificados />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/certificado/create"
                element={
                    <ProtectedRoute>
                        <NovoCertificado />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
