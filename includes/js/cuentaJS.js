let usuario;
let nombre;
let tipo_usr;
let contrase;
window.addEventListener("load", () =>
{
    security();
});

function security() {
    let url = "../includes/php/dashboard.php";
    fetch(url)
        .then(respuesta => {
            return respuesta.json();
        })
        .then(datos => {
            if (datos.error == 1) {
                window.location.href = "../index.html";
            }
            else {
                usuario = datos.usuario;
                nombre = datos.nombre;
                tipo_usr = datos.tipo_usr;

                datosUsuario(nombre, usuario);

                if (tipo_usr == 1) {
                    adminFunciones();
                }
                datosCuenta(usuario);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function datosUsuario(nombre, usuario) {
    let divCuenta = document.getElementById("divCuenta");

    let cuenta = document.createElement("div");
    cuenta.className = "text-white px-3 py-2 rounded";

    cuenta.innerHTML = `<h4 class="m-0 fs-6">Hola <a class="text-decoration-none text-reset enlace-usuario" href="cuenta.html">${nombre}, ${usuario}</a></h4>`;

    divCuenta.appendChild(cuenta);
}

function adminFunciones() {
    let ulNav = document.getElementById("ulNav");

    let li = document.createElement("li");
    li.className = "nav-item";

    li.innerHTML = `<a class="nav-link text-white" href="admin.html" id="admin-link">ADMINISTRAR</a>`;

    ulNav.appendChild(li);
}

function datosCuenta(usuario)
{
    let datos = {
        usuario: usuario
    };
    let url = "../includes/php/datosUsuario.php";
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(respuesta => {
            return respuesta.json();
        })
        .then(datos => {
            let error = datos.error;
            let mensaje = datos.mensaje;
            if (error == 1) {
                msg_cuerpo_3.innerHTML = mensaje;
                msg_titulo_3.innerHTML = 'ERROR 1';
                msg_3.showModal();
            }
            else if (error == 100) {
                msg_cuerpo_3.innerHTML = mensaje;
                msg_titulo_3.innerHTML = 'ERROR EN LA CONEXION';
                msg_3.showModal();
            }
            else if (error == 0) {
                ponerDatos(datos.data);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function ponerDatos(datosUsuario)
{
    document.getElementById("usuario").value = datosUsuario.usuario;
    document.getElementById("primer_nombre").value = datosUsuario.primer_nombre;
    document.getElementById("segundo_nombre").value = datosUsuario.segundo_nombre;
    document.getElementById("apell_pat").value = datosUsuario.apell_pat;
    document.getElementById("apell_mat").value = datosUsuario.apell_mat;
    document.getElementById("correo").value = datosUsuario.correo;
    document.getElementById("celular").value = datosUsuario.celular;
    contrase = datosUsuario.contrase;
}

function cambiarContrase()
{
    let contrase_anterior = document.getElementById("contrase_anterior").value.trim();
    let contrase_nueva = document.getElementById("contrase_nueva").value.trim();
    let contrase_repetida = document.getElementById("contrase_repetida").value.trim();
    
    if(contrase_anterior == contrase)
    {
        if(contrase_nueva == contrase_repetida)
        {
            let datos = {
                usuario: usuario,
                contrase: contrase_nueva
            };
            let url = "../includes/php/cambiarContrase.php";
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(datos),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(respuesta => {
                    return respuesta.json();
                })
                .then(datos => {
                    let error = datos.error;
                    let mensaje = datos.mensaje;
                    if (error == 1) {
                        msg_cuerpo_3.innerHTML = mensaje;
                        msg_titulo_3.innerHTML = 'ERROR 1';
                        msg_3.showModal();
                    }
                    else if (error == 100) {
                        msg_cuerpo_3.innerHTML = mensaje;
                        msg_titulo_3.innerHTML = 'ERROR EN LA CONEXION';
                        msg_3.showModal();
                    }
                    else if (error == 0) {
                        msg_cuerpo_3.innerHTML = mensaje;
                        msg_titulo_3.innerHTML = "MODIFICACIÓN CORRECTA";
                        msg_3.showModal();
                        document.getElementById("contrase_anterior").value = "";
                        document.getElementById("contrase_nueva").value = "";
                        document.getElementById("contrase_repetida").value = "";
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
        else
        {
            msg_cuerpo_3.innerHTML = `Las Nuevas Contraseñas No Coinciden<br>Prueba Otra Vez`;
            msg_titulo_3.innerHTML = "CONTRASEÑAS NO COINCIDEN";
            msg_3.showModal();
            document.getElementById("contrase_repetida").value = "";
        }
    }
    else
    {
        msg_cuerpo_3.innerHTML = "La Contraseña Ingresada No Coincide con la Contraseña Original";
        msg_titulo_3.innerHTML = "CONTRASEÑA NO COINCIDE";
        msg_3.showModal();
    }
}

function logout() {
    let cerrar = document.getElementById("msg_cerrar");
    let cancelar = document.getElementById("cancelar");
    msg.showModal();
    cerrar.addEventListener("click", () => {
        let urlCS = "../includes/php/cerrar_session.php";
        fetch(urlCS)
            .then(respuesta => {
                return respuesta.json();
            })
            .then(datos => {
                window.location.href = "../index.html";
            })
            .catch(error => {
                console.log(error);
            });
        msg.close();
    });

    cancelar.addEventListener("click", () => {
        msg.close();
    });
}

function mostrarInfo() {
    msg_titulo_3.innerHTML = "INFORMACIÓN DE BANCO DE MATERIALES";
    msg_cuerpo_3.innerHTML = `<p><strong>Banco de Materiales Escolares</strong> es una plataforma web diseñada para conectar a estudiantes del Instituto Tecnológico de Chihuahua II que desean donar, vender o intercambiar materiales escolares con aquellos que los necesitan.</p><p><strong>🎯 Objetivo:</strong><br> Promover el intercambio responsable de materiales escolares para optimizar recursos, reducir el desperdicio y fomentar una comunidad colaborativa dentro del plantel.</p><p><strong>📚 ¿Qué materiales puedes encontrar?</strong><br> Libros, calculadoras, equipo de laboratorio y otros recursos académicos en buen estado.</p><p><strong>🔧 Funcionalidades principales:</strong><br> • Registro con número de control y correo institucional<br> • Publicación de materiales (donar, vender o intercambiar)<br> • Feed de publicaciones con imágenes y descripciones<br> • Sistema de comentarios para preguntar sobre los materiales<br> • Cierre de sesión seguro</p><p><strong>🌱 Impacto esperado:</strong><br> Fomentar una cultura de sostenibilidad, solidaridad y ahorro económico entre los estudiantes, aprovechando al máximo los recursos disponibles.</p><p><strong>📱 Accesible desde cualquier navegador web</strong>, sin necesidad de descargar una aplicación móvil.</p><p><strong>📧 Contacto:</strong><br> Si tienes dudas, comentarios o sugerencias, puedes escribirnos a:<br> • <a href="mailto:LC20550585@chihuahua2.tecnm.mx?subject=Banco%20de%20Materiales%20Escolares&cc=L23550736@chihuahua2.tecnm.mx,L23550741@chihuahua2.tecnm.mx,L23550748@chihuahua2.tecnm.mx"
                    target="_blank" class="email-link">LC20550585@chihuahua2.tecnm.mx</a><br> • <a href="mailto:L23550736@chihuahua2.tecnm.mx?subject=Banco%20de%20Materiales%20Escolares&cc=LC20550585@chihuahua2.tecnm.mx,L23550741@chihuahua2.tecnm.mx,L23550748@chihuahua2.tecnm.mx"
                    target="_blank" class="email-link">L23550736@chihuahua2.tecnm.mx</a><br> • <a href="mailto:L23550741@chihuahua2.tecnm.mx?subject=Banco%20de%20Materiales%20Escolares&cc=L23550736@chihuahua2.tecnm.mx,LC20550585@chihuahua2.tecnm.mx,L23550748@chihuahua2.tecnm.mx"
                    target="_blank" class="email-link">L23550741@chihuahua2.tecnm.mx</a><br> • <a href="mailto:L23550748@chihuahua2.tecnm.mx?subject=Banco%20de%20Materiales%20Escolares&cc=L23550736@chihuahua2.tecnm.mx,L23550741@chihuahua2.tecnm.mx,LC20550585@chihuahua2.tecnm.mx"
                    target="_blank" class="email-link">L23550748@chihuahua2.tecnm.mx</a></p><p><em>Únete a la comunidad y dale una segunda vida a los materiales escolares. ¡Tu participación hace la diferencia!</em></p>`;
    msg_3.showModal();
}