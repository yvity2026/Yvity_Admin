export function filterApprovalRows(rows = [], params = {}) {

  let filtered = [...rows];

  const q = (params.q || "").trim().toLowerCase();



  if (q) {

    filtered = filtered.filter(

      (row) =>

        row.name.toLowerCase().includes(q) ||

        row.location.toLowerCase().includes(q) ||

        row.industry?.toLowerCase().includes(q) ||

        row.service?.toLowerCase().includes(q) ||

        row.designation.toLowerCase().includes(q) ||

        row.requestTypeLabel?.toLowerCase().includes(q) ||

        row.userShortId?.toLowerCase().includes(q) ||

        row.userId?.toLowerCase().includes(q),

    );

  }



  if (params.queue === "waiting") {

    filtered = filtered.filter(

      (row) => row.status === "pending" && row.waitingDays >= 3,

    );

  }



  const status = params.status || "all";

  if (status !== "all" && params.queue !== "waiting") {

    filtered = filtered.filter((row) => row.status === status);

  }



  if (params.requestType && params.requestType !== "all") {

    filtered = filtered.filter((row) => row.requestType === params.requestType);

  }



  if (params.plan && params.plan !== "all") {

    filtered = filtered.filter((row) => row.plan === params.plan);

  }



  if (params.featured === "hero") {

    filtered = filtered.filter((row) => row.isHero);

  } else if (params.featured === "landing") {

    filtered = filtered.filter((row) => row.isLanding);

  }



  return filtered;

}



export function paginateRows(rows, page = 1, limit = 10) {

  const safePage = Math.max(parseInt(page, 10) || 1, 1);

  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

  const from = (safePage - 1) * safeLimit;



  return {

    data: rows.slice(from, from + safeLimit),

    pagination: {

      page: safePage,

      limit: safeLimit,

      total: rows.length,

      totalPages: Math.ceil(rows.length / safeLimit) || 0,

    },

  };

}


