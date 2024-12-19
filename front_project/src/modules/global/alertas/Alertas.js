import Swal from "sweetalert2";
export const alertaErro = (texto) => {
    Swal.fire({
        text: texto,
        icon: "error",
        className: 'alertas-cad-empresa',
        toast: true,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        width: 'auto',
        position: 'top-start',
        confirmButtonText: 'Cool'
    })
}
export const alertaSucesso = (texto) => {
    Swal.fire({
        text: texto,
        icon: "success",
        className: 'alertas-cad-empresa',
        toast: true,
        showConfirmButton: false,
        width: 'auto',
        timer: 4000,
        timerProgressBar: true,
        position: 'top-start',
        confirmButtonText: 'Cool'
    })
}