let unidades = 1;
let carrito = [];

// Recupera el carrito guardado.
try {
    const guardado = JSON.parse(
        localStorage.getItem("carritoOptiStyle")
    );

    if (Array.isArray(guardado)) {
        carrito = guardado.filter(function(producto) {
            return producto &&
                typeof producto.nombre === "string" &&
                Number.isFinite(producto.precio) &&
                producto.precio >= 0 &&
                Number.isInteger(producto.cantidad) &&
                producto.cantidad > 0;
        });
    }
} catch (error) {
    console.warn("No se pudo recuperar el carrito.", error);
}

const botonAgregar = document.getElementById("botonAgregar");

// Cambia la cantidad en la página del producto.
function cambiarCantidad(cambio) {
    if (!botonAgregar) return;

    unidades = Math.max(1, unidades + cambio);

    const precio = Number(botonAgregar.dataset.precio);

    escribirTexto("cantidadProducto", unidades);
    escribirTexto("subtotalProducto", (unidades * precio).toFixed(2));
}

function agregarAlCarrito(nombre, precio, cantidad = 1) {
    if (nombre === undefined) {
        if (!botonAgregar) return;

        nombre = botonAgregar.dataset.nombre;
        precio = botonAgregar.dataset.precio;
        cantidad = unidades;
    }

    precio = Number(precio);
    cantidad = Number(cantidad);

    if (
        !nombre ||
        !Number.isFinite(precio) ||
        precio < 0 ||
        !Number.isInteger(cantidad) ||
        cantidad < 1
    ) {
        return;
    }

    const existente = carrito.find(function(producto) {
        return producto.nombre === nombre;
    });

    if (existente) {
        existente.precio = precio;
        existente.cantidad += cantidad;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: cantidad
        });
    }

    actualizarCarrito();
}

function escribirTexto(id, texto) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = texto;
    }
}

// Cambia la cantidad dentro del carrito.
function cambiarCantidadCarrito(indice, cambio) {
    if (!carrito[indice]) return;

    carrito[indice].cantidad += cambio;

    if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1);
    }

    actualizarCarrito();
}

function actualizarCarrito() {
    try {
        localStorage.setItem(
            "carritoOptiStyle",
            JSON.stringify(carrito)
        );
    } catch (error) {
        console.warn("No se pudo guardar el carrito.", error);
    }

    const lista = document.getElementById("listaCarrito");

    if (lista) lista.textContent = "";

    let cantidad = 0;
    let total = 0;

    carrito.forEach(function(producto, indice) {
        const subtotal = producto.precio * producto.cantidad;

        if (lista) {
            const elemento = document.createElement("li");
            const texto = document.createElement("p");
            const controles = document.createElement("div");
            const menos = document.createElement("button");
            const numero = document.createElement("span");
            const mas = document.createElement("button");

            texto.textContent =
                producto.nombre + " - S/ " + subtotal.toFixed(2);

            controles.className = "controles-carrito";

            menos.type = "button";
            menos.textContent = "−";
            menos.setAttribute(
                "aria-label", "Reducir " + producto.nombre
            );
            menos.onclick = function() {
                cambiarCantidadCarrito(indice, -1);
            };

            numero.textContent = producto.cantidad;

            mas.type = "button";
            mas.textContent = "+";
            mas.setAttribute(
                "aria-label", "Aumentar " + producto.nombre
            );
            mas.onclick = function() {
                cambiarCantidadCarrito(indice, 1);
            };

            controles.append(menos, numero, mas);
            elemento.append(texto, controles);
            lista.appendChild(elemento);
        }

        cantidad += producto.cantidad;
        total += subtotal;
    });

    escribirTexto("cantidadCarrito", cantidad);
    escribirTexto("contadorCarrito", cantidad);
    escribirTexto("totalCarrito", total.toFixed(2));

    const vacio = document.getElementById("carritoVacio");
    const productos = document.getElementById("carritoProductos");

    if (vacio) vacio.hidden = carrito.length > 0;
    if (productos) productos.hidden = carrito.length === 0;
}

function mostrarCarrito() {
    const seccion = document.getElementById("carrito");

    if (!seccion) return;

    actualizarCarrito();
    seccion.hidden = !seccion.hidden;
}

function cerrarCarrito() {
    const seccion = document.getElementById("carrito");

    if (seccion) seccion.hidden = true;
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

function comprarCarrito() {
    if (carrito.length === 0) {
        alert("Agrega productos al carrito para comprar.");
        return;
    }

    let total = 0;

    carrito.forEach(function(producto) {
        total += producto.precio * producto.cantidad;
    });

    const confirmar = confirm(
        "¿Confirmar compra por S/ " + total.toFixed(2) + "?"
    );

    if (confirmar) {
        alert("¡Compra realizada correctamente!");
        vaciarCarrito();
        cerrarCarrito();
    }
}

// Muestra los datos al cargar la página.
cambiarCantidad(0);
actualizarCarrito();