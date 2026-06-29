import React, { useState } from "react";
import Modal from "react-modal";

// Bind modal to appElement (required by react-modal)
Modal.setAppElement("#root");

const DEFAULT_YOUTUBE_EMBED = "https://www.youtube.com/embed/3A8X8O4dT5E";

const VideoModal = ({ showAnimation = false, youtubeUrl = DEFAULT_YOUTUBE_EMBED }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <div className="video-modal-root">
            {/* Button to open modal */}
            <div className="video-modal-trigger relative group inline-flex items-center justify-center">
                {showAnimation && (
                    <>
                        <span className="absolute inline-flex h-[125px] w-[125px] rounded-full bg-[#ef4d16]/25 blur-md group-hover:bg-[#ef4d16]/35 transition"></span>
                        <span className="absolute inline-flex h-[125px] w-[125px] rounded-full border border-[#ef4d16]/30 animate-ping" style={{ animationDelay: '0s' }}></span>
                        <span className="absolute inline-flex h-[146px] w-[146px] rounded-full border border-[#ef4d16]/25 animate-ping" style={{ animationDelay: '0.8s' }}></span>
                        <span className="absolute inline-flex h-[166px] w-[166px] rounded-full border border-[#ef4d16]/20 animate-ping" style={{ animationDelay: '1.6s' }}></span>
                        <span className="absolute inline-flex h-[125px] w-[125px] rounded-full opacity-70 blur-[1px]
                            bg-[conic-gradient(from_0deg,rgba(240,77,22,0)_0%,rgba(240,77,22,0.55)_28%,rgba(240,77,22,0)_56%)]
                            animate-[spin_10s_linear_infinite]"></span>
                        <span className="absolute inline-flex h-[125px] w-[125px] rounded-full opacity-50 blur-[2px]
                            bg-[conic-gradient(from_180deg,rgba(255,122,69,0)_0%,rgba(255,122,69,0.45)_22%,rgba(255,122,69,0)_48%)]
                            animate-[spin_14s_linear_infinite_reverse]"></span>
                    </>
                )}
                <button
                    onClick={openModal}
                    className={`relative z-[1] flex items-center justify-center rounded-full bg-[#ef4d16]
                    text-white shadow-[0_0_18px_rgba(240,77,22,0.28)] hover:shadow-[0_0_26px_rgba(240,77,22,0.45)]
                    transition-all duration-300 outline-none focus:ring-4 focus:ring-[#ef4d16]/25
                    hover:scale-105 active:scale-95 ${showAnimation ? 'h-[83px] w-[83px] md:h-[94px] md:w-[94px]' : 'h-16 w-16 md:h-20 md:w-20'}`}
                    aria-label="Open video"
                >
                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ef4d16] to-[#ff7a45] opacity-0 group-hover:opacity-20 blur-sm transition" />
                    <i className="fa fa-play relative"></i>
                </button>
            </div>

            {/* Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="YouTube Video"
                overlayClassName="ReactModal__Overlay video-modal-overlay"
                className="ReactModal__Content video-modal-content"
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        zIndex: 10050,
                    },
                    content: {
                        border: "none",
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
                        src={youtubeUrl || DEFAULT_YOUTUBE_EMBED}
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
