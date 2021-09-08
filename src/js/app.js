let pagina = 1;
const cita = {
	nombre: "",
	fecha: "",
	hora: "",
	servicios: [],
};

document.addEventListener("DOMContentLoaded", function () {
	iniciarApp();
});

function iniciarApp() {
	mostrarServicios();
	// resalta el div actual segun el tab que se presiona
	mostrarSeccion();
	// oculta o muestra seccion segun el tab que se presiona
	cambiarSeccion();
	//paginación
	paginaSiguiente();
	paginaAnterior();
	//Comprueba pagina actual
	botonesPaginador();
	// Muestra resumen de cita/error
	mostrarResumen();
	//Almacenar nombre en el objeto
	nombreCita();
	//Almacenar fecha en el objeto
	fechaCita();
	//Deshabilitar fechas anteriores
	NoFechaAnterior();
	//Almacenar hora
	horaCita();
}

async function mostrarServicios() {
	try {
		const resultado = await fetch("./servicios.json");
		const db = await resultado.json();
		const { servicios } = db;
		// generar html

		servicios.forEach((element) => {
			const { id, nombre, precio } = element;

			//DOM
			//Genero los nombres de los servicios
			const nombreService = document.createElement("p");
			nombreService.textContent = nombre;
			nombreService.classList.add("nombre-servicio");

			//Generar Precios de los servicios
			const precioService = document.createElement("p");
			precioService.textContent = `$ ${precio}`;
			precioService.classList.add("precio-servicio");

			// Generar contenedor de serivicios
			const servicioDiv = document.createElement("div");
			servicioDiv.classList.add("servicio");
			servicioDiv.dataset.idServicio = id;

			// Seleccionar un servicio un particular
			servicioDiv.onclick = seleccionarServicio;

			// ingreso precio y nombre dentro del div
			servicioDiv.appendChild(nombreService);
			servicioDiv.appendChild(precioService);

			// insertar en HTML
			document.querySelector("#servicios").appendChild(servicioDiv);
		});
	} catch (error) {}
}

function seleccionarServicio(e) {
	let elemento;

	// forzar elemento a que sea div
	if (e.target.tagName === "P") {
		elemento = e.target.parentElement;
	} else {
		elemento = e.target;
	}

	if (elemento.classList.contains("seleccionado")) {
		elemento.classList.remove("seleccionado");
		const id = parseInt(elemento.dataset.idServicio);

		eliminarServicio(id);
	} else {
		elemento.classList.add("seleccionado");
		// construir el objeto
		const servicioObj = {
			id: parseInt(elemento.dataset.idServicio),
			nombre: elemento.firstChild.textContent,
			precio: elemento.firstChild.nextElementSibling.textContent,
		};

		agregarServicio(servicioObj);
	}
}
// defino funciones de objetos
function eliminarServicio(id) {
	const { servicios } = cita;
	cita.servicios = servicios.filter((servicio) => servicio.id !== id); // filtro los servicios dif a mi id
	console.log(cita);
}
function agregarServicio(servicioObj) {
	// destructuring
	const { servicios } = cita;
	cita.servicios = [...servicios, servicioObj]; // copio el objeto
}
// fin funciones de objeto
function mostrarSeccion() {
	//Eliminar mostrar-seccion de la seccion anterior
	const seccionAnterior = document.querySelector(".mostrar-seccion");
	if (seccionAnterior) {
		seccionAnterior.classList.remove("mostrar-seccion");
	}

	const seccionActual = document.querySelector(`#paso-${pagina}`);
	seccionActual.classList.add("mostrar-seccion");

	// eliminar la clase actual de tab anterior
	const tabAnterior = document.querySelector(".tabs .actual");
	if (tabAnterior) {
		tabAnterior.classList.remove("actual");
	}

	// tab actual
	const tab = document.querySelector(`[data-paso="${pagina}"]`);
	tab.classList.add("actual");
}

function cambiarSeccion() {
	const enlaces = document.querySelectorAll(".tabs button");

	enlaces.forEach((enlace) => {
		enlace.addEventListener("click", (e) => {
			e.preventDefault();
			pagina = parseInt(e.target.dataset.paso);

			//llamo a mostrar
			mostrarSeccion();
			// llamo a paginar
			botonesPaginador();
		});
	});
}

function paginaSiguiente() {
	const paginaSiguiente = document.querySelector("#siguiente");
	paginaSiguiente.addEventListener("click", () => {
		pagina++;
		botonesPaginador();
	});
}

function paginaAnterior() {
	const paginaAnterior = document.querySelector("#anterior");
	paginaAnterior.addEventListener("click", () => {
		pagina--;
		botonesPaginador();
	});
}

function botonesPaginador() {
	const paginaSiguiente = document.querySelector("#siguiente");
	const paginaAnterior = document.querySelector("#anterior");
	if (pagina == 1) {
		paginaAnterior.classList.add("ocultar");
	} else if (pagina == 2) {
		paginaAnterior.classList.remove("ocultar");
		paginaSiguiente.classList.remove("ocultar");
	} else if (pagina == 3) {
		paginaSiguiente.classList.add("ocultar");
		paginaAnterior.classList.remove("ocultar");
		mostrarResumen(); // pagina 3 carga resumen
	}

	mostrarSeccion();
}

function mostrarResumen() {
	// destructuring
	const { nombre, fecha, hora, servicios } = cita;

	// selecciono el resumen
	const resumenDiv = document.querySelector(".contenido-resumen");

	// limpiar html previo
	resumenDiv.innerHTML = "";

	// validacion
	if (Object.values(cita).includes("")) {
		const NoServicios = document.createElement("P");
		NoServicios.textContent = "Faltan datos de servicios, hora, fecha o nombre";
		NoServicios.classList.add("invalidar-cita");

		// muestro el error

		resumenDiv.appendChild(NoServicios);
	} else {
		const headingCitas = document.createElement("H3");
		headingCitas.textContent = "Resumen Reserva";

		const nombreCita = document.createElement("P");
		nombreCita.innerHTML = `<span>Nombre: </span>${nombre}`;

		const fechaCita = document.createElement("P");
		fechaCita.innerHTML = `<span>Fecha: </span>${fecha}`;

		const horaCita = document.createElement("P");
		horaCita.innerHTML = `<span>Hora: </span>${hora}`;

		const servicioCita = document.createElement("DIV");
		servicioCita.classList.add("resumen-servicios");

		const headingServicio = document.createElement("H3");
		headingServicio.textContent = "Resumen de servicios";

		servicioCita.appendChild(headingServicio);

		let cantidad = 0;

		// iterar sobre los servicios
		servicios.forEach((e) => {
			const divServicio = document.createElement("DIV");
			divServicio.classList.add("contenedor-servicio");

			const textoServicio = document.createElement("P");
			textoServicio.textContent = e.nombre;

			const precioServicio = document.createElement("P");
			precioServicio.textContent = e.precio;
			precioServicio.classList.add("precio");

			const totalServicio = e.precio.split("$");
			//console.log(parseInt(totalServicio[1].trim()));
			cantidad += parseInt(totalServicio[1].trim());

			divServicio.appendChild(textoServicio);
			divServicio.appendChild(precioServicio);

			servicioCita.appendChild(divServicio);
		});
		console.log(cantidad);
		resumenDiv.appendChild(headingCitas);
		resumenDiv.appendChild(nombreCita);
		resumenDiv.appendChild(fechaCita);
		resumenDiv.appendChild(horaCita);

		resumenDiv.appendChild(servicioCita);

		const cantidadA_pagar = document.createElement("P");
		cantidadA_pagar.classList.add("total");
		cantidadA_pagar.innerHTML = `<span>Total a Pagar: </span>$${cantidad}`;
		resumenDiv.appendChild(cantidadA_pagar);
	}
}

function nombreCita() {
	const nombreInput = document.querySelector("#nombre");

	nombreInput.addEventListener("input", (e) => {
		const nombreTexto = e.target.value.trim();
		// validacion

		if (nombreTexto === "" || nombreTexto.length < 3) {
			mostrarAlerta("Nombre no valido", "error");
		} else {
			const alerta = document.querySelector(".alerta");
			if (alerta) {
				alerta.remove;
			}
			cita.nombre = nombreTexto;
		}
	});
}

function mostrarAlerta(mensaje, tipo) {
	const alertaPrevia = document.querySelector(".alerta");
	if (alertaPrevia) {
		return;
	}

	const alerta = document.createElement("DIV");
	alerta.textContent = mensaje;
	alerta.classList.add("alerta");

	if (tipo === "error") {
		alerta.classList.add("error");
	}

	// insertar en html
	const formulario = document.querySelector(".formulario");
	formulario.appendChild(alerta);

	//eliminar alerta luego de 3s
	setTimeout(() => {
		alerta.remove();
	}, 3000);
}

function fechaCita() {
	const fechaInput = document.querySelector("#fecha");

	fechaInput.addEventListener("input", (e) => {
		const elDia = new Date(e.target.value).getUTCDay(); // num de dia 0 a 6
		if ([0, 1].includes(elDia)) {
			e.preventDefault();
			fechaInput.value = "";
			mostrarAlerta("No se trabaja domingo ni lunes", "error");
		} else {
			cita.fecha = fechaInput.value;
		}
	});
}

function NoFechaAnterior() {
	const inputFecha = document.querySelector("#fecha");
	const fechaAhora = new Date();
	const year = fechaAhora.getFullYear();
	let mes = fechaAhora.getMonth() + 1;
	let dia = fechaAhora.getDate() + 1;

	if (mes < 10 && dia < 10) {
		mes = `0${mes}`;
		dia = `0${dia}`;
	}
	const fechaDeshabilitada = `${year}-${mes}-${dia}`;
	inputFecha.min = fechaDeshabilitada;
}

function horaCita() {
	const inputHora = document.querySelector("#hora");

	inputHora.addEventListener("input", (e) => {
		const horaCita = e.target.value;
		const hora = horaCita.split(":");
		if (hora[0] < 9 || hora[0] > 20) {
			mostrarAlerta("Horario no disponible", "error");
			setTimeout(() => {
				inputHora.value = "";
			}, 3000);
		} else {
			cita.hora = horaCita;
		}
	});
}
