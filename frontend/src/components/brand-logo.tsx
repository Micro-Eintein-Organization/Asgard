import logo from "@/assets/Logo_Snowflake+ASGARD_lightmode.png";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Asgard"
      width={650}
      height={146}
      className={`brand-logo ${className}`}
    />
  );
}
