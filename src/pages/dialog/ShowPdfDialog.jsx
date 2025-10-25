import React from "react";
import { Dialog } from "primereact/dialog";

const ShowPdfDialog = ({ visible, setVisible, pdfUrl, setPdfUrl }) => {
    const handleHide = () => {
        setVisible(false);
        if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl); // cleanup blob
        }
        setPdfUrl(null);
    };

    return (
        <Dialog
            header="Prévisualisation de la Facture"
            visible={visible}
            style={{ width: "80vw", height: "90vh" }}
            onHide={handleHide}
            maximizable
            modal
        >
            {pdfUrl ? (
                <iframe
                    src={pdfUrl}
                    title="Aperçu Facture"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                />
            ) : (
                <p>Chargement du document...</p>
            )}
        </Dialog>
    );
};

export default ShowPdfDialog;
