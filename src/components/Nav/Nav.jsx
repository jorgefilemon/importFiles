import style from "./nav.module.css";
import { Link } from "react-router-dom";

function Nav() {
	return (
		<nav className={style.navContainer}>
			<div>
				<Link to="/">home</Link>
			</div>
			<div>
				<Link to="/import">importar</Link>
			</div>
			<div>
				<Link to="/PrintLabelsPage">imprimir etiquetas</Link>
			</div>
		</nav>
	);
}

export default Nav;
