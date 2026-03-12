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
                //return respuesta.text();
                //console.log(respuesta);
                return respuesta.json();
                //return respuesta.text();
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
            //console.log("No se seleccionó imagen, se guardará solo texto");
        }

        let datos = {
            titulo: titulo,
            descripcion: descripcion,
            urlImage: urlImage, // Puede ser string vacío si no hay imagen
            fecha: formatearFechaISO(),
            usuario: usuario,
            nombre: nombre
        };

        //console.log("Enviando datos:", datos);

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
                console.log(datos);

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
                console.log(datos.data);
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
                <div class="publicacion-encabezado">
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
                    
                <h6 class="comentarios-titulo">Comentarios (0)</h6>
                <ul class="lista-comentarios">
                </ul>
                    
                <form class="formulario-comentario">
                    <div class="grupo-comentario">
                        <input type="text" class="campo-comentario" placeholder="Escribe un comentario..." required>
                        <button class="boton boton-comentar" type="submit">Publicar</button>
                    </div>
                </form>
            </div>
        </div>`;

        publicaciones.appendChild(publi);
    });
}