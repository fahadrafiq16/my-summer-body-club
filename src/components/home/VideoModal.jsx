import React, { useState } from "react";
import Modal from "react-modal";

// Bind modal to appElement (required by react-modal)
Modal.setAppElement("#root");

const VideoModal = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <div>
            {/* Button to open modal */}
            <button
                onClick={openModal}
                style={{
                    padding: "10px 10px",
                    fontSize: "16px",
                    cursor: "pointer",
                    backgroundColor: "#ef4d16",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                }}
            >
                <i class="btn-icon button-after fa fa-play"></i>
            </button>

            {/* Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="YouTube Video"
                style={{
                    overlay: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
                    content: {
                        width: "80%",
                        maxWidth: "600px",
                        margin: "auto",
                        borderRadius: "10px",
                        padding: "20px",
                    },
                }}
            >
                <button
                    onClick={closeModal}
                    style={{
                        position: "absolute",
                        top: "0px",
                        right: "8px",
                        background: "none",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer",
                    }}
                >
                    &times;
                </button>
                <div style={{ position: "relative", paddingTop: "56.25%" }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/3A8X8O4dT5E"
                        title="YouTube Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                        }}
                    ></iframe>
                </div>
            </Modal>
        </div>
    );
};

export default VideoModal;
