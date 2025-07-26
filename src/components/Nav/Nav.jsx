import { NavLink } from "react-router-dom";
import "./nav.css";

// using module.css is a nightmare i went back to normal css, and really costume the names so i dont get duplications on the css.

function Nav() {
	return (
		<nav className="navContainer">
			<NavLink to="/" className="link">
				Home
			</NavLink>

			<NavLink to="/import" className="link">
				Importar
			</NavLink>

			<NavLink to="/PrintLabelsPage" className="link">
				Imprimir etiquetas
			</NavLink>

			<NavLink to="/stock" className="link">
				Inventario
			</NavLink>
		</nav>
	);
}

export default Nav;
