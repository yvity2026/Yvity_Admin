"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AdminPageTitleContext = createContext(null);

export function AdminPageTitleProvider({ children }) {
  const [titleOverride, setTitleOverride] = useState(null);

  const setPageTitle = useCallback((title) => {
    setTitleOverride(title || null);
  }, []);

  const value = useMemo(
    () => ({
      titleOverride,
      setPageTitle,
    }),
    [titleOverride, setPageTitle],
  );

  return (
    <AdminPageTitleContext.Provider value={value}>
      {children}
    </AdminPageTitleContext.Provider>
  );
}

export function useAdminPageTitle() {
  const context = useContext(AdminPageTitleContext);

  if (!context) {
    throw new Error("useAdminPageTitle must be used within AdminPageTitleProvider");
  }

  return context;
}
