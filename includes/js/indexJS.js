window.addEventListener("load", () => {

});

function login()
{
    console.log("Hola");
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

                window.location = "/modulos/dashboard.html";
            }
        })
        .catch(error => {
            console.log(error);
        });
}