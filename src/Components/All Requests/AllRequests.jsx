import React from "react";
import ServiceCardVf from "../Voluntering/volunteringFreelance/ServiceCardVf.jsx";
import ServiceCardCf from "../Custmoers/CustmerFreelance/ServiceCardCf.jsx";

export default function AllRequests() {
    return (
        <div className="pt-10">
            {/* القسم الأول */}
            <h1 className="text-3xl font-bold text-center mb-6">
                Available Orders
            </h1>
            <ServiceCardVf showAll={true} />

            {/* القسم الثاني */}
            <h1 className="text-3xl font-bold text-center mb-6 mt-10">
                Available Services
            </h1>
            <ServiceCardCf showAll={true} />
        </div>
    );
}
