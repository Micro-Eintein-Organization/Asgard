import { useSavedProfile } from "@/features/profile/identity";
import { useNavigate } from "react-router";
import { EntryChoice } from "./EntryChoice";
import { appRoutes } from "@/lib/routes";
import { useAuth } from "@/auth/context";
import { rememberEntryChoice } from "@/features/auth/entry-choice";

export default function DiscoveryContainer() {
  const navigate = useNavigate();
  const saved = useSavedProfile();
  const { user } = useAuth();
  return (
    <EntryChoice firstName={saved.data?.profile?.first_name}
      onSelectChoice={(choice) => {
        if (user) rememberEntryChoice(user.id);
        void navigate(
          choice === "wizard" ? appRoutes.discovery : appRoutes.careers,
        );
      }}
    />
  );
}
