import React, {useEffect} from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import { NumberFormat } from "../../helper/Tools";
import writtenNumber from "written-number";
writtenNumber.defaults.lang = "fr";

const FactureDialog = ({
                           show,
                           handleClose,
                           handleSave,
                           formData,
                           setFormData,
                           handleAddLigne,
                           handleRemoveLigne,
                           handleLigneChange,
                           editingFacture,
                           enterprise,
                           clients,
                           orders,
                           somme_Total,
                       }) => {

    const handleConvNumberLetterChange = (e) => {
        setFormData({ ...formData, convNumberLetter: e.target.value });
    };
    useEffect(() => {
        const totalTTC = somme_Total * (formData.tva / 100) + somme_Total;
        const formatted = writtenNumber(totalTTC) + " DA";
        setFormData((prev) => ({ ...prev, convNumberLetter: formatted }));
    }, [somme_Total, formData.tva]);

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            dialogClassName="modal-xxl"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {editingFacture ? "✏️ Edit Facture" : "➕ Add Facture"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    {/* --- Row 1 --- */}
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Numéro Facture</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="form-control-lg custom-input"
                                    value={formData.numFacture}
                                    onChange={(e) =>
                                        setFormData({ ...formData, numFacture: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Titre</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="form-control-lg custom-input"
                                    value={formData.titre}
                                    onChange={(e) =>
                                        setFormData({ ...formData, titre: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </div>
                    </div>

                    {/* --- Row 2 --- */}
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Date Création</Form.Label>
                                <Form.Control
                                    type="date"
                                    className="form-control-lg custom-input"
                                    value={formData.dateCreation}
                                    onChange={(e) =>
                                        setFormData({ ...formData, dateCreation: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Mode de Règlement</Form.Label>
                                <Form.Select
                                    className="form-control-lg custom-input"
                                    value={formData.modeReglement || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, modeReglement: e.target.value })
                                    }
                                >
                                    <option value="">-- Sélectionnez un mode --</option>
                                    <option value="Espèces">Espèces</option>
                                    <option value="Virement">Virement</option>
                                    <option value="Chèque">Chèque</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>

                    {/* --- Row 3 --- */}
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Entreprise</Form.Label>
                                <Form.Select
                                    className="form-control-lg custom-input"
                                    value={formData.enterpriseId || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, enterpriseId: e.target.value })
                                    }
                                >
                                    <option value="">-- Select Enterprise --</option>
                                    {enterprise.map((ent) => (
                                        <option key={ent.id} value={ent.id}>
                                            {ent.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>

                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Client</Form.Label>
                                <Form.Select
                                    className="form-control-lg custom-input"
                                    value={formData.clientId || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, clientId: e.target.value })
                                    }
                                >
                                    <option value="">-- Select Client --</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>

                    {/* --- Row 4 --- */}
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Bon Commandes</Form.Label>
                                <Form.Select
                                    className="form-control-lg custom-input"
                                    value={formData.orderId || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, orderId: e.target.value })
                                    }
                                >
                                    <option value="">-- Select Order --</option>
                                    {orders.map((order) => (
                                        <option key={order.id} value={order.id}>
                                            {order.id} - {order.description}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>

                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Check
                                    inline
                                    type="checkbox"
                                    id="isProforma"
                                    label="Facture Proforma"
                                    className="custom-check"
                                    checked={formData.proformat || false}
                                    onChange={(e) =>
                                        setFormData({ ...formData, proformat: e.target.checked })
                                    }
                                />
                                <Form.Check
                                    inline
                                    type="checkbox"
                                    id="isPayed"
                                    label="Facture Payed"
                                    className="custom-check"
                                    checked={formData.payed || false}
                                    onChange={(e) =>
                                        setFormData({ ...formData, payed: e.target.checked })
                                    }
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder="Enter description..."
                                    value={formData.description || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6 ">
                            <Form.Group className="mb-3">
                                <Form.Label>Rest (DZD)</Form.Label>
                                <td className="fw-bold text-success">

                                {NumberFormat(formData.rest)}
                                </td>
                            </Form.Group>
                        </div>
                    </div>

                    {/* --- Lignes Section --- */}
                    <h5 className="mt-4">📌 Lignes de Facture</h5>
                    <Button
                        variant="success"
                        size="sm"
                        onClick={handleAddLigne}
                        className="mb-3"
                    >
                        <FaPlus /> Add Ligne
                    </Button>

                    <Table bordered hover responsive className="table-custom">
                        <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Désignation</th>
                            <th>Quantité</th>
                            <th>PUHT</th>
                            <th>Montant</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {formData.lignes.map((ligne, index) => (
                            <tr key={index}>
                                <td>{ligne.numero}</td>
                                <td>
                                    <Form.Control
                                        type="text"
                                        className="custom-input"
                                        value={ligne.designation}
                                        onChange={(e) =>
                                            handleLigneChange(index, "designation", e.target.value)
                                        }
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        className="custom-input"
                                        value={ligne.quantity}
                                        onChange={(e) =>
                                            handleLigneChange(index, "quantity", e.target.value)
                                        }
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        className="custom-input"
                                        value={ligne.puht}
                                        onChange={(e) =>
                                            handleLigneChange(index, "puht", e.target.value)
                                        }
                                    />
                                </td>
                                <td className="fw-bold text-success">
                                    {NumberFormat(ligne.montant)}
                                </td>
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleRemoveLigne(index)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Form>

                <div className="row">
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Conversion Nombre en Lettre</Form.Label>
                            <Form.Control
                                type="text"
                                className="form-control-lg custom-input"
                                value={formData.convNumberLetter || ""}
                                onChange={handleConvNumberLetterChange}
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-3">
                        <Form.Group className="mb-3">
                            <Form.Label>TVA (%)</Form.Label>
                            <Form.Control
                                type="number"
                                className="form-control-lg custom-input"
                                value={formData.tva}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        tva: parseFloat(e.target.value) || 0,
                                    })
                                }
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-3">
                        <Form.Group className="mb-3">
                            <Form.Label>Somme Totale (HT)</Form.Label>
                            <Form.Control
                                type="text"
                                className="form-control-lg custom-input text-success text-start fw-bold "
                                value={NumberFormat(somme_Total)}
                                disabled
                                readOnly
                            />
                        </Form.Group>
                        <td className="fw-bold text-success">
                            Somme Totale TTC :{" "}
                            {NumberFormat(somme_Total * (formData.tva / 100) + somme_Total)}

                        </td>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    ❌ Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    💾 Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FactureDialog;
