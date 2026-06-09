import AdminSectionPlaceholder from "@/components/admin/AdminSectionPlaceholder";
import { getPlaceholderMeta } from "@/lib/admin/navConfig";

const meta = getPlaceholderMeta("industry_configuration");

export default function IndustryConfigPage() {
  return (
    <AdminSectionPlaceholder
      title={meta.title}
      description={meta.description}
      status={meta.status}
    />
  );
}
