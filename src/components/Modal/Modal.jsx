import React from "react";
import style from "./modal.module.css";
import NothingToImport from "./NothingToImport";
import Importing from "./Importing";
import Imported from "./Imported";

const Modal = ({ message, visible, setModal, productsArray }) => {
	if (!visible) return null; // Ensures the modal does not render if not visible

	return (
		<div className={style.modalBackground}>
			<div className={style.modalContainer}>
				{message === "Nada que importar!" && (
					<NothingToImport setModal={setModal} message={message} />
				)}
				{message === "Importing" && ( //
					<Importing />
				)}
				{message === "success" && (
					<Imported
						setModal={setModal}
						productsArray={productsArray}
					/>
				)}
			</div>
		</div>
	);
};

export default Modal;
