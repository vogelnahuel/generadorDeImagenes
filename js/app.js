const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacion = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalDePaginas;
let iterador;
let paginaActual;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();
    const terminoBusqueda = document.querySelector('#termino').value;
    if (terminoBusqueda === '') {
        mostrarError('el campo no debe estar vacio');
        return;
    }

    buscarImagenes();

}


function buscarImagenes() {
    const terminoBusqueda = document.querySelector('#termino').value;
    const idAPP = '20312899-80367c3b0240e4347af50ca30';
    //per_page define cuantos elementos trae
    const url = `https://pixabay.com/api/?key=${idAPP}&q=${terminoBusqueda}&per_page=${registrosPorPagina}&page=${paginaActual}`;



    fetch(url)
        .then(respuesta => {

            return respuesta.json();
        })
        .then(datos => {
            totalDePaginas = calcularPaginas(datos.totalHits);

            mostrarImagenes(datos.hits)
        })
}

//generador que va a registrar las paginas a usar
function* generador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }

}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(img) {

    //iterar sobre arreglo de img y construir html
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
    img.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;
        resultado.innerHTML += `
        <div class="w-1/3 md:w1/4 lg:w1/5 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">

                <div class='p-4'>
                    <p class="font-bold">${likes}<span class="font-light"> Me Gusta</span></p>
                    <p class="font-bold">${views}<span class="font-light"> visitas</span></p>

                    <a
                        class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                         href="${largeImageURL}" target="_BLANK"
                     > 
                          ver Imagen
                    </a>
                </div>
             
                    
             
             </div>
        </div>
        `; //font-bold es negrita
    });
    while (paginacion.firstChild) {
        paginacion.removeChild(paginacion.firstChild);
    }

    imprimirGenerador();
}

function imprimirGenerador() {
    iterador = generador(totalDePaginas);
    while (true) {
        const { value, done } = iterador.next();
        if (done) {
            return;
        }
        //caso contrario genera un boton por cada pagina
        const boton = document.createElement('a');
        boton.href = "#";
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-10', 'uppercase', 'rounded');
        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();

        }
        paginacion.appendChild(boton);
    }
}

function mostrarError(msj) {
    const existeAlerta = document.querySelector('.bg-red-100');
    if (!existeAlerta) {

        const alerta = document.createElement('p');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${msj}</span>
        `;
        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);

    }

}