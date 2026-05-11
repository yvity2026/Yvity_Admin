export default function UnauthorizedAdminPage() {
  return (
    <div className="min-h-screen bg-[#EEF2F0] p-6">
      <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Access Restricted
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          You do not have permission for this section
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Ask a super admin to update your permissions if you need access to this
          area of the dashboard.
        </p>
      </div>
    </div>
  );
}
