import { buildPlansResponse } from "@/lib/admin/plans/mapPlanRecord";

import {

  getMembershipPlansSnapshot,

  useMembershipPlansStore,

} from "@/lib/local-data/membership-plans-store";



export function useLocalMembershipPlans() {

  return useMembershipPlansStore();

}



export function listLocalMembershipPlans() {

  const { plans, subscriberCounts } = getMembershipPlansSnapshot();

  return buildPlansResponse(plans, subscriberCounts);

}


