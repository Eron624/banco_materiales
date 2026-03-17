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
                todasLasPublicaciones = datos.data;
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
        let col = document.createElement("div");
        col.className = "col-12";

        let publi = document.createElement("div");
        publi.className = "card shadow-sm h-100";

        publi.innerHTML = `
        <div class="tarjeta">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3" id="encabe${index}">
                    <h5 class="card-title h5 mb-0">${item.titulo}</h5>
                    <span class="badge estado-disponible">Disponible</span>
                </div>

                ${item.urlImage ? `
                <div class="text-center mb-3">
                    <img src="${item.urlImage}" class="img-fluid rounded" style="max-height: 300px; object-fit: contain;" alt="${item.titulo}">
                </div>
                ` : ''}
                <p class="card-text text-secondary">${item.descripcion}</p>
                    
                <div class="text-secondary small mb-3">
                    <div>Publicado ${item.fecha}</div>
                    <div class="fw-semibold">${item.nombre}</div>
                </div>
                    
                <h6 class="text-success fw-semibold mt-3 mb-2" id="cantidadComent${item.idPubli}"></h6>
                <ul class="list-unstyled" id="listaComent${item.idPubli}">
                </ul>
                    
                <form class="mt-3" id="formComent${item.idPubli}" onsubmit="event.preventDefault(); agregarComent(${item.idPubli});">
                    <div class="input-group">
                        <input type="text" class="form-control" id="coment${item.idPubli}" placeholder="Escribe un comentario..." required maxlength="250">
                        <button class="btn btn-secondary" type="submit">Publicar</button>
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
    listaComent.innerHTML = '';

    datos.forEach((item, index) => {
        let li = document.createElement("li");
        li.className = "comentario mb-2";
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center" id="divComent${item.idComent}">
                <div class="flex-gow-1">
                    <div class="d-flex justify-content-between align-items-center">
                        <strong>${item.primer_nombre} ${item.apell_pat}:</strong>
                        <span class="small text-secondary">${item.fecha_coment}</span>
                    </div>
                    <div class="mt-1">${item.contenido}</div>
                </div>
            </div>
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

                    eliminarComentariosPubli(idPubli);
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

function eliminarComentariosPubli(idPubli) {
    idPubli = Number(idPubli);
    let datos = { idPubli: idPubli };
    let url = "../includes/php/eliminar_ComentPubli.php";
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

            }
            else if (datos.error == 100) {
                msg_cuerpo_3.innerHTML = mensaje;
                msg_titulo_3.innerHTML = 'ERROR EN LA CONEXION';
                msg_3.showModal();
            }
            else if (datos.error == 1) {
                msg_cuerpo_3.innerHTML = mensaje;
                msg_titulo_3.innerHTML = 'ERROR 1';
                msg_3.showModal();
            }
        })
        .catch(error => {
            console.log(error);
        });
}

let todasLasPublicaciones = [];

function normalizarTexto(texto) {
    return texto.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function buscarMateriales() {
    let textoBusqueda = document.getElementById('busqueda').value.trim();
    let textoNormalizado = normalizarTexto(textoBusqueda);
    let divResultado = document.getElementById('resultadoBusqueda');

    if (textoBusqueda === '') {
        generarPublicaciones(todasLasPublicaciones);
        divResultado.innerHTML = '';
        return;
    }

    let resultados = todasLasPublicaciones.filter(publicacion => {
        let tituloNorm = normalizarTexto(publicacion.titulo);
        let descripcionNorm = normalizarTexto(publicacion.descripcion);
        let nombreNorm = normalizarTexto(publicacion.nombre);

        return tituloNorm.includes(textoNormalizado) ||
            descripcionNorm.includes(textoNormalizado) ||
            nombreNorm.includes(textoNormalizado);
    });

    if (resultados.length > 0) {
        generarPublicaciones(resultados);
        divResultado.innerHTML = `Se encontraron ${resultados.length} resultado(s) para "${textoBusqueda}"`;
    } else {
        let publicacionesDiv = document.getElementById('publicaciones');
        publicacionesDiv.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="bi bi-search" style="font-size: 2.5rem; color: #ccc;"></i>
                    <p class="mt-3 text-muted">No se encontraron materiales para "${textoBusqueda}"</p>
                    <button class="btn btn-outline-success btn-sm mt-2" onclick="limpiarBusqueda()">
                        Ver todos los materiales
                    </button>
                </div>
            </div>
        `;
        divResultado.innerHTML = '';
    }
}

function limpiarBusqueda() {
    document.getElementById('busqueda').value = '';
    document.getElementById('resultadoBusqueda').innerHTML = '';
    generarPublicaciones(todasLasPublicaciones);
}