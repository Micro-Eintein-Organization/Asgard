import { useNavigate } from "react-router";
import { EntryChoice } from "./EntryChoice";
import { appRoutes } from "@/lib/routes";

export default function DiscoveryContainer() {
  const navigate = useNavigate();
  return (
    <EntryChoice
      onSelectChoice={(choice) => {
        void navigate(
          choice === "wizard" ? appRoutes.discovery : appRoutes.careers,
        );
      }}
    />
  );
}
