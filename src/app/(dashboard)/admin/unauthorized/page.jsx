export default function UnauthorizedAdminPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1] p-6 flex items-center justify-center">
      <div className="mx-auto max-w-2xl rounded-3xl border border-[#F59E0B]/30 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F59E0B]">
          Access Restricted
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#0a4a4a] font-cormorant">
          You do not have permission for this section
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 font-poppins">
          Ask a super admin to update your permissions if you need access to this
          area of the dashboard.
        </p>
      </div>
    </div>
  );
}
