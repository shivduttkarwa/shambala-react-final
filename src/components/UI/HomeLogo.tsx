import React from "react";

interface HomeLogoProps {
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
}

const HomeLogo: React.FC<HomeLogoProps> = ({
  className = "",
  style,
  ariaLabel = "Shambala Homes",
  onClick,
}) => {
  const publicUrl = import.meta.env.BASE_URL || "/";
  const logoPath = publicUrl.endsWith("/") 
    ? `${publicUrl}images/brand/shambala-homes-logo-white.svg`
    : `${publicUrl}/images/brand/shambala-homes-logo-white.svg`;

  return (
    <img
      src={logoPath}
      alt={ariaLabel}
      className={className}
      style={style}
      onClick={onClick}
      role="img"
      aria-label={ariaLabel}
    />
  );
};

export default HomeLogo;
