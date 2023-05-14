import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const UpdateMessage = ({ onClose, message }) => {
	return (
		<Modal show onHide={() => onClose()}>
			<Modal.Header closeButton>
				<Modal.Title>{message}</Modal.Title>
			</Modal.Header>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => onClose()}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default UpdateMessage;
