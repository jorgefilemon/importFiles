import { BounceLoader } from "react-spinners";
import style from "./modal.module.css";

const Importing = () => {
	return (
		<>
			<div className={style.loading}>Importando Articulos ...</div>
			<div className={style.bouncer}>
				<BounceLoader color="#7883ff" />
			</div>
		</>
	);
};

export default Importing;
