import { Link, Navigate, useLocation } from "react-router";
import { ChevronDown } from "lucide-react";
import { coreApi, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CareerNavigation() {
  const { pathname } = useLocation();
  const active =
    pathname === appRoutes.careers || pathname.startsWith(appRoutes.roadmaps);
  return (
    <span className="inline-flex items-center">
      <Link
        to={appRoutes.roadmaps}
        className={active ? "active" : ""}
        aria-current={active ? "page" : undefined}
      >
        Career
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-3" aria-label="Career destinations">
          <ChevronDown size={16} aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link to={appRoutes.roadmaps}>Current roadmap</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={appRoutes.careers}>Career catalog</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={appRoutes.results}>Discovery results</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
}

export function CareerDestination() {
  const learning = useCoreQuery(["learning"], coreApi.learning);
  const id = learning.data?.current_roadmap_id;
  const roadmap = useCoreQuery(
    ["roadmap", id],
    () => coreApi.roadmap(id!),
    !!id,
  );
  const error = learning.error ?? roadmap.error;
  if (error)
    return (
      <div role="alert">
        <p>{error.message}</p>
        <button
          onClick={() => {
            void learning.refetch();
            if (id) void roadmap.refetch();
          }}
        >
          Reload saved focus
        </button>{" "}
        <Link to={appRoutes.careers}>Browse careers</Link>
      </div>
    );
  if (!learning.data || (id && !roadmap.data))
    return <p role="status">Opening your saved learning path…</p>;
  return (
    <Navigate
      replace
      to={
        id
          ? appRoutes.roadmap(roadmap.data!.career_id) + "?roadmap=" + id
          : appRoutes.careers
      }
    />
  );
}
