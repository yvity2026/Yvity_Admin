"use client";

import { AdminFilterBar, AdminFilterSelect, AdminSearchInput } from "@/components/admin/ui";

export default function UsersSearchBar({
  query,
  onQueryChange,
  userType,
  onUserTypeChange,
  status,
  onStatusChange,
  plan,
  onPlanChange,
  registeredFrom,
  onRegisteredFromChange,
  registeredTo,
  onRegisteredToChange,
  onSubmit,
}) {
  const planDisabled = userType === "customer";

  return (
    <AdminFilterBar title="Search users" asForm onSubmit={onSubmit}>
      <AdminSearchInput
        label="Keywords"
        value={query}
        onChange={onQueryChange}
        placeholder="Name, city, service, company, profession, or user ID"
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <AdminFilterSelect label="User type" value={userType} onChange={onUserTypeChange}>
          <option value="all">All users</option>
          <option value="professional">Professionals</option>
          <option value="customer">Customers</option>
        </AdminFilterSelect>

        <AdminFilterSelect label="Status" value={status} onChange={onStatusChange}>
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </AdminFilterSelect>

        <AdminFilterSelect
          label="Plan"
          value={plan}
          onChange={onPlanChange}
          disabled={planDisabled}
        >
          <option value="all">All plans</option>
          <option value="free">Free</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
        </AdminFilterSelect>

        <AdminFilterSelect
          label="Registered from"
          type="date"
          value={registeredFrom}
          onChange={onRegisteredFromChange}
        />

        <AdminFilterSelect
          label="Registered to"
          type="date"
          value={registeredTo}
          onChange={onRegisteredToChange}
        />
      </div>
    </AdminFilterBar>
  );
}
