import AdminSectionPlaceholder from "@/components/admin/AdminSectionPlaceholder";
import { getPlaceholderMeta } from "@/lib/admin/navConfig";

const meta = getPlaceholderMeta("industries");

export default function IndustriesPage() {
  return (
    <AdminSectionPlaceholder
      title={meta.title}
      description={meta.description}
      status={meta.status}
    />
  );
}
