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

    cuenta.innerHTML = `<h4 class="m-0 fs-6">Hola ${nombre}, ${usuario}</h4>`;

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
    let datos = {busqueda: busqueda};

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

function updateUsuarios(usuariosBusqueda)
{
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
        return;
    }

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
                            <form id="form-${usuario.usuario}" onsubmit="event.preventDefault();">
                                <!-- Usuario (solo lectura) -->
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
                                        <input type="email" class="form-control" name="correo" value="${usuario.correo || ''}" required pattern=".*@chihuahua2\.tecnm\.mx$" title="El correo debe terminar en @chihuahua2.tecnm.mx">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label fw-bold">Celular</label>
                                        <input type="tel" class="form-control" name="celular" value="${usuario.celular || ''}">
                                    </div>
                                </div>
                                
                                <!-- Contraseña (requiere contraseña anterior) -->
                                <div class="mb-3">
                                    <label class="form-label fw-bold">Cambiar Contraseña</label>
                                    <input type="password" class="form-control mb-2" name="contraseña_anterior" placeholder="Contraseña anterior">
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
                                        <input type="text" class="form-control" value="${usuario.ctrl_intentos || 0}" readonly>
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
                                    <button type="button" class="btn btn-secondary" onclick="cancelarEdicion('${usuario.usuario}')">Cancelar</button>
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
}