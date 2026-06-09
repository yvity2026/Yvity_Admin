import AdminSectionPlaceholder from "@/components/admin/AdminSectionPlaceholder";
import { getPlaceholderMeta } from "@/lib/admin/navConfig";

const meta = getPlaceholderMeta("verification_rules");

export default function VerificationRulesPage() {
  return (
    <AdminSectionPlaceholder
      title={meta.title}
      description={meta.description}
      status={meta.status}
    />
  );
}
