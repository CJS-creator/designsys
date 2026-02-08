import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export function TabRedirect() {
    const { tabId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (tabId) {
            // Map path variable to query param
            // Preserve other query params if any
            const searchParams = new URLSearchParams(location.search);
            searchParams.set("tab", tabId);

            // Redirect to /app with the tab query param
            navigate({ pathname: "/app", search: searchParams.toString() }, { replace: true });
        } else {
            // Fallback if no tabId provided (should correspond to /app route if used elsewhere)
            navigate("/app", { replace: true });
        }
    }, [tabId, navigate, location.search]);

    return null; // Render nothing while redirecting
}
