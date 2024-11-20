import React, { useState, useRef, useEffect } from 'react';
import { BOOK, BOTTOM_ARROW, CARRER, EMAIL, LOGOUT, ROLE, UP_ARROW } from '../utils/Icons';  // Asegúrate de tener el ícono de flecha hacia arriba (UP_ARROW)
import Paragraph from '../utils/Paragraph';
import { useAuth } from '../provider/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const arrowRef = useRef(null);
    const nameContainerRef = useRef(null);
    const [menuWidth, setMenuWidth] = useState(0);
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
      };

    useEffect(() => {
        console.log(user);
        // Establecemos el ancho del menú cuando el componente se monta
        if (arrowRef.current && nameContainerRef.current) {
            const totalWidth = arrowRef.current.offsetWidth + nameContainerRef.current.offsetWidth;
            setMenuWidth(totalWidth);
        }
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const printRole = (role) => {
        switch(role) {
            case "student":
            return "Alumno/a";
            case "teacher":
            return "Maestro";
            case "admin":
            return "Administrador";
            default:
            return "Undefined"
        }
    }

    return (
        <div className="w-full lg:w-[90%] mx-auto gap-4 flex flex-col md:flex-row  justify-center md:justify-between items-center py-4 px-6 bg-gray-900 rounded-lg shadow-lg">
            <div className="flex items-center gap-4">
                <span className="text-4xl text-yellow-400 font-bold">{BOOK()}</span>
                <h1 className="text-3xl font-semibold text-white tracking-wider">
                    Sistema de registro de notas
                </h1>
            </div>
            <div className="flex flex-row items-center relative">
                <div
                    className="text-2xl pr-2 cursor-pointer text-white transform transition-all duration-300"
                    onClick={toggleMenu}
                    ref={arrowRef}
                >
                    {isOpen ? UP_ARROW() : BOTTOM_ARROW()}
                </div>
                <div className="flex flex-col text-white w-max" ref={nameContainerRef}>
                    <Paragraph paragraph={`Nombre: ${user[0].firstname + user[0].lastname}`} />
                </div>
                {isOpen && (
                    <div
                        ref={menuRef}
                        className="absolute top-[55px] right-0 bg-gray-800 text-white p-2 rounded-sm shadow-xl"
                        style={{
                            width: menuWidth, 
                        }}
                    >
                        <ul className="flex flex-col">
                            <li className="hover:bg-gray-700 flex flex-row items-center px-2 py-1 hover:cursor-pointer">
                                <span className="mr-2 text-yellow-400">{CARRER()}</span>
                                <Paragraph paragraph={`Carrera: Ingeniería de Sistemas`}/>
                            </li>
                            <li className="hover:bg-gray-700 flex flex-row items-center px-2 py-1 hover:cursor-pointer">
                                <span className="mr-2 text-yellow-400">{ROLE()}</span>
                                <Paragraph paragraph={`Rol: ${printRole(user[0].role)}`}/>
                            </li>
                            <li className="hover:bg-gray-700 flex flex-row items-center px-2 py-1 hover:cursor-pointer">
                                <span className="mr-2 text-yellow-400">{EMAIL()}</span>
                                <Paragraph paragraph={`Correo: ${user[0].email}`} />
                            </li>
                            <li className="hover:bg-gray-700 flex flex-row items-center px-2 py-1 hover:cursor-pointer" onClick={handleLogout}>
                                <span className="mr-2 text-yellow-400">{LOGOUT()}</span>
                                <Paragraph paragraph={`Salir`} styles={`font-semibold`}/>

                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
