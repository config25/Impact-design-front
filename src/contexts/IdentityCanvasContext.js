import React, { createContext, useState } from "react";

export const IdentityCanvasContext = createContext();

const initialValues = {
    mission: "",
    vision: "",
    value: "",
    macro: "",
    tech: "",
    customer: "",
    competitor: "",
    capability: "",
    culture: "",
    structure: "",
    etc: "",
    newMission: "",
    newVision: "",
    newValue: "",
};

export const IdentityCanvasProvider = ({ children }) => {
    const [values, setValues] = useState(initialValues);

    const updateField = (key, value) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    const loadFromResponse = (data) => {
        if (!data) return;
        setValues({
            mission: data.mission || "",
            vision: data.vision || "",
            value: data.value || "",
            macro: data.macro || "",
            tech: data.tech || "",
            customer: data.customer || "",
            competitor: data.competitor || "",
            capability: data.capability || "",
            culture: data.culture || "",
            structure: data.structure || "",
            etc: data.etc || "",
            newMission: data.newMission || "",
            newVision: data.newVision || "",
            newValue: data.newValue || "",
        });
    };

    return (
        <IdentityCanvasContext.Provider value={{ values, updateField, loadFromResponse }}>
            {children}
        </IdentityCanvasContext.Provider>
    );
};
