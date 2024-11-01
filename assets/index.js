import { course01 } from './data/students.js';

const $ = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);
const $create = (el) => document.createElement(el);

const ROLE = {
    STUDENT: "Estudiante",
    TEACHER: "Maestro",
    ADMINISTRATOR: "Super Administrador"
}


const NAVITEMS = {
    LIHOME: "li-home",
    LIMYNOTES: "li-my-notes",
    LIGENERALRESULTS: "li-general-results",
    LINOTES: "li-notes",
    LIUPLOAD: "li-upload",
    LIVIEWSTUDENTS: "li-view-students",
    LIVIEWTEACHERS: "li-view-teaches",
    LIVIEWSTATS: "li-view-stats",
}

const resetModules = () => {
    if ($('.main-container').hasChildNodes()) {
        $('.main-container').removeChild($('.main-container').children[0]);
    }
};

const showNavBar = (role) => {
    switch (role) {
        case ROLE.STUDENT:
            const student = $('#nav-students').style.display = 'block';
            break;
        case ROLE.TEACHER:
            const teacher = $('#nav-teachers').style.display = 'block';
            break;
        case ROLE.ADMINISTRATOR:
            const admin = $('#nav-super-admin').style.display = 'block';
            break;
        default:
            break;
    }
}

const showHome = () => {
    resetModules();
    const divHome = $create('div')
    divHome.setAttribute('id', 'show-home');
    $('.main-container').appendChild(divHome)
    const module = `
    <div class="welcome">
        <h1 class="greetings">Bienvenido al registro de notas UCA</h1>
        <p>Este sistema te permitirá gestionar y registrar las notas de tus alumnos de manera sencilla y eficiente.</p>
        <p>Utiliza el menú de navegación para acceder a las diferentes secciones, como:</p>
        <ul>
            <li><strong>Mis Notas:</strong> Consulta y actualiza las notas de tus alumnos.</li>
            <li><strong>Subir Notas:</strong> Agrega nuevas notas fácilmente.</li>
            <li><strong>Resultados Generales:</strong> Visualiza los resultados de todos los estudiantes.</li>
        </ul>
        <p>¡Esperamos que disfrutes de la plataforma!</p>
    </div>`
    $('#show-home').innerHTML = module;
}

const selectCourse = (role, callback) => {
    resetModules();
    const divCourses = document.createElement('div');
    divCourses.setAttribute('id', 'courses');
    document.querySelector('.main-container').appendChild(divCourses);

    const module = `
        <h2>Seleccione el curso</h2>
        <h3>Cursos disponibles</h3>
        <form id="form-select-course" class="form-select-course">
            <div class="form-group">
                <select id="course-select" required class="select-input">
                    <option value="">Seleccione un curso</option>
                    <option value="course 1">Curso 1</option>
                    <option value="course 2">Curso 2</option>
                    <option value="course 3">Curso 3</option>
                </select>
            </div>
            <button type="submit" class='select-course btn'>Enviar</button>
        </form>
    `;

    divCourses.innerHTML = module;

    document.querySelector('.form-select-course').addEventListener('submit', (e) => {
        e.preventDefault();
        const course = document.getElementById('course-select').value;
        resetModules();
        callback(course, role);
    });
};

const tableRows = (course) => {
    return course.map((student) => {
        return `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.grade / 10}</td>
                <td>${student.date}</td>
            </tr>
        `;
    }).join('');
}

const showNotes = (course, role) => {
    resetModules();
    const divNotes = document.createElement('div');
    divNotes.setAttribute('id', 'show-notes');
    document.querySelector('.main-container').appendChild(divNotes);

    const module = `
        <h2>Registro de notas</h2>
        <h3 id='course'>Curso: ${course}</h3>
        <table id="notes-table">
            <thead>
                <tr>
                    <th>ID del Alumno</th>
                    <th>Nombre del Alumno</th>
                    <th>Valor de la Nota</th>
                    <th>Fecha de la Nota</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows(course01)}
            </tbody>
        </table>
    `;

    switch (role) {
        case ROLE.TEACHER:
        case ROLE.ADMINISTRATOR:
            divNotes.innerHTML = module;
            break;
        default:
            console.log('Role not recognized');
            break;
    }
};

const addStudent = (course, role) => {
    const divNotes = document.createElement('div');
    divNotes.setAttribute('id', 'add-student');
    document.querySelector('.main-container').appendChild(divNotes);

    const module = `
        <h2>Registro de Estudiante</h2>
        <h3 id='course'>Curso: ${course}</h3>
        <form id="form-register-student" class="form-register-student">
            <div class="form-group">
                <label for="student-name">Nombre del Estudiante:</label>
                <input type="text" id="student-name" required>
            </div>
            <div class="form-group">
                <label for="student-id">ID del Estudiante:</label>
                <input type="text" id="student-id" required>
            </div>
            <button type="submit" class="btn">Registrar Estudiante</button>
        </form>
    `;

    divNotes.innerHTML = module;

    document.querySelector('.form-register-student').addEventListener('submit', (e) => {
        e.preventDefault();
        const studentName = document.getElementById('student-name').value;
        const studentId = document.getElementById('student-id').value;

        console.log(`Estudiante registrado: ${studentName}, ID: ${studentId}`);
    });
};

const myNotes = (role, course) => {
    resetModules();
    const divNotes = document.createElement('div');
    divNotes.setAttribute('id', 'my-notes');
    document.querySelector('.main-container').appendChild(divNotes);

    const module = `
        <h2>Mis Notas</h2>
        <h3 id='course'>Curso: ${course}</h3>
        <table id="my-notes-table">
            <thead>
                <tr>
                    <th>ID del Alumno</th>
                    <th>Nombre del Alumno</th>
                    <th>Valor de la Nota</th>
                    <th>Fecha de la Nota</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows(course)}
            </tbody>
        </table>
    `;
    switch (role) {
        case ROLE.STUDENT:
            divNotes.innerHTML = module;
            break;
        default:
            console.log('Role not recognized');
            break;
    }
}

const uploadNotes = (course, role) => {
    const divNotes = document.createElement('div');
    divNotes.setAttribute('id', 'show-notes');
    document.querySelector('.main-container').appendChild(divNotes);

    const module = `
        <h2>Registro de notas</h2>
        <h3 id='course'>Curso: ${course}</h3>
        <form id="form-register-note" class="form-register-note">
            <div class="form-group">
                <label for="student-name">Nombre del alumno:</label>
                <input type="text" id="student-name" required>
            </div>
            <div class="form-group">
                <label for="note-value">Valor de la nota:</label>
                <input type="number" id="note-value" min="0" max="100" required>
            </div>
            <div class="form-group">
                <label for="date-note">Fecha de la nota:</label>
                <input type="date" id="date-note" required>
            </div>
            <button type="submit" class="btn">Registrar Nota</button>
        </form>
    `;

    switch (role) {
        case ROLE.TEACHER:
        case ROLE.ADMINISTRATOR:
            divNotes.innerHTML = module;
            break;
        default:
            console.log('Role not recognized');
            break;
    }
};

const setRoles = (role) => {
    $('.header-role').innerHTML = role;
    showNavBar(role)

    const navItems = document.querySelectorAll('.navbar .nav-ul-item');

    window.addEventListener('DOMContentLoaded', () => showHome());

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const classList = item.classList;
            let action = '';

            switch (true) {
                case classList.contains(NAVITEMS.LIHOME):
                    showHome()
                    break;
                case classList.contains(NAVITEMS.LIMYNOTES):
                    myNotes(role, course01);
                    break;
                case classList.contains(NAVITEMS.LIGENERALRESULTS):
                    action = "Resultados generales clicked";
                    break;
                case classList.contains(NAVITEMS.LINOTES):
                    selectCourse(role, showNotes)
                    break;
                case classList.contains(NAVITEMS.LIUPLOAD):
                    selectCourse(role, uploadNotes)
                    break;
                case classList.contains(NAVITEMS.LIVIEWSTUDENTS):
                    selectCourse(role, addStudent)
                    break;
                case classList.contains(NAVITEMS.LIVIEWTEACHERS):
                    action = "Profesores clicked";
                    break;
                case classList.contains(NAVITEMS.LIVIEWSTATS):
                    action = "Estadísticas clicked";
                    break;
                default:
                    action = "Unknown item clicked";
                    break;
            }
        });
    })
}

setRoles(ROLE.ADMINISTRATOR)