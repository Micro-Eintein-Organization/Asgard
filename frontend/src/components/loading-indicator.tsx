import snowflake from "@/assets/Logo_Standalone_Snowflake.png";

export function LoadingIndicator({ size = "inline" }: { size?: "inline" | "panel" }) {
  return (
    <span className="loading-indicator" data-size={size} aria-hidden="true">
      <img src={snowflake} alt="" width={size === "panel" ? 32 : 16} height={size === "panel" ? 32 : 16} />
    </span>
  );
}
