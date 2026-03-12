window.addEventListener("load", () => {
    verificarSesion();
});

function verificarSesion() {
    let cone = "./includes/php/verifIndex.php";
    fetch(cone)
        .then(respuesta => {
            //return respuesta.text();
            //console.log(respuesta);
            return respuesta.json();
            //return respuesta.text();
        })
        .then(datos => {
            //console.log(datos);
            let error = datos.error;
            let mensaje = datos.mensaje;

            if (error == 6) {
                msg_cuerpo_2.innerHTML = mensaje;
                msg_titulo_2.innerHTML = 'ERROR 6';
                msg_2.showModal();

                setTimeout(() => {
                    window.location = "/banco_materiales/modulos/dashboard.html";
                }, 2000);
            }
            else {

            }
        })
        .catch(error => {
            console.log(error);
            console.log(datos);
        });
}

function login()
{
    let usuario = document.getElementById("usuario").value;
    let contrase = document.getElementById("contrase").value;
    console.log(usuario);
    console.log(contrase);
    let datos = {
        usuario: usuario,
        contrase: contrase
    };
    let url = "./includes/php/login.php";
    fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                //'Content-Type': 'text/plain;charset=UTF-8'
                'Content-Type': 'application/json'
            }
        })
        .then(respuesta => {
            //return respuesta.text();
            //console.log(respuesta);
            return respuesta.json();
            //return respuesta.text();
        })
        .then(datos => {
            // console.log(datos.error);
            // console.log(datos.mensaje);
            let error = datos.error;
            let mensaje = datos.mensaje;

            console.log(error);

            if (error == 1) {
                msg_cuerpo.innerHTML = mensaje;
                msg_titulo.innerHTML = 'ERROR 1';
                msg.showModal();
            }
            else if (error == 2) {
                msg_cuerpo.innerHTML = mensaje;
                msg_titulo.innerHTML = 'ERROR 2';
                msg.showModal();
            }
            else if (error == 3) {
                msg_cuerpo.innerHTML = mensaje;
                msg_titulo.innerHTML = 'ERROR 3';
                msg.showModal();
            }
            else if (error == 4) {
                msg_cuerpo.innerHTML = mensaje;
                msg_titulo.innerHTML = 'ERROR 4';
                msg.showModal();
            }
            else if (error == 5) {
                msg_cuerpo.innerHTML = mensaje;
                msg_titulo.innerHTML = 'ERROR 5';
                msg.showModal();
            }
            else if (error == 6) {
                msg_cuerpo_2.innerHTML = mensaje;
                msg_titulo_2.innerHTML = 'ERROR 6';
                msg_2.showModal();
            }

            else if (error == 100) {
                msg_cuerpo.innerHTML = mensaje;
                msg_titulo.innerHTML = 'ERROR EN LA CONEXION';
                msg.showModal();
            }
            else if (error == 0) {
                //let nombre = datos.nombre;

                window.location = "/banco_materiales/modulos/dashboard.html";
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function registroNuevo() {
    let usuario = document.getElementById("user").value;
    usuario = parseInt(usuario);
    let contrase = document.getElementById("pass").value;
    let primer_nombre = document.getElementById("primer_nombre").value;
    let segundo_nombre = document.getElementById("segundo_nombre").value;
    let apell_pat = document.getElementById("apell_pat").value;
    let apell_mat = document.getElementById("apell_mat").value;
    let correo = document.getElementById("correo").value;
    let celular = document.getElementById("celular").value;

    datosNuevo =
    {
        usuario: usuario,
        contrase: contrase,
        primer_nombre: primer_nombre,
        segundo_nombre: segundo_nombre,
        apell_pat: apell_pat,
        apell_mat: apell_mat,
        correo: correo,
        celular: celular
    }

    let url = "./includes/php/registro.php";
    fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(datosNuevo),
            headers: {
                //'Content-Type': 'text/plain;charset=UTF-8'
                'Content-Type': 'application/json'
            }
        })
        .then(respuesta => {
            return respuesta.json();
            //return respuesta.text();
        })
        .then(datos => {
            let error = datos.error;
            let mensaje = datos.mensaje;
            let right = 0;
            if (error == 1) {
                msg_cuerpo_3.innerHTML = mensaje;
                msg_titulo_3.innerHTML = 'ERROR 1';
                msg_3.showModal();
            }
            else if (error == 2) {
                msg_cuerpo_3.innerHTML = mensaje;
                msg_titulo_3.innerHTML = 'ERROR 2';
                msg_3.showModal();
            }
            else if (error == 3) {
                msg_cuerpo_3.innerHTML = mensaje;
                msg_titulo_3.innerHTML = 'ERROR 3';
                msg_3.showModal();
            }

            else if (error == 100) {
                msg_cuerpo_3.innerHTML = mensaje;
                msg_titulo_3.innerHTML = 'ERROR EN LA CONEXION';
                msg_3.showModal();
            }
            else if (error == 0) {
                right = 1;
                msg_cuerpo_3.innerHTML = mensaje;
                msg_titulo_3.innerHTML = 'REGISTRO CORRECTO';
                msg_3.showModal();
            }

            msg_cerrar_3.addEventListener("click", () => {
                if (right == 1) {
                    setTimeout(() => {
                        location.reload();
                    }, 100);
                }
                else {
                    msg_3.close();
                }
            });
        })
        .catch(error => {
            console.log(error);
        });
}