import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8000/api";

export default function BalanceSection({ balanceData, onBalanceUpdate }) {
    const navigate = useNavigate();
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const amounts = [199, 499, 999];
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) setUploadedFile(file);
    };

    const handleSubmit = async () => {
        if (!selectedAmount || !uploadedFile) return;
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("amount", selectedAmount);
            formData.append("image", uploadedFile);

            await axios.post(`${API}/recharge-balance`, formData, {
                headers: { ...headers, "Content-Type": "multipart/form-data" },
            });

            setIsSubmitted(true);
            setIsSubmitted(true);

            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        }
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto my-6 md:max-w-2xl md:p-12 lg:max-w-3xl">
            <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
                Recharge Balance
            </h2>

            {!isSubmitted ? (
                <>
                    {/* Current Balance */}
                    <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                        <p className="text-sm text-gray-600">Current Balance</p>
                        <p className="text-2xl font-bold text-green-600">
                            {balanceData?.balance || 0} EGP
                        </p>
                    </div>

                    {/* Amount Selection */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Amount (EGP)</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {amounts.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setSelectedAmount(amount)}
                                    className={`px-4 py-2 rounded-xl border-2 transition-all duration-200 ${selectedAmount === amount
                                            ? "border-green-600 bg-green-100 text-green-700 shadow-lg"
                                            : "border-gray-300 bg-white text-gray-700 hover:border-green-400"
                                        }`}
                                >
                                    <span className="text-xl font-bold">{amount}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Upload Screenshot */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Transfer Screenshot</h3>
                        <label className="block">
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 transition-colors">
                                {uploadedFile ? (
                                    <div>
                                        <p className="text-green-600 font-semibold">{uploadedFile.name}</p>
                                        <img
                                            src={URL.createObjectURL(uploadedFile)}
                                            alt="Preview"
                                            className="mt-2 max-h-20 mx-auto rounded"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Click to upload screenshot</p>
                                )}
                            </div>
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={!selectedAmount || !uploadedFile || loading}
                        className={`w-full py-2 rounded-xl font-bold text-white transition-all ${selectedAmount && uploadedFile && !loading
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Submitting..." : "Submit Recharge"}
                    </button>
                </>
            ) : (
                <div className="text-center">
                    
                        <p className="text-4xl mb-4">🎉</p>
                        <h3 className="text-xl font-bold text-green-600 mb-2">
                            Recharge Submitted!
                        </h3>
                        <p className="text-gray-600">
                            Your request has been received successfully.
                            <br />
                            The balance will be added within{" "}
                            <span className="font-semibold text-green-600">48 hours</span>.
                        </p>
                    
                </div>
            )}
        </div>
    );
}