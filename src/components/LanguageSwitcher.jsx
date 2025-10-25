import React from "react";
import { Dropdown } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";

const LanguageSwitcher = ({ variant = "outline-light" }) => {
    const { language, setLanguage, languages } = useLanguage();

    const current = languages.find((option) => option.code === language) || languages[0];

    return (
        <Dropdown align="end" className="language-switcher">
            <Dropdown.Toggle variant={variant} size="sm" className="fw-semibold">
                {current?.label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {languages.map((option) => (
                    <Dropdown.Item
                        key={option.code}
                        active={option.code === language}
                        onClick={() => setLanguage(option.code)}
                    >
                        {option.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default LanguageSwitcher;

