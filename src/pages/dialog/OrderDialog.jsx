import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { Card } from "primereact/card";

const OrderDialog = ({
                         show,
                         onClose,
                         onSave,
                         formData,
                         setFormData,
                         editingOrder,
                         clients = [],
                         enterprise = []
                     }) => {
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.files[0];
        if (file) {
            setFormData({ ...formData, file, documentName: file.name });
            const type = file.type;
            if (type.startsWith("image/") || type === "application/pdf") {
                const reader = new FileReader();
                reader.onloadend = () => setPreviewUrl(reader.result);
                reader.readAsDataURL(file);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    // Reset preview when dialog closes
    useEffect(() => {
        if (!show) setPreviewUrl(null);
    }, [show]);

    const footer = (
        <div className="flex justify-end gap-2 mt-4">
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-danger"
                onClick={onClose}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-success"
                onClick={onSave}
            />
        </div>
    );

    return (
        <Dialog
            header={editingOrder ? "✏️ Edit Order" : "➕ Add New Order"}
            visible={show}
            style={{ width: "45rem" }}
            modal
            className="p-fluid"
            onHide={onClose}
            footer={footer}
        >
            <div className="grid formgrid p-fluid gap-3">
                {/* Date */}
                <div className="col-12 md:col-6">
                    <label htmlFor="date" className="font-medium mb-2">Date</label>
                    <Calendar
                        id="date"
                        value={formData.date ? new Date(formData.date) : null}
                        onChange={(e) => setFormData({ ...formData, date: e.value })}
                        dateFormat="yy-mm-dd"
                        showIcon
                        className="w-full"
                    />
                </div>

                {/* Enterprise */}
                <div className="col-12 md:col-6">
                    <label htmlFor="enterprise" className="font-medium mb-2">Enterprise</label>
                    <Dropdown
                        id="enterprise"
                        value={formData.enterpriseId || ""}
                        options={enterprise.map(ent => ({ label: ent.name, value: ent.id }))}
                        onChange={(e) => setFormData({ ...formData, enterpriseId: e.value })}
                        placeholder="-- Select Enterprise --"
                        className="w-full"
                    />
                </div>

                {/* Client */}
                <div className="col-12 md:col-6">
                    <label htmlFor="client" className="font-medium mb-2">Client</label>
                    <Dropdown
                        id="client"
                        value={formData.clientId || ""}
                        options={clients.map(c => ({ label: c.name, value: c.id }))}
                        onChange={(e) => setFormData({ ...formData, clientId: e.value })}
                        placeholder="-- Select Client --"
                        className="w-full"
                    />
                </div>

                {/* Description */}
                <div className="col-12">
                    <label htmlFor="description" className="font-medium mb-2">Description</label>
                    <InputTextarea
                        id="description"
                        rows={3}
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter order description..."
                    />
                </div>

                {/* Document Upload */}
                <div className="col-12">
                    <label htmlFor="document" className="font-medium mb-2">Document</label>
                    <FileUpload
                        name="file"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        mode="basic"
                        chooseLabel="Select File"
                        customUpload
                        auto={false}
                        onSelect={handleFileSelect}
                        className="w-full"
                    />
                    {formData.documentName && (
                        <small className="text-color-secondary block mt-2">
                            📄 Selected: {formData.documentName}
                        </small>
                    )}
                </div>

                {/* Preview (PDF or image) */}
                {previewUrl && (
                    <div className="col-12 mt-3">
                        <Card title="Preview" className="shadow-2 border-round-xl p-3">
                            {formData.file.type.startsWith("image/") ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full border-round-lg shadow-2"
                                />
                            ) : (
                                <iframe
                                    src={previewUrl}
                                    title="PDF Preview"
                                    width="100%"
                                    height="400px"
                                    className="border-round-lg shadow-2"
                                />
                            )}
                        </Card>
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default OrderDialog;
