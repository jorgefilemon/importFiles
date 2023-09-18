import style from "./modal.module.css";
import { BounceLoader } from "react-spinners";

const Modal = () => {
	return (
		<div className={style.modalBackground}>
			<div className={style.modalContainer}>
				<div className={style.loading}>Buscando ...</div>
				<div>
					<BounceLoader color="#36d7b7" />
				</div>
			</div>
		</div>
	);
};

export default Modal;
