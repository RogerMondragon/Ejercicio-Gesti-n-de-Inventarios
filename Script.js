// Arreglo para almacenar los productos
let inventario = [
    { nombre: "Monitor LED 24\"", cantidad: 15 },
    { nombre: "Teclado Mecánico", cantidad: 20 },
    { nombre: "Ratón Gamer", cantidad: 25 },
    { nombre: "Laptop HP Pavilion", cantidad: 10 },
    { nombre: "Auriculares Bluetooth", cantidad: 30 },
    { nombre: "Webcam HD", cantidad: 12 },
    { nombre: "Disco Duro Externo 1TB", cantidad: 18 },
    { nombre: "Impresora Multifuncional", cantidad: 8 },
    { nombre: "Memoria RAM 16GB", cantidad: 22 },
    { nombre: "Tarjeta Gráfica NVIDIA GTX", cantidad: 5 }
];

// Función para mostrar todos los productos en la tabla
function mostrarProductos() {
    const tablaInventario = document.getElementById("tablaInventario").getElementsByTagName('tbody')[0];
    tablaInventario.innerHTML = ""; // Limpiar la tabla

    if (inventario.length === 0) {
        const fila = tablaInventario.insertRow();
        const celda = fila.insertCell(0);
        celda.colSpan = 3;
        celda.textContent = "No hay productos en el inventario.";
        celda.style.color = "#dc3545";
        return;
    }

    inventario.forEach((producto, index) => {
        const fila = tablaInventario.insertRow();

        // Nombre del Producto
        const celdaNombre = fila.insertCell(0);
        celdaNombre.textContent = producto.nombre;

        // Cantidad
        const celdaCantidad = fila.insertCell(1);
        celdaCantidad.textContent = producto.cantidad;

        // Acciones
        const celdaAcciones = fila.insertCell(2);

        // Botón de Actualizar
        const btnActualizar = document.createElement("button");
        btnActualizar.textContent = "Actualizar";
        btnActualizar.classList.add("btn", "btn-actualizar");
        btnActualizar.onclick = () => actualizarCantidad(index);
        celdaAcciones.appendChild(btnActualizar);

        // Botón de Eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add("btn", "btn-eliminar");
        btnEliminar.onclick = () => eliminarProducto(index);
        celdaAcciones.appendChild(btnEliminar);
    });
}

// Función para agregar un nuevo producto
function agregarProducto(event) {
    event.preventDefault(); // Evitar recargar la página

    const nombreInput = document.getElementById("nombreProducto");
    const cantidadInput = document.getElementById("cantidadProducto");

    const nombre = nombreInput.value.trim();
    const cantidad = parseInt(cantidadInput.value);

    if (nombre === "" || isNaN(cantidad) || cantidad <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingresa un nombre válido y una cantidad mayor a 0.',
            confirmButtonColor: '#dc3545'
        });
        return;
    }

    // Verificar si el producto ya existe
    const productoExistente = inventario.find(producto => producto.nombre.toLowerCase() === nombre.toLowerCase());

    if (productoExistente) {
        Swal.fire({
            icon: 'warning',
            title: 'Producto Existente',
            text: `El producto "${nombre}" ya existe. Puedes actualizar su cantidad.`,
            confirmButtonColor: '#ffc107'
        });
    } else {
        // Agregar el nuevo producto al inventario
        inventario.push({ nombre: nombre, cantidad: cantidad });
        Swal.fire({
            icon: 'success',
            title: 'Producto Agregado',
            text: `El producto "${nombre}" ha sido agregado con una cantidad de ${cantidad}.`,
            confirmButtonColor: '#28a745'
        });
    }

    // Limpiar los campos del formulario
    nombreInput.value = "";
    cantidadInput.value = "";

    mostrarProductos();
}

// Función para actualizar la cantidad de un producto
function actualizarCantidad(index) {
    Swal.fire({
        title: `Actualizar Cantidad de "${inventario[index].nombre}"`,
        input: 'number',
        inputLabel: 'Nueva Cantidad',
        inputValue: inventario[index].cantidad,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        inputAttributes: {
            min: 0
        },
        inputValidator: (value) => {
            if (value === '' || isNaN(value) || parseInt(value) < 0) {
                return 'Por favor, ingresa una cantidad válida.';
            }
        },
        customClass: {
            popup: 'custom-popup-class',
            title: 'custom-title-class',
            content: 'custom-html-class',
            confirmButton: 'custom-confirm-button-class',
        },
        background: '#fff',
        color: '#000',
        confirmButtonColor: '#28a745',
    }).then((result) => {
        if (result.isConfirmed) {
            const nuevaCantidad = parseInt(result.value);
            inventario[index].cantidad = nuevaCantidad;

            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: `La cantidad de "${inventario[index].nombre}" ha sido actualizada a ${nuevaCantidad}.`,
                confirmButtonColor: '#28a745'
            });

            // Eliminar el producto si la cantidad es 0
            if (nuevaCantidad === 0) {
                eliminarProducto(index, false); // No mostrar alerta nuevamente
            } else {
                mostrarProductos();
            }
        }
    });
}

// Función para eliminar un producto sin stock
function eliminarProducto(index, mostrarAlert = true) {
    if (inventario[index].cantidad > 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Acción no permitida',
            text: `El producto "${inventario[index].nombre}" aún tiene stock y no puede ser eliminado.`,
            confirmButtonColor: '#ffc107'
        });
        return;
    }

    // Confirmar eliminación
    Swal.fire({
        title: `Eliminar "${inventario[index].nombre}"`,
        text: "¿Estás seguro de que deseas eliminar este producto?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
    }).then((result) => {
        if (result.isConfirmed) {
            const nombreEliminado = inventario[index].nombre;
            inventario.splice(index, 1); // Eliminar del arreglo

            if (mostrarAlert) {
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: `El producto "${nombreEliminado}" ha sido eliminado.`,
                    confirmButtonColor: '#28a745'
                });
            }

            mostrarProductos();
        }
    });
}

// Agregar evento al formulario
document.getElementById("agregarProductoForm").addEventListener("submit", agregarProducto);

// Mostrar los productos al cargar la página
window.onload = mostrarProductos;
