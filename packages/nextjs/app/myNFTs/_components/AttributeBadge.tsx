import React, { useState } from "react";

export interface AttributeBadgeProps {
  traitType: string;
  value: string | number;
  className?: string;
}

export const AttributeBadge: React.FC<AttributeBadgeProps> = ({ traitType, value, className = "" }) => {
  const stringValue = String(value);
  const isLongValue = stringValue.length > 20;
  const [isVisible, setIsVisible] = useState(false);

  // Obtenir l'acronyme pour le type d'attribut
  const getAcronym = (traitType: string) => {
    const type = traitType.toLowerCase();
    switch (type) {
      case "resonance_frequency":
        return "RF:";
      case "secret_code":
        return "SC:";
      default:
        return "";
    }
  };

  // Format d'affichage selon le type d'attribut
  const getDisplayValue = () => {
    const acronym = getAcronym(traitType);

    // Resonance frequency avec acronyme
    if (traitType.toLowerCase() === "resonance_frequency") {
      return `${acronym} ${stringValue}`;
    }

    // Secret code avec toggle visibility - ACRONYME TOUJOURS VISIBLE
    if (traitType.toLowerCase() === "secret_code") {
      const displayValue = isVisible ? stringValue : "●●●●●●●●";
      return `${acronym} ${displayValue}`;
    }

    // Autres attributs longs
    if (isLongValue) {
      return `${stringValue.slice(0, 8)}...${stringValue.slice(-8)}`;
    }

    return stringValue;
  };

  const needsToggle = traitType.toLowerCase() === "secret_code" && isLongValue;

  return (
    <div className="flex items-center gap-1 w-fit max-w-full">
      <span
        className={`badge badge-secondary px-2 py-1 text-xs rounded-lg leading-tight ${className}`}
        title={`${traitType}: ${stringValue}`}
        style={{
          display: "inline-block",
          width: "fit-content",
          maxWidth: needsToggle ? (isVisible ? "250px" : "130px") : "200px",
          minHeight: isVisible && needsToggle ? "auto" : "auto",
          height: "auto",
          overflow: "visible",
          whiteSpace: isVisible && needsToggle ? "normal" : "nowrap",
          wordBreak: isVisible && needsToggle ? "break-all" : "normal",
          textAlign: "center",
          lineHeight: "1.2",
        }}
      >
        {getDisplayValue()}
      </span>

      {/* Eye toggle pour secret codes */}
      {needsToggle && (
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="text-xs opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
          title={isVisible ? "Masquer le code" : "Afficher le code complet"}
        >
          {isVisible ? "🙈" : "👁️"}
        </button>
      )}
    </div>
  );
};

export default AttributeBadge;
