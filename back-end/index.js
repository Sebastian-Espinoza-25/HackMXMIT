const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

let productos = cargarInventario();
let historialVentas = cargarHistorialVentas();
let pendientes = cargarPendientes();
let gananciasTotales = 0;
let estadoConversacion = { etapa: 'inicio' };

// Funciones para cargar y guardar datos en JSON
function cargarInventario() {
    try {
        const data = fs.readFileSync('inventario.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

function guardarInventario() {
    fs.writeFileSync('inventario.json', JSON.stringify(productos, null, 4));
}

function cargarHistorialVentas() {
    try {
        const data = fs.readFileSync('historial_ventas.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function guardarHistorialVentas() {
    fs.writeFileSync('historial_ventas.json', JSON.stringify(historialVentas, null, 4));
}

function cargarPendientes() {
    try {
        const data = fs.readFileSync('pendientes.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function guardarPendientes() {
    fs.writeFileSync('pendientes.json', JSON.stringify(pendientes, null, 4));
}

// Función para registrar productos pendientes
function registrarPendientes(mensaje) {
    if (estadoConversacion.etapa === 'inicio') {
        if (pendientes.length === 0) {
            return "No hay productos pendientes.";
        }

        const pendiente = pendientes.shift();
        estadoConversacion = {
            etapa: 'registro_pendiente_nombre',
            codigo: pendiente.codigo,
            nombre: '',
            precio: 0,
            cantidad: 0
        };
        guardarPendientes();
        return `Producto pendiente encontrado. Ingresa el nombre del producto con código ${pendiente.codigo}:`;
    }

    switch (estadoConversacion.etapa) {
        case 'registro_pendiente_nombre':
            estadoConversacion.nombre = mensaje;
            estadoConversacion.etapa = 'registro_pendiente_precio';
            return `Ingresa el precio del producto ${estadoConversacion.nombre}:`;

        case 'registro_pendiente_precio':
            estadoConversacion.precio = parseFloat(mensaje);
            estadoConversacion.etapa = 'registro_pendiente_cantidad';
            return `Ingresa la cantidad del producto ${estadoConversacion.nombre}:`;

        case 'registro_pendiente_cantidad':
            estadoConversacion.cantidad = parseInt(mensaje);
            productos[estadoConversacion.codigo] = {
                nombre: estadoConversacion.nombre,
                precio: estadoConversacion.precio,
                cantidad: estadoConversacion.cantidad
            };
            guardarInventario();
            historialVentas.push({
                codigo: estadoConversacion.codigo,
                cantidad: estadoConversacion.cantidad,
                precio: estadoConversacion.precio,
                fechaHora: new Date().toISOString()
            });
            guardarHistorialVentas();
            estadoConversacion = { etapa: 'inicio' };
            return `Producto ${estadoConversacion.nombre} registrado exitosamente y añadido al historial de ventas. ¿Quieres hacer algo más? (1) Venta, (2) Reabastecer, (3) Productos pendientes, o (5) Salir.`;

        default:
            return "No entiendo esa opción. ¿Qué quieres hacer? (1) Venta, (2) Reabastecer, (3) Productos pendientes, (4) Ver inventario, o (5) Salir.";
    }
}

function mostrarInventario() {
    let inventario = "Inventario:\n";
    for (const codigo in productos) {
        const producto = productos[codigo];
        inventario += `Código: ${codigo}, Nombre: ${producto.nombre}, Precio: $${producto.precio.toFixed(2)}, Cantidad: ${producto.cantidad}\n`;
    }
    return inventario;
}

// Endpoint de conversación
app.post('/conversacion', (req, res) => {
    const { comando: text } = req.body;
    let respuesta;

    switch (estadoConversacion.etapa) {
        case 'inicio':
            respuesta = "Hola! ¿Qué quieres hacer? Escribe: (1) para venta, (2) para reabastecer, (3) para registrar productos pendientes, (4) para ver inventario, o (5) para salir.";
            estadoConversacion.etapa = 'opciones';
            break;

        case 'opciones':
            if (text === '1') {
                respuesta = "Ingresa el código de barras del producto para la venta:";
                estadoConversacion.etapa = 'venta_codigo';
            } else if (text === '2') {
                respuesta = "Ingresa el código de barras del producto para reabastecimiento:";
                estadoConversacion.etapa = 'reabastecer_codigo';
            } else if (text === '3') {
                respuesta = registrarPendientes(text); // Accede a registrar pendientes sin cambiar etapa
                if (pendientes.length > 0) {
                    estadoConversacion.etapa = 'registro_pendiente_nombre';
                }
            } else if (text === '4') {
                respuesta = mostrarInventario();
                respuesta += "\n¿Quieres hacer algo más? (1) Venta, (2) Reabastecer, (3) Productos pendientes, o (5) Salir.";
                estadoConversacion.etapa = 'opciones';
            } else if (text === '5') {
                respuesta = "¡Hasta luego! Ganancias totales del día: $" + gananciasTotales.toFixed(2);
                estadoConversacion.etapa = 'inicio';
            } else {
                respuesta = "Opción no válida. Escribe: (1) para venta, (2) para reabastecer, (3) para productos pendientes, (4) para ver inventario, o (5) para salir.";
            }
            break;

        case 'venta_codigo':
            estadoConversacion.codigo = text;
            if (productos[estadoConversacion.codigo]) {
                respuesta = `Producto: ${productos[estadoConversacion.codigo].nombre}, Precio: $${productos[estadoConversacion.codigo].precio}. Ingresa la cantidad a vender:`;
                estadoConversacion.etapa = 'venta_cantidad';
            } else {
                respuesta = "Producto no encontrado. ¿Quieres registrarlo? (s/n)";
                estadoConversacion.etapa = 'registro_producto';
            }
            break;

        case 'venta_cantidad':
            const cantidadVenta = parseInt(text);
            const productoVenta = productos[estadoConversacion.codigo];

            if (cantidadVenta <= productoVenta.cantidad) {
                productoVenta.cantidad -= cantidadVenta;
                const subtotal = cantidadVenta * productoVenta.precio;
                gananciasTotales += subtotal;
                historialVentas.push({
                    codigo: estadoConversacion.codigo,
                    cantidad: cantidadVenta,
                    precio: productoVenta.precio,
                    fechaHora: new Date().toISOString()
                });
                guardarInventario();
                guardarHistorialVentas();

                respuesta = `Venta registrada. Subtotal: $${subtotal.toFixed(2)}. ¿Quieres hacer algo más? (1) Venta, (2) Reabastecer, (3) Productos pendientes, o (5) Salir.`;
                estadoConversacion.etapa = 'opciones';
            } else {
                // Si no hay suficiente inventario, registrar como pendiente
                pendientes.push({ codigo: estadoConversacion.codigo, cantidad: cantidadVenta });
                guardarPendientes();
                respuesta = `No hay suficiente inventario. Producto registrado en pendientes. ¿Quieres hacer algo más? (1) Venta, (2) Reabastecer, (3) Productos pendientes, o (5) Salir.`;
                estadoConversacion.etapa = 'opciones';
            }
            break;

        case 'registro_producto':
            if (text.toLowerCase() === 's') {
                respuesta = "Ingresa el nombre del producto:";
                estadoConversacion.etapa = 'registro_nombre';
            } else {
                respuesta = "Ingresa la cantidad vendida del producto:";
                estadoConversacion.etapa = 'registro_cantidad_pendiente';
            }
            break;

        case 'registro_cantidad_pendiente':
            const cantidadPendiente = parseInt(text);
            pendientes.push({ codigo: estadoConversacion.codigo, cantidad: cantidadPendiente });
            guardarPendientes();
            respuesta = "Producto no registrado y añadido a pendientes. ¿Quieres hacer algo más? (1) Venta, (2) Reabastecer, (3) Productos pendientes, o (5) Salir.";
            estadoConversacion.etapa = 'opciones';
            break;

        case 'registro_nombre':
            estadoConversacion.nombre = text;
            respuesta = "Ingresa el precio del producto:";
            estadoConversacion.etapa = 'registro_precio';
            break;

        case 'registro_precio':
            estadoConversacion.precio = parseFloat(text);
            respuesta = "Ingresa la cantidad inicial en inventario:";
            estadoConversacion.etapa = 'registro_cantidad';
            break;

        case 'registro_cantidad':
            estadoConversacion.cantidad = parseInt(text);
            productos[estadoConversacion.codigo] = {
                nombre: estadoConversacion.nombre,
                precio: estadoConversacion.precio,
                cantidad: estadoConversacion.cantidad
            };
            guardarInventario();
            respuesta = `Producto ${estadoConversacion.nombre} registrado exitosamente. ¿Quieres hacer algo más? (1) Venta, (2) Reabastecer, (3) Productos pendientes, o (5) Salir.`;
            estadoConversacion.etapa = 'opciones';
            break;

        case 'reabastecer_codigo':
            estadoConversacion.codigo = text;
            if (productos[estadoConversacion.codigo]) {
                respuesta = "Ingresa la cantidad para reabastecer:";
                estadoConversacion.etapa = 'reabastecer_cantidad';
            } else {
                respuesta = "Producto no encontrado. ¿Quieres registrarlo? (s/n)";
                estadoConversacion.etapa = 'registro_producto';
            }
            break;

        case 'reabastecer_cantidad':
            const cantidadReabastecida = parseInt(text);
            productos[estadoConversacion.codigo].cantidad += cantidadReabastecida;
            guardarInventario();
            respuesta = `Producto reabastecido. Nueva cantidad: ${productos[estadoConversacion.codigo].cantidad}. ¿Quieres hacer algo más? (1) Venta, (2) Reabastecer, (3) Productos pendientes, o (5) Salir.`;
            estadoConversacion.etapa = 'opciones';
            break;

        case 'registro_pendiente_nombre':
            estadoConversacion.nombre = text;
            respuesta = "Ingresa el precio del producto:";
            estadoConversacion.etapa = 'registro_pendiente_precio';
            break;

        case 'registro_pendiente_precio':
            estadoConversacion.precio = parseFloat(text);
            respuesta = "Ingresa la cantidad inicial en inventario:";
            estadoConversacion.etapa = 'registro_pendiente_cantidad';
            break;

        case 'registro_pendiente_cantidad':
            estadoConversacion.cantidad = parseInt(text);
            productos[estadoConversacion.codigo] = {
                nombre: estadoConversacion.nombre,
                precio: estadoConversacion.precio,
                cantidad: estadoConversacion.cantidad
            };
            guardarInventario();
            historialVentas.push({
                codigo: estadoConversacion.codigo,
                cantidad: estadoConversacion.cantidad,
                precio: estadoConversacion.precio,
                fechaHora: new Date().toISOString()
            });
            guardarHistorialVentas();
            respuesta = `Producto ${estadoConversacion.nombre} registrado exitosamente y añadido al historial de ventas. ¿Quieres hacer algo más? (1) Venta, (2) Reabastecer, (3) Productos pendientes, o (5) Salir.`;
            estadoConversacion.etapa = 'opciones';
            break;

        default:
            respuesta = "No entiendo esa opción. ¿Qué quieres hacer? (1) Venta, (2) Reabastecer, (3) Productos pendientes, (4) Ver inventario, o (5) Salir.";
            estadoConversacion.etapa = 'opciones';
    }

    res.json({ respuesta });
});

// Ruta para obtener el inventario
app.get('/inventario', (req, res) => {
    fs.readFile('inventario.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo inventario.json');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para obtener el historial de ventas
app.get('/historial_ventas', (req, res) => {
    fs.readFile('historial_ventas.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo historial_ventas.json');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});