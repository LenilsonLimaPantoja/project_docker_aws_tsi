import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import AlterarUser from "../pages/alterar/user/AlterarUser";
import NovoUser from "../pages/novo/usuario/NovoUser";
import ListarCertificados from "../pages/lista/certificados/ListarCertificados";
import NovoCertificado from "../pages/novo/certificado/NovoCertificado";
import AlterarCertificado from "../pages/alterar/certificado/AlterarCertificado";
import NotFound from "../components/NotFound";
import Login from "../../global/login/Login";
import ListarTurmas from "../pages/lista/turmas/ListarTurmas";
import ListarCursos from "../pages/lista/cursos/ListarCursos";
import ListarCampos from "../pages/lista/campos/ListarCampos";
import NovoCampos from "../pages/novo/campos/NovoCampos";
import AlterarCampos from "../pages/alterar/campos/AlterarCampos";
import NovoCurso from "../pages/novo/curso/NovoCurso";
import AlterarCurso from "../pages/alterar/curso/AlterarCurso";
import NovaTurma from "../pages/novo/turma/NovaTurma";
import AlterarTurma from "../pages/alterar/turma/AlterarTurma";
import Cookies from 'js-cookie'; // Importando js-cookie para manipulação de cookies

// Componente para proteger rotas
function ProtectedRoute({ children }) {
    const token = Cookies.get("token"); // Usando js-cookie para obter o token
    return token ? children : <Navigate to="/" />;
}

// Rota inicial dinâmica
function InitialRoute() {
    const token = Cookies.get("token"); // Usando js-cookie para verificar se o token está presente
    return token ? <ProtectedRoute><Navigate to="/home" /></ProtectedRoute> : <Login />;
}

export default function AdmRotas() {
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
                path="/campos/update/:campos_id"
                element={
                    <ProtectedRoute>
                        <AlterarCampos />
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
                path="/usuario/create"
                element={<NovoUser />}
            />
            <Route
                path="/campos/create"
                element={<NovoCampos />}
            />
            <Route
                path="/curso/create"
                element={<NovoCurso />}
            />
            <Route
                path="/curso/update/:curso_id"
                element={<AlterarCurso />}
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
            <Route
                path="/turma/read"
                element={
                    <ProtectedRoute>
                        <ListarTurmas />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/turma/create"
                element={
                    <ProtectedRoute>
                        <NovaTurma />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/turma/update/:turma_id"
                element={
                    <ProtectedRoute>
                        <AlterarTurma />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/curso/read"
                element={
                    <ProtectedRoute>
                        <ListarCursos />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/campos/read"
                element={
                    <ProtectedRoute>
                        <ListarCampos />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
