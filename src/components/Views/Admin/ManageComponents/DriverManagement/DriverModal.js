import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DriverModal.css';

const DriverModal = ({ isOpen, onClose, driver = null, onSubmit }) => {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        surname: "",
        username: "",
        password: "",
        petrolAllowance: "",
        registrationId: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (driver) {
            setFormData({
                id: driver.id,
                name: driver.name,
                surname: driver.surname,
                username: driver.username,
                password: driver.password,
                petrolAllowance: driver.petrolAllowance,
                registrationId: driver.registration.id
            });
        } else {
            setFormData({
                id: "",
                name: "",
                surname: "",
                username: "",
                password: "",
                petrolAllowance: "",
                registrationId: ""
            });
        }
    }, [driver]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (driver) {
                await axios.put('http://localhost:8080/ClubCurry/driver/update', formData);
            } else {
                await axios.post('http://localhost:8080/ClubCurry/driver/save', formData);
            }
            onSubmit(); // Refresh list and close modal
            onClose(); // Close the modal after successful submission
        } catch (error) {
            setError("Error submitting form. Please try again.");
            console.error("Error submitting form", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-driver">
            <div className="modal-content-driver">
                <div className="modal-header-driver">
                    <h2>{driver ? "Edit Driver" : "Add Driver"}</h2>
                    <button className="close-button" onClick={onClose} aria-label="Close modal">
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body-driver">
                        {error && <p className="error-message">{error}</p>}
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                        <input type="text" name="surname" value={formData.surname} onChange={handleChange} placeholder="Surname" required />
                        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                        <input type="number" name="petrolAllowance" value={formData.petrolAllowance} onChange={handleChange} placeholder="Petrol Allowance" required />
                        <input type="text" name="registrationId" value={formData.registrationId} onChange={handleChange} placeholder="Registration Id" required />
                    </div>
                    <div className="modal-footer-driver">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DriverModal;
