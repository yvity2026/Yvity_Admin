import { FaUser } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { LuUsersRound } from "react-icons/lu";
import {
  MdChatBubbleOutline,
  MdOutlineAnalytics,
  MdOutlineCampaign,
  MdOutlinePayment,
  MdOutlineReport,
  MdOutlineStar,
  MdOutlineVerified,
  MdOutlineVisibility,
} from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";
import { BsShield } from "react-icons/bs";
import { SiWechat } from "react-icons/si";
import { IoSettingsOutline } from "react-icons/io5";
import { RiCoupon3Line, RiPriceTag3Line, RiVipCrownLine } from "react-icons/ri";
import { BiBuildings, BiSliderAlt } from "react-icons/bi";
import { GiMedal } from "react-icons/gi";

/** Icon map keyed by navConfig item id. */
export const ADMIN_NAV_ICONS = {
  overview: <TbCategoryPlus />,
  users: <FaUser />,
  profiles: <LuUsersRound />,
  platform_testimonials: <MdOutlineStar />,
  advisor_testimonials: <MdChatBubbleOutline />,
  reports_complaints: <MdOutlineReport />,
  irdai_approvals: <BsShield />,
  industries: <BiBuildings />,
  industry_configuration: <BiSliderAlt />,
  verification_rules: <MdOutlineVerified />,
  visibility_controls: <MdOutlineVisibility />,
  products_plans: <TbCategoryPlus />,
  plans: <RiVipCrownLine />,
  pricing: <RiPriceTag3Line />,
  coupons: <RiCoupon3Line />,
  feature_controls: <SiWechat />,
  billing: <LuUsersRound />,
  payments: <MdOutlinePayment />,
  ambassadors: <GiMedal />,
  analytics: <MdOutlineAnalytics />,
  roles_permissions: <HiOutlineUserGroup />,
  communications: <MdOutlineCampaign />,
  campaigns: <MdOutlineCampaign />,
  settings: <IoSettingsOutline />,
};
