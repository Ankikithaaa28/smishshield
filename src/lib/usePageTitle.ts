import { useEffect } from "react";

/** Sets the document title when a page mounts. */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
