import { Outlet } from "react-router-dom";
import Nav from "../components/Nav/Nav";
import "../App.css";

const Root = () => {
	return (
		<div className="container">
			<Nav />
			<Outlet />
		</div>
	);
};

export default Root;
