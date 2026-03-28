window.addEventListener("load", () => {
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
            else if (datos.tipo_usr != 1) {
                window.location.href = "../modulos/dashboard.html"
            }
            else {
                usuario = datos.usuario;
                nombre = datos.nombre;
                tipo_usr = datos.tipo_usr;

                datosUsuario(nombre, usuario);
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

function buscarUsuario() {
    let busqueda = document.getElementById("busqueda").value;
    let datos = { busqueda: busqueda };

    let url = "../includes/php/traerUsuarios.php";
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
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
                updateUsuarios(datos.data);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function actualizarContadorResultados(cantidad) {
    let numBusqueda = document.getElementById("numBusqueda");
    if (numBusqueda) {
        if (cantidad === 0) {
            numBusqueda.innerHTML = '';
        } else if (cantidad === 1) {
            numBusqueda.innerHTML = `Se encontró ${cantidad} resultado`;
        } else {
            numBusqueda.innerHTML = `Se encontraron ${cantidad} resultados`;
        }
    }
}

function updateUsuarios(usuariosBusqueda) {
    let contenido = document.getElementById("contenido");
    contenido.innerHTML = '';

    if (!usuariosBusqueda || usuariosBusqueda.length === 0) {
        contenido.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center" role="alert">
                    No se encontraron usuarios con el criterio de búsqueda.
                </div>
            </div>
        `;
        actualizarContadorResultados(0);
        return;
    }

    actualizarContadorResultados(usuariosBusqueda.length);

    let div = document.createElement("div");
    div.className = "container mt-4";

    let html = '';

    usuariosBusqueda.forEach(usuario => {
        html += `
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6">
                    <div class="card shadow-sm mb-4">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0">Editar Usuario: ${usuario.usuario}</h5>
                        </div>
                        <div class="card-body">
                            <form id="form-${usuario.usuario}" data-usuario='${JSON.stringify(usuario)}'>
                                <div class="mb-3">
                                    <label class="form-label fw-bold">Usuario</label>
                                    <input type="text" class="form-control" value="${usuario.usuario}" readonly>
                                </div>
                                
                                <!-- Nombres y Apellidos -->
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label fw-bold">Primer Nombre</label>
                                        <input type="text" class="form-control" name="primer_nombre" value="${usuario.primer_nombre || ''}">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label fw-bold">Segundo Nombre</label>
                                        <input type="text" class="form-control" name="segundo_nombre" value="${usuario.segundo_nombre || ''}">
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label fw-bold">Apellido Paterno</label>
                                        <input type="text" class="form-control" name="apell_pat" value="${usuario.apell_pat || ''}">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label fw-bold">Apellido Materno</label>
                                        <input type="text" class="form-control" name="apell_mat" value="${usuario.apell_mat || ''}">
                                    </div>
                                </div>
                                
                                <!-- Correo y Celular -->
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label fw-bold">Correo</label>
                                        <input type="email" class="form-control" name="correo" value="${usuario.correo || ''}" required pattern=".*@chihuahua2\.tecnm\.mx$" title="El correo debe terminar en @chihuahua2.tecnm.mx" readonly>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label fw-bold">Celular</label>
                                        <input type="tel" class="form-control" name="celular" value="${usuario.celular || ''}">
                                    </div>
                                </div>
                                
                                <!-- Contraseña (requiere contraseña anterior) -->
                                <div class="mb-3">
                                    <label class="form-label fw-bold">Cambiar Contraseña</label>
                                    <!-- <input type="password" class="form-control mb-2" name="contraseña_anterior" placeholder="Contraseña anterior"> -->
                                    <input type="password" class="form-control" name="contraseña_nueva" placeholder="Contraseña nueva">
                                    <small class="text-muted">Dejar en blanco para no cambiar</small>
                                </div>
                                
                                <!-- Estado (Activo/Inactivo) - Botón toggle -->
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold">Estado</label>
                                        <div>
                                            <button type="button" class="btn ${usuario.flag == 1 ? 'btn-success' : 'btn-danger'}" 
                                                    onclick="toggleEstado(this, '${usuario.usuario}')">
                                                ${usuario.flag == 1 ? 'Activo' : 'Inactivo'}
                                            </button>
                                            <input type="hidden" name="flag" value="${usuario.flag}">
                                        </div>
                                        <small class="text-muted">Al cambiar estado, intentos se reinician a 0</small>
                                    </div>
                                    
                                    <!-- Intentos (solo lectura) -->
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold">Intentos</label>
                                        <input type="text" name="ctrl_intentos" id="intentos${usuario.usuario}" class="form-control" value="${usuario.ctrl_intentos || 0}" readonly>
                                    </div>
                                </div>
                                
                                <!-- Tipo de Usuario - Botón toggle -->
                                <div class="mb-3">
                                    <label class="form-label fw-bold">Tipo de Usuario</label>
                                    <div>
                                        <button type="button" class="btn ${usuario.tipo_usr == 1 ? 'btn-primary' : 'btn-secondary'}" 
                                                onclick="toggleTipoUsuario(this, '${usuario.usuario}')">
                                            ${usuario.tipo_usr == 1 ? 'Administrador' : 'Usuario'}
                                        </button>
                                        <input type="hidden" name="tipo_usr" value="${usuario.tipo_usr}">
                                    </div>
                                </div>
                                
                                <!-- Botones de acción -->
                                <div class="d-flex gap-2 justify-content-end mt-4">
                                    <button type="button" class="btn btn-secondary" onclick="buscarUsuario()">Cancelar</button>
                                    <button type="submit" class="btn btn-success">Guardar Cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    div.innerHTML = html;
    contenido.appendChild(div);

    usuariosBusqueda.forEach(usuario => {
        const form = document.getElementById(`form-${usuario.usuario}`);
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const usuarioData = JSON.parse(this.dataset.usuario);
                modificarDatos(usuarioData.usuario);
            });
        }
    });
}

function modificarDatos(usuarioObj) {
    let nombreUsuario = typeof usuarioObj === 'object' ? usuarioObj.usuario : usuarioObj;
    let form = document.getElementById(`form-${nombreUsuario}`);
    if (!form) {
        console.error("Formulario no encontrado para:", nombreUsuario);
        return;
    }

    let formData = {
        usuario: nombreUsuario,
        primer_nombre: form.querySelector('[name="primer_nombre"]').value,
        segundo_nombre: form.querySelector('[name="segundo_nombre"]').value,
        apell_pat: form.querySelector('[name="apell_pat"]').value,
        apell_mat: form.querySelector('[name="apell_mat"]').value,
        correo: form.querySelector('[name="correo"]').value,
        celular: form.querySelector('[name="celular"]').value,
        //contrasena_anterior: form.querySelector('[name="contraseña_anterior"]').value,
        contrase: form.querySelector('[name="contraseña_nueva"]').value.trim(),
        flag: form.querySelector('[name="flag"]').value,
        tipo_usr: form.querySelector('[name="tipo_usr"]').value,
        ctrl_intentos: form.querySelector('[name="ctrl_intentos"]').value
    };

    let formDataUsuario = {
        usuario: nombreUsuario
    };

    let url = "../includes/php/verificacion.php";
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(formDataUsuario),
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
            else if (error == 2) {
                msg_cuerpo_3.innerHTML = mensaje;
                msg_titulo_3.innerHTML = 'ERROR 2';
                msg_3.showModal();
            }
            else if (error == 100) {
                msg_cuerpo_3.innerHTML = mensaje;
                msg_titulo_3.innerHTML = 'ERROR EN LA CONEXION';
                msg_3.showModal();
            }
            else if (error == 0) {
                fetchModificacion(datos.data.contrase, datos.data.flag, formData);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function fetchModificacion(contrase, flag, formData) {
    let datos = formData;

    if (formData.contrase == "") {
        datos['contrase'] = contrase;
    }

    if (formData.flag == 1 && flag == 0) {
        datos['ctrl_intentos'] = 0;
    }

    let url = "../includes/php/modificarUsuario.php";
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
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
                msg_titulo_3.innerHTML = 'MODIFIACIÓN EXITOSA';
                msg_3.showModal();
                buscarUsuario();
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function toggleEstado(boton, usuario) {
    msg_titulo_2.innerHTML = "¿ACTIVAR/DESACTIVAR USUARIO?";
    msg_cuerpo_2.innerHTML = "Estás seguro de activar/desactivar este usuario?";
    msg_validar_2.innerHTML = "ACTIVAR/DESACTIVAR USUARIO";
    msg_2.showModal();

    // Remover listeners anteriores (opcional pero recomendado)
    const newConfirmListener = () => {
        // Alternar entre 1 (Activo) y 0 (Inactivo)
        let nuevoValor = boton.textContent.includes('Activo') ? 0 : 1;

        // Actualizar el campo oculto
        let inputHidden = boton.parentElement.querySelector('input[name="flag"]');
        inputHidden.value = nuevoValor;

        // Cambiar apariencia y texto del botón
        if (nuevoValor == 1) {
            boton.textContent = 'Activo';
            boton.classList.remove('btn-danger');
            boton.classList.add('btn-success');
        } else {
            boton.textContent = 'Inactivo';
            boton.classList.remove('btn-success');
            boton.classList.add('btn-danger');
        }
        msg_2.close();
    };

    const newCancelListener = () => {
        msg_2.close();
    };

    // Usar { once: true } para que se ejecuten solo una vez
    msg_validar_2.addEventListener("click", newConfirmListener, { once: true });
    cancelar_2.addEventListener("click", newCancelListener, { once: true });
}

function toggleTipoUsuario(boton, usuario) {
    msg_titulo_4.innerHTML = "¿CAMBIAR PRIVILEGIOS?";
    msg_cuerpo_4.innerHTML = "Estás seguro de cambiar los privilegios?";
    msg_validar_4.innerHTML = "CAMBIAR TIPO";
    msg_4.showModal();

    const newConfirmListener = () => {
        // Alternar entre 1 y 0
        let nuevoValor = boton.textContent.includes('Administrador') ? 0 : 1;

        // Actualizar el campo oculto
        let inputHidden = boton.parentElement.querySelector('input[name="tipo_usr"]');
        inputHidden.value = nuevoValor;

        // Cambiar apariencia y texto del botón
        if (nuevoValor == 1) {
            boton.textContent = 'Administrador';
            boton.classList.remove('btn-secondary');
            boton.classList.add('btn-primary');
        } else {
            boton.textContent = 'Usuario';
            boton.classList.remove('btn-primary');
            boton.classList.add('btn-secondary');
        }
        msg_4.close();
    };

    const newCancelListener = () => {
        msg_4.close();
    };

    // Usar { once: true } para que se ejecuten solo una vez
    msg_validar_4.addEventListener("click", newConfirmListener, { once: true });
    cancelar_4.addEventListener("click", newCancelListener, { once: true });
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