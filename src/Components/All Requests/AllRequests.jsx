import React from "react";
import ServiceCardVf from "../Voluntering/volunteringFreelance/ServiceCardVf.jsx";
import ServiceCardCf from "../Custmoers/CustmerFreelance/ServiceCardCf.jsx";
import { useTranslation } from "react-i18next";

export default function AllRequests() {
    const { t} = useTranslation();
    return (
        <div className="pt-10">
            {/* القسم الأول */}
            <h1 className="text-3xl font-bold text-center mb-6">
                {t("availableorders")}
            </h1>
            <ServiceCardVf showAll={true} />

            {/* القسم الثاني */}
            <h1 className="text-3xl font-bold text-center mb-6 mt-10">
                {t("availablService")}
            </h1>
            <ServiceCardCf showAll={true} />
        </div>
    );
}
