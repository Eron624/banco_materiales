window.addEventListener("load", () => 
{
    security();
    traerPublicaciones();
});

let usuario;
let nombre;

function security()
{
    let url = "../includes/php/dashboard.php";
    fetch(url)
        .then(respuesta => {
            return respuesta.json();
            //return respuesta.text();
        })
        .then(datos => {
            if (datos.error == 1) {
                window.location.href = "../index.html";
            }
            else {
                usuario = datos.usuario;
                nombre = datos.nombre;
            }
        })
        .catch(error => {
            console.log(error);
        });
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

function formatearFechaISO()
{
    const fecha = new Date();

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses 0-11
    const dia = String(fecha.getDate()).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minuto = String(fecha.getMinutes()).padStart(2, '0');
    const segundo = String(fecha.getSeconds()).padStart(2, '0');

    return `${año}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
}

async function agregarPublicacion(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    let titulo = document.getElementById("titulo").value;
    let descripcion = document.getElementById("descripcion").value;

    try {
        let urlImage = "";

        // Verificar si se seleccionó una imagen
        const imagenInput = document.getElementById("imagen");
        if (imagenInput.files.length > 0) {
            // Intentar subir la imagen solo si hay un archivo seleccionado
            urlImage = await subirFoto();
        } else {
        }

        let datos = {
            titulo: titulo,
            descripcion: descripcion,
            urlImage: urlImage, // Puede ser string vacío si no hay imagen
            fecha: formatearFechaISO(),
            usuario: usuario,
            nombre: nombre
        };

        let url = "../includes/php/subirPubli.php";
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(respuesta => respuesta.json())
            .then(datos => {
                // Limpiar el formulario después de subir
                document.getElementById("titulo").value = "";
                document.getElementById("descripcion").value = "";
                document.getElementById("imagen").value = "";

                // Quitar la vista previa si existe
                const preview = document.getElementById("preview");
                if (preview) {
                    preview.remove();
                }

                // Mostrar mensaje de éxito
                //alert("Publicación agregada exitosamente");
                traerPublicaciones();
            })
            .catch(error => {
                console.log("Error en fetch:", error);
                alert("Error al guardar la publicación");
            });

    } catch (error) {
        console.error("Error en agregarPublicacion:", error);
        alert("Error al procesar la publicación. " + error.message);
    }
}

function subirFoto() {
    return new Promise((resolve, reject) => {
        const apiKey = '2133fd0d3058780fade0da7cb3bcf6e6';
        const imageFile = document.getElementById("imagen").files[0];

        // Validar que se haya seleccionado una imagen (aunque esto ya se verifica antes)
        if (!imageFile) {
            resolve(""); // Si no hay imagen, resolvemos con string vacío
            return;
        }

        // Validar el tipo de archivo
        if (!imageFile.type.startsWith('image/')) {
            reject(new Error("El archivo seleccionado no es una imagen"));
            return;
        }

        const reader = new FileReader();

        reader.onload = async () => {
            try {
                // Eliminar el prefijo "data:image/jpeg;base64,"
                const base64Image = reader.result.split(',')[1];

                const formData = new FormData();
                formData.append('key', apiKey);
                formData.append('image', base64Image);

                const response = await fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    // Devolver la URL de visualización (display_url)
                    resolve(data.data.display_url);
                } else {
                    reject(new Error("Error al subir la imagen a imgbb"));
                }
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error("Error al leer el archivo"));
        };

        reader.readAsDataURL(imageFile);
    });
}

function traerPublicaciones()
{
    let url = "../includes/php/traerPubli.php";
    fetch(url)
        .then(respuesta => {
            return respuesta.json();
            //return respuesta.text();
        })
        .then(datos => {
            if (datos.error == 0) {
                generarPublicaciones(datos.data);
            }
            else {
                
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function generarPublicaciones(datos)
{
    let publicaciones = document.getElementById("publicaciones");
    publicaciones.innerHTML = ``;
    datos.forEach((item, index) =>
    {
        let publi = document.createElement("div");

        publi.innerHTML = `
        <div class="tarjeta">
            <div class="tarjeta-contenido">
                <div class="publicacion-encabezado" id="encabe${index}">
                    <h5 class="publicacion-titulo">${item.titulo}</h5>
                    <span class="estado estado-disponible">Disponible</span>
                </div>
                <div class="text-center">
                    <img src="${item.urlImage}" alt="" class"img-fluid rounded mx-auto d-block">
                </div>
                <p class="publicacion-descripcion">${item.descripcion}</p>
                    
                <div class="publicacion-metadata">
                    <small class="texto-secundario">Publicado ${item.fecha}</small><br>
                    <small class="texto-secundario">${item.nombre}</small>
                </div>
                    
                <h6 class="comentarios-titulo" id="cantidadComent${item.idPubli}"></h6>
                <ul class="lista-comentarios" id="listaComent${item.idPubli}">
                </ul>
                    
                <form class="formulario-comentario" id="formComent${item.idPubli}" onsubmit="event.preventDefault(); agregarComent(${item.idPubli});">
                    <div class="grupo-comentario">
                        <input type="text" class="campo-comentario" id="coment${item.idPubli}" placeholder="Escribe un comentario..." required maxlength="250">
                        <button class="boton boton-comentar" type="submit">Publicar</button>
                    </div>
                </form>
            </div>
        </div>`;
        publicaciones.appendChild(publi);

        let encabe = document.getElementById(`encabe${index}`);

        if (item.usuario == usuario) {
            let divBtnErase = document.createElement("div");

            divBtnErase.innerHTML = `<button class="btn btn-sm btn-outline-danger eliminar-btn" onclick="eliminarPubli(${item.idPubli})">
                        Eliminar
                    </button>`;

            encabe.appendChild(divBtnErase);
        }
        else {

        }

        traerComentarios(item.idPubli);
    });
}

function traerComentarios(idPubli) {
    idPubli = Number(idPubli);
    let datos = { idPubli: idPubli };
    let url = "../includes/php/traerComentarios.php";
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.error == 0) {
                generarComentarios(datos.data, idPubli);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function generarComentarios(datos, idPubli) {
    let cantidadComent = document.getElementById(`cantidadComent${idPubli}`);

    cantidadComent.textContent = `Comentarios (${datos.length})`;

    let listaComent = document.getElementById(`listaComent${idPubli}`);

    datos.forEach((item, index) => {
        let li = document.createElement("li");
        li.className = "comentario";
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center" id="divComent${item.idComent}">
                <strong>${item.primer_nombre} ${item.apell_pat}:</strong>
                <span class="small text-secondary">${item.fecha_coment}</span>
            </div>
            <div>${item.contenido}</div>
        `;
        listaComent.appendChild(li);

        let divComent = document.getElementById(`divComent${item.idComent}`);

        if (item.usuario == usuario) {
            let divBtnEraseComent = document.createElement("div");

            divBtnEraseComent.innerHTML = `<button class="btn btn-sm btn-outline-danger eliminar-btn" onclick="eliminarComentario(${item.idComent}, ${idPubli})">
                        Eliminar
                    </button>`;

            divComent.appendChild(divBtnEraseComent);
        }
        else {

        }
    });
}

function eliminarComentario(idComent, idPubli) {
    msg_5.showModal();
    let msg_eliminar = document.getElementById("msg_eliminar_5");
    let nuevoBoton = msg_eliminar.cloneNode(true);
    msg_eliminar.parentNode.replaceChild(nuevoBoton, msg_eliminar);
    msg_eliminar = nuevoBoton;

    let datos = { idComent: idComent };
    msg_eliminar.addEventListener("click", () => {
        msg_5.close();
        let url = "../includes/php/eliminar_comentario.php";
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(respuesta => respuesta.json())
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
                    right = 1;
                    msg_cuerpo_3.innerHTML = mensaje;
                    msg_titulo_3.innerHTML = 'ELIMINADO CORRECTAMENTE';
                    msg_3.showModal();

                    document.getElementById(`listaComent${idPubli}`).innerHTML = ``;
                    traerComentarios(idPubli);
                }
            })
            .catch(error => {
                console.log(error);
            });
    });
}

function eliminarPubli(idPubli) {
    msg_4.showModal();
    let msg_eliminar = document.getElementById("msg_eliminar");
    let nuevoBoton = msg_eliminar.cloneNode(true);
    msg_eliminar.parentNode.replaceChild(nuevoBoton, msg_eliminar);
    msg_eliminar = nuevoBoton;

    let datos = { idPubli: idPubli };
    msg_eliminar.addEventListener("click", () => {
        msg_4.close();
        let url = "../includes/php/eliminar_publicacion.php";
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(respuesta => respuesta.json())
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
                    right = 1;
                    msg_cuerpo_3.innerHTML = mensaje;
                    msg_titulo_3.innerHTML = 'ELIMINADA CORRECTAMENTE';
                    msg_3.showModal();

                    traerPublicaciones();
                }
            })
            .catch(error => {
                console.log(error);
            });
    });
}

function agregarComent(idPubli) {
    let contenido = document.getElementById(`coment${idPubli}`).value;

    let datos = {
        contenido: contenido,
        usuario: usuario,
        idPubli: idPubli,
        fecha_coment: formatearFechaISO()
    };
    let url = "../includes/php/subirComent.php";
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(respuesta => respuesta.json())
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
                msg_titulo_3.innerHTML = 'REGISTRADO CORRECTAMENTE';
                //msg_3.showModal();

                document.getElementById(`formComent${idPubli}`).reset();
                document.getElementById(`listaComent${idPubli}`).innerHTML = ``;
                traerComentarios(idPubli);
            }
        })
        .catch(error => {
            console.log(error);
        });
}