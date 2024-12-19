const BASE_URL = `${process.env.REACT_APP_BASE_URL}`
// const BASE_URL = "http://3.21.12.205:3000"
export const apiUrls = {
    userUrl: `${BASE_URL}/usuario`,
    turmasUrl: `${BASE_URL}/turmas`,
    cursosUrl: `${BASE_URL}/cursos`,
    camposUrl: `${BASE_URL}/campos`,
    certificadosUrl: `${BASE_URL}/pdf`,
    loginAdmUrl: `${BASE_URL}/usuario/login/adm`,
    loginAlunoUrl: `${BASE_URL}/usuario/login/aluno`,
}