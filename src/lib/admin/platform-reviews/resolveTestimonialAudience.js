const MAX_BULK_LIMIT = 200;

export function parseAudienceParams(searchParams = {}) {
  const limit = Math.min(
    Math.max(parseInt(searchParams.limit || "50", 10) || 50, 1),
    MAX_BULK_LIMIT,
  );

  return {
    userType: searchParams.userType || "all",
    city: searchParams.city || "all",
    service: searchParams.service || "all",
    company: searchParams.company || "all",
    plan: searchParams.plan || "all",
    registeredWithin: searchParams.registeredWithin || "30d",
    registeredFrom: searchParams.registeredFrom || "",
    registeredTo: searchParams.registeredTo || "",
    sort: searchParams.sort || "latest",
    limit,
    excludeWithPlatformTestimonial: (() => {
      const value = searchParams.excludeWithPlatformTestimonial;
      if (value === false || value === "false" || value === 0 || value === "0") {
        return false;
      }
      return true;
    })(),
  };
}

function registrationCutoff(params) {
  if (params.registeredFrom) {
    return { from: params.registeredFrom, to: params.registeredTo || null };
  }

  const now = new Date();
  const map = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };

  const days = map[params.registeredWithin];
  if (!days) return { from: null, to: null };

  const from = new Date(now);
  from.setDate(from.getDate() - days);
  return { from: from.toISOString(), to: null };
}

function matchesServiceFilter(services = [], service, company) {
  if (service === "all" && company === "all") return true;

  return services.some((item) => {
    const serviceType = String(item.service_type || item.title || item.category || "")
      .toLowerCase();
    const companyName = String(item.company || item.provider || "").toLowerCase();

    const serviceOk =
      service === "all" || serviceType.includes(String(service).toLowerCase());
    const companyOk =
      company === "all" || companyName.includes(String(company).toLowerCase());

    return serviceOk && companyOk;
  });
}

function maskPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 4 ? `••••${digits.slice(-4)}` : "—";
}

export function toPreviewRecipient(row) {
  return {
    id: row.id,
    name: row.name,
    city: row.city || null,
    userType: row.userType,
    userTypeLabel: row.userTypeLabel,
    plan: row.plan || "—",
    phoneMasked: row.phoneMasked || maskPhone(row.mobile),
    registeredAt: row.registeredAt || row.created_at || null,
  };
}

export async function getProfessionalUserIds(supabase) {
  const { data } = await supabase.from("advisor_profiles").select("advisor_id");
  return (data || []).map((row) => row.advisor_id).filter(Boolean);
}

export async function getSubmittedPlatformMobiles(supabase) {
  const { data } = await supabase.from("yvity_testimonials").select("mobile_number");
  return new Set(
    (data || [])
      .map((row) => String(row.mobile_number || "").replace(/\D/g, "").slice(-10))
      .filter(Boolean),
  );
}

export async function resolveSupabaseTestimonialAudience(supabase, params) {
  const professionalIds = await getProfessionalUserIds(supabase);
  const professionalSet = new Set(professionalIds);
  const submittedMobiles = params.excludeWithPlatformTestimonial
    ? await getSubmittedPlatformMobiles(supabase)
    : new Set();

  const { from, to } = registrationCutoff(params);

  let query = supabase
    .from("users")
    .select("id, name, mobile, city, profession, created_at, account_status")
    .eq("account_status", "active")
    .not("mobile", "is", null)
    .neq("mobile", "");

  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", `${to}T23:59:59.999Z`);

  if (params.city && params.city !== "all") {
    query = query.ilike("city", `%${params.city}%`);
  }

  query = query.order("created_at", { ascending: params.sort === "oldest" });

  const { data: users, error } = await query.limit(5000);
  if (error) throw error;

  let rows = users || [];

  if (params.userType === "professional") {
    rows = rows.filter((row) => professionalSet.has(row.id));
  } else if (params.userType === "customer") {
    rows = rows.filter((row) => !professionalSet.has(row.id));
  }

  if (params.plan && params.plan !== "all") {
    const { data: planRows } = await supabase
      .from("advisor_profiles")
      .select("advisor_id")
      .eq("subscription_plan", params.plan);

    const planSet = new Set((planRows || []).map((row) => row.advisor_id));
    rows = rows.filter((row) => planSet.has(row.id));
  }

  const needsServiceFilter =
    (params.service && params.service !== "all") ||
    (params.company && params.company !== "all");

  let servicesByUser = new Map();
  if (needsServiceFilter && rows.length) {
    const { data: services } = await supabase
      .from("advisor_services")
      .select("advisor_id, service_type, company")
      .in(
        "advisor_id",
        rows.map((row) => row.id),
      );

    for (const service of services || []) {
      const existing = servicesByUser.get(service.advisor_id) || [];
      existing.push(service);
      servicesByUser.set(service.advisor_id, existing);
    }

    rows = rows.filter((row) =>
      matchesServiceFilter(servicesByUser.get(row.id) || [], params.service, params.company),
    );
  }

  const recipients = [];

  for (const row of rows) {
    const mobile = String(row.mobile || "").replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(mobile)) continue;
    if (submittedMobiles.has(mobile)) continue;

    const isProfessional = professionalSet.has(row.id);
    recipients.push({
      id: row.id,
      name: row.name || "User",
      mobile,
      city: row.city || null,
      userType: isProfessional ? "professional" : "customer",
      userTypeLabel: isProfessional ? "Professional" : "Customer",
      phoneMasked: maskPhone(mobile),
      registeredAt: row.created_at,
      plan: "—",
    });

    if (recipients.length >= params.limit) break;
  }

  return recipients;
}

export async function fetchSupabaseAudienceOptions(supabase) {
  const [{ data: users }, { data: services }] = await Promise.all([
    supabase.from("users").select("city").not("city", "is", null).neq("city", "").limit(2000),
    supabase
      .from("advisor_services")
      .select("service_type, company")
      .limit(2000),
  ]);

  const cities = [
    ...new Set((users || []).map((row) => row.city).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  const serviceTypes = [
    ...new Set((services || []).map((row) => row.service_type).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  const companies = [
    ...new Set((services || []).map((row) => row.company).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  return { cities, services: serviceTypes, companies };
}
