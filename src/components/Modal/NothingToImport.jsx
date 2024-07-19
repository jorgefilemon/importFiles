import style from "./modal.module.css";

const NothingToImport = ({ setModal, message }) => {
	return (
		<>
			<div className={style.message}>{message}</div>
			<div className={style.btn}>
				<button
					onClick={() =>
						setModal({
							visible: false,
							message: "",
						})
					}
				>
					Cerrar
				</button>
			</div>
		</>
	);
};

export default NothingToImport;
