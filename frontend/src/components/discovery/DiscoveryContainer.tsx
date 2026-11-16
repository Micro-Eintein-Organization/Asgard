import { useSavedProfile } from "@/features/profile/identity";
import { useNavigate } from "react-router";
import { EntryChoice } from "./EntryChoice";
import { appRoutes } from "@/lib/routes";

export default function DiscoveryContainer() {
  const navigate = useNavigate();
  const saved = useSavedProfile();
  return (
    <EntryChoice firstName={saved.data?.profile?.first_name}
      onSelectChoice={(choice) => {
        void navigate(
          choice === "wizard" ? appRoutes.discovery : appRoutes.careers,
        );
      }}
    />
  );
}
