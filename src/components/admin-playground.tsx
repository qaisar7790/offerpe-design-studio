"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import {
  AreaChart,
  ArrowDown,
  ArrowUp,
  BadgeIndianRupee,
  BarChart3,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Filter,
  Flag,
  GripVertical,
  LayoutDashboard,
  Lock,
  Image as ImageIcon,
  Bell,
  Mail,
  Megaphone,
  Menu,
  MessageSquare,
  MoreHorizontal,
  MousePointerClick,
  Pencil,
  Plus,
  RotateCcw,
  ClipboardCheck,
  DownloadCloud,
  RefreshCw,
  AlertTriangle,
  Search,
  Share2,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Smartphone,
  Star,
  Store,
  Tag,
  Trash2,
  UploadCloud,
  Users,
  WalletCards,
  X,
  Bold,
  Italic,
  Heading2,
  LayoutGrid,
  List,
  ListOrdered,
  Undo2,
  Redo2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip as UiTooltip, TooltipContent as UiTooltipContent, TooltipProvider, TooltipTrigger as UiTooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type View = "conversion-resolutions" | "dashboard" | "merchants" | "reviews" | "merchant-onboarding-queue" | "trackier-queue" | "affiliate-networks" | "affiliate-network-new" | "affiliate-network-edit" | "merchant-edit" | "offers" | "offer-edit" | "promo-banners" | "promo-banner-edit" | "promo-banner-new" | "categories" | "category-mapping" | "category-edit" | "category-new" | "cashback-claims" | "transactions" | "clicks" | "withdrawals" | "rejection-reasons" | "communication-templates" | "communication-dispatches" | "users" | "app-versions" | "settings" | "cities" | "onboarding-screens" | "onboarding-slide-edit" | "onboarding-slide-new" | "legal-pages" | "merchant-staff" | "admin-users" | "roles" | "role-edit" | "conversions";
type RawMapping = { raw: string; mappedTo: string };
type ReviewStatus = "Pending" | "Approved" | "Rejected";
type Review = { id: string; user: string; merchant: string; rating: number; comment: string; photos: string[]; submitted: string; status: ReviewStatus; reason: string; note: string };
type Status = "Active" | "Inactive" | "Pending" | "Approved" | "Rejected" | "Requested" | "Paid";
type TemplateChannel = "Email" | "SMS" | "WhatsApp" | "Notification";
type TemplateCopy = { enabled: boolean; subject?: string; body: string };
type CommunicationTemplate = { id: string; name: string; event: string; description: string; trigger: string; variables: string[]; channels: Record<TemplateChannel, TemplateCopy> };
type Offer = { id: string; merchant: string; headline: string; subtext: string; details: string; terms: string; discountType: "Percentage" | "Flat amount"; discountValue: number; commissionType: "Percentage" | "Flat amount"; commissionValue: number; start: string; end: string; minBill: number; sortOrder: number; discountCap: number; commissionCap: number; redirectUrl: string; voucherLink: string; productLink: string; affiliate: string; featured: boolean; active: boolean };
type Banner = { id: string; title: string; placement: string; target: string; image: string; start: string; end: string; active: boolean };
type PromoSection = "HERO" | "PREMIUM DEALS" | "FLASH OFFERS" | "NEW ON PLATFORM";
type PromoBanner = { id: string; section: PromoSection; headline: string; image: string; tag: string; ctaText: string; ctaTarget: string; order: number; start: string; end: string; active: boolean };
type Category = { id: string; channel: "Online" | "Offline"; name: string; order: number; active: boolean; image: string; line1: string; line2: string };
type AffiliateNetwork = { id: string; name: string; propertyId: string; storeTemplate: string; voucherTemplate: string; productTemplate: string; active: boolean };
type OfferOrigin = { type: "merchant"; merchant: typeof merchants[number] } | { type: "listing" };

const groups = [
  { label: "Catalog", icon: ShoppingBag, items: [{ label: "Merchants", icon: Store, view: "merchants" as View }, { label: "Offers", icon: Tag, view: "offers" as View }, { label: "Promo Banners", icon: Megaphone, view: "promo-banners" as View }, { label: "Merchant Reviews", icon: Star, view: "reviews" as View }, { label: "Categories", icon: Tag, view: "categories" as View }] },
  { label: "Operations", icon: Settings2, items: [{ label: "Merchant Onboarding Queue", icon: ClipboardCheck, view: "merchant-onboarding-queue" as View }, { label: "Trackier Import Queue", icon: DownloadCloud, view: "trackier-queue" as View }, { label: "Affiliate Networks", icon: Share2, view: "affiliate-networks" as View }, { label: "Category Mapping", icon: Tag, view: "category-mapping" as View }] },
  { label: "Financial", icon: WalletCards, items: [{ label: "Cashback Claims", icon: CircleDollarSign, view: "cashback-claims" as View }, { label: "Conversion Resolutions", icon: RotateCcw, view: "conversion-resolutions" as View }, { label: "Online Conversions", icon: CircleDollarSign, view: "conversions" as View }, { label: "Transactions", icon: ArrowDown, view: "transactions" as View }, { label: "Clicks", icon: MousePointerClick, view: "clicks" as View }, { label: "Withdrawals", icon: BadgeIndianRupee, view: "withdrawals" as View }, { label: "Rejection Reasons", icon: Flag, view: "rejection-reasons" as View }] },
  { label: "Communication", icon: Megaphone, items: [{ label: "Templates", icon: MessageSquare, view: "communication-templates" as View }, { label: "Dispatches & Notifications", icon: Bell, view: "communication-dispatches" as View }] },
  { label: "System", icon: SlidersHorizontal, items: [{ label: "Users", icon: Users, view: "users" as View }, { label: "Cities", icon: Building2, view: "cities" as View }, { label: "App Versions", icon: Smartphone, view: "app-versions" as View }, { label: "Onboarding Screens", icon: ImageIcon, view: "onboarding-screens" as View }, { label: "Merchant Staff", icon: Store, view: "merchant-staff" as View }, { label: "Legal Pages", icon: FileText, view: "legal-pages" as View }, { label: "Admins", icon: Mail, view: "admin-users" as View }, { label: "Roles", icon: ShieldCheck, view: "roles" as View }, { label: "Settings", icon: Settings2, view: "settings" as View }] },
];

const merchants = [
  ["Theobroma", "Offline", "Premium Bakeries", 0, "Active", 3, "Up to 12%", ["Mumbai", "Bengaluru", "Delhi", "Pune", "Hyderabad"]],
  ["Absolute Barbecues", "Offline", "Restaurants", 0, "Active", 2, "8% default", ["Mumbai", "Bengaluru", "Hyderabad", "Chennai"]],
  ["Croma", "Online", "Electronics", 0, "Active", 5, "Up to 10%", ["Pan-India"]],
  ["Withdrawal Test Merchant", "Online", "Testing", 0, "Inactive", 0, "6% default", ["Mumbai"]],
  ["Nykaa", "Online", "Beauty", 1, "Active", 4, "Up to 11%", ["Pan-India"]],
  ["MakeMyTrip", "Online", "Travel", 1, "Active", 3, "8% default", ["Pan-India"]],
  ["Myntra", "Online", "Fashion", 1, "Active", 2, "Up to 9%", ["Pan-India"]],
  ["Big Bazaar", "Offline", "Department Stores", 2, "Inactive", 0, "6% default", ["Mumbai", "Pune", "Ahmedabad", "Surat"]],
  ["Hummel", "Online", "Fashion", 2, "Active", 2, "8% default", ["Mumbai", "Delhi", "Bengaluru"]],
  ["Nippon Paint FX10", "Online", "Home & Living", 3, "Active", 1, "Up to 7%", ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"]],
] as const;

const initialOffers: Offer[] = [
  { id: "OFF-1042", merchant: "Theobroma", headline: "Flat 10% cashback", subtext: "On all bakery items", details: "Get 10% of your bill amount credited as OfferPe wallet balance.", terms: "Valid on in-store purchases only.", discountType: "Percentage", discountValue: 10, commissionType: "Percentage", commissionValue: 5, start: "2026-08-29T06:53", end: "2026-09-30T23:59", minBill: 299, sortOrder: 1, discountCap: 100, commissionCap: 50, redirectUrl: "https://offerpe.link/r/theobroma-bakery", voucherLink: "offerpe://voucher/{id}", productLink: "offerpe://product/{slug}", affiliate: "None", featured: true, active: true },
  { id: "OFF-1041", merchant: "Theobroma", headline: "Celebration cakes", subtext: "A sweeter celebration", details: "Earn a flat cashback on celebration cakes.", terms: "Minimum bill value applies.", discountType: "Flat amount", discountValue: 150, commissionType: "Flat amount", commissionValue: 220, start: "2026-09-01T00:00", end: "2026-10-15T23:59", minBill: 999, sortOrder: 2, discountCap: 150, commissionCap: 220, redirectUrl: "", voucherLink: "offerpe://voucher/{id}", productLink: "", affiliate: "None", featured: false, active: true },
  { id: "OFF-1040", merchant: "Theobroma", headline: "First order bonus", subtext: "New customers only", details: "Extra cashback on your first purchase.", terms: "One redemption per customer.", discountType: "Percentage", discountValue: 10, commissionType: "Percentage", commissionValue: 12, start: "2026-09-10T00:00", end: "2026-12-31T23:59", minBill: 499, sortOrder: 3, discountCap: 200, commissionCap: 250, redirectUrl: "", voucherLink: "", productLink: "offerpe://product/{slug}", affiliate: "None", featured: true, active: true },
  { id: "OFF-1039", merchant: "Croma", headline: "Electronics weekend cashback", subtext: "Selected electronics", details: "Cashback on eligible electronics purchased online.", terms: "Exclusions apply.", discountType: "Percentage", discountValue: 4, commissionType: "Percentage", commissionValue: 6, start: "2026-09-01T00:00", end: "2026-11-30T23:59", minBill: 4999, sortOrder: 1, discountCap: 1500, commissionCap: 2000, redirectUrl: "https://offerpe.link/r/croma", voucherLink: "", productLink: "", affiliate: "Trackier", featured: true, active: true },
  { id: "OFF-1038", merchant: "Nykaa", headline: "Beauty essentials cashback", subtext: "Across selected brands", details: "Earn cashback on qualifying beauty purchases.", terms: "Selected products only.", discountType: "Percentage", discountValue: 8, commissionType: "Percentage", commissionValue: 11, start: "2026-08-15T00:00", end: "2026-10-31T23:59", minBill: 799, sortOrder: 2, discountCap: 500, commissionCap: 650, redirectUrl: "https://offerpe.link/r/nykaa", voucherLink: "", productLink: "", affiliate: "Impact", featured: false, active: true },
  { id: "OFF-1037", merchant: "Myntra", headline: "Fashion season offer", subtext: "App-only savings", details: "Cashback on fashion orders.", terms: "Not valid with select coupons.", discountType: "Percentage", discountValue: 6, commissionType: "Percentage", commissionValue: 9, start: "2026-07-01T00:00", end: "2026-08-31T23:59", minBill: 999, sortOrder: 4, discountCap: 400, commissionCap: 600, redirectUrl: "https://offerpe.link/r/myntra", voucherLink: "", productLink: "", affiliate: "Involve Asia", featured: false, active: false },
];

const initialCategories: Category[] = [
  { id: "CAT-101", channel: "Offline", name: "Restaurants", order: 1, active: true, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=240", line1: "Eat out. Earn more.", line2: "Cashback at restaurants near you." },
  { id: "CAT-102", channel: "Online", name: "Fashion", order: 2, active: true, image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=240", line1: "Fresh styles, rewarding prices.", line2: "Shop fashion from leading brands." },
  { id: "CAT-103", channel: "Online", name: "Electronics", order: 3, active: true, image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=240", line1: "Upgrade and earn.", line2: "Cashback on the latest technology." },
  { id: "CAT-104", channel: "Online", name: "Beauty", order: 4, active: true, image: "", line1: "Beauty that gives back.", line2: "Discover everyday essentials." },
  { id: "CAT-105", channel: "Offline", name: "Department Stores", order: 5, active: false, image: "", line1: "Everything in one place.", line2: "More value on every visit." },
  { id: "CAT-106", channel: "Online", name: "Travel", order: 6, active: true, image: "", line1: "Go farther for less.", line2: "Rewards on flights and stays." },
];

const initialMappings: RawMapping[] = [
  { raw: "baby and kids", mappedTo: "" },
  { raw: "beauty", mappedTo: "CAT-104" },
  { raw: "departmental", mappedTo: "CAT-105" },
  { raw: "education", mappedTo: "" },
  { raw: "electronics", mappedTo: "CAT-103" },
  { raw: "fashion", mappedTo: "CAT-102" },
  { raw: "flowers and gifting", mappedTo: "" },
  { raw: "food and grocery", mappedTo: "CAT-101" },
  { raw: "health and personal care", mappedTo: "" },
  { raw: "health and wellness", mappedTo: "" },
];

const initialAffiliateNetworks: AffiliateNetwork[] = [
  { id: "NET-101", name: "Trackier", propertyId: "", storeTemplate: "{tracking_url}&source={click_id}", voucherTemplate: "{voucher_deeplink}&source={click_id}", productTemplate: "{product_deeplink}&source={click_id}", active: true },
  { id: "NET-102", name: "Cuelinks", propertyId: "offerpe_in", storeTemplate: "https://linksredirect.com/?cid={property_id}&source={click_id}&url={deeplink_encoded}", voucherTemplate: "https://linksredirect.com/?cid={property_id}&source={click_id}&url={voucher_deeplink}", productTemplate: "https://linksredirect.com/?cid={property_id}&source={click_id}&url={product_deeplink}", active: true },
  { id: "NET-103", name: "vCommission", propertyId: "VC-48291", storeTemplate: "https://tracking.vcommission.com/aff_c?offer_id={property_id}&aff_sub={click_id}&url={deeplink_encoded}", voucherTemplate: "", productTemplate: "", active: false },
];

const initialPromoBanners: PromoBanner[] = [
  { id: "PB-101", section: "HERO", headline: "Flat cashback on your first order", image: "", tag: "NEW USERS", ctaText: "Claim Cashback", ctaTarget: "offerpe://offers/first-order", order: 1, start: "2026-08-29T10:19", end: "", active: true },
  { id: "PB-102", section: "PREMIUM DEALS", headline: "Absolute Barbecues: unlimited grills, 15% cashback", image: "", tag: "DINING", ctaText: "View Offer", ctaTarget: "offerpe://merchant/absolute-barbecues", order: 1, start: "2026-09-01T09:00", end: "2026-10-31T23:59", active: true },
  { id: "PB-103", section: "FLASH OFFERS", headline: "Croma: extra 5% cashback in-store", image: "", tag: "LIMITED TIME", ctaText: "Shop Now", ctaTarget: "offerpe://merchant/croma", order: 1, start: "2026-09-10T08:00", end: "2026-09-30T23:59", active: true },
  { id: "PB-104", section: "NEW ON PLATFORM", headline: "MakeMyTrip is now live on OfferPe", image: "", tag: "NEW", ctaText: "Explore", ctaTarget: "offerpe://merchant/makemytrip", order: 1, start: "2026-09-12T09:00", end: "", active: true },
  { id: "PB-105", section: "NEW ON PLATFORM", headline: "Big Bazaar is now live on OfferPe", image: "", tag: "NEW", ctaText: "Explore", ctaTarget: "offerpe://merchant/big-bazaar", order: 2, start: "2026-09-14T09:00", end: "", active: true },
  { id: "PB-106", section: "HERO", headline: "Festive season is here", image: "", tag: "FESTIVE", ctaText: "Discover Deals", ctaTarget: "offerpe://category/festive", order: 2, start: "2026-09-18T09:00", end: "2026-11-05T23:59", active: true },
  { id: "PB-107", section: "FLASH OFFERS", headline: "Nykaa: flash sale, up to 10% cashback", image: "", tag: "FLASH SALE", ctaText: "Shop Now", ctaTarget: "offerpe://merchant/nykaa", order: 2, start: "2026-09-20T09:00", end: "2026-09-25T23:59", active: true },
  { id: "PB-108", section: "PREMIUM DEALS", headline: "Myntra: up to 12% cashback on fashion", image: "", tag: "FASHION", ctaText: "View Offer", ctaTarget: "offerpe://merchant/myntra", order: 2, start: "2026-09-21T09:00", end: "2026-10-15T23:59", active: true },
];

type Application = { id: string; store: string; category: string; owner: string; phone: string; email: string; address: string; city: string; commission: string; documents: string[]; submitted: string; status: ReviewStatus; reason: string; note: string };

const onboardingRejectionReasons = ["Invalid GST/FSSAI documents", "Store category outside OfferPe scope", "Commission rate below platform threshold", "Unverifiable store location / storefront", "Duplicate merchant registration"];

const initialApplications: Application[] = [
  { id: "APP-3012", store: "Blue Tokai Coffee Roasters", category: "Cafes & Dining", owner: "Nikhil Desai", phone: "+91 98200 41122", email: "nikhil@bluetokai.example", address: "Linking Road, Bandra West", city: "Mumbai", commission: "12%", documents: ["GST registration", "FSSAI license", "Storefront photo"], submitted: "21 Sep 2026, 08:40", status: "Pending", reason: "", note: "" },
  { id: "APP-3011", store: "Third Wave Coffee Roasters", category: "Cafes & Dining", owner: "Shruti Kulkarni", phone: "+91 99019 77340", email: "shruti@thirdwave.example", address: "100 Feet Road, Indiranagar", city: "Bengaluru", commission: "10%", documents: ["GST registration", "FSSAI license"], submitted: "20 Sep 2026, 17:12", status: "Pending", reason: "", note: "" },
  { id: "APP-3010", store: "Urban Threads Studio", category: "Retail", owner: "Farhan Qureshi", phone: "+91 98111 22003", email: "farhan@urbanthreads.example", address: "Khan Market", city: "New Delhi", commission: "9%", documents: ["GST registration", "Storefront photo"], submitted: "19 Sep 2026, 12:05", status: "Approved", reason: "", note: "" },
  { id: "APP-3009", store: "Sunrise Kirana Mart", category: "Grocery", owner: "Rekha Patil", phone: "+91 90040 55871", email: "rekha@sunrisemart.example", address: "Kothrud", city: "Pune", commission: "4%", documents: ["GST registration"], submitted: "18 Sep 2026, 10:22", status: "Rejected", reason: "Commission rate below platform threshold", note: "Offered 4%, platform minimum for grocery is 6%." },
  { id: "APP-3008", store: "Glow Aesthetics Clinic", category: "Wellness", owner: "Dr. Ira Menon", phone: "+91 97400 31188", email: "ira@glowaesthetics.example", address: "Jubilee Hills", city: "Hyderabad", commission: "14%", documents: ["GST registration", "Storefront photo"], submitted: "17 Sep 2026, 15:48", status: "Approved", reason: "", note: "" },
  { id: "APP-3007", store: "Cafe Mocha Lane", category: "Cafes & Dining", owner: "Vikram Joshi", phone: "+91 98330 90210", email: "vikram@mochalane.example", address: "Salt Lake Sector V", city: "Kolkata", commission: "11%", documents: ["Storefront photo"], submitted: "16 Sep 2026, 09:31", status: "Rejected", reason: "Invalid GST/FSSAI documents", note: "GST certificate was illegible and FSSAI licence missing." },
];

type Claim = { id: string; userId: string; user: string; merchant: string; orderId: string; clickId: string; claimDate: string; claimTime: string; orderDate: string; orderValue: number; expectedCashback: number; proof: string; comment: string; status: ReviewStatus; reason: string; note: string };

const claimRejectionReasons = ["No matching click found", "Order placed outside OfferPe click window", "Order cancelled or returned", "Proof of purchase unreadable", "Duplicate claim for the same order", "Merchant category excluded from cashback"];

const rejectionCategories = ["Transaction Rejection Reason", "Retailer Onboarding Rejection Reason", "Review Rejection Reason", "Cashback Claims Rejection Reason", "Withdrawal Rejection Reason"] as const;
type RejectionCategory = (typeof rejectionCategories)[number];
const rejectionCategoryShort: Record<RejectionCategory, string> = { "Transaction Rejection Reason": "Transaction", "Retailer Onboarding Rejection Reason": "Retailer Onboarding", "Review Rejection Reason": "Review", "Cashback Claims Rejection Reason": "Cashback Claims", "Withdrawal Rejection Reason": "Withdrawal" };
type RejectionReason = { id: string; reason: string; category: RejectionCategory; order: number; active: boolean };

const initialRejectionReasons: RejectionReason[] = [
  { id: "RR-1", reason: "Order Cancelled", category: "Transaction Rejection Reason", order: 1, active: true },
  { id: "RR-2", reason: "Order Returned", category: "Transaction Rejection Reason", order: 2, active: true },
  { id: "RR-3", reason: "Fraud Suspected", category: "Transaction Rejection Reason", order: 3, active: true },
  { id: "RR-4", reason: "Network Rejected", category: "Transaction Rejection Reason", order: 4, active: true },
  { id: "RR-5", reason: "Other", category: "Transaction Rejection Reason", order: 5, active: true },
  { id: "RR-6", reason: "Invalid GST/FSSAI documents", category: "Retailer Onboarding Rejection Reason", order: 6, active: true },
  { id: "RR-7", reason: "Store category outside OfferPe scope", category: "Retailer Onboarding Rejection Reason", order: 7, active: true },
  { id: "RR-8", reason: "Duplicate merchant registration", category: "Retailer Onboarding Rejection Reason", order: 8, active: true },
  { id: "RR-9", reason: "Review contains abusive language", category: "Review Rejection Reason", order: 9, active: true },
  { id: "RR-10", reason: "Photo does not match the store", category: "Review Rejection Reason", order: 10, active: true },
  { id: "RR-11", reason: "Promotional or spam content", category: "Review Rejection Reason", order: 11, active: false },
  { id: "RR-12", reason: "No matching click found", category: "Cashback Claims Rejection Reason", order: 12, active: true },
  { id: "RR-13", reason: "Order placed outside OfferPe click window", category: "Cashback Claims Rejection Reason", order: 13, active: true },
  { id: "RR-14", reason: "Proof of purchase unreadable", category: "Cashback Claims Rejection Reason", order: 14, active: true },
  { id: "RR-15", reason: "Bank account details invalid", category: "Withdrawal Rejection Reason", order: 15, active: true },
  { id: "RR-16", reason: "Balance below minimum withdrawal amount", category: "Withdrawal Rejection Reason", order: 16, active: true },
  { id: "RR-17", reason: "KYC verification pending", category: "Withdrawal Rejection Reason", order: 17, active: true },
];

const templateChannels: TemplateChannel[] = ["Email", "SMS", "WhatsApp", "Notification"];

const initialCommunicationTemplates: CommunicationTemplate[] = [
  {
    id: "TPL-101",
    name: "Purchase Tracked",
    event: "online_purchase_pending",
    description: "Fires when an online purchase first tracks and enters ONLINE_PENDING.",
    trigger: "First online tracking event before approval.",
    variables: ["{{user_name}}", "{{amount}}", "{{merchant_name}}", "{{channel}}"],
    channels: {
      Email: { enabled: false, subject: "Tracked", body: "{{user_name}} / {{amount}} / {{merchant_name}} / {{channel}}" },
      SMS: { enabled: false, body: "Your Rs. {{amount}} cashback from {{merchant_name}} is tracked and pending approval." },
      WhatsApp: { enabled: false, body: "Your Rs. {{amount}} cashback from {{merchant_name}} is tracked and pending approval." },
      Notification: { enabled: false, subject: "Purchase tracked", body: "Your Rs. {{amount}} cashback from {{merchant_name}} is tracked." },
    },
  },
  {
    id: "TPL-102",
    name: "Cashback Approved",
    event: "cashback_approved",
    description: "Unified across offline redemption, approved online purchase, and final referral bonus cashback.",
    trigger: "Fires when cashback becomes final.",
    variables: ["{{user_name}}", "{{amount}}", "{{merchant_name}}", "{{channel}}"],
    channels: {
      Email: { enabled: false, subject: "Approved", body: "{{user_name}} / {{amount}} / {{merchant_name}} / {{channel}}" },
      SMS: { enabled: true, body: "Congrats! You earned {{amount}} reward points on OfferPe for shopping at {{merchant_name}}. https://www.offerpe.in | OfferPe by Zerothware" },
      WhatsApp: { enabled: false, body: "You earned Rs. {{amount}} cashback from {{merchant_name}}! Added to your OfferPe wallet." },
      Notification: { enabled: false, subject: "Cashback approved", body: "You earned Rs. {{amount}} cashback from {{merchant_name}}!" },
    },
  },
  {
    id: "TPL-103",
    name: "Cashback Rejected",
    event: "online_purchase_rejected",
    description: "Fires when an online purchase is reported as not approved.",
    trigger: "Network or admin rejection on tracked cashback.",
    variables: ["{{user_name}}", "{{amount}}", "{{merchant_name}}", "{{channel}}"],
    channels: {
      Email: { enabled: false, subject: "Rejected", body: "{{user_name}} / {{amount}} / {{merchant_name}} / {{channel}}" },
      SMS: { enabled: false, body: "Your Rs. {{amount}} cashback claim from {{merchant_name}} was not approved." },
      WhatsApp: { enabled: false, body: "Your Rs. {{amount}} cashback claim from {{merchant_name}} was not approved." },
      Notification: { enabled: false, subject: "Cashback not approved", body: "Your Rs. {{amount}} cashback claim from {{merchant_name}} was not approved." },
    },
  },
  {
    id: "TPL-104",
    name: "Cashback Withdrawn",
    event: "cashback_withdrawn",
    description: "Scaffold only — there is no withdrawal feature yet, so this never actually fires today. Edit freely; nothing sends.",
    trigger: "Scaffold only.",
    variables: [],
    channels: {
      Email: { enabled: false, subject: "", body: "" },
      SMS: { enabled: false, body: "Updated by content manager test" },
      WhatsApp: { enabled: false, body: "" },
      Notification: { enabled: false, subject: "", body: "" },
    },
  },
  {
    id: "TPL-105",
    name: "Review Approved",
    event: "merchant_review_approved",
    description: "Fires when an admin approves a submitted merchant review, making it publicly visible.",
    trigger: "Review moderation approval.",
    variables: ["{{user_name}}", "{{merchant_name}}"],
    channels: {
      Email: { enabled: false, subject: "Your review of {{merchant_name}} is live", body: "Hi {{user_name}}, your review of {{merchant_name}} has been approved and is now visible to other shoppers. Thanks for sharing your experience!" },
      SMS: { enabled: false, body: "{{user_name}}, your review of {{merchant_name}} is now live on OfferPe. Thanks for sharing!" },
      WhatsApp: { enabled: false, body: "Hi {{user_name}}, your review of {{merchant_name}} has been approved and is now visible to other shoppers." },
      Notification: { enabled: false, subject: "Review approved", body: "Your review of {{merchant_name}} is live!" },
    },
  },
  {
    id: "TPL-106",
    name: "Review Rejected",
    event: "merchant_review_rejected",
    description: "Fires when an admin rejects a submitted merchant review.",
    trigger: "Review moderation rejection.",
    variables: ["{{user_name}}", "{{merchant_name}}"],
    channels: {
      Email: { enabled: false, subject: "Your review of {{merchant_name}} was not approved", body: "Hi {{user_name}}, your review of {{merchant_name}} could not be approved this time. You're welcome to edit and resubmit it." },
      SMS: { enabled: false, body: "{{user_name}}, your review of {{merchant_name}} was not approved. You can edit and resubmit it anytime." },
      WhatsApp: { enabled: false, body: "Hi {{user_name}}, your review of {{merchant_name}} could not be approved this time. You're welcome to edit and resubmit it." },
      Notification: { enabled: false, subject: "Review not approved", body: "Your review of {{merchant_name}} was not approved." },
    },
  },
  {
    id: "TPL-107",
    name: "Merchant Onboarding Submitted",
    event: "merchant_onboarding_submitted",
    description: "Fires immediately when a merchant onboarding application is submitted from the web form or merchant app.",
    trigger: "Application submission received.",
    variables: ["{{contact_name}}", "{{store_name}}"],
    channels: {
      Email: { enabled: false, subject: "Application received for {{store_name}}", body: "Hi {{contact_name}}, we received your application for {{store_name}}." },
      SMS: { enabled: false, body: "{{contact_name}}, your OfferPe application for {{store_name}} has been received. We'll follow up soon." },
      WhatsApp: { enabled: false, body: "Hi {{contact_name}}, we've received your OfferPe application for {{store_name}}. Our team will review it and follow up soon." },
      Notification: { enabled: false, subject: "Application received", body: "Application received for {{store_name}}." },
    },
  },
  {
    id: "TPL-108",
    name: "Merchant Onboarding Approved",
    event: "merchant_onboarding_approved",
    description: "Fires when an admin approves a merchant onboarding application — the applicant can now log in to the merchant app with their registered phone number.",
    trigger: "Application approval saved.",
    variables: ["{{contact_name}}", "{{store_name}}"],
    channels: {
      Email: { enabled: false, subject: "", body: "Hi {{contact_name}}, {{store_name}} is approved!" },
      SMS: { enabled: false, body: "{{contact_name}}, {{store_name}} is approved and now live on OfferPe! Log in to the merchant app to get started." },
      WhatsApp: { enabled: false, body: "Hi {{contact_name}}, great news — {{store_name}} has been approved and is now live on OfferPe. Log in to the merchant app with your registered phone number to get started." },
      Notification: { enabled: false, subject: "Merchant approved", body: "{{store_name}} is approved and live!" },
    },
  },
  {
    id: "TPL-109",
    name: "Merchant Onboarding Rejected",
    event: "merchant_onboarding_rejected",
    description: "Fires when an admin rejects a merchant onboarding application.",
    trigger: "Application rejection saved.",
    variables: ["{{contact_name}}", "{{store_name}}", "{{rejection_reason}}"],
    channels: {
      Email: { enabled: false, subject: "", body: "Hi {{contact_name}}, {{store_name}} was not approved. Reason: {{rejection_reason}}." },
      SMS: { enabled: false, body: "{{contact_name}}, your OfferPe application for {{store_name}} was not approved. Reason: {{rejection_reason}}." },
      WhatsApp: { enabled: false, body: "Hi {{contact_name}}, unfortunately your OfferPe application for {{store_name}} was not approved. Reason: {{rejection_reason}}." },
      Notification: { enabled: false, subject: "Application update", body: "Update on your {{store_name}} application." },
    },
  },
];

const initialClaims: Claim[] = [
  { id: "CLM-5042", userId: "USR-88214", user: "Ananya Rao", merchant: "Myntra", orderId: "MYN-77120934", clickId: "clk_9f42ab7c", claimDate: "21 Sep 2026", claimTime: "09:12", orderDate: "14 Sep 2026", orderValue: 4299, expectedCashback: 344, proof: "order-confirmation.png", comment: "Cashback did not track even though I came through the OfferPe app.", status: "Pending", reason: "", note: "" },
  { id: "CLM-5041", userId: "USR-75903", user: "Rahul Menon", merchant: "Croma", orderId: "CRM-4408217", clickId: "clk_2b71de09", claimDate: "20 Sep 2026", claimTime: "18:44", orderDate: "12 Sep 2026", orderValue: 28990, expectedCashback: 1449, proof: "invoice-croma.pdf", comment: "Bought a washing machine, cashback still missing after 7 days.", status: "Pending", reason: "", note: "" },
  { id: "CLM-5040", userId: "USR-91247", user: "Sneha Iyer", merchant: "Nykaa", orderId: "NYK-33019876", clickId: "clk_77c1a4e2", claimDate: "20 Sep 2026", claimTime: "11:05", orderDate: "11 Sep 2026", orderValue: 2150, expectedCashback: 215, proof: "nykaa-order.png", comment: "Order delivered, no cashback in wallet.", status: "Pending", reason: "", note: "" },
  { id: "CLM-5039", userId: "USR-68450", user: "Imran Shaikh", merchant: "Myntra", orderId: "MYN-77118420", clickId: "clk_51ba0d33", claimDate: "19 Sep 2026", claimTime: "16:20", orderDate: "08 Sep 2026", orderValue: 1899, expectedCashback: 152, proof: "myntra-order.png", comment: "Missing cashback on a fashion order.", status: "Approved", reason: "", note: "Click found in logs, conversion created with source = CLAIM." },
  { id: "CLM-5038", userId: "USR-83172", user: "Priya Nair", merchant: "Croma", orderId: "CRM-4407004", clickId: "", claimDate: "18 Sep 2026", claimTime: "10:02", orderDate: "05 Sep 2026", orderValue: 7499, expectedCashback: 375, proof: "screenshot.jpg", comment: "Cashback not credited.", status: "Rejected", reason: "No matching click found", note: "No OfferPe click recorded within 30 days of the order date." },
  { id: "CLM-5037", userId: "USR-59310", user: "Devansh Gupta", merchant: "Nykaa", orderId: "NYK-33015512", clickId: "clk_1de9f004", claimDate: "17 Sep 2026", claimTime: "14:37", orderDate: "02 Sep 2026", orderValue: 999, expectedCashback: 100, proof: "nykaa-invoice.pdf", comment: "Placed via app, no cashback.", status: "Approved", reason: "", note: "" },
  { id: "CLM-5036", userId: "USR-70188", user: "Meera Krishnan", merchant: "Myntra", orderId: "MYN-77101288", clickId: "clk_84aa22b1", claimDate: "16 Sep 2026", claimTime: "09:55", orderDate: "29 Aug 2026", orderValue: 3499, expectedCashback: 280, proof: "order.png", comment: "Returned one item but kept the rest.", status: "Rejected", reason: "Order cancelled or returned", note: "Merchant reported the full order as returned." },
];



type StagedOffer = { headline: string; terms: string; discountType: string; discountValue: string; commissionType: string; commissionValue: string };
type StagedCampaign = { id: string; trackierId: string; name: string; categoryId: string; rawCategory: string; about: string; logo: string; website: string; trackingTime: string; approvalTime: string; displayOrder: string; attribution: string; trackingUrl: string; offers: StagedOffer[] };
type SyncRun = { id: string; started: string; trigger: "MANUAL" | "SCHEDULED"; status: "SUCCEEDED" | "FAILED"; fetched: number; staged: number; updated: number; skips: number; errors: string[] };

const campaignRejectionReasons = ["Duplicate merchant", "Inactive affiliate program", "Commission below platform threshold", "Category outside OfferPe scope", "Incomplete campaign data"];

const initialCampaigns: StagedCampaign[] = [
  { id: "TRK-1123", trackierId: "#1123", name: "Strch", categoryId: "CAT-102", rawCategory: "fashion", about: "Strch, India's first and softest activewear brand, crafts high-quality sportswear that feels as good as it looks. Our clothing is made with engineered Nylon Spandex fabric, designed to provide the perfect balance of comfort, flexibility, and durability. Brand Bidding/PPC/Meta ads, etc., are strictly prohibited.", logo: "https://static.vnative.co/images/6aa91555eb372.png", website: "https://strch.com", trackingTime: "5", approvalTime: "45", displayOrder: "3", attribution: "Web", trackingUrl: "https://track.techtrack.in/click?campaign_id=1123&pub_id=679", offers: [{ headline: "Strch", terms: "Do not visit the merchant's website through any other source before using our link. Try to complete your purchase within 30 minutes of clicking our tracking link. Use only coupon codes available on our platform. Third-party coupon codes may invalidate your cashback.", discountType: "%", discountValue: "19.2", commissionType: "%", commissionValue: "32" }] },
  { id: "TRK-1125", trackierId: "#1125", name: "Bersache", categoryId: "", rawCategory: "Men's Footwear", about: "", logo: "", website: "https://bersache.com", trackingTime: "10", approvalTime: "60", displayOrder: "1", attribution: "Web", trackingUrl: "https://track.techtrack.in/click?campaign_id=1125&pub_id=679", offers: [{ headline: "Bersache", terms: "Complete the purchase in a single session after clicking the tracking link. Cashback is void on cancelled or returned orders.", discountType: "%", discountValue: "18", commissionType: "%", commissionValue: "30" }] },
  { id: "TRK-1128", trackierId: "#1128", name: "Bombay Shaving Company", categoryId: "CAT-104", rawCategory: "health and personal care", about: "Bombay Shaving Company builds precision grooming products for men and women — razors, beard care, skincare and gifting ranges designed and manufactured in India.", logo: "https://static.vnative.co/images/9bd21a44ce118.png", website: "https://bombayshavingcompany.com", trackingTime: "8", approvalTime: "30", displayOrder: "2", attribution: "Web", trackingUrl: "https://track.techtrack.in/click?campaign_id=1128&pub_id=679", offers: [{ headline: "Bombay Shaving Company", terms: "Cashback applies on prepaid orders only. Combo and gift-card purchases are excluded from the cashback programme.", discountType: "%", discountValue: "12.5", commissionType: "%", commissionValue: "22" }] },
];

const initialSyncRuns: SyncRun[] = [
  { id: "RUN-4019", started: "19 Sept 2026, 12:20 pm", trigger: "MANUAL", status: "SUCCEEDED", fetched: 61, staged: 2, updated: 57, skips: 1, errors: ["Campaign #1131: logo URL returned HTTP 404"] },
  { id: "RUN-4018", started: "2 Sept 2026, 4:21 pm", trigger: "MANUAL", status: "SUCCEEDED", fetched: 64, staged: 19, updated: 44, skips: 1, errors: [] },
  { id: "RUN-4017", started: "2 Sept 2026, 5:43 am", trigger: "MANUAL", status: "SUCCEEDED", fetched: 13, staged: 0, updated: 12, skips: 1, errors: [] },
  { id: "RUN-4016", started: "2 Sept 2026, 5:36 am", trigger: "SCHEDULED", status: "SUCCEEDED", fetched: 13, staged: 0, updated: 12, skips: 1, errors: [] },
];

const rejectionReasons = ["Profanity / abusive content", "Irrelevant / spam", "False or misleading claims", "Competitor promotion", "Personal identification information (PII)"];

const initialReviews: Review[] = [
  { id: "REV-2041", user: "Ananya Sharma", merchant: "Theobroma", rating: 5, comment: "The brownies were fresh and the staff applied my OfferPe cashback instantly at billing. Great experience overall.", photos: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=320", "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=320"], submitted: "21 Sep 2026, 09:14", status: "Pending", reason: "", note: "" },
  { id: "REV-2040", user: "Rahul Mehta", merchant: "Croma", rating: 4, comment: "Bought a soundbar in-store. Cashback tracked within a day, though the billing queue was long on a weekend.", photos: [], submitted: "20 Sep 2026, 18:42", status: "Pending", reason: "", note: "" },
  { id: "REV-2039", user: "Priya Nair", merchant: "Absolute Barbecues", rating: 5, comment: "Buffet spread was excellent and the team knew exactly how the OfferPe QR flow works.", photos: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=320"], submitted: "20 Sep 2026, 13:05", status: "Pending", reason: "", note: "" },
  { id: "REV-2038", user: "Kabir Singh", merchant: "Nykaa", rating: 4, comment: "Ordered skincare during the sale. Cashback reflected correctly in the wallet.", photos: [], submitted: "19 Sep 2026, 11:30", status: "Approved", reason: "", note: "" },
  { id: "REV-2037", user: "Meera Iyer", merchant: "Theobroma", rating: 5, comment: "Celebration cake was delivered on time and the store honoured the running offer.", photos: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=320"], submitted: "18 Sep 2026, 16:20", status: "Approved", reason: "", note: "" },
  { id: "REV-2036", user: "Devansh Gupta", merchant: "Myntra", rating: 2, comment: "Check out shopdealz dot in instead, much better prices than here.", photos: [], submitted: "17 Sep 2026, 08:55", status: "Rejected", reason: "Competitor promotion", note: "Review promotes an external marketplace." },
  { id: "REV-2035", user: "Sana Khan", merchant: "Croma", rating: 3, comment: "Decent service. Call me on my number for details about the offer.", photos: [], submitted: "16 Sep 2026, 19:10", status: "Rejected", reason: "Personal identification information (PII)", note: "Contact details shared in public review." },
  { id: "REV-2034", user: "Arjun Rao", merchant: "MakeMyTrip", rating: 5, comment: "Flight booking cashback was credited faster than expected. Smooth process.", photos: [], submitted: "15 Sep 2026, 21:48", status: "Approved", reason: "", note: "" },
];

function createBlankOffer(merchant: string): Offer {
  return { id: `OFF-${Date.now()}`, merchant, headline: "", subtext: "", details: "", terms: "", discountType: "Percentage", discountValue: 10, commissionType: "Percentage", commissionValue: 5, start: "2026-09-21T09:00", end: "", minBill: 0, sortOrder: 1, discountCap: 0, commissionCap: 0, redirectUrl: "", voucherLink: "", productLink: "", affiliate: "None", featured: false, active: true };
}

type Conversion = {
  cashback: string; click: string | null; order: string; merchant: string; status: Status;
  value: string; reported: string; calculated: string; orderDate: string; created: string;
  resolved: string | null; rejection: string | null; notes: string; withdrawal: string | null; invoice: string | null;
};

const conversionSeeds: Conversion[] = [
  { cashback: "CB-84921", click: "clk_72a9f4", order: "ORD-72194", merchant: "Myntra", status: "Pending", value: "₹3,499.00", reported: "₹279.92", calculated: "₹262.43", orderDate: "20 Sep 2026, 14:32", created: "20 Sep 2026, 14:42", resolved: null, rejection: null, notes: "Awaiting merchant validation", withdrawal: null, invoice: null },
  { cashback: "CB-84920", click: "clk_16bd03", order: "ORD-88217", merchant: "Nykaa", status: "Approved", value: "₹1,890.00", reported: "₹151.20", calculated: "₹151.20", orderDate: "20 Sep 2026, 10:57", created: "20 Sep 2026, 11:18", resolved: "20 Sep 2026, 17:05", rejection: null, notes: "Matched automatically", withdrawal: null, invoice: "INV-2026/09-0012" },
  { cashback: "CB-84918", click: "clk_b872ad", order: "ORD-59103", merchant: "Croma", status: "Rejected", value: "₹42,990.00", reported: "₹859.80", calculated: "₹0.00", orderDate: "19 Sep 2026, 17:44", created: "19 Sep 2026, 18:06", resolved: "20 Sep 2026, 09:11", rejection: "Cancelled by user", notes: "Cancellation confirmed by merchant", withdrawal: null, invoice: null },
  { cashback: "CB-84912", click: "clk_0cd721", order: "ORD-33819", merchant: "MakeMyTrip", status: "Requested", value: "₹16,420.00", reported: "₹492.60", calculated: "₹492.60", orderDate: "19 Sep 2026, 09:38", created: "19 Sep 2026, 09:51", resolved: "19 Sep 2026, 16:26", rejection: null, notes: "Included in current withdrawal batch", withdrawal: "WD-009821", invoice: "INV-2026/09-0009" },
  { cashback: "CB-84901", click: null, order: "ORD-44531", merchant: "Theobroma", status: "Paid", value: "₹860.00", reported: "₹68.80", calculated: "₹64.50", orderDate: "18 Sep 2026, 15:48", created: "18 Sep 2026, 16:20", resolved: "18 Sep 2026, 19:02", rejection: null, notes: "Settled via September payout", withdrawal: "WD-009806", invoice: "INV-2026/09-0004" },
  { cashback: "CB-84889", click: "clk_081af3", order: "ORD-10773", merchant: "Hummel", status: "Approved", value: "₹5,299.00", reported: "₹423.92", calculated: "₹397.43", orderDate: "18 Sep 2026, 09:57", created: "18 Sep 2026, 10:12", resolved: "18 Sep 2026, 14:38", rejection: null, notes: "Manual validation completed", withdrawal: null, invoice: "INV-2026/09-0001" },
  { cashback: "CB-84876", click: "clk_a841dc", order: "ORD-24018", merchant: "Big Bazaar", status: "Rejected", value: "₹2,140.00", reported: "₹85.60", calculated: "₹0.00", orderDate: "17 Sep 2026, 17:22", created: "17 Sep 2026, 17:44", resolved: "18 Sep 2026, 11:09", rejection: "Duplicate transaction", notes: "Duplicate of CB-84874", withdrawal: null, invoice: null },
  { cashback: "CB-84865", click: "clk_11f6b2", order: "ORD-90417", merchant: "Nippon Paint FX10", status: "Pending", value: "₹8,750.00", reported: "₹350.00", calculated: "₹350.00", orderDate: "17 Sep 2026, 12:03", created: "17 Sep 2026, 12:29", resolved: null, rejection: null, notes: "Invoice evidence requested", withdrawal: null, invoice: null },
  { cashback: "CB-84852", click: "clk_c38b92", order: "ORD-62281", merchant: "Absolute Barbecues", status: "Approved", value: "₹4,260.00", reported: "₹340.80", calculated: "₹319.50", orderDate: "16 Sep 2026, 20:11", created: "16 Sep 2026, 20:28", resolved: "17 Sep 2026, 08:40", rejection: null, notes: "Validated against offline report", withdrawal: null, invoice: "INV-2026/09-0098" },
  { cashback: "CB-84841", click: null, order: "ORD-56192", merchant: "Nykaa", status: "Paid", value: "₹2,599.00", reported: "₹207.92", calculated: "₹194.93", orderDate: "16 Sep 2026, 15:14", created: "16 Sep 2026, 15:39", resolved: "16 Sep 2026, 19:21", rejection: null, notes: "Settled successfully", withdrawal: "WD-009794", invoice: "INV-2026/09-0091" },
];

const conversions: Conversion[] = Array.from({ length: 148 }, (_, index) => {
  const seed = conversionSeeds[index % conversionSeeds.length];
  if (!seed) throw new Error("Conversion seed data is unavailable");
  const cycle = Math.floor(index / conversionSeeds.length);
  return cycle === 0 ? seed : {
    ...seed,
    cashback: `CB-${84840 - index}`,
    click: seed.click ? `${seed.click}_${cycle}` : null,
    order: `ORD-${String(56192 - index * 37).padStart(5, "0")}`,
    withdrawal: seed.withdrawal ? `WD-${String(9794 - index).padStart(6, "0")}` : null,
    invoice: seed.invoice ? `INV-2026/09-${String(91 - index).padStart(4, "0")}` : null,
  };
});

type TransactionStatus = "Pending" | "Approved" | "Rejected" | "Pending Bill";
type OnlineTransaction = { id: string; status: TransactionStatus; userId: string; orderValue: number; reported: number; calculated: number; rejection: string; click: string; created: string; updated: string };
type OfflineTransaction = { id: string; status: TransactionStatus; userId: string; billAmount: number | null; discount: number | null; payable: number | null; commission: number | null; confirmedBy: string; merchant: string; occurred: string };
type LedgerEntry = { id: string; type: "OFFLINE_REDEMPTION" | "ONLINE_PENDING"; userId: string; amount: number; merchant: string; offer: string; resolution: string; occurred: string };
type ClickRecord = { token: string; occurred: string; date: string; userId: string; merchant: string; offer: string; discountType: "Percentage" | "Flat amount"; discountValue: number; commissionType: "Percentage" | "Flat amount" | null; commissionValue: number | null; minBill: number | null; discountCap: number | null; commissionCap: number | null };
type WithdrawalStatus = "Requested" | "Paid" | "Failed";
type Withdrawal = { id: string; userId: string; amount: number; mode: "Bank Account" | "UPI" | "Gift Card"; payoutDetails: string; status: WithdrawalStatus; requested: string; date: string; resolved: string; utr: string; notes: string };
type CommunicationTab = "analytics" | "dispatches" | "notifications";
type AnalyticsEvent = { id: string; event: string; group: "Session" | "Screen" | "Action" | "Engagement"; screen: string; userId: string; properties: Record<string, string | number> | null; session: string; occurred: string; date: string };
type DispatchDelivery = "SENT" | "FAILED" | "QUEUED" | "DELIVERED";
type CommunicationDispatch = { id: string; type: string; template: string; channel: TemplateChannel; title: string; body: string; read: "Yes" | "No"; delivery: DispatchDelivery; userId: string; occurred: string; date: string };
type NotificationLog = { id: string; type: string; title: string; body: string; read: "Yes" | "No"; delivery: DispatchDelivery; userId: string; session: string; occurred: string; date: string };
type UserStatus = "Active" | "Inactive";
type DeletedFilter = "all" | "yes" | "no";
type UserDateField = "lastLogin" | "signedUp" | "deletedAt" | "reRegisteredAt";
type UserRecord = { id: string; name: string; phone: string; email: string; status: UserStatus; deleted: boolean; reRegistered: boolean; lastLoginIp: string; lastLoginAgent: string; lastLoginAt: string; lastLoginDate: string; signedUp: string; signedUpDate: string; deletedAt: string; deletedDate: string; reRegisteredAt: string; reRegisteredDate: string; city: string; source: string; wallet: number };
type PermissionGroupName = "Catalog" | "Operations" | "Financial" | "Communication" | "System";
type Permission = { key: string; group: PermissionGroupName };
type AdminRole = { id: string; name: string; description: string; permissions: string[]; admins: number; system: boolean; updated: string };
type AdminUserStatus = "Active" | "Invited" | "Disabled";
type AdminUser = { id: string; name: string; email: string; role: string; status: AdminUserStatus; lastActive: string; created: string };

const onlineTransactions: OnlineTransaction[] = [
  { id: "TXN-94128", status: "Pending", userId: "USR-10294", orderValue: 4299, reported: 344, calculated: 322, rejection: "—", click: "clk_9f42ab7c", created: "21 Sep 2026, 09:18", updated: "21 Sep 2026, 09:22" },
  { id: "TXN-94127", status: "Approved", userId: "USR-08471", orderValue: 1890, reported: 151, calculated: 151, rejection: "—", click: "clk_2b71de09", created: "20 Sep 2026, 18:44", updated: "21 Sep 2026, 08:10" },
  { id: "TXN-94125", status: "Rejected", userId: "USR-06322", orderValue: 7499, reported: 375, calculated: 0, rejection: "No matching click found", click: "—", created: "20 Sep 2026, 11:05", updated: "20 Sep 2026, 16:34" },
  { id: "TXN-94122", status: "Pending", userId: "USR-11806", orderValue: 2150, reported: 215, calculated: 204, rejection: "—", click: "clk_77c1a4e2", created: "19 Sep 2026, 17:26", updated: "19 Sep 2026, 17:26" },
  { id: "TXN-94119", status: "Approved", userId: "USR-04519", orderValue: 28990, reported: 1449, calculated: 1377, rejection: "—", click: "clk_51ba0d33", created: "19 Sep 2026, 10:02", updated: "20 Sep 2026, 09:41" },
];

const offlineTransactions: OfflineTransaction[] = [
  { id: "OFF-78321", status: "Pending Bill", userId: "USR-09734", billAmount: null, discount: null, payable: null, commission: null, confirmedBy: "—", merchant: "Absolute Barbecues", occurred: "19 Sep 2026, 06:08" },
  { id: "OFF-78318", status: "Approved", userId: "USR-08152", billAmount: 2380, discount: 238, payable: 2142, commission: 286, confirmedBy: "Rahul S.", merchant: "Theobroma", occurred: "18 Sep 2026, 20:14" },
  { id: "OFF-78312", status: "Approved", userId: "USR-06290", billAmount: 1650, discount: 165, payable: 1485, commission: 198, confirmedBy: "Neha P.", merchant: "Blue Tokai Coffee", occurred: "18 Sep 2026, 17:42" },
  { id: "OFF-78304", status: "Rejected", userId: "USR-11045", billAmount: 899, discount: null, payable: null, commission: null, confirmedBy: "—", merchant: "Croma", occurred: "17 Sep 2026, 13:09" },
];

const ledgerEntries: LedgerEntry[] = [
  { id: "LED-6201", type: "OFFLINE_REDEMPTION", userId: "USR-07853", amount: 250, merchant: "—", offer: "—", resolution: "—", occurred: "19 Sep 2026, 11:50" },
  { id: "LED-6202", type: "OFFLINE_REDEMPTION", userId: "USR-09127", amount: 250, merchant: "—", offer: "—", resolution: "—", occurred: "19 Sep 2026, 14:36" },
  { id: "LED-6203", type: "OFFLINE_REDEMPTION", userId: "USR-06418", amount: 250, merchant: "—", offer: "—", resolution: "—", occurred: "19 Sep 2026, 16:06" },
  { id: "LED-6204", type: "ONLINE_PENDING", userId: "USR-10294", amount: 60, merchant: "Croma", offer: "Up to 4% cashback", resolution: "Still pending", occurred: "19 Sep 2026, 19:17" },
  { id: "LED-6205", type: "ONLINE_PENDING", userId: "USR-10294", amount: 60, merchant: "Croma", offer: "Up to 4% cashback", resolution: "Still pending", occurred: "19 Sep 2026, 19:18" },
  { id: "LED-6206", type: "ONLINE_PENDING", userId: "USR-10294", amount: 20, merchant: "Croma", offer: "Up to 4% cashback", resolution: "Still pending", occurred: "19 Sep 2026, 19:20" },
  { id: "LED-6207", type: "OFFLINE_REDEMPTION", userId: "USR-08836", amount: 250, merchant: "—", offer: "—", resolution: "—", occurred: "19 Sep 2026, 19:21" },
  { id: "LED-6208", type: "ONLINE_PENDING", userId: "USR-10294", amount: 60, merchant: "Croma", offer: "Up to 4% cashback", resolution: "Still pending", occurred: "20 Sep 2026, 04:07" },
];

const clickRecords: ClickRecord[] = [
  { token: "5a63726b883505650248e9c6", occurred: "21 Sep 2026, 12:18 pm", date: "2026-09-21", userId: "USR-10294", merchant: "MakeMyTrip", offer: "Up to 8% cashback", discountType: "Percentage", discountValue: 8, commissionType: null, commissionValue: null, minBill: null, discountCap: null, commissionCap: null },
  { token: "7c81bd24917a4e0f962d315b", occurred: "21 Sep 2026, 11:42 am", date: "2026-09-21", userId: "USR-08471", merchant: "Nykaa", offer: "Beauty essentials cashback", discountType: "Percentage", discountValue: 8, commissionType: "Percentage", commissionValue: 11, minBill: 799, discountCap: 500, commissionCap: 650 },
  { token: "21ef748a53c890db77bc422d", occurred: "21 Sep 2026, 10:16 am", date: "2026-09-21", userId: "USR-06322", merchant: "Croma", offer: "Electronics weekend cashback", discountType: "Percentage", discountValue: 4, commissionType: "Percentage", commissionValue: 6, minBill: 4999, discountCap: 1500, commissionCap: 2000 },
  { token: "af902d77c0124a15b15d0bc8", occurred: "20 Sep 2026, 8:37 pm", date: "2026-09-20", userId: "USR-11806", merchant: "Myntra", offer: "Fashion season offer", discountType: "Percentage", discountValue: 6, commissionType: "Percentage", commissionValue: 9, minBill: 999, discountCap: 400, commissionCap: 600 },
  { token: "b6392c50a43f449aa5da182e", occurred: "20 Sep 2026, 6:04 pm", date: "2026-09-20", userId: "USR-04519", merchant: "Theobroma", offer: "Flat 10% cashback", discountType: "Percentage", discountValue: 10, commissionType: "Percentage", commissionValue: 5, minBill: 299, discountCap: 100, commissionCap: 50 },
  { token: "cf401958299744b8a696f5d4", occurred: "20 Sep 2026, 2:51 pm", date: "2026-09-20", userId: "USR-09734", merchant: "Absolute Barbecues", offer: "Weekend dining rewards", discountType: "Flat amount", discountValue: 250, commissionType: "Percentage", commissionValue: 8, minBill: 1999, discountCap: 250, commissionCap: 350 },
];

const initialWithdrawals: Withdrawal[] = [
  { id: "WD-009842", userId: "USR-10294", amount: 1250, mode: "Bank Account", payoutDetails: "HDFC Bank • A/C 50100234871642 • IFSC HDFC0001732 • Qaisar Farooq", status: "Requested", requested: "21 Sep 2026, 11:46 am", date: "2026-09-21", resolved: "—", utr: "—", notes: "KYC verified" },
  { id: "WD-009841", userId: "USR-08471", amount: 780, mode: "UPI", payoutDetails: "ananya.shah@okhdfcbank", status: "Requested", requested: "21 Sep 2026, 10:12 am", date: "2026-09-21", resolved: "—", utr: "—", notes: "—" },
  { id: "WD-009839", userId: "USR-06322", amount: 2400, mode: "Bank Account", payoutDetails: "ICICI Bank • A/C 684201001529 • IFSC ICIC0006842 • Rohan Mehta", status: "Paid", requested: "20 Sep 2026, 4:38 pm", date: "2026-09-20", resolved: "21 Sep 2026, 9:30 am", utr: "HDFC20260921018463", notes: "Processed in morning batch" },
  { id: "WD-009836", userId: "USR-11806", amount: 500, mode: "Gift Card", payoutDetails: "Amazon Pay • priya.nair@example.com", status: "Failed", requested: "20 Sep 2026, 12:17 pm", date: "2026-09-20", resolved: "20 Sep 2026, 5:04 pm", utr: "—", notes: "Invalid gift card contact" },
  { id: "WD-009831", userId: "USR-04519", amount: 3150, mode: "UPI", payoutDetails: "vikram.singh@paytm", status: "Paid", requested: "19 Sep 2026, 6:52 pm", date: "2026-09-19", resolved: "20 Sep 2026, 10:02 am", utr: "PAYTM260920018972", notes: "—" },
  { id: "WD-009827", userId: "USR-09734", amount: 925, mode: "Bank Account", payoutDetails: "Axis Bank • A/C 918010047526331 • IFSC UTIB0000918 • Meera Iyer", status: "Requested", requested: "19 Sep 2026, 2:06 pm", date: "2026-09-19", resolved: "—", utr: "—", notes: "First withdrawal" },
];

const analyticsEvents: AnalyticsEvent[] = [
  { id: "EVT-9001", event: "session_landing", group: "Session", screen: "—", userId: "Pre-login", properties: { source: "organic", build: "2.8.14" }, session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:07 am", date: "2026-09-19" },
  { id: "EVT-9002", event: "screen_view", group: "Screen", screen: "PhoneEntry", userId: "Pre-login", properties: null, session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:07 am", date: "2026-09-19" },
  { id: "EVT-9003", event: "send_otp_tapped", group: "Action", screen: "—", userId: "Pre-login", properties: null, session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:07 am", date: "2026-09-19" },
  { id: "EVT-9004", event: "screen_view", group: "Screen", screen: "OtpVerify", userId: "Pre-login", properties: null, session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:07 am", date: "2026-09-19" },
  { id: "EVT-9005", event: "verify_otp_tapped", group: "Action", screen: "—", userId: "USR-10294", properties: null, session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:07 am", date: "2026-09-19" },
  { id: "EVT-9006", event: "screen_exit", group: "Screen", screen: "—", userId: "USR-10294", properties: { duration_ms: 24120, reason: "otp_verified" }, session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:07 am", date: "2026-09-19" },
  { id: "EVT-9007", event: "screen_view", group: "Screen", screen: "ProfileSetup", userId: "USR-10294", properties: null, session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:07 am", date: "2026-09-19" },
  { id: "EVT-9008", event: "profile_submit_tapped", group: "Action", screen: "—", userId: "USR-10294", properties: null, session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:08 am", date: "2026-09-19" },
  { id: "EVT-9009", event: "screen_view", group: "Screen", screen: "Home", userId: "USR-10294", properties: null, session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:08 am", date: "2026-09-19" },
  { id: "EVT-9010", event: "scroll_depth", group: "Engagement", screen: "Home", userId: "USR-10294", properties: { percent: 50, section: "featured_merchants" }, session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:08 am", date: "2026-09-19" },
  { id: "EVT-9011", event: "merchant_opened", group: "Action", screen: "MerchantDetail", userId: "USR-08471", properties: { merchant: "Croma", source: "home_carousel" }, session: "a7fb07ab-a347-4453-bdea-1029dc091f90", occurred: "21 Sept 2026, 10:19 am", date: "2026-09-21" },
  { id: "EVT-9012", event: "offer_cta_tapped", group: "Action", screen: "MerchantDetail", userId: "USR-08471", properties: { offer_id: "OFF-1039", merchant: "Croma" }, session: "a7fb07ab-a347-4453-bdea-1029dc091f90", occurred: "21 Sept 2026, 10:20 am", date: "2026-09-21" },
];

const communicationDispatches: CommunicationDispatch[] = [
  { id: "DSP-7108", type: "ONLINE_CASHBACK_PENDING", template: "Purchase Tracked", channel: "SMS", title: "Cashback tracked", body: "Your Rs. 60.00 cashback from Croma is now tracked and pending approval.", read: "No", delivery: "FAILED", userId: "USR-10294", occurred: "19 Sept 2026, 6:08 am", date: "2026-09-19" },
  { id: "DSP-7107", type: "ONLINE_CASHBACK_PENDING", template: "Purchase Tracked", channel: "WhatsApp", title: "Cashback tracked", body: "Your Rs. 60.00 cashback from Croma is now tracked and pending approval.", read: "No", delivery: "FAILED", userId: "USR-10294", occurred: "19 Sept 2026, 6:08 am", date: "2026-09-19" },
  { id: "DSP-7106", type: "ONLINE_CASHBACK_PENDING", template: "Purchase Tracked", channel: "Notification", title: "Cashback tracked", body: "Your Rs. 20.00 cashback from Croma is now tracked and pending approval.", read: "No", delivery: "QUEUED", userId: "USR-10294", occurred: "19 Sept 2026, 6:09 am", date: "2026-09-19" },
  { id: "DSP-7105", type: "CASHBACK_APPROVED", template: "Cashback Approved", channel: "SMS", title: "Cashback approved", body: "Congrats! You earned 151 reward points on OfferPe for shopping at Theobroma.", read: "Yes", delivery: "SENT", userId: "USR-08471", occurred: "20 Sept 2026, 8:10 am", date: "2026-09-20" },
  { id: "DSP-7104", type: "MERCHANT_REVIEW_APPROVED", template: "Review Approved", channel: "Email", title: "Your review of Nykaa is live", body: "Hi Ananya, your review of Nykaa has been approved and is now visible to other shoppers.", read: "Yes", delivery: "DELIVERED", userId: "USR-06322", occurred: "20 Sept 2026, 3:24 pm", date: "2026-09-20" },
  { id: "DSP-7103", type: "MERCHANT_ONBOARDING_SUBMITTED", template: "Merchant Onboarding Submitted", channel: "Email", title: "Application received for Blue Tokai Coffee Roasters", body: "Hi Nikhil Desai, we received your application for Blue Tokai Coffee Roasters.", read: "No", delivery: "DELIVERED", userId: "MER-APP-3012", occurred: "21 Sept 2026, 8:40 am", date: "2026-09-21" },
  { id: "DSP-7102", type: "MERCHANT_ONBOARDING_REJECTED", template: "Merchant Onboarding Rejected", channel: "WhatsApp", title: "Application update", body: "Hi Rekha Patil, unfortunately your OfferPe application for Sunrise Kirana Mart was not approved.", read: "No", delivery: "SENT", userId: "MER-APP-3009", occurred: "18 Sept 2026, 1:32 pm", date: "2026-09-18" },
  { id: "DSP-7101", type: "CASHBACK_REJECTED", template: "Cashback Rejected", channel: "Notification", title: "Cashback not approved", body: "Your Rs. 375 cashback claim from Croma was not approved.", read: "No", delivery: "SENT", userId: "USR-83172", occurred: "18 Sept 2026, 10:16 am", date: "2026-09-18" },
];

const notificationLogs: NotificationLog[] = [
  { id: "NTF-8042", type: "ONLINE_CASHBACK_PENDING", title: "Cashback tracked", body: "Your Rs. 60.00 cashback from Croma is now tracked and pending approval.", read: "No", delivery: "FAILED", userId: "USR-10294", session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:08 am", date: "2026-09-19" },
  { id: "NTF-8041", type: "ONLINE_CASHBACK_PENDING", title: "Cashback tracked", body: "Your Rs. 20.00 cashback from Croma is now tracked and pending approval.", read: "No", delivery: "FAILED", userId: "USR-10294", session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:09 am", date: "2026-09-19" },
  { id: "NTF-8040", type: "CASHBACK_APPROVED", title: "Cashback approved", body: "You earned Rs. 151 cashback from Theobroma!", read: "Yes", delivery: "DELIVERED", userId: "USR-08471", session: "f840db2c-1d37-4f7e-a165-c720998d1121", occurred: "20 Sept 2026, 8:10 am", date: "2026-09-20" },
  { id: "NTF-8039", type: "REVIEW_APPROVED", title: "Review approved", body: "Your review of Nykaa is live!", read: "Yes", delivery: "SENT", userId: "USR-06322", session: "d791617b-4073-4b38-a32f-a1a336c4dc77", occurred: "20 Sept 2026, 3:24 pm", date: "2026-09-20" },
  { id: "NTF-8038", type: "REVIEW_REJECTED", title: "Review not approved", body: "Your review of Croma was not approved.", read: "No", delivery: "SENT", userId: "USR-11806", session: "ba7b1fd9-2861-41f5-bfc5-b7710506bd57", occurred: "20 Sept 2026, 5:45 pm", date: "2026-09-20" },
  { id: "NTF-8037", type: "MERCHANT_ONBOARDING_APPROVED", title: "Merchant approved", body: "Urban Threads Studio is approved and live!", read: "No", delivery: "QUEUED", userId: "MER-APP-3010", session: "merchant-app", occurred: "19 Sept 2026, 12:09 pm", date: "2026-09-19" },
];

const userSeeds: UserRecord[] = [
  { id: "USR-10294", name: "Qaisar Farooq", phone: "919910784574", email: "—", status: "Active", deleted: false, reRegistered: false, lastLoginIp: "49.36.201.18", lastLoginAgent: "OfferPe Android 2.8.14", lastLoginAt: "21 Sep 2026, 12:06 pm", lastLoginDate: "2026-09-21", signedUp: "19 Sep 2026, 6:08 am", signedUpDate: "2026-09-19", deletedAt: "—", deletedDate: "", reRegisteredAt: "—", reRegisteredDate: "", city: "Mumbai", source: "Referral", wallet: 151 },
  { id: "USR-08471", name: "Ananya Shah", phone: "918477203114", email: "—", status: "Active", deleted: false, reRegistered: false, lastLoginIp: "103.87.34.11", lastLoginAgent: "OfferPe iOS 2.8.12", lastLoginAt: "21 Sep 2026, 10:31 am", lastLoginDate: "2026-09-21", signedUp: "20 Sep 2026, 8:10 am", signedUpDate: "2026-09-20", deletedAt: "—", deletedDate: "", reRegisteredAt: "—", reRegisteredDate: "", city: "Delhi", source: "Organic", wallet: 780 },
  { id: "USR-06322", name: "Rohan Mehta", phone: "919820114567", email: "—", status: "Active", deleted: false, reRegistered: true, lastLoginIp: "122.161.42.73", lastLoginAgent: "Chrome Mobile 121", lastLoginAt: "20 Sep 2026, 9:48 pm", lastLoginDate: "2026-09-20", signedUp: "16 Sep 2026, 4:27 am", signedUpDate: "2026-09-16", deletedAt: "14 Sep 2026, 7:18 pm", deletedDate: "2026-09-14", reRegisteredAt: "16 Sep 2026, 4:27 am", reRegisteredDate: "2026-09-16", city: "Bengaluru", source: "Paid Ads", wallet: 2400 },
  { id: "USR-11806", name: "Priya Nair", phone: "919650203487", email: "—", status: "Inactive", deleted: false, reRegistered: false, lastLoginIp: "—", lastLoginAgent: "—", lastLoginAt: "—", lastLoginDate: "", signedUp: "19 Sep 2026, 7:21 pm", signedUpDate: "2026-09-19", deletedAt: "—", deletedDate: "", reRegisteredAt: "—", reRegisteredDate: "", city: "Pune", source: "App Store", wallet: 500 },
  { id: "USR-04519", name: "Vikram Singh", phone: "918880771230", email: "—", status: "Active", deleted: false, reRegistered: false, lastLoginIp: "27.58.119.2", lastLoginAgent: "OfferPe Android 2.8.14", lastLoginAt: "20 Sep 2026, 6:42 pm", lastLoginDate: "2026-09-20", signedUp: "18 Sep 2026, 11:50 am", signedUpDate: "2026-09-18", deletedAt: "—", deletedDate: "", reRegisteredAt: "—", reRegisteredDate: "", city: "Hyderabad", source: "Influencer", wallet: 3150 },
  { id: "USR-09734", name: "Meera Iyer", phone: "919930455621", email: "—", status: "Active", deleted: false, reRegistered: false, lastLoginIp: "157.49.83.5", lastLoginAgent: "OfferPe iOS 2.8.12", lastLoginAt: "19 Sep 2026, 10:22 pm", lastLoginDate: "2026-09-19", signedUp: "18 Sep 2026, 4:06 pm", signedUpDate: "2026-09-18", deletedAt: "—", deletedDate: "", reRegisteredAt: "—", reRegisteredDate: "", city: "Chennai", source: "Referral", wallet: 925 },
  { id: "USR-08836", name: "Kabir Malhotra", phone: "919711602445", email: "—", status: "Active", deleted: false, reRegistered: false, lastLoginIp: "106.51.39.91", lastLoginAgent: "Samsung Internet 24", lastLoginAt: "19 Sep 2026, 8:33 pm", lastLoginDate: "2026-09-19", signedUp: "17 Sep 2026, 2:36 pm", signedUpDate: "2026-09-17", deletedAt: "—", deletedDate: "", reRegisteredAt: "—", reRegisteredDate: "", city: "Kolkata", source: "Organic", wallet: 250 },
  { id: "USR-07563", name: "Deleted User", phone: "982765341327666", email: "—", status: "Inactive", deleted: true, reRegistered: false, lastLoginIp: "—", lastLoginAgent: "—", lastLoginAt: "—", lastLoginDate: "", signedUp: "20 Sep 2026, 4:27 am", signedUpDate: "2026-09-20", deletedAt: "20 Sep 2026, 4:37 am", deletedDate: "2026-09-20", reRegisteredAt: "—", reRegisteredDate: "", city: "—", source: "Unknown", wallet: 0 },
  { id: "USR-07116", name: "Deleted User", phone: "976119150438178", email: "—", status: "Inactive", deleted: true, reRegistered: false, lastLoginIp: "—", lastLoginAgent: "—", lastLoginAt: "—", lastLoginDate: "", signedUp: "19 Sep 2026, 7:21 pm", signedUpDate: "2026-09-19", deletedAt: "19 Sep 2026, 7:25 pm", deletedDate: "2026-09-19", reRegisteredAt: "—", reRegisteredDate: "", city: "—", source: "Unknown", wallet: 0 },
  { id: "USR-00005", name: "Trackier Webhook HTTP Test Consumer", phone: "919000000045", email: "—", status: "Active", deleted: false, reRegistered: false, lastLoginIp: "10.0.0.8", lastLoginAgent: "Webhook QA client", lastLoginAt: "19 Sep 2026, 7:17 pm", lastLoginDate: "2026-09-19", signedUp: "19 Sep 2026, 7:17 pm", signedUpDate: "2026-09-19", deletedAt: "—", deletedDate: "", reRegisteredAt: "—", reRegisteredDate: "", city: "Mumbai", source: "Internal QA", wallet: 0 },
  { id: "USR-09248", name: "Deleted User", phone: "943250828009798", email: "—", status: "Inactive", deleted: true, reRegistered: false, lastLoginIp: "—", lastLoginAgent: "—", lastLoginAt: "—", lastLoginDate: "", signedUp: "19 Sep 2026, 4:06 pm", signedUpDate: "2026-09-19", deletedAt: "19 Sep 2026, 4:15 pm", deletedDate: "2026-09-19", reRegisteredAt: "—", reRegisteredDate: "", city: "—", source: "Unknown", wallet: 0 },
  { id: "USR-05518", name: "Devansh Gupta", phone: "919876620340", email: "—", status: "Active", deleted: false, reRegistered: false, lastLoginIp: "2401:4900:1c4f::51", lastLoginAgent: "OfferPe Android 2.8.13", lastLoginAt: "18 Sep 2026, 7:42 pm", lastLoginDate: "2026-09-18", signedUp: "16 Sep 2026, 8:35 am", signedUpDate: "2026-09-16", deletedAt: "—", deletedDate: "", reRegisteredAt: "—", reRegisteredDate: "", city: "Ahmedabad", source: "Referral", wallet: 100 },
  { id: "USR-06971", name: "Sana Khan", phone: "918477351902", email: "—", status: "Inactive", deleted: false, reRegistered: false, lastLoginIp: "—", lastLoginAgent: "—", lastLoginAt: "—", lastLoginDate: "", signedUp: "13 Sep 2026, 5:33 am", signedUpDate: "2026-09-13", deletedAt: "—", deletedDate: "", reRegisteredAt: "—", reRegisteredDate: "", city: "Surat", source: "App Store", wallet: 0 },
  { id: "USR-04182", name: "Arjun Rao", phone: "919593095823", email: "—", status: "Active", deleted: false, reRegistered: false, lastLoginIp: "103.141.55.8", lastLoginAgent: "Chrome Mobile 122", lastLoginAt: "13 Sep 2026, 4:55 am", lastLoginDate: "2026-09-13", signedUp: "13 Sep 2026, 3:49 am", signedUpDate: "2026-09-13", deletedAt: "—", deletedDate: "", reRegisteredAt: "—", reRegisteredDate: "", city: "Jaipur", source: "Organic", wallet: 640 },
  { id: "USR-03490", name: "Deleted User", phone: "978348698392111", email: "—", status: "Inactive", deleted: true, reRegistered: false, lastLoginIp: "—", lastLoginAgent: "—", lastLoginAt: "—", lastLoginDate: "", signedUp: "12 Sep 2026, 8:35 am", signedUpDate: "2026-09-12", deletedAt: "12 Sep 2026, 9:01 am", deletedDate: "2026-09-12", reRegisteredAt: "—", reRegisteredDate: "", city: "—", source: "Unknown", wallet: 0 },
  { id: "USR-03145", name: "Deleted User", phone: "925072473841449", email: "—", status: "Inactive", deleted: true, reRegistered: false, lastLoginIp: "—", lastLoginAgent: "—", lastLoginAt: "—", lastLoginDate: "", signedUp: "12 Sep 2026, 7:56 am", signedUpDate: "2026-09-12", deletedAt: "12 Sep 2026, 8:04 am", deletedDate: "2026-09-12", reRegisteredAt: "—", reRegisteredDate: "", city: "—", source: "Unknown", wallet: 0 },
  { id: "USR-02964", name: "Nisha Kapoor", phone: "919821104230", email: "—", status: "Active", deleted: false, reRegistered: false, lastLoginIp: "49.207.155.67", lastLoginAgent: "OfferPe iOS 2.8.11", lastLoginAt: "11 Sep 2026, 3:10 pm", lastLoginDate: "2026-09-11", signedUp: "10 Sep 2026, 9:24 am", signedUpDate: "2026-09-10", deletedAt: "—", deletedDate: "", reRegisteredAt: "—", reRegisteredDate: "", city: "Lucknow", source: "Referral", wallet: 430 },
  { id: "USR-02712", name: "Farhan Ali", phone: "919643822107", email: "—", status: "Active", deleted: false, reRegistered: false, lastLoginIp: "122.176.64.41", lastLoginAgent: "OfferPe Android 2.8.10", lastLoginAt: "10 Sep 2026, 11:26 am", lastLoginDate: "2026-09-10", signedUp: "09 Sep 2026, 7:52 pm", signedUpDate: "2026-09-09", deletedAt: "—", deletedDate: "", reRegisteredAt: "—", reRegisteredDate: "", city: "Noida", source: "Paid Ads", wallet: 1180 },
];

const initialUsers: UserRecord[] = userSeeds.flatMap((row, index): UserRecord[] => [row, { ...row, id: `USR-${String(20000 + index).padStart(5, "0")}`, phone: `${row.phone.slice(0, -2)}${String(index + 21).padStart(2, "0")}`, wallet: Math.max(0, row.wallet + index * 37), deleted: index % 7 === 0 ? true : row.deleted, status: index % 7 === 0 ? "Inactive" : row.status }]);

const buildPermissions = (group: PermissionGroupName, keys: string[]): Permission[] => keys.map((key) => ({ key, group }));

const permissionCatalog: Record<PermissionGroupName, Permission[]> = {
  Catalog: buildPermissions("Catalog", ["categories.EDIT", "categories.ADD", "categories.DELETE", "categories.VIEW", "cities.ADD", "cities.DELETE", "cities.EDIT", "cities.VIEW", "gift_card_types.ADD", "gift_card_types.EDIT", "gift_card_types.DELETE", "gift_card_types.VIEW", "legal_pages.EDIT", "legal_pages.VIEW", "merchant_banners.VIEW", "merchant_banners.EDIT", "merchant_banners.ADD", "merchant_banners.DELETE", "merchant_page_sections.ADD", "merchant_page_sections.EDIT", "merchant_page_sections.DELETE", "merchant_page_sections.VIEW", "merchant_reviews.VIEW", "merchant_reviews.EDIT", "merchants.ADD", "merchants.EDIT", "merchants.DELETE", "merchants.VIEW", "offers.ADD", "offers.EDIT", "offers.DELETE", "offers.VIEW", "onboarding_settings.EDIT", "onboarding_slides.ADD", "onboarding_slides.VIEW", "onboarding_slides.EDIT", "onboarding_slides.DELETE", "promo_banners.ADD", "promo_banners.EDIT", "promo_banners.DELETE", "promo_banners.VIEW"]),
  Operations: buildPermissions("Operations", ["affiliate_networks.ADD", "affiliate_networks.EDIT", "affiliate_networks.DELETE", "affiliate_networks.VIEW", "merchant_onboarding.VIEW", "merchant_onboarding.EDIT", "merchant_onboarding_rejection_reasons.ADD", "merchant_onboarding_rejection_reasons.EDIT", "merchant_onboarding_rejection_reasons.VIEW", "merchant_staff.ADD", "merchant_staff.EDIT", "merchant_staff.DELETE", "merchant_staff.VIEW", "sync_settings.VIEW", "sync_settings.EDIT", "trackier_categories.EDIT", "trackier_categories.VIEW", "trackier_import_queue.ADD", "trackier_import_queue.DELETE", "trackier_import_queue.IMPORT", "trackier_import_queue.VIEW", "trackier_statuses.EDIT", "trackier_statuses.VIEW"]),
  Financial: buildPermissions("Financial", ["cashback_claims.EDIT", "cashback_claims.VIEW", "claims_settings.EDIT", "claims_settings.VIEW", "clicks.VIEW", "conversion_resolutions.EDIT", "conversion_resolutions.IMPORT", "conversion_resolutions.VIEW", "ledger.VIEW", "offline_redemptions.VIEW", "online_conversions.DELETE", "online_conversions.EDIT", "online_conversions.EXPORT", "online_conversions.IMPORT", "online_conversions.VIEW", "reconciliation_log.EXPORT", "reconciliation_log.VIEW", "referral_settings.EDIT", "referral_settings.VIEW", "rejection_reasons.ADD", "rejection_reasons.EDIT", "rejection_reasons.VIEW", "withdrawal_settings.EDIT", "withdrawal_settings.VIEW", "withdrawals.EDIT", "withdrawals.EXPORT", "withdrawals.IMPORT", "withdrawals.VIEW"]),
  Communication: buildPermissions("Communication", ["communication_dispatches.VIEW", "communication_templates.EDIT", "communication_templates.VIEW", "notifications.VIEW"]),
  System: buildPermissions("System", ["admin_users.ADD", "admin_users.DELETE", "admin_users.EDIT", "admin_users.VIEW", "analytics_events.VIEW", "app_versions.EDIT", "app_versions.VIEW", "role_management.ADD", "role_management.DELETE", "role_management.EDIT", "role_management.VIEW", "users.EXPORT", "users.IMPORT", "users.VIEW"]),
};

const allPermissionKeys = Object.values(permissionCatalog).flat().map((permission) => permission.key);

const initialRoles: AdminRole[] = [
  { id: "ROLE-OWNER", name: "Owner", description: "Every permission in the system. System role — cannot be edited or deleted.", permissions: allPermissionKeys, admins: 6, system: true, updated: "21 Sep 2026, 10:19 am" },
  { id: "ROLE-CONTENT", name: "Content Manager", description: "Every permission except SUPER_ADMIN-only resources such as payout config, admin user management, and affiliate network config.", permissions: allPermissionKeys.filter((key) => !key.startsWith("admin_users") && !key.startsWith("role_management") && !key.startsWith("withdrawal_settings") && !key.startsWith("affiliate_networks")), admins: 7, system: false, updated: "20 Sep 2026, 4:12 pm" },
  { id: "ROLE-FINANCE", name: "Finance Manager", description: "Owns cashback claims, conversions, ledger review, withdrawals, and financial exports.", permissions: [...permissionCatalog.Financial.map((permission) => permission.key), "users.VIEW", "communication_dispatches.VIEW"], admins: 3, system: false, updated: "19 Sep 2026, 6:42 pm" },
  { id: "ROLE-OPS", name: "Operations Manager", description: "Handles merchant onboarding, Trackier imports, affiliate network hygiene, and catalog publishing checks.", permissions: [...permissionCatalog.Operations.map((permission) => permission.key), "merchants.VIEW", "offers.VIEW", "categories.VIEW", "promo_banners.VIEW"], admins: 4, system: false, updated: "18 Sep 2026, 11:20 am" },
  { id: "ROLE-SUPPORT", name: "Support Analyst", description: "Read-focused access for customer support with limited claim and review moderation actions.", permissions: ["users.VIEW", "cashback_claims.VIEW", "cashback_claims.EDIT", "clicks.VIEW", "online_conversions.VIEW", "ledger.VIEW", "communication_dispatches.VIEW", "notifications.VIEW", "merchant_reviews.VIEW", "merchant_reviews.EDIT"], admins: 9, system: false, updated: "17 Sep 2026, 3:04 pm" },
];

const initialAdminUsers: AdminUser[] = [
  { id: "ADM-0001", name: "Qaisar Farooq", email: "qaisarfarooq0511@gmail.com", role: "Owner", status: "Active", lastActive: "21 Sep 2026, 10:14 am", created: "02 Jan 2026" },
  { id: "ADM-0002", name: "Neha Pillai", email: "neha.pillai@offerpe.com", role: "Content Manager", status: "Active", lastActive: "21 Sep 2026, 9:38 am", created: "14 Feb 2026" },
  { id: "ADM-0003", name: "Rahul Sharma", email: "rahul.sharma@offerpe.com", role: "Finance Manager", status: "Active", lastActive: "20 Sep 2026, 7:52 pm", created: "03 Mar 2026" },
  { id: "ADM-0004", name: "Ananya Rao", email: "ananya.rao@offerpe.com", role: "Operations Manager", status: "Active", lastActive: "20 Sep 2026, 4:05 pm", created: "18 Mar 2026" },
  { id: "ADM-0005", name: "Dev Kapoor", email: "dev.kapoor@offerpe.com", role: "Support Analyst", status: "Invited", lastActive: "—", created: "19 Sep 2026" },
  { id: "ADM-0006", name: "Ishita Menon", email: "ishita.menon@offerpe.com", role: "Support Analyst", status: "Active", lastActive: "19 Sep 2026, 1:22 pm", created: "22 Apr 2026" },
  { id: "ADM-0007", name: "Vikram Nair", email: "vikram.nair@offerpe.com", role: "Content Manager", status: "Disabled", lastActive: "02 Aug 2026, 11:47 am", created: "11 May 2026" },
  { id: "ADM-0008", name: "Sana Qureshi", email: "sana.qureshi@offerpe.com", role: "Finance Manager", status: "Active", lastActive: "18 Sep 2026, 6:30 pm", created: "07 Jun 2026" },
];


const chartData = {
  users: [{ name: "Today", value: 7 }, { name: "Yesterday", value: 12 }, { name: "7d", value: 49 }, { name: "30d", value: 184 }],
  clicks: [{ name: "Today", value: 42 }, { name: "Yesterday", value: 57 }, { name: "7d", value: 319 }, { name: "30d", value: 1240 }],
  transactions: [{ name: "Today", value: 12 }, { name: "Yesterday", value: 18 }, { name: "7d", value: 94 }, { name: "30d", value: 382 }],
  withdrawals: [{ name: "Today", value: 4 }, { name: "Yesterday", value: 8 }, { name: "7d", value: 31 }, { name: "30d", value: 108 }],
  claims: [{ name: "Today", value: 2 }, { name: "Yesterday", value: 3 }, { name: "7d", value: 11 }, { name: "30d", value: 38 }],
};

function StatusBadge({ status }: { status: Status }) {
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", `status-${status.toLowerCase()}`)}>{status}</span>;
}

function IconButton({ label, children, className, onClick }: { label: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <Button type="button" variant="ghost" size="icon" className={cn("h-8 w-8 text-muted-foreground", className)} onClick={onClick} title={label} aria-label={label}>{children}</Button>;
}

function Sidebar({ view, setView, open, setOpen }: { view: View; setView: (v: View) => void; open: boolean; setOpen: (v: boolean) => void }) {
  const [expanded, setExpanded] = useState<string | null>(() => {
    const activeView = view === "merchant-edit" ? "merchants" : view === "offer-edit" ? "offers" : view === "promo-banner-edit" || view === "promo-banner-new" ? "promo-banners" : view === "category-edit" || view === "category-new" ? "categories" : view === "affiliate-network-edit" || view === "affiliate-network-new" ? "affiliate-networks" : view === "role-edit" ? "roles" : view === "onboarding-slide-edit" || view === "onboarding-slide-new" ? "onboarding-screens" : view;
    const activeGroup = groups.find((group) => group.items.some((item) => item.view === activeView));
    return activeGroup?.label ?? "Catalog";
  });
  const choose = (next: View) => { setView(next); setOpen(false); };
  const chooseGroupedItem = (next: View, groupLabel: string) => {
    setExpanded(groupLabel);
    choose(next);
  };
  return (
    <>
      {open && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-overlay md:hidden" onClick={() => setOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform md:static md:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-18 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary font-heading text-sm font-bold text-primary-foreground">O</div>
          <div className="min-w-0"><div className="truncate font-heading text-[15px] font-bold text-sidebar-foreground">OfferPe Admin</div><div className="text-xs text-muted-foreground">Owner</div></div>
          <IconButton label="Close navigation" className="ml-auto md:hidden" onClick={() => setOpen(false)}><X /></IconButton>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <Button variant="ghost" className={cn("mb-3 h-10 w-full justify-start gap-3 px-3", view === "dashboard" && "bg-sidebar-accent text-sidebar-primary hover:bg-sidebar-accent")} onClick={() => choose("dashboard")}><LayoutDashboard />Dashboard</Button>
          <div className="space-y-1">
            {groups.map((group) => {
              const isOpen = expanded === group.label;
              return <div key={group.label}>
                <Button variant="ghost" className="h-9 w-full justify-start gap-2 px-3 text-[11px] font-bold uppercase text-muted-foreground hover:bg-sidebar-accent" onClick={() => setExpanded(isOpen ? null : group.label)} aria-expanded={isOpen}>
                  <group.icon className="h-3.5 w-3.5" /><span className="flex-1 text-left">{group.label}</span><ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-90")} />
                </Button>
                {isOpen && <div className="ml-4 border-l border-sidebar-border pl-2">
                   {group.items.map((item) => <Button key={item.label} variant="ghost" disabled={!item.view} className={cn("my-0.5 h-auto min-h-9 w-full justify-start gap-2.5 whitespace-normal px-3 py-1.5 text-[13px] text-sidebar-foreground disabled:opacity-55", (item.view === view || (view === "merchant-edit" && item.view === "merchants") || (view === "offer-edit" && item.view === "offers") || ((view === "promo-banner-edit" || view === "promo-banner-new") && item.view === "promo-banners") || ((view === "category-edit" || view === "category-new") && item.view === "categories") || ((view === "affiliate-network-edit" || view === "affiliate-network-new") && item.view === "affiliate-networks") || (view === "role-edit" && item.view === "roles") || ((view === "onboarding-slide-edit" || view === "onboarding-slide-new") && item.view === "onboarding-screens")) && "bg-sidebar-accent font-semibold text-sidebar-primary hover:bg-sidebar-accent")} onClick={() => item.view && chooseGroupedItem(item.view, group.label)}><item.icon className="h-4 w-4 shrink-0" /><span className="min-w-0 break-words text-left leading-tight">{item.label}</span></Button>)}
                </div>}
              </div>;
            })}
          </div>
        </nav>
        <div className="border-t border-sidebar-border p-3"><Button variant="ghost" className="w-full justify-start text-muted-foreground"><ChevronLeft />Sign out</Button></div>
      </aside>
    </>
  );
}

function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return <header className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between"><div><h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>{description && <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>}</div>{actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}</header>;
}

function DonutCard({ title, total, data }: { title: string; total: number; data: { name: string; value: number; fill: string }[] }) {
  return <section className="rounded-lg border border-border bg-card p-5 shadow-card"><div className="flex items-start justify-between"><h2 className="font-heading text-sm font-semibold">{title}</h2><span className="font-heading text-2xl font-bold">{total}</span></div><div className="h-48"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={2} stroke="var(--card)" strokeWidth={3}>{data.map((item) => <Cell key={item.name} fill={item.fill} />)}</Pie><Tooltip formatter={(value) => [value, "Stores"]} /></PieChart></ResponsiveContainer></div><div className="flex justify-center gap-5">{data.map((item) => <div key={item.name} className="flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2.5 w-2.5 rounded-full" style={{ background: item.fill }} />{item.name}</div>)}</div></section>;
}

function MetricCard({ title, total, data }: { title: string; total?: string; data: { name: string; value: number }[] }) {
  return <section className="rounded-lg border border-border bg-card p-5 shadow-card"><div className="mb-4 flex items-start justify-between"><h2 className="font-heading text-sm font-semibold">{title}</h2>{total && <span className="font-heading text-xl font-bold">{total}</span>}</div><div className="h-40"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 5, right: 0, left: -24, bottom: 0 }}><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} /><Tooltip cursor={{ fill: "var(--muted)" }} /><Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></section>;
}

function Dashboard() {
  return <><PageHeader title="Dashboard" description="As of 21 Sep 2026, 11:25 IST · Refreshed hourly. A concise operational snapshot across the OfferPe platform." /><section className="mb-4 flex flex-col gap-4 rounded-lg border border-border bg-card px-5 py-4 shadow-card sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-heading text-lg font-bold text-foreground">Welcome back, Qaisar <span className="font-semibold text-muted-foreground">(Owner)</span></h2><p className="mt-1 text-sm text-muted-foreground">Here’s the latest operational picture across OfferPe.</p></div><div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground"><ShieldCheck className="h-4 w-4 text-primary" /><span>All systems operational</span><span aria-hidden="true" className="text-muted-foreground">•</span><span className="font-normal text-muted-foreground">Last matview refresh 10:19 AM IST</span></div></section><div className="mb-4 grid gap-4 lg:grid-cols-2"><DonutCard title="Stores — Status" total={38} data={[{ name: "Live", value: 33, fill: "var(--chart-1)" }, { name: "Inactive", value: 5, fill: "var(--chart-2)" }]} /><DonutCard title="Stores — Channel" total={38} data={[{ name: "Online", value: 31, fill: "var(--chart-1)" }, { name: "Offline", value: 7, fill: "var(--chart-3)" }]} /></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><MetricCard title="Users Joined" total="2,486" data={chartData.users} /><MetricCard title="Clicks" data={chartData.clicks} /><MetricCard title="Transactions" data={chartData.transactions} /><MetricCard title="Withdrawal Requests" data={chartData.withdrawals} /><button onClick={() => undefined} className="rounded-lg border border-border bg-card p-5 text-left shadow-card transition-shadow hover:shadow-card-hover"><div className="font-heading text-sm font-semibold">Withdrawals — Currently Pending</div><div className="mt-7 font-heading text-4xl font-bold">14</div><div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">View pending <ChevronRight className="h-4 w-4" /></div></button><MetricCard title="Missing Claims" data={chartData.claims} /></div></>;
}

function DateFilter() {
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(2026, 8, 1), to: new Date(2026, 8, 21) });
  return <Popover><PopoverTrigger asChild><Button variant="outline" className="min-w-52 justify-start font-normal"><CalendarDays />{date?.from ? `${format(date.from, "dd MMM")} – ${date.to ? format(date.to, "dd MMM yyyy") : "…"}` : "Choose dates"}</Button></PopoverTrigger><PopoverContent className="pointer-events-auto w-auto p-0" align="end"><Calendar mode="range" selected={date} onSelect={setDate} numberOfMonths={1} /></PopoverContent></Popover>;
}

function FilterBar({ query, setQuery, statuses, setStatuses, showChannel = false }: { query: string; setQuery: (v: string) => void; statuses: Status[]; setStatuses: (v: Status[]) => void; showChannel?: boolean }) {
  const options: Status[] = showChannel ? ["Active", "Inactive"] : ["Pending", "Approved", "Rejected", "Requested", "Paid"];
  return <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center"><div className="relative min-w-64 flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder={showChannel ? "Search merchants or categories…" : "Search cashback, order, or merchant…"} /></div><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline"><Filter />Status{statuses.length > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{statuses.length}</span>}<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44">{options.map((status) => <DropdownMenuCheckboxItem key={status} checked={statuses.includes(status)} onCheckedChange={() => setStatuses(statuses.includes(status) ? statuses.filter((s) => s !== status) : [...statuses, status])}>{status}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu>{showChannel ? <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Channel<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuCheckboxItem checked>Online</DropdownMenuCheckboxItem><DropdownMenuCheckboxItem>Offline</DropdownMenuCheckboxItem></DropdownMenuContent></DropdownMenu> : <DateFilter />}{(query || statuses.length > 0) && <Button variant="ghost" onClick={() => { setQuery(""); setStatuses([]); }}>Clear</Button>}</div>;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return <IconButton label={copied ? `${value} copied` : `Copy ${value}`} className={cn("h-7 w-7", copied && "text-primary")} onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1200); }}>{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</IconButton>;
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-border bg-card shadow-card"><div className="border-b border-border px-5 py-4"><h2 className="font-heading text-base font-bold">{title}</h2>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div><div className="p-5">{children}</div></section>;
}

function ConfirmDeleteDialog({ itemType, name, onConfirm, children }: { itemType: string; name: string; onConfirm: () => void; children: React.ReactNode }) {
  return <AlertDialog><AlertDialogTrigger asChild>{children}</AlertDialogTrigger><AlertDialogContent className="border-border bg-card"><AlertDialogHeader><AlertDialogTitle className="font-heading">Delete {itemType}?</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete &apos;{name}&apos;? This action will remove the record from OfferPe.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={onConfirm}><Trash2 className="h-4 w-4" />Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}

function ConfirmSaveDialog({ title, summary, onConfirm, disabled, children }: { title: string; summary: { label: string; value: string }[]; onConfirm: () => void; disabled?: boolean; children: React.ReactNode }) {
  return <AlertDialog><AlertDialogTrigger asChild disabled={disabled}>{children}</AlertDialogTrigger><AlertDialogContent className="border-border bg-card"><AlertDialogHeader><AlertDialogTitle className="font-heading">{title}</AlertDialogTitle><AlertDialogDescription>These values apply to every user immediately. Review the change before confirming.</AlertDialogDescription></AlertDialogHeader><dl className="divide-y divide-border rounded-md border border-border bg-muted/30 text-sm">{summary.map((row) => <div key={row.label} className="flex items-center justify-between gap-4 px-3 py-2"><dt className="text-muted-foreground">{row.label}</dt><dd className="font-semibold">{row.value}</dd></div>)}</dl><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={onConfirm}><Check className="h-4 w-4" />Confirm &amp; Save</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}

function SettingsCard({ title, description, children, footer }: { title: string; description: string; children: React.ReactNode; footer: React.ReactNode }) {
  return <section className="rounded-lg border border-border bg-card shadow-card">
    <div className="border-b border-border px-5 py-4">
      <h2 className="font-heading text-base font-bold">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
    <div className="grid gap-4 p-5 sm:grid-cols-2">{children}</div>
    <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3.5">{footer}</div>
  </section>;
}

type LegalPage = { id: string; name: string; slug: string; title: string; version: string; content: string; published: boolean; updatedAt: string };

const legalPageSeeds: LegalPage[] = [
  {
    id: "LP-1",
    name: "Privacy Policy",
    slug: "privacy-policy",
    title: "Privacy Policy",
    version: "draft-v1",
    published: true,
    updatedAt: "09 Jul 2026, 12:19 pm",
    content: `1. Information we collect
We collect the following categories of information when you use the OfferPe app:
- Phone number — used as your sole account identifier, verified via a one-time password (OTP). We do not require or collect an email address, password, or government ID.
- Profile information — your name and city, and, only if you choose to grant location permission, your device's coordinates.
- Transaction data — records of the cashback and in-store discounts you earn or redeem.
- Device push notification token — used to deliver order and cashback status updates to your device.
- Usage and analytics data — which screens you view and general app usage patterns.

2. How we use your information
- Create and maintain your account, and verify your identity via OTP.
- Calculate, credit, and display the cashback and discounts you earn.
- Suggest a nearby city and show you relevant local in-store offers.
- Send you notifications about your transactions and account.

3. Who we share information with
We do not sell your personal information. We share data only with the service providers that help us operate the app.

4. Cashback is non-withdrawable
Cashback earned through OfferPe is credited as in-app store credit and is not withdrawable as cash.

5. Contact us
Questions about this policy or your data can be sent to [support email to be added].`,
  },
  {
    id: "LP-2",
    name: "Terms of Service",
    slug: "terms-of-service",
    title: "Terms of Service",
    version: "draft-v1",
    published: true,
    updatedAt: "09 Jul 2026, 12:19 pm",
    content: `1. Acceptance of these terms
By creating an OfferPe account or using the OfferPe app, you agree to these Terms of Service.

2. The service
OfferPe is a cashback platform covering two channels: cashback on qualifying purchases at partner online brands, and instant in-store discounts at partner physical stores.

3. Your account
You sign up with your phone number, verified by a one-time password. One account per person.

4. Cashback and discounts
- Cashback is credited to your in-app wallet as non-withdrawable store credit.
- Online cashback is provisional until confirmed by the partner brand.
- In-store discounts, once confirmed at checkout, are final.

5. Governing law
These terms are governed by the laws of India.`,
  },
  {
    id: "LP-3",
    name: "Merchant Agreement",
    slug: "merchant-agreement",
    title: "Merchant Agreement",
    version: "draft-v1",
    published: false,
    updatedAt: "09 Jul 2026, 12:40 pm",
    content: `1. Acceptance of this agreement
By submitting a store registration to OfferPe and, once approved, operating as a merchant on the platform, you agree to this Merchant Agreement.

2. Onboarding and approval
Submitting a registration does not itself create a live store — OfferPe reviews every submission and may approve or reject it.

3. Redemptions and discounts
Your staff confirm in-store discount redemptions via a QR code or Unique Code shown in a customer's app. A confirmed redemption is final.

4. Governing law
This agreement is governed by the laws of India.`,
  },
];

function legalContentToHtml(value: string) {
  if (value.trim().startsWith("<")) return value;
  const blocks: string[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length) {
      blocks.push(`<ul>${bullets.map((item) => `<li>${item}</li>`).join("")}</ul>`);
      bullets = [];
    }
  };
  value.split("\n").forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) { flush(); return; }
    if (line.startsWith("-")) { bullets.push(line.replace(/^-\s*/, "")); return; }
    flush();
    if (/^\d+\./.test(line)) blocks.push(`<h2>${line}</h2>`);
    else blocks.push(`<p>${line}</p>`);
  });
  flush();
  return blocks.join("");
}

function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const initialHtml = useRef(legalContentToHtml(value));

  const run = (command: string, argument?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const tools: { label: string; icon: typeof Bold; onClick: () => void }[] = [
    { label: "Bold", icon: Bold, onClick: () => run("bold") },
    { label: "Italic", icon: Italic, onClick: () => run("italic") },
    { label: "Heading", icon: Heading2, onClick: () => run("formatBlock", "<h2>") },
    { label: "Bullet list", icon: List, onClick: () => run("insertUnorderedList") },
    { label: "Numbered list", icon: ListOrdered, onClick: () => run("insertOrderedList") },
    { label: "Undo", icon: Undo2, onClick: () => run("undo") },
    { label: "Redo", icon: Redo2, onClick: () => run("redo") },
  ];

  return <div className="overflow-hidden rounded-lg border border-border bg-card">
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
      {tools.map((tool, index) => <Fragment key={tool.label}>
        {index === 5 ? <span className="mx-1 h-5 w-px bg-border" /> : null}
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title={tool.label} aria-label={tool.label} onMouseDown={(event) => event.preventDefault()} onClick={tool.onClick}>
          <tool.icon className="h-4 w-4" />
        </Button>
      </Fragment>)}
    </div>
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      onInput={(event) => onChange(event.currentTarget.innerHTML)}
      className="max-h-[520px] min-h-[320px] overflow-y-auto px-4 py-3 text-sm leading-6 outline-none [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:font-heading [&_h2]:text-base [&_h2]:font-semibold [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: initialHtml.current }}
    />
  </div>;
}

function LegalPagesPage({ pages, onSave, onDelete }: { pages: LegalPage[]; onSave: (page: LegalPage) => void; onDelete: (page: LegalPage) => void }) {
  const [selectedId, setSelectedId] = useState(pages[0]?.id ?? "");
  const selected = pages.find((page) => page.id === selectedId) ?? pages[0];
  const [draft, setDraft] = useState<LegalPage | null>(selected ?? null);
  const activeDraft = draft && selected && draft.id === selected.id ? draft : selected;

  if (!selected || !activeDraft) return <PageHeader title="Legal Pages" description="No legal pages have been created yet." />;

  const dirty = JSON.stringify(activeDraft) !== JSON.stringify(selected);
  const update = (patch: Partial<LegalPage>) => setDraft({ ...activeDraft, ...patch });
  const valid = activeDraft.title.trim().length > 0 && activeDraft.slug.trim().length > 0 && activeDraft.content.trim().length > 0;

  return <div className="space-y-5">
    <PageHeader title="Legal Pages" description="One editable document per page type — Privacy Policy and Terms of Service are fetched live on the public marketing site (apps/web); Merchant Agreement is linked from both Merchant Onboarding forms' terms checkbox. Unpublished changes are invisible to the public site until Published is checked." />

    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Page</span>
      </div>
      <Select value={activeDraft.id} onValueChange={(value) => { setSelectedId(value); setDraft(pages.find((page) => page.id === value) ?? null); }}>
        <SelectTrigger className="h-9 w-full sm:w-[280px]"><SelectValue /></SelectTrigger>
        <SelectContent>{pages.map((page) => <SelectItem key={page.id} value={page.id}>{page.name}</SelectItem>)}</SelectContent>
      </Select>
      <div className="flex flex-1 items-center justify-end gap-2 text-xs text-muted-foreground">
        <StatusBadge status={selected.published ? "Active" : "Inactive"} />
        <span>{selected.published ? "Published" : "Unpublished"}</span>
        <span>Last updated {selected.updatedAt}</span>
      </div>
    </div>

    <section className="rounded-lg border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
        <h2 className="font-heading text-base font-bold">{selected.name}</h2>
        <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">/{activeDraft.slug}</code>
      </div>
      <div className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1.5 text-sm font-medium">Title <span className="text-destructive">*</span>
            <Input value={activeDraft.title} onChange={(event) => update({ title: event.target.value })} />
          </label>
          <label className="space-y-1.5 text-sm font-medium">Slug <span className="text-destructive">*</span>
            <Input value={activeDraft.slug} onChange={(event) => update({ slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
          </label>
          <label className="space-y-1.5 text-sm font-medium">Version <span className="text-destructive">*</span>
            <Input value={activeDraft.version} onChange={(event) => update({ version: event.target.value })} />
          </label>
        </div>
        <div className="space-y-1.5 text-sm font-medium">Content <span className="text-destructive">*</span>
          <RichTextEditor key={selected.id} value={activeDraft.content} onChange={(html) => update({ content: html })} />
        </div>
        <p className="text-xs text-muted-foreground">Headings, bold, italics and lists are carried through to the public page exactly as shown here.</p>
        <label className="flex items-center gap-2 text-sm font-medium">
          <Checkbox checked={activeDraft.published} onCheckedChange={(value) => update({ published: value === true })} />
          Published — visible on the public site
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3.5">
        <ConfirmDeleteDialog itemType="legal page" name={selected.name} onConfirm={() => { onDelete(selected); const next = pages.find((page) => page.id !== selected.id); setSelectedId(next?.id ?? ""); setDraft(next ?? null); }}>
          <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" />Delete page</Button>
        </ConfirmDeleteDialog>
        <Button variant="outline" disabled={!dirty} onClick={() => setDraft(selected)}>Cancel</Button>
        <ConfirmSaveDialog
          title={`Save ${selected.name}?`}
          disabled={!dirty || !valid}
          summary={[{ label: "Title", value: activeDraft.title }, { label: "Slug", value: `/${activeDraft.slug}` }, { label: "Version", value: activeDraft.version }, { label: "Visibility", value: activeDraft.published ? "Published — public" : "Unpublished — hidden" }]}
          onConfirm={() => onSave(activeDraft)}
        >
          <Button disabled={!dirty || !valid}><Check className="h-4 w-4" />Save</Button>
        </ConfirmSaveDialog>
      </div>
    </section>
  </div>;
}

type MerchantStaff = { id: string; name: string; phone: string; merchant: string; role: "Owner" | "Staff"; status: "Active" | "Pending"; invitedOn: string; lastActive: string };

const merchantStaffSeeds: MerchantStaff[] = [
  { id: "MS-1041", name: "Rohit Kulkarni", phone: "919000000001", merchant: "Theobroma", role: "Owner", status: "Active", invitedOn: "02 Aug 2026", lastActive: "21 Sep 2026, 6:12 pm" },
  { id: "MS-1042", name: "Sneha Pawar", phone: "919000000002", merchant: "Theobroma", role: "Staff", status: "Active", invitedOn: "05 Aug 2026", lastActive: "20 Sep 2026, 1:44 pm" },
  { id: "MS-1043", name: "Imran Shaikh", phone: "919000000003", merchant: "Absolute Barbecues", role: "Owner", status: "Active", invitedOn: "11 Aug 2026", lastActive: "21 Sep 2026, 9:05 am" },
  { id: "MS-1044", name: "Divya Menon", phone: "919000000004", merchant: "Absolute Barbecues", role: "Staff", status: "Pending", invitedOn: "18 Sep 2026", lastActive: "—" },
  { id: "MS-1045", name: "Arjun Nair", phone: "919000000005", merchant: "Big Bazaar", role: "Staff", status: "Pending", invitedOn: "19 Sep 2026", lastActive: "—" },
  { id: "MS-1046", name: "Farhan Qureshi", phone: "919000000006", merchant: "Hummel", role: "Owner", status: "Active", invitedOn: "27 Jul 2026", lastActive: "18 Sep 2026, 4:30 pm" },
  { id: "MS-1047", name: "Meera Iyer", phone: "919000000007", merchant: "Nippon Paint FX10", role: "Staff", status: "Active", invitedOn: "01 Sep 2026", lastActive: "21 Sep 2026, 11:20 am" },
  { id: "MS-1048", name: "Kabir Sethi", phone: "919000000008", merchant: "Theobroma", role: "Staff", status: "Pending", invitedOn: "20 Sep 2026", lastActive: "—" },
];

function MerchantStaffDialog({ staff, merchantOptions, onSave, children }: { staff: MerchantStaff | null; merchantOptions: string[]; onSave: (staff: MerchantStaff, isNew: boolean) => void; children: React.ReactNode }) {
  const isNew = !staff;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(staff?.name ?? "");
  const [phone, setPhone] = useState(staff?.phone ?? "");
  const [merchant, setMerchant] = useState(staff?.merchant ?? merchantOptions[0] ?? "");
  const [role, setRole] = useState<MerchantStaff["role"]>(staff?.role ?? "Staff");

  const reset = () => { setName(staff?.name ?? ""); setPhone(staff?.phone ?? ""); setMerchant(staff?.merchant ?? merchantOptions[0] ?? ""); setRole(staff?.role ?? "Staff"); };
  const phoneValid = /^\d{10,14}$/.test(phone.trim());
  const valid = name.trim().length > 0 && phoneValid && merchant.length > 0;

  return <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (next) reset(); }}>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="max-w-lg border-border bg-card">
      <DialogHeader>
        <DialogTitle className="font-heading">{isNew ? "Invite staff member" : "Edit staff member"}</DialogTitle>
        <DialogDescription>Mobile number is the invite — if this number already has an account, they are linked to the merchant immediately. Otherwise they are linked automatically the next time they sign in.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium">Name <span className="text-destructive">*</span>
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name as it appears in the merchant app" />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">Phone number <span className="text-destructive">*</span>
          <Input value={phone} onChange={(event) => setPhone(event.target.value.replace(/[^\d]/g, ""))} placeholder="919000000001 (country code + number, no +)" inputMode="numeric" />
          {!phoneValid && phone.length > 0 && <span className="block text-xs font-normal text-destructive">Enter the country code and number, digits only.</span>}
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm font-medium">Merchant <span className="text-destructive">*</span>
            <Select value={merchant} onValueChange={setMerchant}>
              <SelectTrigger><SelectValue placeholder="Select merchant" /></SelectTrigger>
              <SelectContent>{merchantOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
            </Select>
          </label>
          <label className="space-y-1.5 text-sm font-medium">Role
            <Select value={role} onValueChange={(value) => setRole(value as MerchantStaff["role"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Owner">Owner</SelectItem><SelectItem value="Staff">Staff</SelectItem></SelectContent>
            </Select>
          </label>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild><Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive">Cancel</Button></DialogClose>
        <Button disabled={!valid} onClick={() => {
          onSave({
            id: staff?.id ?? `MS-${Math.floor(1100 + Math.random() * 800)}`,
            name: name.trim(),
            phone: phone.trim(),
            merchant,
            role,
            status: staff?.status ?? "Pending",
            invitedOn: staff?.invitedOn ?? format(new Date(), "dd MMM yyyy"),
            lastActive: staff?.lastActive ?? "—",
          }, isNew);
          setOpen(false);
        }}>{isNew ? <><Plus className="h-4 w-4" />Invite staff member</> : <><Check className="h-4 w-4" />Save changes</>}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}

function MerchantStaffPage({ staff, onSave, onDelete }: { staff: MerchantStaff[]; onSave: (member: MerchantStaff, isNew: boolean) => void; onDelete: (member: MerchantStaff) => void }) {
  const merchantOptions = useMemo(() => Array.from(new Set(merchants.map((row) => row[0] as string))).sort(), []);
  const [query, setQuery] = useState("");
  const [merchantFilters, setMerchantFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<MerchantStaff["status"][]>([]);

  const rows = staff.filter((member) => {
    const term = query.trim().toLowerCase();
    const matchesQuery = term.length === 0 || member.name.toLowerCase().includes(term) || member.phone.includes(term) || member.id.toLowerCase().includes(term);
    const matchesMerchant = merchantFilters.length === 0 || merchantFilters.includes(member.merchant);
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(member.status);
    return matchesQuery && matchesMerchant && matchesStatus;
  });
  const filtered = query.length > 0 || merchantFilters.length > 0 || statusFilters.length > 0;

  return <>
    <PageHeader title="Merchant Staff" description="Every phone number that can sign in to the merchant app and confirm in-store redemptions, across all merchants. Mobile number is the invite — no email or password is involved." actions={<MerchantStaffDialog staff={null} merchantOptions={merchantOptions} onSave={onSave}><Button><Plus />Invite staff member</Button></MerchantStaffDialog>} />

    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
      <div className="relative min-w-[280px] flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search by name, phone number, or staff ID…" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="outline">Merchant{merchantFilters.length > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{merchantFilters.length}</span>}<ChevronDown /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-72 w-56 overflow-y-auto">{merchantOptions.map((option) => <DropdownMenuCheckboxItem key={option} checked={merchantFilters.includes(option)} onCheckedChange={() => setMerchantFilters((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option])}>{option}</DropdownMenuCheckboxItem>)}</DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="outline">Status{statusFilters.length > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{statusFilters.length}</span>}<ChevronDown /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">{(["Active", "Pending"] as MerchantStaff["status"][]).map((option) => <DropdownMenuCheckboxItem key={option} checked={statusFilters.includes(option)} onCheckedChange={() => setStatusFilters((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option])}>{option}</DropdownMenuCheckboxItem>)}</DropdownMenuContent>
      </DropdownMenu>
      {filtered && <Button variant="ghost" onClick={() => { setQuery(""); setMerchantFilters([]); setStatusFilters([]); }}><RotateCcw className="h-4 w-4" />Reset</Button>}
    </div>

    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-245 text-left text-sm">
        <thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground">
          <tr><th>Staff ID</th><th>Name</th><th>Phone number</th><th>Merchant</th><th>Role</th><th>Status</th><th>Invited on</th><th>Last active</th><th className="text-right">Actions</th></tr>
        </thead>
        <tbody>
          {rows.map((member) => <tr key={member.id} className="border-t border-border hover:bg-muted/50">
            <td><div className="flex items-center gap-1 font-mono text-xs">{member.id}<CopyButton value={member.id} /></div></td>
            <td className="font-semibold">{member.name}</td>
            <td><div className="flex items-center gap-1 font-mono text-xs">{member.phone}<CopyButton value={member.phone} /></div></td>
            <td>{member.merchant}</td>
            <td>{member.role}</td>
            <td><StatusBadge status={member.status} /></td>
            <td className="text-muted-foreground">{member.invitedOn}</td>
            <td className="text-muted-foreground">{member.lastActive}</td>
            <td>
              <div className="flex items-center justify-end gap-1">
                {member.status === "Pending" && <Button variant="ghost" size="sm" onClick={() => toast.success("Invite re-sent", { description: `${member.name} will be linked to ${member.merchant} on their next sign-in.` })}><RefreshCw className="h-3.5 w-3.5" />Resend</Button>}
                <MerchantStaffDialog staff={member} merchantOptions={merchantOptions} onSave={onSave}><Button variant="ghost" size="sm"><Pencil className="h-3.5 w-3.5" />Edit</Button></MerchantStaffDialog>
                <ConfirmDeleteDialog itemType="staff member" name={member.name} onConfirm={() => onDelete(member)}><Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" />Remove</Button></ConfirmDeleteDialog>
              </div>
            </td>
          </tr>)}
          {rows.length === 0 && <tr><td colSpan={9} className="py-10 text-center text-muted-foreground">No staff match these filters.</td></tr>}
        </tbody>
      </table>
    </div>
    <TransactionPagination count={rows.length} />
  </>;
}

type OnboardingApp = "Consumer" | "Merchant";
type OnboardingSlide = { id: string; app: OnboardingApp; title: string; body: string; image: string; active: boolean };

const onboardingSlideSeeds: OnboardingSlide[] = [
  { id: "OS-1", app: "Consumer", title: "Welcome to OfferPe", body: "Earn real cashback every time you shop — online or in-store.", image: "", active: true },
  { id: "OS-2", app: "Consumer", title: "Shop your favorite brands online", body: "Tap Shop Now on any brand inside the app and we track your order automatically.", image: "", active: true },
  { id: "OS-3", app: "Consumer", title: "Scan & Pay in-store", body: "At a partner store, just show your Scan & Pay code at the counter.", image: "", active: true },
  { id: "OS-4", app: "Consumer", title: "Track every rupee", body: "Once your cashback is approved, withdraw it straight to your bank account.", image: "", active: true },
  { id: "OS-5", app: "Consumer", title: "Invite friends, earn more", body: "Invite friends and earn a bonus every time they complete their first order.", image: "", active: false },
  { id: "OS-6", app: "Merchant", title: "Welcome to OfferPe Merchant", body: "Accept OfferPe cashback payments in seconds at your counter.", image: "", active: true },
  { id: "OS-7", app: "Merchant", title: "Scan a customer's code", body: "Scan your customer's QR code, or ask for their registered mobile number.", image: "", active: true },
  { id: "OS-8", app: "Merchant", title: "Enter the bill and confirm", body: "Enter the bill amount — cashback is calculated and applied instantly.", image: "", active: true },
  { id: "OS-9", app: "Merchant", title: "Check your redemption history anytime", body: "Every redemption is logged. See your full history and settlements in one place.", image: "", active: true },
];

function OnboardingSlidePreview({ slide, index, total }: { slide: OnboardingSlide; index: number; total: number }) {
  return <div className="mx-auto w-[260px] rounded-[2rem] border-8 border-foreground/85 bg-card shadow-card">
    <div className="relative flex h-[520px] flex-col overflow-hidden rounded-[1.4rem] bg-primary">
      <div className="absolute inset-0">{slide.image ? <img src={slide.image} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gradient-to-b from-primary to-primary/70" />}</div>
      <div className="absolute inset-0 bg-overlay" />
      <div className="relative flex h-full flex-col justify-between p-5 text-primary-foreground">
        <div className="flex justify-end"><span className="rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-semibold text-foreground">Skip</span></div>
        <div>
          <h3 className="font-heading text-xl font-bold leading-tight">{slide.title || "Slide title"}</h3>
          <p className="mt-2 text-sm leading-6 opacity-90">{slide.body || "Slide body text appears here."}</p>
          <div className="mt-5 flex items-center gap-1.5">{Array.from({ length: Math.max(total, 1) }).map((_, dot) => <span key={dot} className={cn("h-1.5 rounded-full transition-all", dot === index ? "w-5 bg-primary-foreground" : "w-1.5 bg-primary-foreground/40")} />)}</div>
        </div>
      </div>
    </div>
  </div>;
}

function OnboardingSlideEditPage({ slide, app, total, index, onCancel, onSave, onDelete }: { slide: OnboardingSlide | null; app: OnboardingApp; total: number; index: number; onCancel: () => void; onSave: (slide: OnboardingSlide) => void; onDelete: (slide: OnboardingSlide) => void }) {
  const isNew = !slide;
  const [form, setForm] = useState<OnboardingSlide>(() => slide ?? { id: `OS-${Date.now()}`, app, title: "", body: "", image: "", active: true });
  const inputRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof OnboardingSlide>(key: K, value: OnboardingSlide[K]) => setForm((current) => ({ ...current, [key]: value }));
  const readFile = (file?: File) => { if (!file) return; const reader = new FileReader(); reader.onload = () => set("image", typeof reader.result === "string" ? reader.result : ""); reader.readAsDataURL(file); };
  const save = () => { if (!form.title.trim() || !form.body.trim()) { toast.error("Title and body text are required"); return; } onSave(form); toast.success(isNew ? "Onboarding slide added" : "Onboarding slide updated", { description: `${form.title} was saved for the ${form.app} app.` }); };
  return <div className="pb-20">
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={onCancel}>Dashboard</Button><ChevronRight className="h-3.5 w-3.5" /><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={onCancel}>Onboarding Screens</Button><ChevronRight className="h-3.5 w-3.5" /><span className="font-medium text-foreground">{isNew ? "New" : "Edit"}</span></nav>
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 className="font-heading text-3xl font-bold">{isNew ? "New onboarding slide" : "Edit onboarding slide"}</h1><p className="mt-1 text-sm text-muted-foreground">{form.app} app · shown once before signup on a fresh install.</p></div>
      {!isNew && <ConfirmDeleteDialog itemType="Onboarding Slide" name={form.title} onConfirm={() => onDelete(form)}><Button variant="destructive"><Trash2 />Delete</Button></ConfirmDeleteDialog>}
    </header>
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
      <SectionCard title="Slide Content" description="Fields marked with an asterisk are required.">
        <div className="grid gap-4">
          <label className="space-y-1.5 text-sm font-medium">App <span className="text-destructive">*</span>
            <Select value={form.app} onValueChange={(value) => set("app", value as OnboardingApp)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Consumer">Consumer</SelectItem><SelectItem value="Merchant">Merchant</SelectItem></SelectContent></Select>
          </label>
          <label className="space-y-1.5 text-sm font-medium">Title <span className="text-destructive">*</span>
            <Input value={form.title} onChange={(event) => set("title", event.target.value)} placeholder="Welcome to OfferPe" />
          </label>
          <label className="space-y-1.5 text-sm font-medium">Body text <span className="text-destructive">*</span>
            <Textarea rows={3} value={form.body} onChange={(event) => set("body", event.target.value)} placeholder="Earn real cashback every time you shop." />
          </label>
          <div>
            <span className="text-sm font-medium">{form.image ? "Replace image (optional)" : "Image (optional)"}</span>
            {form.image && <div className="mt-2 h-28 w-28 overflow-hidden rounded-md border border-border"><img src={form.image} alt="Current slide" className="h-full w-full object-cover" /></div>}
            <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); readFile(event.dataTransfer.files[0]); }} className="mt-2 flex min-h-24 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center hover:border-primary hover:bg-accent">
              <UploadCloud className="mb-2 h-6 w-6 text-primary" /><span className="text-sm font-semibold">Choose a file</span><span className="mt-1 text-xs text-muted-foreground">Full-bleed, shown behind the title and body text.</span>
              <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => readFile(event.target.files?.[0])} />
            </button>
            {form.image && <Button variant="ghost" size="sm" className="mt-2 text-destructive" onClick={() => set("image", "")}><X />Remove image</Button>}
          </div>
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2.5">
            <div><p className="text-sm font-semibold">Active</p><p className="text-xs text-muted-foreground">Inactive slides stay in the list but are skipped in the app.</p></div>
            <Switch checked={form.active} onCheckedChange={(value) => set("active", value)} aria-label="Active slide" />
          </div>
        </div>
      </SectionCard>
      <aside className="xl:sticky xl:top-6"><SectionCard title="Live Preview" description="How this slide appears in the onboarding carousel."><OnboardingSlidePreview slide={form} index={isNew ? total : index} total={isNew ? total + 1 : total} /></SectionCard></aside>
    </div>
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur md:left-64"><div className="mx-auto flex max-w-400 justify-end gap-2"><Button variant="destructiveSoft" onClick={onCancel}>Cancel</Button><Button onClick={save}><Check />Save</Button></div></div>
  </div>;
}

type LayoutMode = "list" | "grid";

function LayoutToggle({ value, onChange }: { value: LayoutMode; onChange: (mode: LayoutMode) => void }) {
  return <div className="inline-flex shrink-0 items-center gap-0.5 rounded-md border border-border bg-card p-0.5 shadow-card">
    <Button type="button" variant={value === "list" ? "default" : "ghost"} size="sm" className="h-7 px-2" aria-pressed={value === "list"} aria-label="List layout" onClick={() => onChange("list")}><List className="h-3.5 w-3.5" />List</Button>
    <Button type="button" variant={value === "grid" ? "default" : "ghost"} size="sm" className="h-7 px-2" aria-pressed={value === "grid"} aria-label="Grid layout" onClick={() => onChange("grid")}><LayoutGrid className="h-3.5 w-3.5" />Grid</Button>
  </div>;
}

function MerchantLogo({ name, compact = false }: { name: string; compact?: boolean }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  return <div aria-label={`${name} logo`} className={cn("flex shrink-0 items-center justify-center rounded-lg border border-border bg-card font-heading font-bold text-primary shadow-card", compact ? "h-11 w-11 text-sm" : "h-20 w-20 text-2xl")}>
    {initials || <Store className={compact ? "h-4 w-4" : "h-7 w-7"} />}
  </div>;
}

function OnboardingSlidesPage({ slides, app, onAppChange, onCreate, onEdit, onToggle, onMove, onDelete }: { slides: OnboardingSlide[]; app: OnboardingApp; onAppChange: (app: OnboardingApp) => void; onCreate: () => void; onEdit: (slide: OnboardingSlide) => void; onToggle: (slide: OnboardingSlide) => void; onMove: (slide: OnboardingSlide, direction: -1 | 1) => void; onDelete: (slide: OnboardingSlide) => void }) {
  const rows = slides.filter((slide) => slide.app === app);
  const [layout, setLayout] = useState<LayoutMode>("list");
  return <>
    <PageHeader title="Onboarding Screens" description="The full-screen carousel shown once, before signup or login, on a fresh install of each app. Reorder with the arrows below — the same mechanism as Merchant Page Sections." actions={<><LayoutToggle value={layout} onChange={setLayout} /><Button onClick={onCreate}><Plus />Add slide</Button></>} />
    <Tabs value={app} onValueChange={(value) => onAppChange(value as OnboardingApp)}>
      <TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0"><TabsTrigger value="Consumer" className={tabTriggerClass}>Consumer</TabsTrigger><TabsTrigger value="Merchant" className={tabTriggerClass}>Merchant</TabsTrigger></TabsList>
      <TabsContent value={app} className="mt-0">
        {layout === "grid" && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((slide, index) => <article key={slide.id} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
            <div className="relative h-40 w-full border-b border-border bg-muted/40">{slide.image ? <img src={slide.image} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center"><ImageIcon className="h-6 w-6 text-muted-foreground" /></span>}<span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-md bg-card font-heading text-xs font-bold text-primary shadow-card">{index + 1}</span></div>
            <div className="flex min-h-44 flex-1 flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2"><span className="font-heading text-sm font-bold">{slide.title}</span><StatusBadge status={slide.active ? "Active" : "Inactive"} /></div>
              <p className="line-clamp-3 text-xs text-muted-foreground">{slide.body}</p>
              <div className="mt-auto flex flex-wrap items-center gap-1 pt-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Move ${slide.title} up`} disabled={index === 0} onClick={() => onMove(slide, -1)}><ArrowUp className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Move ${slide.title} down`} disabled={index === rows.length - 1} onClick={() => onMove(slide, 1)}><ArrowDown className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="h-8" onClick={() => onToggle(slide)}>{slide.active ? "Deactivate" : "Activate"}</Button>
                <Button variant="ghost" size="sm" className="h-8" onClick={() => onEdit(slide)}><Pencil className="h-3.5 w-3.5" />Edit</Button>
                <ConfirmDeleteDialog itemType="Onboarding Slide" name={slide.title} onConfirm={() => onDelete(slide)}><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" aria-label={`Delete ${slide.title}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog>
              </div>
            </div>
          </article>)}
          {rows.length === 0 && <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">No onboarding slides for the {app} app yet.</div>}
        </div>}
        {layout === "list" && <div className="space-y-2">
          {rows.map((slide, index) => <div key={slide.id} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent font-heading text-xs font-bold text-primary">{index + 1}</span>
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md border border-border bg-muted">{slide.image ? <img src={slide.image} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></span>}</div>
            <div className="min-w-0 flex-1"><div className="truncate font-heading text-sm font-bold">{slide.title}</div><div className="truncate text-xs text-muted-foreground">{slide.body}</div></div>
            <StatusBadge status={slide.active ? "Active" : "Inactive"} />
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Move ${slide.title} up`} disabled={index === 0} onClick={() => onMove(slide, -1)}><ArrowUp className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Move ${slide.title} down`} disabled={index === rows.length - 1} onClick={() => onMove(slide, 1)}><ArrowDown className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="h-8" onClick={() => onToggle(slide)}>{slide.active ? "Deactivate" : "Activate"}</Button>
              <Button variant="ghost" size="sm" className="h-8" onClick={() => onEdit(slide)}><Pencil className="h-3.5 w-3.5" />Edit</Button>
              <ConfirmDeleteDialog itemType="Onboarding Slide" name={slide.title} onConfirm={() => onDelete(slide)}><Button variant="ghost" size="sm" className="h-8 text-destructive"><Trash2 className="h-3.5 w-3.5" />Delete</Button></ConfirmDeleteDialog>
            </div>
          </div>)}
          {rows.length === 0 && <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">No onboarding slides for the {app} app yet.</div>}
        </div>}
      </TabsContent>
    </Tabs>
  </>;
}

function OnboardingAppCard({ app }: { app: string }) {
  const [state, setState] = useState({ interval: "3", skip: true });
  const [saved, setSaved] = useState({ interval: "3", skip: true });
  const dirty = JSON.stringify(state) !== JSON.stringify(saved);
  return <div className="rounded-lg border border-border bg-background p-4">
    <h3 className="font-heading text-sm font-bold">{app}</h3>
    <label className="mt-3 block space-y-1.5 text-sm font-medium">Auto-swipe interval (seconds) <span className="text-destructive">*</span>
      <Input type="number" min="1" value={state.interval} onChange={(event) => setState((current) => ({ ...current, interval: event.target.value }))} />
    </label>
    <label className="mt-3 flex items-center gap-2 text-sm font-medium">
      <Checkbox checked={state.skip} onCheckedChange={(checked) => setState((current) => ({ ...current, skip: checked === true }))} aria-label={`Show Skip button on ${app}`} />
      Show Skip button
    </label>
    <div className="mt-4 flex items-center gap-2">
      <ConfirmSaveDialog title={`Save ${app} onboarding settings?`} disabled={!dirty} summary={[{ label: "Auto-swipe interval", value: `${state.interval || "0"} sec` }, { label: "Skip button", value: state.skip ? "Shown" : "Hidden" }]} onConfirm={() => { setSaved(state); toast.success(`${app} onboarding saved`, { description: `Auto-swipe every ${state.interval}s · Skip ${state.skip ? "shown" : "hidden"}.` }); }}>
        <Button disabled={!dirty}><Check />Save</Button>
      </ConfirmSaveDialog>
      <Button variant="destructiveSoft" disabled={!dirty} onClick={() => setState(saved)}>Cancel</Button>
    </div>
  </div>;
}

function SettingsPage() {
  const [withdrawal, setWithdrawal] = useState({ minimum: "100", saved: "100" });
  const [referral, setReferral] = useState({ referrer: "50", referred: "50", active: true });
  const [referralSaved, setReferralSaved] = useState({ referrer: "50", referred: "50", active: true });
  const [sync, setSync] = useState({ passthrough: "60", hours: "2", enabled: false });
  const [syncSaved, setSyncSaved] = useState({ passthrough: "60", hours: "2", enabled: false });

  const withdrawalDirty = withdrawal.minimum !== withdrawal.saved;
  const referralDirty = JSON.stringify(referral) !== JSON.stringify(referralSaved);
  const syncDirty = JSON.stringify(sync) !== JSON.stringify(syncSaved);

  return <>
    <PageHeader title="Settings" description="Platform-wide defaults for payouts, referrals and the Trackier catalog sync. Every change asks for a second confirmation before it goes live." />
    <div className="grid gap-5">
      <SettingsCard title="Withdrawal Settings" description="Controls the smallest balance a user can cash out from their OfferPe wallet."
        footer={<>
          <Button variant="destructiveSoft" disabled={!withdrawalDirty} onClick={() => setWithdrawal((current) => ({ ...current, minimum: current.saved }))}>Cancel</Button>
          <ConfirmSaveDialog title="Save withdrawal settings?" disabled={!withdrawalDirty} summary={[{ label: "Minimum withdrawal amount", value: `₹${withdrawal.minimum || "0"}` }]} onConfirm={() => { setWithdrawal((current) => ({ ...current, saved: current.minimum })); toast.success("Withdrawal settings saved", { description: `Minimum withdrawal is now ₹${withdrawal.minimum}.` }); }}>
            <Button disabled={!withdrawalDirty}><Check />Save</Button>
          </ConfirmSaveDialog>
        </>}>
        <label className="space-y-1.5 text-sm font-medium">Minimum withdrawal amount (₹) <span className="text-destructive">*</span>
          <Input type="number" min="1" value={withdrawal.minimum} onChange={(event) => setWithdrawal((current) => ({ ...current, minimum: event.target.value }))} />
          <span className="block text-xs font-normal text-muted-foreground">Requests below this amount are blocked in the app.</span>
        </label>
      </SettingsCard>

      <SettingsCard title="Referral Settings" description="Bonus credited to the referrer and to the new user once their first qualifying order is confirmed."
        footer={<>
          <Button variant="destructiveSoft" disabled={!referralDirty} onClick={() => setReferral(referralSaved)}>Cancel</Button>
          <ConfirmSaveDialog title="Save referral settings?" disabled={!referralDirty} summary={[{ label: "Referrer bonus", value: `₹${referral.referrer || "0"}` }, { label: "Referred user bonus", value: `₹${referral.referred || "0"}` }, { label: "Program", value: referral.active ? "Active" : "Paused" }]} onConfirm={() => { setReferralSaved(referral); toast.success("Referral settings saved", { description: referral.active ? `Referrer ₹${referral.referrer} · new user ₹${referral.referred}.` : "Referral program is now paused." }); }}>
            <Button disabled={!referralDirty}><Check />Save</Button>
          </ConfirmSaveDialog>
        </>}>
        <label className="space-y-1.5 text-sm font-medium">Referrer bonus amount (₹) <span className="text-destructive">*</span>
          <Input type="number" min="0" value={referral.referrer} onChange={(event) => setReferral((current) => ({ ...current, referrer: event.target.value }))} />
        </label>
        <label className="space-y-1.5 text-sm font-medium">Referred (new user) bonus amount (₹) <span className="text-destructive">*</span>
          <Input type="number" min="0" value={referral.referred} onChange={(event) => setReferral((current) => ({ ...current, referred: event.target.value }))} />
        </label>
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-3 py-2.5 sm:col-span-2">
          <div>
            <p className="text-sm font-semibold">Program active</p>
            <p className="text-xs text-muted-foreground">When paused, referral codes stop crediting new bonuses.</p>
          </div>
          <Switch checked={referral.active} onCheckedChange={(checked) => setReferral((current) => ({ ...current, active: checked }))} aria-label="Referral program active" />
        </div>
      </SettingsCard>

      <SettingsCard title="Trackier Sync Settings" description="Global defaults for the Trackier catalog sync. A merchant's own passthrough override always takes priority over the default set here."
        footer={<>
          <Button variant="destructiveSoft" disabled={!syncDirty} onClick={() => setSync(syncSaved)}>Cancel</Button>
          <ConfirmSaveDialog title="Save Trackier sync settings?" disabled={!syncDirty} summary={[{ label: "Default passthrough", value: `${sync.passthrough || "0"}%` }, { label: "Minimum hours between syncs", value: `${sync.hours || "1"} hrs` }, { label: "Scheduled sync", value: sync.enabled ? "Enabled" : "Disabled" }]} onConfirm={() => { setSyncSaved(sync); toast.success("Sync settings saved", { description: `Default passthrough ${sync.passthrough}% · scheduled sync ${sync.enabled ? "enabled" : "disabled"}.` }); }}>
            <Button disabled={!syncDirty}><Check />Save</Button>
          </ConfirmSaveDialog>
        </>}>
        <label className="space-y-1.5 text-sm font-medium">Default passthrough % <span className="text-destructive">*</span>
          <Input type="number" min="0" max="100" value={sync.passthrough} onChange={(event) => setSync((current) => ({ ...current, passthrough: event.target.value }))} />
          <span className="block text-xs font-normal text-muted-foreground">Applies to any merchant without its own override.</span>
        </label>
        <label className="space-y-1.5 text-sm font-medium">Minimum hours between scheduled syncs <span className="text-destructive">*</span>
          <Input type="number" min="1" value={sync.hours} onChange={(event) => setSync((current) => ({ ...current, hours: event.target.value }))} />
          <span className="block text-xs font-normal text-muted-foreground">A floor of 1 hour is enforced regardless of this value.</span>
        </label>
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-3 py-2.5 sm:col-span-2">
          <div>
            <p className="text-sm font-semibold">Scheduled sync enabled</p>
            <p className="text-xs text-muted-foreground">Runs the Trackier catalog import automatically on the interval above.</p>
          </div>
          <Switch checked={sync.enabled} onCheckedChange={(checked) => setSync((current) => ({ ...current, enabled: checked }))} aria-label="Scheduled sync enabled" />
        </div>
      </SettingsCard>

      <section className="rounded-lg border border-border bg-card shadow-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-bold">Onboarding Settings</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Per-app auto-swipe timing and whether the Skip button is offered on the onboarding carousel.</p>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <OnboardingAppCard app="Consumer App" />
          <OnboardingAppCard app="Merchant App" />
        </div>
      </section>
    </div>
  </>;
}

const tabTriggerClass = "rounded-none border-b-2 border-transparent px-1 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none";

function Categories({ categories, mappedCount, tab, onTabChange, mappings, onSaveMapping, onEdit, onCreate, onDelete }: { categories: Category[]; mappedCount: (category: Category) => number; tab: "categories" | "mapping"; onTabChange: (tab: "categories" | "mapping") => void; mappings: RawMapping[]; onSaveMapping: (raw: string, mappedTo: string) => void; onEdit: (category: Category) => void; onCreate: () => void; onDelete: (category: Category) => void }) {
  const [query, setQuery] = useState(""); const [channel, setChannel] = useState("all"); const [status, setStatus] = useState("all"); const [ascending, setAscending] = useState(true);
  const rows = categories.filter((category) => (!query || category.name.toLowerCase().includes(query.toLowerCase())) && (channel === "all" || category.channel === channel) && (status === "all" || (category.active ? "Active" : "Inactive") === status)).sort((a, b) => ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  return <><PageHeader title="Categories" description="Manage online and offline shopping categories, display sequences, and promotional copy." actions={tab === "categories" ? <Button onClick={onCreate}><Plus />Add new category</Button> : undefined} /><Tabs value={tab} onValueChange={(value) => onTabChange(value as "categories" | "mapping")}><TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0"><TabsTrigger value="categories" className={tabTriggerClass}>Categories</TabsTrigger><TabsTrigger value="mapping" className={tabTriggerClass}>Category Mapping</TabsTrigger></TabsList><TabsContent value="categories" className="mt-0"><div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by category name…" /></div><Select value={channel} onValueChange={setChannel}><SelectTrigger className="lg:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All channels</SelectItem><SelectItem value="Online">Online</SelectItem><SelectItem value="Offline">Offline</SelectItem></SelectContent></Select><Select value={status} onValueChange={setStatus}><SelectTrigger className="lg:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></div><div className="overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-215 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th>Channel</th><th><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setAscending(!ascending)}>Name<ChevronDown className={cn("transition-transform", !ascending && "rotate-180")} /></Button></th><th>Mapped Merchants</th><th>Display Order</th><th>Status</th><th className="text-right">Actions</th></tr></thead><tbody>{rows.map((category) => <tr key={category.id} className="border-t border-border hover:bg-muted/50"><td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", category.channel === "Online" ? "bg-success-soft text-success" : "bg-info-soft text-info")}>{category.channel}</span></td><td className="font-semibold">{category.name}</td><td><span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"><Store className="h-3 w-3" />{mappedCount(category)} stores</span></td><td>{category.order}</td><td><StatusBadge status={category.active ? "Active" : "Inactive"} /></td><td className="text-right"><span className="inline-flex"><IconButton className="h-7 w-7" label={`Edit ${category.name}`} onClick={() => onEdit(category)}><Pencil className="h-3.5 w-3.5" /></IconButton><ConfirmDeleteDialog itemType="Category" name={category.name} onConfirm={() => onDelete(category)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete ${category.name}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog></span></td></tr>)}</tbody></table></div></div><p className="mt-4 text-sm text-muted-foreground">Showing {rows.length} of {categories.length} categories</p></TabsContent><TabsContent value="mapping" className="mt-0"><CategoryMapping categories={categories} mappings={mappings} onSave={onSaveMapping} /></TabsContent></Tabs></>;
}

function CategoryMapping({ categories, mappings, onSave }: { categories: Category[]; mappings: RawMapping[]; onSave: (raw: string, mappedTo: string) => void }) {
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("all");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const valueFor = (item: RawMapping) => drafts[item.raw] ?? (item.mappedTo || "none");
  const rows = mappings.filter((item) => (!query || item.raw.includes(query.toLowerCase())) && (status === "all" || (item.mappedTo ? "Mapped" : "Unmapped") === status));
  const save = (item: RawMapping) => {
    const value = valueFor(item);
    const next = value === "none" ? "" : value;
    onSave(item.raw, next);
    const category = categories.find((entry) => entry.id === next);
    toast.success(category ? `Category mapped: "${item.raw}" → "${category.name}"` : `Mapping cleared for "${item.raw}"`);
  };
  return <><p className="mb-5 max-w-4xl text-sm leading-6 text-muted-foreground">Raw category strings as Trackier reports them, resolved to this catalog&apos;s own categories. A raw category is added here automatically the first time a sync run sees it — unmapped ones are never silently dropped, but the merchants under them won&apos;t have a real category_id until mapped.</p><div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search raw category…" /></div><Select value={status} onValueChange={setStatus}><SelectTrigger className="lg:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Mapped">Mapped</SelectItem><SelectItem value="Unmapped">Unmapped</SelectItem></SelectContent></Select></div><div className="overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-190 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th>Raw Category</th><th>Status</th><th>Mapped To</th><th className="text-right">Actions</th></tr></thead><tbody>{rows.map((item) => <tr key={item.raw} className="border-t border-border hover:bg-muted/50"><td className="font-mono text-xs font-semibold">{item.raw}</td><td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", item.mappedTo ? "bg-success-soft text-success" : "status-pending")}>{item.mappedTo ? "Mapped" : "Unmapped"}</span></td><td><Select value={valueFor(item)} onValueChange={(value) => setDrafts((current) => ({ ...current, [item.raw]: value }))}><SelectTrigger className="h-8 w-64"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Not mapped</SelectItem>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name} ({category.channel.toUpperCase()})</SelectItem>)}</SelectContent></Select></td><td className="text-right"><Button size="sm" className="h-8" onClick={() => save(item)}>Save</Button></td></tr>)}</tbody></table></div></div><p className="mt-4 text-sm text-muted-foreground">Showing {rows.length} of {mappings.length} raw categories</p></>;
}

function CategoryFormPage({ category, onCancel, onSave, onDelete }: { category: Category | null; onCancel: () => void; onSave: (category: Category) => void; onDelete: (category: Category) => void }) {
  const isNew = !category;
  const [form, setForm] = useState<Category>(() => category ?? { id: `CAT-${Date.now()}`, channel: "Online", name: "", order: 0, active: true, image: "", line1: "", line2: "" });
  const set = <K extends keyof Category>(key: K, value: Category[K]) => setForm((current) => ({ ...current, [key]: value }));
  const save = () => { if (!form.name.trim()) { toast.error("Category name is required"); return; } onSave(form); toast.success(isNew ? "Category created" : "Category updated", { description: `${form.name} was saved successfully.` }); };
  return <div className="pb-20"><nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={onCancel}>Dashboard</Button><ChevronRight className="h-3.5 w-3.5" /><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={onCancel}>Categories</Button><ChevronRight className="h-3.5 w-3.5" /><span className="font-medium text-foreground">{isNew ? "New" : "Edit"}</span></nav><header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="font-heading text-3xl font-bold">{isNew ? "New category" : "Edit category"}</h1><p className="mt-1 text-sm text-muted-foreground">Configure category placement, promotional copy, and availability.</p></div>{isNew ? <Button variant="outline" onClick={onCancel}><ChevronLeft />Back to Categories</Button> : <ConfirmDeleteDialog itemType="Category" name={form.name} onConfirm={() => onDelete(form)}><Button variant="destructive"><Trash2 />Delete Category</Button></ConfirmDeleteDialog>}</header><SectionCard title="Category Details" description="Fields marked with an asterisk are required."><div className="grid gap-5 md:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Channel <span className="text-destructive">*</span><Select value={form.channel} onValueChange={(value) => set("channel", value as Category["channel"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Offline">Offline</SelectItem><SelectItem value="Online">Online</SelectItem></SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">Display order <span className="text-destructive">*</span><Input type="number" min="0" value={form.order} onChange={(event) => set("order", Number(event.target.value))} /></label><label className="space-y-1.5 text-sm font-medium md:col-span-2">Name <span className="text-destructive">*</span><Input value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="Restaurants" /></label><label className="space-y-1.5 text-sm font-medium md:col-span-2">Image URL<div className="flex gap-3"><Input type="url" value={form.image} onChange={(event) => set("image", event.target.value)} placeholder="https://…" />{form.image && <img src={form.image} alt="Category preview" className="h-10 w-16 shrink-0 rounded border border-border object-cover" />}</div></label><label className="space-y-1.5 text-sm font-medium md:col-span-2">Text line 1<Input value={form.line1} onChange={(event) => set("line1", event.target.value)} placeholder="Marketing tagline" /></label><label className="space-y-1.5 text-sm font-medium md:col-span-2">Text line 2<Input value={form.line2} onChange={(event) => set("line2", event.target.value)} placeholder="Supporting promotional copy" /></label><label className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3 md:col-span-2"><Checkbox checked={form.active} onCheckedChange={(value) => set("active", value === true)} /><span className="text-sm font-semibold">Active</span></label></div></SectionCard><div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur md:left-64"><div className="mx-auto flex max-w-400 justify-end gap-2"><Button variant="destructiveSoft" onClick={onCancel}>Cancel</Button><Button onClick={save}>Save</Button></div></div></div>;
}

function OfferTable({ offers, onEdit, onDelete, showMerchant = false }: { offers: Offer[]; onEdit: (offer: Offer) => void; onDelete: (offer: Offer) => void; showMerchant?: boolean }) {
  return <div className="overflow-x-auto rounded-lg border border-border"><table className="w-full min-w-245 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th>Headline / Offer Name</th>{showMerchant && <th>Merchant</th>}<th>Customer Cashback</th><th>Commission</th><th>Validity</th><th>Min Bill</th><th>Sort</th><th>Featured</th><th>Status</th><th className="text-right">Actions</th></tr></thead><tbody>{offers.map((offer) => <tr key={offer.id} className="border-t border-border hover:bg-muted/50"><td><div className="font-semibold">{offer.headline}</div><div className="text-xs text-muted-foreground">{offer.subtext}</div></td>{showMerchant && <td><span className="inline-flex items-center gap-2 font-medium"><span className="flex h-6 w-6 items-center justify-center rounded bg-accent text-primary"><Store className="h-3.5 w-3.5" /></span>{offer.merchant}</span></td>}<td>{offer.discountType === "Percentage" ? `${offer.discountValue}%` : `₹${offer.discountValue}`}</td><td>{offer.commissionType === "Percentage" ? `${offer.commissionValue}%` : `₹${offer.commissionValue}`}</td><td className="whitespace-nowrap text-xs text-muted-foreground">{format(new Date(offer.start), "dd MMM yyyy")} – {offer.end ? format(new Date(offer.end), "dd MMM yyyy") : "Open"}</td><td>₹{offer.minBill}</td><td>{offer.sortOrder}</td><td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", offer.featured ? "bg-info-soft text-info" : "bg-muted text-muted-foreground")}>{offer.featured ? "Featured" : "Standard"}</span></td><td><StatusBadge status={offer.active ? "Active" : "Inactive"} /></td><td className="text-right"><span className="inline-flex"><IconButton className="h-7 w-7" label={`Edit ${offer.headline}`} onClick={() => onEdit(offer)}><Pencil className="h-3.5 w-3.5" /></IconButton>{showMerchant && <CopyButton value={offer.id} />}<ConfirmDeleteDialog itemType="Offer" name={offer.headline} onConfirm={() => onDelete(offer)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete ${offer.headline}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog></span></td></tr>)}</tbody></table></div>;
}

function AddBannerModal({ open, onOpenChange, nextPosition, onAdd }: { open: boolean; onOpenChange: (open: boolean) => void; nextPosition: number; onAdd: (banner: Banner, position: number) => void }) {
  const [title, setTitle] = useState("");
  const [placement, setPlacement] = useState("Merchant Page Hero");
  const [target, setTarget] = useState("");
  const [image, setImage] = useState("");
  const [position, setPosition] = useState(nextPosition);
  const [start, setStart] = useState("2026-09-21");
  const [end, setEnd] = useState("");
  const [active, setActive] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const add = () => {
    if (!title.trim()) { toast.error("Banner title is required"); return; }
    onAdd({ id: `BAN-${Date.now()}`, title: title.trim(), placement, target, image, start, end, active }, position);
    toast.success("Banner added", { description: `${title.trim()} is now in position ${position}.` });
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto bg-card p-0"><DialogHeader className="border-b border-border px-6 py-5"><DialogTitle className="font-heading text-xl">Add Banner</DialogTitle><DialogDescription>Create and schedule a promotional banner for this merchant.</DialogDescription></DialogHeader><div className="grid gap-4 px-6 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium sm:col-span-2">Banner Title / Headline <span className="text-destructive">*</span><Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Festive Gifting Collection" /></label><label className="space-y-1.5 text-sm font-medium">Placement / Slot<Select value={placement} onValueChange={setPlacement}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Merchant Page Hero", "Category Carousel", "Store Footer"].map((slot) => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}</SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">Display Position<Input type="number" min="1" max={nextPosition} value={position} onChange={(event) => setPosition(Math.max(1, Number(event.target.value)))} /></label><label className="space-y-1.5 text-sm font-medium sm:col-span-2">Target / Deep link<Input value={target} onChange={(event) => setTarget(event.target.value)} placeholder="offerpe://merchants/theobroma/festive" /></label><div className="sm:col-span-2"><span className="text-sm font-medium">Banner Image</span><button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) setImage(file.name); }} className="mt-1.5 flex min-h-32 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-4 hover:border-primary hover:bg-accent"><UploadCloud className="mb-2 h-7 w-7 text-primary" /><span className="text-sm font-semibold">{image || "Drop an image here or choose a file"}</span><span className="mt-1 text-xs text-muted-foreground">PNG, JPG or WebP</span><input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => setImage(event.target.files?.[0]?.name ?? "")} /></button><Input className="mt-2" value={image} onChange={(event) => setImage(event.target.value)} placeholder="Or paste an image URL" /></div><label className="space-y-1.5 text-sm font-medium">Schedule Start<Input type="date" value={start} onChange={(event) => setStart(event.target.value)} /></label><label className="space-y-1.5 text-sm font-medium">Schedule End <span className="font-normal text-muted-foreground">(optional)</span><Input type="date" value={end} onChange={(event) => setEnd(event.target.value)} /></label><div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2.5 sm:col-span-2"><div><p className="text-sm font-semibold">Active status</p><p className="text-xs text-muted-foreground">Show this banner during its scheduled period.</p></div><Switch checked={active} onCheckedChange={setActive} aria-label="Active banner" /></div></div><DialogFooter className="border-t border-border px-6 py-4"><Button variant="destructiveSoft" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={add}><Plus />Add Banner</Button></DialogFooter></DialogContent></Dialog>;
}

function MerchantEditPage({ merchant, offers, reviews, initialTab, onBack, onDeleteMerchant, onEditOffer, onCreateOffer, onDeleteOffer, onApproveReview, onRejectReview, onRevertReview, onDeleteReview }: { merchant: typeof merchants[number]; offers: Offer[]; reviews: Review[]; initialTab: "details" | "offers"; onApproveReview: (review: Review) => void; onRejectReview: (review: Review, reason: string, note: string) => void; onRevertReview: (review: Review) => void; onDeleteReview: (review: Review) => void; onBack: () => void; onDeleteMerchant: () => void; onEditOffer: (offer: Offer) => void; onCreateOffer: () => void; onDeleteOffer: (offer: Offer) => void }) {
  const [active, setActive] = useState(merchant[4] === "Active");
  const [cities, setCities] = useState(["Mumbai, Maharashtra", "Bengaluru, Karnataka"]);
  const [steps, setSteps] = useState(["Show your OfferPe QR code at billing", "Merchant scans and confirms the amount", "Cashback credits to your wallet instantly"]);
  const [pageSections, setPageSections] = useState([{ name: "ABOUT", visible: true }, { name: "HOW TO AVAIL", visible: true }, { name: "OFFER DETAILS", visible: true }, { name: "TERMS CONDITIONS", visible: true }]);
  const [newSection, setNewSection] = useState("OTHER OFFERS");
  const [banners, setBanners] = useState<Banner[]>([
    { id: "BAN-101", title: "Festive gifting collection", placement: "Merchant Page Hero", target: "offerpe://merchants/theobroma/festive", image: "", start: "2026-09-21", end: "2026-10-31", active: true },
    { id: "BAN-102", title: "Brownie celebration box", placement: "Category Carousel", target: "offerpe://merchants/theobroma/brownies", image: "", start: "2026-09-21", end: "", active: true },
    { id: "BAN-103", title: "Weekend store offer", placement: "Store Footer", target: "offerpe://merchants/theobroma/weekend", image: "", start: "2026-09-21", end: "", active: true },
  ]);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [draggedBanner, setDraggedBanner] = useState<number | null>(null);
  const moveSection = (index: number, direction: -1 | 1) => setPageSections((current) => { const target = index + direction; if (target < 0 || target >= current.length) return current; const next = [...current]; const item = next[index]; const targetItem = next[target]; if (item && targetItem) { next[index] = targetItem; next[target] = item; } return next; });
  const moveStep = (index: number, direction: -1 | 1) => setSteps((current) => { const target = index + direction; if (target < 0 || target >= current.length) return current; const next = [...current]; [next[index], next[target]] = [next[target] ?? "", next[index] ?? ""]; return next; });
  const moveBanner = (from: number, to: number) => { if (from === to || to < 0 || to >= banners.length) return; setBanners((current) => { const next = [...current]; const [moved] = next.splice(from, 1); if (!moved) return current; next.splice(to, 0, moved); return next; }); toast.success("Banner order updated"); };
  const addBanner = (banner: Banner, position: number) => setBanners((current) => { const next = [...current]; next.splice(Math.min(Math.max(position - 1, 0), next.length), 0, banner); return next; });
  const save = () => { toast.success("Merchant updated", { description: `${merchant[0]} was saved successfully.` }); onBack(); };
  return <div className="pb-20"><nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={() => onBack()}>Dashboard</Button><ChevronRight className="h-3.5 w-3.5" /><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={onBack}>Merchants</Button><ChevronRight className="h-3.5 w-3.5" /><span className="font-medium text-foreground">{merchant[0]}</span></nav><header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap items-center gap-3"><h1 className="font-heading text-3xl font-bold">{merchant[0]}</h1><StatusBadge status={active ? "Active" : "Inactive"} /></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={onBack}><ChevronLeft />Back to Merchants</Button><ConfirmDeleteDialog itemType="Merchant" name={merchant[0]} onConfirm={onDeleteMerchant}><Button variant="destructive"><Trash2 />Delete Merchant</Button></ConfirmDeleteDialog></div></header><Tabs defaultValue={initialTab}><TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0"><TabsTrigger value="details" className="rounded-none border-b-2 border-transparent px-1 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none">Details</TabsTrigger><TabsTrigger value="sections" className="rounded-none border-b-2 border-transparent px-1 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none">Page Sections</TabsTrigger><TabsTrigger value="banners" className="rounded-none border-b-2 border-transparent px-1 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none">Banners</TabsTrigger><TabsTrigger value="offers" className="rounded-none border-b-2 border-transparent px-1 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none">Offers</TabsTrigger><TabsTrigger value="reviews" className={tabTriggerClass}>Reviews</TabsTrigger></TabsList><TabsContent value="details" className="mt-0"><div className="grid gap-5 xl:grid-cols-2"><SectionCard title="Core Details" description="Primary merchant identity and publishing settings."><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium sm:col-span-2">Name <span className="text-destructive">*</span><Input defaultValue={merchant[0]} /></label><label className="space-y-1.5 text-sm font-medium">Category <span className="text-destructive">*</span><Select defaultValue={merchant[2]}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={merchant[2]}>{merchant[2]}</SelectItem><SelectItem value="Restaurants">Restaurants</SelectItem><SelectItem value="Fashion">Fashion</SelectItem></SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">Display Order <span className="text-destructive">*</span><Input type="number" defaultValue={merchant[3]} /></label><label className="space-y-1.5 text-sm font-medium">Website URL<Input type="url" placeholder="https://merchant.example" /></label><label className="space-y-1.5 text-sm font-medium">Affiliate Network<Select defaultValue="none"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="trackier">Trackier</SelectItem><SelectItem value="impact">Impact</SelectItem></SelectContent></Select></label><div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2.5 sm:col-span-2"><div><p className="text-sm font-semibold">Active merchant</p><p className="text-xs text-muted-foreground">Visible to customers across OfferPe.</p></div><Switch checked={active} onCheckedChange={setActive} aria-label="Active merchant" /></div></div></SectionCard><SectionCard title="Operating Cities & Locations" description="Control where this merchant is available."><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">State<Select defaultValue="maharashtra"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="maharashtra">Maharashtra</SelectItem><SelectItem value="karnataka">Karnataka</SelectItem></SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">City<Select defaultValue="mumbai"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="mumbai">Mumbai</SelectItem><SelectItem value="bengaluru">Bengaluru</SelectItem></SelectContent></Select></label></div><div className="mt-4 flex flex-wrap gap-2">{cities.map((city) => <span key={city} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{city}<Button variant="ghost" size="icon" className="h-4 w-4" aria-label={`Remove ${city}`} onClick={() => setCities((current) => current.filter((item) => item !== city))}><X className="h-3 w-3" /></Button></span>)}</div><p className="mt-4 text-sm leading-6 text-muted-foreground">A chain can operate in more than one city — pick every city this merchant is live in.</p></SectionCard><SectionCard title="Brand & App Content" description="Customer-facing information and redemption guidance."><div className="space-y-5"><label className="block space-y-1.5 text-sm font-medium">About / Description<Textarea rows={4} defaultValue="Premium bakery and patisserie chain known for its brownies." /></label><div><span className="text-sm font-medium">Brand Logo</span><button type="button" className="mt-1.5 flex min-h-28 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center hover:border-primary hover:bg-accent"><UploadCloud className="mb-2 h-6 w-6 text-primary" /><span className="text-sm font-semibold">Upload brand logo</span><span className="mt-1 text-xs text-muted-foreground">Leave blank to keep the current logo or use the Trackier-synced logo.</span></button></div><div><div className="mb-2 flex items-center justify-between"><span className="text-sm font-medium">How to Avail</span><Button variant="ghost" size="sm" onClick={() => setSteps((current) => [...current, "New redemption step"])}><Plus />Add step</Button></div><div className="space-y-2">{steps.map((step, index) => <div key={`${step}-${index}`} className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-2"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-accent text-xs font-bold text-primary">{index + 1}</span><Input value={step} onChange={(event) => setSteps((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} className="h-8 bg-card" /><div className="flex shrink-0"><IconButton label="Move step up" className="h-7 w-7" onClick={() => moveStep(index, -1)}><ArrowUp className="h-3.5 w-3.5" /></IconButton><IconButton label="Move step down" className="h-7 w-7" onClick={() => moveStep(index, 1)}><ArrowDown className="h-3.5 w-3.5" /></IconButton><ConfirmDeleteDialog itemType="Redemption Step" name={step} onConfirm={() => { setSteps((current) => current.filter((_, itemIndex) => itemIndex !== index)); toast.success("Redemption step deleted"); }}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label="Delete step"><X className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog></div></div>)}</div></div></div></SectionCard><SectionCard title="Commission & Tracking Rules" description="Default calculations and expected processing windows."><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Default Commission Type<Select defaultValue="percentage"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="flat">Flat amount</SelectItem><SelectItem value="none">No default commission</SelectItem></SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">Default Commission Value<Input type="number" defaultValue="8" /></label><label className="space-y-1.5 text-sm font-medium">Expected Tracking Time (minutes)<Input type="number" defaultValue="30" /></label><label className="space-y-1.5 text-sm font-medium">Expected Approval Time (days)<Input type="number" defaultValue="45" /></label></div></SectionCard></div></TabsContent><TabsContent value="sections" className="mt-0"><SectionCard title="Customer Page Sections" description="Arrange and control the sections shown on this merchant’s customer-facing page."><div className="divide-y divide-border rounded-lg border border-border">{pageSections.map((section, index) => <div key={section.name} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent font-heading text-xs font-bold text-primary">{index + 1}</span><div><div className="font-heading text-sm font-bold">{section.name}</div><div className={cn("mt-0.5 inline-flex items-center gap-1 text-xs font-medium", section.visible ? "text-success" : "text-muted-foreground")}>{section.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}{section.visible ? "Visible" : "Hidden"}</div></div></div><div className="flex items-center gap-1"><IconButton label={`Move ${section.name} up`} className="h-8 w-8" onClick={() => moveSection(index, -1)}><ArrowUp className="h-4 w-4" /></IconButton><IconButton label={`Move ${section.name} down`} className="h-8 w-8" onClick={() => moveSection(index, 1)}><ArrowDown className="h-4 w-4" /></IconButton><Button variant="outline" size="sm" onClick={() => setPageSections((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, visible: !item.visible } : item))}>{section.visible ? <EyeOff /> : <Eye />}{section.visible ? "Hide" : "Show"}</Button><ConfirmDeleteDialog itemType="Page Section" name={section.name} onConfirm={() => { setPageSections((current) => current.filter((_, itemIndex) => itemIndex !== index)); toast.success("Page section deleted"); }}><Button variant="destructiveSoft" size="sm"><Trash2 />Delete</Button></ConfirmDeleteDialog></div></div>)}</div><div className="mt-4 flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3 sm:flex-row"><Select value={newSection} onValueChange={setNewSection}><SelectTrigger className="sm:flex-1"><SelectValue /></SelectTrigger><SelectContent>{["OTHER OFFERS", "SIMILAR STORES", "FAQS", "OUTLETS & LOCATIONS", "STORE HIGHLIGHTS"].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select><Button onClick={() => { if (!pageSections.some((section) => section.name === newSection)) setPageSections((current) => [...current, { name: newSection, visible: true }]); }}><Plus />Add section</Button></div></SectionCard></TabsContent><TabsContent value="banners" className="mt-0"><SectionCard title="Promo Banners" description="Drag banners into priority order or use the position controls."><div className="mb-4 flex justify-end"><Button onClick={() => setBannerModalOpen(true)}><Plus />Add Banner</Button></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{banners.map((banner, index) => <article key={banner.id} draggable onDragStart={() => setDraggedBanner(index)} onDragEnd={() => setDraggedBanner(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedBanner !== null) moveBanner(draggedBanner, index); setDraggedBanner(null); }} className={cn("overflow-hidden rounded-lg border border-border bg-card transition", draggedBanner === index && "opacity-50 ring-2 ring-primary")}><div className="relative flex aspect-[16/7] items-center justify-center bg-muted">{banner.image.startsWith("http") ? <img src={banner.image} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-8 w-8 text-muted-foreground" />}<span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md border border-border bg-card/95 px-2 py-1 text-xs font-bold shadow-sm"><GripVertical className="h-3.5 w-3.5" />Position #{index + 1}</span></div><div className="p-3"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm font-semibold">{banner.title}</p><p className="mt-0.5 text-xs text-muted-foreground">{banner.placement} · {banner.active ? "Active" : "Inactive"}</p></div><span className="inline-flex"><IconButton label={`Edit ${banner.title}`}><Pencil className="h-4 w-4" /></IconButton><ConfirmDeleteDialog itemType="Banner" name={banner.title} onConfirm={() => { setBanners((current) => current.filter((item) => item.id !== banner.id)); toast.success("Banner deleted"); }}><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" aria-label={`Delete ${banner.title}`}><Trash2 className="h-4 w-4" /></Button></ConfirmDeleteDialog></span></div><div className="mt-3 flex items-center gap-1 border-t border-border pt-2"><IconButton label={`Move ${banner.title} left`} className="h-7 w-7" onClick={() => moveBanner(index, index - 1)}><ChevronLeft className="h-4 w-4" /></IconButton><IconButton label={`Move ${banner.title} right`} className="h-7 w-7" onClick={() => moveBanner(index, index + 1)}><ChevronRight className="h-4 w-4" /></IconButton><span className="ml-auto text-[11px] text-muted-foreground">Drag to reposition</span></div></div></article>)}</div></SectionCard><AddBannerModal key={bannerModalOpen ? `open-${banners.length}` : "closed"} open={bannerModalOpen} onOpenChange={setBannerModalOpen} nextPosition={banners.length + 1} onAdd={addBanner} /></TabsContent><TabsContent value="offers" className="mt-0"><SectionCard title="Cashback Offers" description="Active discounts and cashback rules for this merchant."><div className="mb-4 flex justify-end"><Button onClick={onCreateOffer}><Plus />Add Offer</Button></div><OfferTable offers={offers.filter((offer) => offer.merchant === merchant[0])} onEdit={onEditOffer} onDelete={onDeleteOffer} /></SectionCard></TabsContent><TabsContent value="reviews" className="mt-0"><ReviewsPanel reviews={reviews} merchantNames={[merchant[0]]} scopedMerchant={merchant[0]} onApprove={onApproveReview} onReject={onRejectReview} onRevert={onRevertReview} onDelete={onDeleteReview} /></TabsContent></Tabs><div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 shadow-sticky-right backdrop-blur md:left-64"><div className="mx-auto flex max-w-400 justify-end gap-2"><Button variant="destructiveSoft" onClick={onBack}>Cancel</Button><Button onClick={save}>Save Changes</Button></div></div></div>;
}

function Stars({ rating }: { rating: number }) {
  return <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((value) => <Star key={value} className={cn("h-3.5 w-3.5", value <= rating ? "fill-[oklch(0.78_0.15_80)] text-[oklch(0.78_0.15_80)]" : "text-border")} />)}</span>;
}

function ReviewPhoto({ src, user }: { src: string; user: string }) {
  return <Dialog><DialogTrigger asChild><button type="button" className="h-16 w-16 overflow-hidden rounded-md border border-border bg-muted"><img src={src} alt={`Photo by ${user}`} className="h-full w-full object-cover" /></button></DialogTrigger><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">Photo by {user}</DialogTitle><DialogDescription>Submitted with the review.</DialogDescription></DialogHeader><img src={src} alt={`Photo by ${user}`} className="max-h-[70vh] w-full rounded-md object-contain" /></DialogContent></Dialog>;
}

function RejectReviewDialog({ review, onReject, children }: { review: Review; onReject: (review: Review, reason: string, note: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(rejectionReasons[0] as string);
  const [note, setNote] = useState("");
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild>{children}</DialogTrigger><DialogContent className="max-w-lg bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">Reject review</DialogTitle><DialogDescription>Rejecting keeps the review hidden from {review.merchant}&apos;s Store Detail page. A reason is required.</DialogDescription></DialogHeader><div className="space-y-4"><label className="block space-y-1.5 text-sm font-medium">Rejection reason <span className="text-destructive">*</span><Select value={reason} onValueChange={setReason}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{rejectionReasons.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label><label className="block space-y-1.5 text-sm font-medium">Admin note <span className="font-normal text-muted-foreground">(optional)</span><Textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add internal context for this decision…" /></label></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="destructive" onClick={() => { onReject(review, reason, note); setOpen(false); }}>Reject review</Button></DialogFooter></DialogContent></Dialog>;
}

function ReviewStatusBadge({ review }: { review: Review }) {
  const tone = review.status === "Approved" ? "bg-success-soft text-success" : review.status === "Rejected" ? "bg-destructive-soft text-destructive" : "status-pending";
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", tone)}>{review.status}</span>;
}

function PendingReviewCard({ review, showMerchant, onApprove, onReject }: { review: Review; showMerchant: boolean; onApprove: (review: Review) => void; onReject: (review: Review, reason: string, note: string) => void }) {
  return <article className="flex min-h-88 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
    <div className="flex h-40 items-center justify-center border-b border-border bg-muted/40"><MerchantLogo name={review.merchant} /></div>
    <div className="flex flex-1 flex-col p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-sm font-bold">{review.user}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-primary"><ShieldCheck className="h-3 w-3" />Verified Purchaser</span>
          <span className="text-xs text-muted-foreground">{review.submitted}</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          {showMerchant && <span className="inline-flex items-center gap-1.5 text-sm font-medium"><span className="flex h-5 w-5 items-center justify-center rounded bg-accent text-primary"><Store className="h-3 w-3" /></span>{review.merchant}</span>}
          <Stars rating={review.rating} />
          <span className="font-mono text-xs text-muted-foreground">{review.id}</span>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button size="sm" onClick={() => onApprove(review)}><Check />Approve</Button>
        <RejectReviewDialog review={review} onReject={onReject}><Button size="sm" variant="destructive"><X />Reject</Button></RejectReviewDialog>
      </div>
    </div>
    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>
    {review.photos.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{review.photos.map((photo) => <ReviewPhoto key={photo} src={photo} user={review.user} />)}</div>}
    </div>
  </article>;
}

function ReviewsPanel({ reviews, merchantNames, scopedMerchant, onApprove, onReject, onRevert, onDelete }: { reviews: Review[]; merchantNames: string[]; scopedMerchant?: string; onApprove: (review: Review) => void; onReject: (review: Review, reason: string, note: string) => void; onRevert: (review: Review) => void; onDelete: (review: Review) => void }) {
  const [tab, setTab] = useState("pending");
  const [status, setStatus] = useState("all");
  const [merchantFilter, setMerchantFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("newest");
  const scoped = scopedMerchant ? reviews.filter((review) => review.merchant === scopedMerchant) : reviews;
  const parse = (value: string) => new Date(value.replace(",", "")).getTime();
  const applyFilters = (rows: Review[]) => rows
    .filter((review) => scopedMerchant || merchantFilter === "all" || review.merchant === merchantFilter)
    .filter((review) => !from || parse(review.submitted) >= new Date(from).getTime())
    .filter((review) => !to || parse(review.submitted) <= new Date(to).getTime() + 86_400_000)
    .sort((a, b) => sort === "oldest" ? parse(a.submitted) - parse(b.submitted) : sort === "rating-high" ? b.rating - a.rating : sort === "rating-low" ? a.rating - b.rating : parse(b.submitted) - parse(a.submitted));
  const pending = useMemo(() => applyFilters(scoped.filter((review) => review.status === "Pending")), [scoped, merchantFilter, from, to, sort, scopedMerchant]);
  const reviewed = useMemo(() => applyFilters(scoped.filter((review) => review.status !== "Pending" && (status === "all" || review.status === status))), [scoped, status, merchantFilter, from, to, sort, scopedMerchant]);
  const hasFilters = status !== "all" || merchantFilter !== "all" || from || to || sort !== "newest";
  const resetFilters = () => { setStatus("all"); setMerchantFilter("all"); setFrom(""); setTo(""); setSort("newest"); };
  const [reviewImportOpen, setReviewImportOpen] = useState(false);
  const [layout, setLayout] = useState<LayoutMode>("grid");
  const reviewTable = (rows: Review[], mode: "pending" | "reviewed") => <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-220 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th className="px-4 py-2">Review ID</th><th>Customer</th>{!scopedMerchant && <th>Merchant</th>}<th>Rating</th><th>Comment</th><th>Submitted</th><th>Status</th><th className="pr-4 text-right">Actions</th></tr></thead><tbody>{rows.map((review) => <tr key={review.id} className="border-t border-border align-top hover:bg-muted/50">
    <td className="px-4 py-2 font-mono text-xs">{review.id}</td>
    <td className="font-medium">{review.user}</td>
    {!scopedMerchant && <td>{review.merchant}</td>}
    <td><Stars rating={review.rating} /></td>
    <td className="max-w-80 text-xs text-muted-foreground"><span className="line-clamp-2">{review.comment}</span>{review.status === "Rejected" && review.reason && <span className="mt-1 block text-xs font-semibold text-destructive">Reason: {review.reason}</span>}</td>
    <td className="whitespace-nowrap text-xs text-muted-foreground">{review.submitted}</td>
    <td><ReviewStatusBadge review={review} /></td>
    <td className="pr-3 text-right"><div className="flex justify-end gap-1">{mode === "pending"
      ? <><Button size="sm" className="h-7 px-2.5 text-xs" onClick={() => onApprove(review)}><Check />Approve</Button><RejectReviewDialog review={review} onReject={onReject}><Button size="sm" variant="destructive" className="h-7 px-2.5 text-xs"><X />Reject</Button></RejectReviewDialog></>
      : <><IconButton className="h-7 w-7" label={`Re-evaluate review ${review.id}`} onClick={() => onRevert(review)}><RotateCcw className="h-3.5 w-3.5" /></IconButton><ConfirmDeleteDialog itemType="Review" name={`${review.user} — ${review.merchant}`} onConfirm={() => onDelete(review)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete review ${review.id}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog></>}</div></td>
  </tr>)}</tbody></table></div></div>;
  return <Tabs value={tab} onValueChange={setTab}>
    <TabsList><TabsTrigger value="pending" className={tabTriggerClass}>Pending Review ({pending.length})</TabsTrigger><TabsTrigger value="reviewed" className={tabTriggerClass}>Reviewed ({reviewed.length})</TabsTrigger></TabsList>
    <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
      {tab === "reviewed" && <Select value={status} onValueChange={setStatus}><SelectTrigger className="lg:w-40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select>}
      {!scopedMerchant && <Select value={merchantFilter} onValueChange={setMerchantFilter}><SelectTrigger className="lg:w-52"><SelectValue placeholder="Merchant" /></SelectTrigger><SelectContent><SelectItem value="all">All merchants</SelectItem>{merchantNames.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select>}
      <Input type="date" className="lg:w-40" value={from} onChange={(event) => setFrom(event.target.value)} aria-label="Submitted from" />
      <Input type="date" className="lg:w-40" value={to} onChange={(event) => setTo(event.target.value)} aria-label="Submitted to" />
      <Select value={sort} onValueChange={setSort}><SelectTrigger className="lg:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest submitted</SelectItem><SelectItem value="oldest">Oldest submitted</SelectItem><SelectItem value="rating-high">Rating: High to Low</SelectItem><SelectItem value="rating-low">Rating: Low to High</SelectItem></SelectContent></Select>
      {hasFilters && <Button variant="ghost" onClick={resetFilters}>Reset</Button>}
      <LayoutToggle value={layout} onChange={setLayout} />
      {tab === "pending" && <Button variant="outline" size="sm" className="shrink-0" onClick={() => setReviewImportOpen(true)}><UploadCloud className="mr-1 h-3.5 w-3.5" />Import</Button>}
      <Button variant="outline" size="sm" className="shrink-0" onClick={() => downloadCsv(tab === "pending" ? pending : reviewed, `offerpe-reviews-${tab}.csv`)}><Download className="mr-1 h-3.5 w-3.5" />Export CSV</Button>
    </div>
    <ImportModal open={reviewImportOpen} onOpenChange={setReviewImportOpen} />
    <TabsContent value="pending" className="mt-4">
      {pending.length === 0 ? <p className="text-sm text-muted-foreground">No reviews waiting for review.</p>
        : layout === "list" ? reviewTable(pending, "pending")
        : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{pending.map((review) => <PendingReviewCard key={review.id} review={review} showMerchant={!scopedMerchant} onApprove={onApprove} onReject={onReject} />)}</div>}
    </TabsContent>
    <TabsContent value="reviewed" className="mt-4">
      {reviewed.length === 0 ? <p className="text-sm text-muted-foreground">Nothing reviewed yet.</p>
        : layout === "list" ? reviewTable(reviewed, "reviewed")
        : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{reviewed.map((review) => <article key={review.id} className="flex min-h-88 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
          <div className="flex h-40 items-center justify-center border-b border-border bg-muted/40"><MerchantLogo name={review.merchant} /></div>
          <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-sm font-bold">{review.user}</span>
                <ReviewStatusBadge review={review} />
                <span className="text-xs text-muted-foreground">{review.submitted}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                {!scopedMerchant && <span className="inline-flex items-center gap-1.5 text-sm font-medium"><span className="flex h-5 w-5 items-center justify-center rounded bg-accent text-primary"><Store className="h-3 w-3" /></span>{review.merchant}</span>}
                <Stars rating={review.rating} />
                <span className="font-mono text-xs text-muted-foreground">{review.id}</span>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button size="sm" variant="outline" onClick={() => onRevert(review)}><RotateCcw />Re-evaluate</Button>
              <ConfirmDeleteDialog itemType="Review" name={`${review.user} — ${review.merchant}`} onConfirm={() => onDelete(review)}><Button size="sm" variant="ghost" className="text-destructive" aria-label={`Delete review ${review.id}`}><Trash2 /></Button></ConfirmDeleteDialog>
            </div>
          </div>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>
          {review.status === "Rejected" && <p className="mt-2 text-xs font-semibold text-destructive">Reason: {review.reason}{review.note && <span className="font-normal text-muted-foreground"> — {review.note}</span>}</p>}
          {review.photos.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{review.photos.map((photo) => <ReviewPhoto key={photo} src={photo} user={review.user} />)}</div>}
          </div>
        </article>)}</div>}
    </TabsContent>
  </Tabs>;
}

function ApplicationDetails({ application }: { application: Application }) {
  return <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Applicant</div><div className="mt-0.5 font-medium">{application.owner}</div><div className="text-muted-foreground">{application.phone}</div><div className="text-muted-foreground">{application.email}</div></div>
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Store address</div><div className="mt-0.5">{application.address}</div><div className="text-muted-foreground">{application.city}</div></div>
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Proposed commission</div><div className="mt-0.5 font-heading text-lg font-bold">{application.commission}</div></div>
    <div className="sm:col-span-2 lg:col-span-3"><div className="text-xs font-semibold uppercase text-muted-foreground">Documentation</div><div className="mt-1 flex flex-wrap gap-2">{application.documents.map((doc) => <span key={doc} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium"><FileText className="h-3 w-3" />{doc}</span>)}</div></div>
  </div>;
}

function RejectApplicationDialog({ application, onReject, children }: { application: Application; onReject: (application: Application, reason: string, note: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(onboardingRejectionReasons[0] as string);
  const [note, setNote] = useState("");
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild>{children}</DialogTrigger><DialogContent className="max-w-lg bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">Reject application</DialogTitle><DialogDescription>{application.store} will not be onboarded. A reason from the Onboarding Rejection Reasons list is required.</DialogDescription></DialogHeader><div className="space-y-4"><label className="block space-y-1.5 text-sm font-medium">Rejection reason <span className="text-destructive">*</span><Select value={reason} onValueChange={setReason}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{onboardingRejectionReasons.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label><label className="block space-y-1.5 text-sm font-medium">Admin remarks <span className="font-normal text-muted-foreground">(optional)</span><Textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add internal context for this decision…" /></label></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="destructive" onClick={() => { onReject(application, reason, note); setOpen(false); }}>Reject application</Button></DialogFooter></DialogContent></Dialog>;
}

function ApplicationHeadline({ application }: { application: Application }) {
  return <div className="flex flex-wrap items-center gap-2">
    <span className="font-heading text-base font-bold">{application.store}</span>
    <span className="inline-flex rounded-full bg-info-soft px-2 py-0.5 text-xs font-semibold text-info">OFFLINE</span>
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium"><Tag className="h-3 w-3" />{application.category}</span>
    <span className="font-mono text-xs text-muted-foreground">{application.id}</span>
    <span className="text-xs text-muted-foreground">Submitted {application.submitted}</span>
  </div>;
}

function OnboardingQueue({ applications, onApprove, onReject, onRevert, onDelete }: { applications: Application[]; onApprove: (application: Application) => void; onReject: (application: Application, reason: string, note: string) => void; onRevert: (application: Application) => void; onDelete: (application: Application) => void }) {
  const [tab, setTab] = useState("pending");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("newest");
  const categories = Array.from(new Set(applications.map((application) => application.category)));
  const parse = (value: string) => new Date(value.replace(",", "")).getTime();
  const applyFilters = (rows: Application[]) => rows
    .filter((application) => !query || `${application.store} ${application.owner} ${application.id} ${application.city}`.toLowerCase().includes(query.toLowerCase()))
    .filter((application) => category === "all" || application.category === category)
    .filter((application) => !from || parse(application.submitted) >= new Date(from).getTime())
    .filter((application) => !to || parse(application.submitted) <= new Date(to).getTime() + 86_400_000)
    .sort((a, b) => sort === "oldest" ? parse(a.submitted) - parse(b.submitted) : sort === "store" ? a.store.localeCompare(b.store) : parse(b.submitted) - parse(a.submitted));
  const pending = useMemo(() => applyFilters(applications.filter((application) => application.status === "Pending")), [applications, query, category, from, to, sort]);
  const reviewed = useMemo(() => applyFilters(applications.filter((application) => application.status !== "Pending" && (status === "all" || application.status === status))), [applications, status, query, category, from, to, sort]);
  const hasFilters = Boolean(query) || status !== "all" || category !== "all" || from || to || sort !== "newest";
  const resetFilters = () => { setQuery(""); setStatus("all"); setCategory("all"); setFrom(""); setTo(""); setSort("newest"); };
  const exportRows = (rows: Application[]) => {
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const header = ["Application ID", "Store", "Category", "Applicant", "Phone", "Email", "City", "Proposed Commission", "Submitted", "Status", "Rejection Reason"];
    const lines = rows.map((application) => [application.id, application.store, application.category, application.owner, application.phone, application.email, application.city, application.commission, application.submitted, application.status, application.reason].map(escape).join(","));
    const url = URL.createObjectURL(new Blob([[header.map(escape).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `offerpe-merchant-onboarding-${tab}.csv`; anchor.click(); URL.revokeObjectURL(url);
    toast.success(`${rows.length} application${rows.length === 1 ? "" : "s"} exported`);
  };
  const activeRows = tab === "pending" ? pending : reviewed;
  const [layout, setLayout] = useState<LayoutMode>("grid");
  const queueTable = (rows: Application[], mode: "pending" | "reviewed") => <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-240 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th className="px-4 py-2">Application ID</th><th>Store</th><th>Category</th><th>Applicant</th><th>City</th><th>Commission</th><th>Submitted</th>{mode === "reviewed" && <th>Status</th>}<th className="pr-4 text-right">Actions</th></tr></thead><tbody>{rows.map((application) => <tr key={application.id} className="border-t border-border hover:bg-muted/50">
    <td className="px-4 py-2 font-mono text-xs">{application.id}</td>
    <td className="font-semibold">{application.store}</td>
    <td className="text-xs text-muted-foreground">{application.category}</td>
    <td>{application.owner}<div className="text-xs text-muted-foreground">{application.phone}</div></td>
    <td className="text-xs text-muted-foreground">{application.city}</td>
    <td className="whitespace-nowrap font-semibold">{application.commission}</td>
    <td className="whitespace-nowrap text-xs text-muted-foreground">{application.submitted}</td>
    {mode === "reviewed" && <td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", application.status === "Approved" ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive")}>{application.status}</span>{application.status === "Rejected" && application.reason && <div className="mt-1 text-xs text-muted-foreground">{application.reason}</div>}</td>}
    <td className="pr-3 text-right"><div className="flex justify-end gap-1">
      <Dialog><DialogTrigger asChild><IconButton className="h-7 w-7" label={`View application ${application.id}`}><ExternalLink className="h-3.5 w-3.5" /></IconButton></DialogTrigger><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">{application.store}</DialogTitle><DialogDescription>Application {application.id} · submitted {application.submitted}</DialogDescription></DialogHeader><ApplicationDetails application={application} /></DialogContent></Dialog>
      {mode === "pending"
        ? <><Button size="sm" className="h-7 px-2.5 text-xs" onClick={() => onApprove(application)}><Check />Approve</Button><RejectApplicationDialog application={application} onReject={onReject}><Button size="sm" variant="destructive" className="h-7 px-2.5 text-xs"><X />Reject</Button></RejectApplicationDialog></>
        : <><IconButton className="h-7 w-7" label={`Re-evaluate application ${application.id}`} onClick={() => onRevert(application)}><RotateCcw className="h-3.5 w-3.5" /></IconButton><ConfirmDeleteDialog itemType="Application" name={application.store} onConfirm={() => onDelete(application)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete application ${application.id}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog></>}
    </div></td>
  </tr>)}</tbody></table></div></div>;
  return <><PageHeader title="Merchant Onboarding Queue" description={'Applications submitted via the web form or the merchant app\'s "Register your store" path. Approving creates a live OFFLINE merchant and grants the applicant immediate merchant-app login — no separate invite step. Rejecting requires a reason from the Onboarding Rejection Reasons list.'} />
    <Tabs value={tab} onValueChange={setTab}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList><TabsTrigger value="pending" className={tabTriggerClass}>Pending Review ({pending.length})</TabsTrigger><TabsTrigger value="reviewed" className={tabTriggerClass}>Reviewed ({reviewed.length})</TabsTrigger></TabsList>
        <div className="flex items-center gap-2"><LayoutToggle value={layout} onChange={setLayout} /><Button variant="outline" className="shrink-0" onClick={() => exportRows(activeRows)}><Download />Export CSV</Button></div>
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative min-w-64 flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search store, applicant, or application ID…" /></div>
        {tab === "reviewed" && <Select value={status} onValueChange={setStatus}><SelectTrigger className="lg:w-40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select>}
        <Select value={category} onValueChange={setCategory}><SelectTrigger className="lg:w-44"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
        <Input type="date" className="lg:w-40" value={from} onChange={(event) => setFrom(event.target.value)} aria-label="Submitted from" />
        <Input type="date" className="lg:w-40" value={to} onChange={(event) => setTo(event.target.value)} aria-label="Submitted to" />
        <Select value={sort} onValueChange={setSort}><SelectTrigger className="lg:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest submitted</SelectItem><SelectItem value="oldest">Oldest submitted</SelectItem><SelectItem value="store">Store name: A to Z</SelectItem></SelectContent></Select>
        {hasFilters && <Button variant="ghost" onClick={resetFilters}>Reset</Button>}
      </div>
      <TabsContent value="pending" className="mt-4">
        {pending.length === 0 ? <p className="text-sm text-muted-foreground">No submissions waiting for review.</p>
          : layout === "list" ? queueTable(pending, "pending")
          : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{pending.map((application) => <article key={application.id} className="flex min-h-88 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
            <div className="flex h-40 items-center justify-center border-b border-border bg-muted/40"><MerchantLogo name={application.store} /></div>
            <div className="flex flex-1 flex-col p-4"><div className="flex flex-col gap-3">
              <ApplicationHeadline application={application} />
              <div className="mt-auto flex shrink-0 gap-2 pt-3">
                <Button size="sm" onClick={() => onApprove(application)}><Check />Approve</Button>
                <RejectApplicationDialog application={application} onReject={onReject}><Button size="sm" variant="destructive"><X />Reject</Button></RejectApplicationDialog>
              </div>
            </div>
            <div className="mt-4 grid gap-3 border-t border-border pt-3 text-xs sm:grid-cols-2">
              <div><div className="font-semibold uppercase text-muted-foreground">Applicant</div><div className="mt-1 font-medium text-foreground">{application.owner}</div><div className="text-muted-foreground">{application.phone}</div></div>
              <div><div className="font-semibold uppercase text-muted-foreground">Location</div><div className="mt-1 font-medium text-foreground">{application.city}</div><div className="line-clamp-2 text-muted-foreground">{application.address}</div></div>
              <div><div className="font-semibold uppercase text-muted-foreground">Commission</div><div className="mt-1 font-heading text-base font-bold text-foreground">{application.commission}</div></div>
              <div><div className="font-semibold uppercase text-muted-foreground">Documents</div><div className="mt-1 font-medium text-foreground">{application.documents.length} attached</div></div>
            </div>
            </div>
          </article>)}</div>}
      </TabsContent>
      <TabsContent value="reviewed" className="mt-4">
        {reviewed.length === 0 ? <p className="text-sm text-muted-foreground">Nothing reviewed yet.</p>
          : layout === "list" ? queueTable(reviewed, "reviewed")
          : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{reviewed.map((application) => <article key={application.id} className="flex min-h-88 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
            <div className="flex h-40 items-center justify-center border-b border-border bg-muted/40"><MerchantLogo name={application.store} /></div>
            <div className="flex flex-1 flex-col p-4"><div className="flex flex-col gap-3">
              <div className="min-w-0">
                <ApplicationHeadline application={application} />
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                  <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", application.status === "Approved" ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive")}>{application.status}</span>
                  <span className="text-muted-foreground">{application.owner} · {application.city}</span>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Dialog><DialogTrigger asChild><Button size="sm" variant="outline"><ExternalLink />View details</Button></DialogTrigger><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">{application.store}</DialogTitle><DialogDescription>Application {application.id} · submitted {application.submitted}</DialogDescription></DialogHeader><ApplicationDetails application={application} />{application.status === "Rejected" && <p className="mt-3 text-sm font-semibold text-destructive">Reason: {application.reason}{application.note && <span className="font-normal text-muted-foreground"> — {application.note}</span>}</p>}</DialogContent></Dialog>
                <Button size="sm" variant="outline" onClick={() => onRevert(application)}><RotateCcw />Re-evaluate</Button>
                <ConfirmDeleteDialog itemType="Application" name={application.store} onConfirm={() => onDelete(application)}><Button size="sm" variant="ghost" className="text-destructive" aria-label={`Delete application ${application.id}`}><Trash2 /></Button></ConfirmDeleteDialog>
              </div>
            </div>
            {application.status === "Rejected" && <p className="mt-2 text-xs font-semibold text-destructive">Reason: {application.reason}{application.note && <span className="font-normal text-muted-foreground"> — {application.note}</span>}</p>}
            </div>
          </article>)}</div>}
      </TabsContent>
    </Tabs>
  </>;
}

const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function ClaimDetails({ claim }: { claim: Claim }) {
  return <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Customer</div><div className="mt-0.5 font-medium">{claim.user}</div><div className="font-mono text-xs text-muted-foreground">{claim.userId}</div></div>
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Order</div><div className="mt-0.5 font-mono text-xs">{claim.orderId}</div><div className="text-muted-foreground">Ordered {claim.orderDate}</div></div>
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Claim date</div><div className="mt-0.5">{claim.claimDate}</div><div className="text-muted-foreground">{claim.claimTime}</div></div>
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Click ID</div><div className="mt-0.5 font-mono text-xs">{claim.clickId || "—"}</div><div className="text-muted-foreground">{claim.clickId ? "Matched in click log" : "No click matched"}</div></div>
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Order value / expected cashback</div><div className="mt-0.5 font-heading text-lg font-bold">{inr(claim.orderValue)}</div><div className="font-semibold text-primary">{inr(claim.expectedCashback)} expected</div></div>
    <div className="sm:col-span-2 lg:col-span-4"><div className="text-xs font-semibold uppercase text-muted-foreground">Customer comment</div><p className="mt-0.5 leading-6">{claim.comment}</p><span className="mt-2 inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium"><ImageIcon className="h-3 w-3" />{claim.proof}</span></div>
  </div>;
}


function RejectClaimDialog({ claim, onReject, children }: { claim: Claim; onReject: (claim: Claim, reason: string, note: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(claimRejectionReasons[0] as string);
  const [note, setNote] = useState("");
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild>{children}</DialogTrigger><DialogContent className="max-w-lg bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">Reject claim</DialogTitle><DialogDescription>{claim.user}&apos;s claim on order {claim.orderId} will be declined. A reason from the Rejection Reasons list is required and is shown to the customer.</DialogDescription></DialogHeader><div className="space-y-4"><label className="block space-y-1.5 text-sm font-medium">Rejection reason <span className="text-destructive">*</span><Select value={reason} onValueChange={setReason}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{claimRejectionReasons.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label><label className="block space-y-1.5 text-sm font-medium">Admin remarks <span className="font-normal text-muted-foreground">(optional)</span><Textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add internal context for this decision…" /></label></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="destructive" onClick={() => { onReject(claim, reason, note); setOpen(false); }}>Reject claim</Button></DialogFooter></DialogContent></Dialog>;
}

function CashbackClaims({ claims, onApprove, onReject, onRevert, onDelete }: { claims: Claim[]; onApprove: (claim: Claim) => void; onReject: (claim: Claim, reason: string, note: string) => void; onRevert: (claim: Claim) => void; onDelete: (claim: Claim) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [merchant, setMerchant] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("newest");
  const [tab, setTab] = useState<"pending" | "reviewed">("pending");
  const [claimImportOpen, setClaimImportOpen] = useState(false);
  const merchantNames = Array.from(new Set(claims.map((claim) => claim.merchant)));
  const pending = claims.filter((claim) => claim.status === "Pending");
  const reviewed = useMemo(() => {
    const parse = (value: string) => new Date(value.replace(",", "")).getTime();
    return claims.filter((claim) => claim.status !== "Pending")
      .filter((claim) => !query || `${claim.orderId} ${claim.id} ${claim.user} ${claim.userId}`.toLowerCase().includes(query.toLowerCase()))
      .filter((claim) => status === "all" || claim.status === status)
      .filter((claim) => merchant === "all" || claim.merchant === merchant)
      .filter((claim) => !from || parse(claim.claimDate) >= new Date(from).getTime())
      .filter((claim) => !to || parse(claim.claimDate) <= new Date(to).getTime() + 86_400_000)
      .sort((a, b) => sort === "oldest" ? parse(a.claimDate) - parse(b.claimDate) : sort === "value-high" ? b.orderValue - a.orderValue : sort === "value-low" ? a.orderValue - b.orderValue : parse(b.claimDate) - parse(a.claimDate));
  }, [claims, query, status, merchant, from, to, sort]);
  const pendingValue = pending.reduce((total, claim) => total + claim.expectedCashback, 0);
  return <><PageHeader title="Cashback Claims" description="Online missing-cashback claims raised by customers. Approving accepts a claim into the same online-conversion pipeline a real network webhook uses (source = CLAIM) — it does not itself credit the wallet. Resolve the resulting conversion from Online Conversions to actually credit it." />
    <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-semibold shadow-card"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{pending.length} pending review</span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-semibold shadow-card">Cashback at stake <span className="text-primary">{inr(pendingValue)}</span></span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-semibold shadow-card">{claims.length - pending.length} reviewed</span>
    </div>
    <Tabs value={tab} onValueChange={(value) => setTab(value as "pending" | "reviewed")}>
      <TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
        <TabsTrigger value="pending" className={tabTriggerClass}>Pending Review ({pending.length})</TabsTrigger>
        <TabsTrigger value="reviewed" className={tabTriggerClass}>Reviewed ({reviewed.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="pending" className="mt-0">
        <section>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setClaimImportOpen(true)}><UploadCloud className="mr-1 h-3.5 w-3.5" />Import</Button>
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => downloadCsv(pending, "offerpe-claims-pending.csv")}><Download className="mr-1 h-3.5 w-3.5" />Export CSV</Button>
        </div>
        {pending.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No claims waiting for review.</p>
          : <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-330 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th>Claim ID</th><th>Claim Date</th><th>User ID</th><th>Customer</th><th>Merchant</th><th>Order ID</th><th>Order Date</th><th>Click match</th><th>Order value</th><th>Cashback</th><th>Proof</th><th className="pr-4 text-right">Actions</th></tr></thead><tbody>{pending.map((claim) => <tr key={claim.id} className="border-t border-border hover:bg-muted/50">
            <td className="px-4 py-2 font-mono text-xs">{claim.id}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{claim.claimDate}<div>{claim.claimTime}</div></td>
            <td className="font-mono text-xs">{claim.userId}</td>
            <td className="font-medium">{claim.user}</td>
            <td className="font-medium">{claim.merchant}</td>
            <td className="font-mono text-xs">{claim.orderId}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{claim.orderDate}</td>
            <td>{claim.clickId ? <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success"><Check className="h-3 w-3" />Matched</span> : <span className="inline-flex items-center gap-1 rounded-full status-pending px-2 py-0.5 text-xs font-semibold"><X className="h-3 w-3" />No match</span>}</td>
            <td className="whitespace-nowrap font-semibold">{inr(claim.orderValue)}</td>
            <td className="whitespace-nowrap font-semibold text-primary">{inr(claim.expectedCashback)}</td>
            <td><span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium"><ImageIcon className="h-3 w-3" />{claim.proof}</span></td>
            <td className="pr-3 text-right"><div className="flex justify-end gap-1">
              <Dialog><DialogTrigger asChild><IconButton className="h-7 w-7" label={`View claim ${claim.id}`}><ExternalLink className="h-3.5 w-3.5" /></IconButton></DialogTrigger><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">{claim.merchant} · {claim.orderId}</DialogTitle><DialogDescription>Claim {claim.id} · {claim.claimDate}, {claim.claimTime}</DialogDescription></DialogHeader><ClaimDetails claim={claim} /></DialogContent></Dialog>
              <Button size="sm" className="h-7 px-2.5 text-xs" onClick={() => onApprove(claim)}><Check />Approve</Button>
              <RejectClaimDialog claim={claim} onReject={onReject}><Button size="sm" variant="destructive" className="h-7 px-2.5 text-xs"><X />Reject</Button></RejectClaimDialog>
            </div></td>
          </tr>)}</tbody></table></div></div>}
        </section>
      </TabsContent>
      <TabsContent value="reviewed" className="mt-0">
        <section>
        <div className="flex flex-wrap items-center justify-end gap-2"><Button variant="outline" size="sm" className="shrink-0" onClick={() => downloadCsv(reviewed, "offerpe-claims-reviewed.csv")}><Download className="mr-1 h-3.5 w-3.5" />Export CSV</Button></div>
        <div className="mt-3 grid gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:grid-cols-2 xl:grid-cols-6">
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground xl:col-span-2">Order ID<div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order ID, claim ID, or customer…" /></div></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">Status<Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">Merchant<Select value={merchant} onValueChange={setMerchant}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{merchantNames.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">From<Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">To<Input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground xl:col-span-2">Sort by<Select value={sort} onValueChange={setSort}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest submitted</SelectItem><SelectItem value="oldest">Oldest submitted</SelectItem><SelectItem value="value-high">Order value: High to Low</SelectItem><SelectItem value="value-low">Order value: Low to High</SelectItem></SelectContent></Select></label>
        </div>
        {reviewed.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">Nothing reviewed yet.</p>
          : <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-330 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th>Claim ID</th><th>Claim Date</th><th>User ID</th><th>Customer</th><th>Merchant</th><th>Order ID</th><th>Order Date</th><th>Order value</th><th>Cashback</th><th>Status</th><th>Comment</th><th className="pr-4 text-right">Actions</th></tr></thead><tbody>{reviewed.map((claim) => <tr key={claim.id} className="border-t border-border align-top hover:bg-muted/50">
            <td className="px-4 py-2 font-mono text-xs">{claim.id}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{claim.claimDate}<div>{claim.claimTime}</div></td>
            <td className="font-mono text-xs">{claim.userId}</td>
            <td className="font-medium">{claim.user}</td>
            <td>{claim.merchant}</td>
            <td className="font-mono text-xs">{claim.orderId}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{claim.orderDate}</td>
            <td className="font-semibold">{inr(claim.orderValue)}</td>
            <td className="font-semibold text-primary">{inr(claim.expectedCashback)}</td>
            <td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", claim.status === "Approved" ? "status-approved" : "status-rejected")}>{claim.status}</span></td>
            <td className="max-w-48 text-xs text-muted-foreground">{claim.reason || "—"}</td>
            <td className="pr-3 text-right"><div className="flex justify-end gap-1">
              <Dialog><DialogTrigger asChild><IconButton className="h-7 w-7" label={`View claim ${claim.id}`}><ExternalLink className="h-3.5 w-3.5" /></IconButton></DialogTrigger><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">{claim.merchant} · {claim.orderId}</DialogTitle><DialogDescription>Claim {claim.id} · {claim.claimDate}, {claim.claimTime}</DialogDescription></DialogHeader><ClaimDetails claim={claim} />{claim.status === "Rejected" && <p className="mt-3 text-sm font-semibold text-destructive">Reason: {claim.reason}{claim.note && <span className="font-normal text-muted-foreground"> — {claim.note}</span>}</p>}{claim.status === "Approved" && claim.note && <p className="mt-3 text-sm text-muted-foreground">{claim.note}</p>}</DialogContent></Dialog>
              <IconButton className="h-7 w-7" label={`Re-evaluate claim ${claim.id}`} onClick={() => onRevert(claim)}><RotateCcw className="h-3.5 w-3.5" /></IconButton>
              <ConfirmDeleteDialog itemType="Claim" name={claim.id} onConfirm={() => onDelete(claim)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete claim ${claim.id}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog>
            </div></td>
          </tr>)}</tbody></table></div></div>}
      </section>
      </TabsContent>
    </Tabs>
    <ImportModal open={claimImportOpen} onOpenChange={setClaimImportOpen} />
  </>;
}

function ReviewsPage(props: { reviews: Review[]; merchantNames: string[]; onApprove: (review: Review) => void; onReject: (review: Review, reason: string, note: string) => void; onRevert: (review: Review) => void; onDelete: (review: Review) => void }) {
  return <><PageHeader title="Merchant Reviews" description="Vendor/store reviews submitted by verified purchasers. Approving makes the review (and any photos) publicly visible on the store's Store Detail page; rejecting requires a reason from the Rejection Reasons list." /><ReviewsPanel {...props} /></>;
}

function Merchants({ rows: merchantRows, onEdit }: { rows: readonly (typeof merchants[number])[]; onEdit: (merchant: typeof merchants[number]) => void }) {
  const [query, setQuery] = useState(""); const [statuses, setStatuses] = useState<Status[]>([]); const [sortAsc, setSortAsc] = useState(true); const [layout, setLayout] = useState<LayoutMode>("list");
  const rows = useMemo(() => merchantRows.filter((m) => (!query || `${m[0]} ${m[2]}`.toLowerCase().includes(query.toLowerCase())) && (!statuses.length || statuses.includes(m[4] as Status))).sort((a, b) => sortAsc ? a[0].localeCompare(b[0]) : b[0].localeCompare(a[0])), [query, statuses, sortAsc, merchantRows]);
  return <><PageHeader title="Merchants" description="Manage merchant availability, categorisation, and channel details." actions={<><LayoutToggle value={layout} onChange={setLayout} /><Button variant="outline" onClick={() => downloadCsv(rows.map((m) => ({ Name: m[0], Channel: m[1], Category: m[2], Offers: m[5], Commission: m[6], Cities: (m[7] as readonly string[]).join(" | "), Order: m[3], Status: m[4] })), "offerpe-merchants.csv")}><Download />Export CSV</Button><Button><Plus />Add new</Button></>} /><FilterBar query={query} setQuery={setQuery} statuses={statuses} setStatuses={setStatuses} showChannel />{layout === "grid" ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{rows.map((m) => <article key={m[0]} className="flex min-h-88 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div className="flex h-40 items-center justify-center border-b border-border bg-muted/40"><MerchantLogo name={m[0]} /></div>
      <div className="flex flex-1 flex-col gap-3 p-4"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className="font-heading text-base font-bold">{m[0]}</div><div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><span className={cn("h-2 w-2 rounded-full", m[1] === "Online" ? "bg-success" : "bg-info")} />{m[1]} · {m[2]}</div></div><StatusBadge status={m[4] as Status} /></div>
      <div className="flex flex-wrap items-center gap-2 text-xs"><span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground"><Tag className="h-3 w-3" />{m[5]} active offers</span><span className="rounded-full border border-border bg-muted px-2 py-0.5 font-semibold">{m[6]} commission</span></div>
      <div className="flex flex-wrap gap-1">{(m[7] as readonly string[]).slice(0, 4).map((city) => <span key={city} className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium">{city}</span>)}{m[7].length > 4 && <span className="rounded-full border border-border bg-accent px-2 py-0.5 text-xs font-semibold text-primary">+{m[7].length - 4}</span>}</div>
      <div className="mt-auto flex items-center justify-between pt-1 text-xs text-muted-foreground"><span>Order {m[3]}</span><Button variant="outline" size="sm" className="h-8" onClick={() => onEdit(m)}><Pencil className="h-3.5 w-3.5" />Edit</Button></div>
      </div>
    </article>)}{rows.length === 0 && <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">No merchants match these filters.</div>}</div> : <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-310 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th className="sticky left-0 z-10 bg-muted px-4 py-2 shadow-sticky-left"><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortAsc(!sortAsc)}>Name <ChevronDown className={cn("transition-transform", !sortAsc && "rotate-180")} /></Button></th><th>Channel</th><th>Category</th><th>Offers</th><th>Commission</th><th>Cities</th><th>Order</th><th>Status</th><th className="pr-4 text-right">Actions</th></tr></thead><tbody>{rows.map((m) => <tr key={m[0]} className="group border-t border-border hover:bg-muted/50"><td className="sticky left-0 z-10 bg-card px-4 py-2 font-semibold shadow-sticky-left group-hover:bg-muted">{m[0]}</td><td><span className="inline-flex items-center gap-1.5 font-medium"><span className={cn("h-2 w-2 rounded-full", m[1] === "Online" ? "bg-success" : "bg-info")} />{m[1]}</span></td><td>{m[2]}</td><td><span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground"><Tag className="h-3 w-3" />{m[5]} active</span></td><td className="whitespace-nowrap font-semibold">{m[6]}</td><td><div className="flex min-w-64 items-center gap-1">{m[7].slice(0, 3).map((city) => <span key={city} className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium">{city}</span>)}{m[7].length > 3 && <TooltipProvider><UiTooltip><UiTooltipTrigger asChild><button type="button" className="rounded-full border border-border bg-accent px-2 py-0.5 text-xs font-semibold text-primary">+{m[7].length - 3} more</button></UiTooltipTrigger><UiTooltipContent>{m[7].join(", ")}</UiTooltipContent></UiTooltip></TooltipProvider>}</div></td><td>{m[3]}</td><td><StatusBadge status={m[4] as Status} /></td><td className="pr-3 text-right"><IconButton className="h-7 w-7" label={`Edit ${m[0]}`} onClick={() => onEdit(m)}><Pencil className="h-3.5 w-3.5" /></IconButton><IconButton className="h-7 w-7" label={`Open ${m[0]}`} onClick={() => onEdit(m)}><ExternalLink className="h-3.5 w-3.5" /></IconButton></td></tr>)}</tbody></table></div></div>}<div className="mt-4 flex items-center justify-between text-sm text-muted-foreground"><span>Showing {rows.length} of {merchantRows.length} merchants</span><div className="flex gap-1"><Button variant="outline" size="icon" disabled><ChevronLeft /></Button><Button variant="outline" size="icon"><ChevronRight /></Button></div></div></>;
}

function OffersPage({ offers, onEdit, onCreate, onDelete }: { offers: Offer[]; onEdit: (offer: Offer) => void; onCreate: () => void; onDelete: (offer: Offer) => void }) {
  const [query, setQuery] = useState(""); const [statuses, setStatuses] = useState<Status[]>([]); const [merchantFilter, setMerchantFilter] = useState("all"); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10); const [layout, setLayout] = useState<LayoutMode>("list");
  const filtered = offers.filter((offer) => (!query || `${offer.headline} ${offer.merchant}`.toLowerCase().includes(query.toLowerCase())) && (!statuses.length || statuses.includes(offer.active ? "Active" : "Inactive")) && (merchantFilter === "all" || offer.merchant === merchantFilter));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize)); const currentPage = Math.min(page, pageCount); const start = (currentPage - 1) * pageSize; const rows = filtered.slice(start, start + pageSize);
  return <><PageHeader title="Offers" description="Manage customer cashback, merchant commissions, validity, and visibility." actions={<><LayoutToggle value={layout} onChange={setLayout} /><Button variant="outline" onClick={() => downloadCsv(filtered, "offerpe-offers.csv")}><Download />Export CSV</Button><Button onClick={onCreate}><Plus />Add new offer</Button></>} /><div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search offer headline or merchant…" /></div><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline"><Filter />Status{statuses.length ? ` (${statuses.length})` : ""}<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent>{(["Active", "Inactive"] as Status[]).map((status) => <DropdownMenuCheckboxItem key={status} checked={statuses.includes(status)} onCheckedChange={() => { setStatuses(statuses.includes(status) ? statuses.filter((item) => item !== status) : [...statuses, status]); setPage(1); }}>{status}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu><Select value={merchantFilter} onValueChange={(value) => { setMerchantFilter(value); setPage(1); }}><SelectTrigger className="w-full lg:w-52"><SelectValue placeholder="All merchants" /></SelectTrigger><SelectContent><SelectItem value="all">All merchants</SelectItem>{merchants.map((merchant) => <SelectItem key={merchant[0]} value={merchant[0]}>{merchant[0]}</SelectItem>)}</SelectContent></Select></div>{layout === "grid" ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{rows.map((offer) => <article key={offer.id} className="flex min-h-88 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div className="flex h-40 items-center justify-center border-b border-border bg-muted/40"><MerchantLogo name={offer.merchant} /></div>
      <div className="flex flex-1 flex-col gap-3 p-4"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className="font-heading text-base font-bold">{offer.headline}</div><div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Store className="h-3 w-3" />{offer.merchant}</div></div><StatusBadge status={offer.active ? "Active" : "Inactive"} /></div>
      <p className="line-clamp-2 text-xs text-muted-foreground">{offer.subtext}</p>
      <div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">Cashback {offer.discountType === "Percentage" ? `${offer.discountValue}%` : inr(offer.discountValue)}</span><span className="rounded-full border border-border bg-muted px-2 py-0.5 font-semibold">Commission {offer.commissionType === "Percentage" ? `${offer.commissionValue}%` : inr(offer.commissionValue)}</span>{offer.featured && <span className="rounded-full bg-success-soft px-2 py-0.5 font-semibold text-success">Featured</span>}</div>
      <div className="mt-auto flex items-center justify-between pt-1 text-xs text-muted-foreground"><span>{offer.start} — {offer.end}</span><span className="flex gap-1"><IconButton className="h-7 w-7" label={`Edit ${offer.headline}`} onClick={() => onEdit(offer)}><Pencil className="h-3.5 w-3.5" /></IconButton><ConfirmDeleteDialog itemType="Offer" name={offer.headline} onConfirm={() => onDelete(offer)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete ${offer.headline}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog></span></div>
      </div>
    </article>)}{rows.length === 0 && <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">No offers match these filters.</div>}</div> : <OfferTable offers={rows} onEdit={onEdit} onDelete={onDelete} showMerchant />}<div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap items-center gap-4"><span>Showing <strong className="text-foreground">{filtered.length ? start + 1 : 0}</strong> to <strong className="text-foreground">{Math.min(start + pageSize, filtered.length)}</strong> of <strong className="text-foreground">{filtered.length}</strong> results</span><div className="flex items-center gap-2">Rows per page<Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}><SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger><SelectContent>{[10, 25, 50, 100].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select></div></div><div className="flex gap-1"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft />Previous</Button><Button size="icon" className="h-8 w-8">{currentPage}</Button><Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight /></Button></div></div></>;
}

function OfferEditPage({ offer, origin, onCancel, onSave, onDelete }: { offer: Offer | null; origin: OfferOrigin; onCancel: () => void; onSave: (offer: Offer) => void; onDelete: (offer: Offer) => void }) {
  const isCreate = !offer;
  const fallbackMerchant = origin.type === "merchant" ? origin.merchant[0] : "Theobroma";
  const [form, setForm] = useState<Offer>(() => offer ?? createBlankOffer(fallbackMerchant));
  const set = <K extends keyof Offer>(key: K, value: Offer[K]) => setForm((current) => ({ ...current, [key]: value }));
  const numberField = (label: string, key: "discountValue" | "commissionValue" | "minBill" | "sortOrder" | "discountCap" | "commissionCap", required = false) => <label className="space-y-1.5 text-sm font-medium">{label} {required && <span className="text-destructive">*</span>}<Input type="number" min="0" value={form[key]} onChange={(event) => set(key, Number(event.target.value))} /></label>;
  const save = () => { if (!form.headline.trim()) { toast.error("Headline is required"); return; } onSave(form); toast.success(isCreate ? "Offer created" : "Offer updated", { description: `${form.headline} was saved successfully.` }); };
  return <div className="pb-20"><nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={onCancel}>Dashboard</Button><ChevronRight className="h-3.5 w-3.5" />{origin.type === "merchant" ? <><span>Merchants</span><ChevronRight className="h-3.5 w-3.5" /><span>{origin.merchant[0]}</span><ChevronRight className="h-3.5 w-3.5" /><span>Offers</span></> : <><span>Catalog</span><ChevronRight className="h-3.5 w-3.5" /><span>Cashback Offers</span></>}<ChevronRight className="h-3.5 w-3.5" /><span className="font-medium text-foreground">{isCreate ? "Create offer" : form.headline}</span></nav><header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="font-heading text-3xl font-bold">{isCreate ? "Create offer" : "Edit offer"}</h1><p className="mt-1 text-sm text-muted-foreground">Configure offer content, value rules, scheduling, and visibility.</p></div><div className="flex gap-2"><Button variant="outline" onClick={onCancel}><ChevronLeft />Back</Button>{!isCreate && <ConfirmDeleteDialog itemType="Offer" name={form.headline} onConfirm={() => onDelete(form)}><Button variant="destructive"><Trash2 />Delete Offer</Button></ConfirmDeleteDialog>}</div></header><div className="grid gap-5 xl:grid-cols-2"><SectionCard title="Merchant & Creative Content"><div className="grid gap-4"><label className="space-y-1.5 text-sm font-medium">Merchant <span className="text-destructive">*</span><Select value={form.merchant} onValueChange={(value) => set("merchant", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{merchants.slice(0, 7).map((merchant) => <SelectItem key={merchant[0]} value={merchant[0]}>{merchant[0]} ({merchant[1].toUpperCase()})</SelectItem>)}</SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">Headline <span className="text-destructive">*</span><Input value={form.headline} onChange={(event) => set("headline", event.target.value)} placeholder="Flat 10% cashback" /></label><label className="space-y-1.5 text-sm font-medium">Subtext<Input value={form.subtext} onChange={(event) => set("subtext", event.target.value)} placeholder="On all bakery items" /></label><label className="space-y-1.5 text-sm font-medium">Offer details<Textarea rows={3} value={form.details} onChange={(event) => set("details", event.target.value)} /></label><label className="space-y-1.5 text-sm font-medium">Terms & conditions<Textarea rows={3} value={form.terms} onChange={(event) => set("terms", event.target.value)} /></label></div></SectionCard><SectionCard title="Discount & Commission Rules"><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Discount type <span className="text-destructive">*</span><Select value={form.discountType} onValueChange={(value) => set("discountType", value as Offer["discountType"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Percentage">Percentage</SelectItem><SelectItem value="Flat amount">Flat amount</SelectItem></SelectContent></Select></label>{numberField("Discount value", "discountValue", true)}<label className="space-y-1.5 text-sm font-medium">Commission type<Select value={form.commissionType} onValueChange={(value) => set("commissionType", value as Offer["commissionType"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Percentage">Percentage</SelectItem><SelectItem value="Flat amount">Flat amount</SelectItem></SelectContent></Select></label>{numberField("Commission value", "commissionValue")}{numberField("Minimum bill amount", "minBill")}{numberField("Discount max cap", "discountCap")}{numberField("Commission max cap", "commissionCap")}</div></SectionCard><SectionCard title="Validity & Scheduling"><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Start <span className="text-destructive">*</span><div className="relative"><Input type="datetime-local" value={form.start} onChange={(event) => set("start", event.target.value)} /><CalendarDays className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" /></div></label><label className="space-y-1.5 text-sm font-medium">End (optional)<div className="relative"><Input type="datetime-local" value={form.end} onChange={(event) => set("end", event.target.value)} /><CalendarDays className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" /></div></label>{numberField("Sort order", "sortOrder", true)}</div></SectionCard><SectionCard title="Tracking & Deep Links"><div className="grid gap-4"><label className="space-y-1.5 text-sm font-medium">Redirect URL (online only)<Input type="url" value={form.redirectUrl} onChange={(event) => set("redirectUrl", event.target.value)} placeholder="https://offerpe.link/r/merchant" /></label><label className="space-y-1.5 text-sm font-medium">Voucher deep link (voucher-slot templates)<Input value={form.voucherLink} onChange={(event) => set("voucherLink", event.target.value)} placeholder="offerpe://voucher/{id}" /></label><label className="space-y-1.5 text-sm font-medium">Product deep link (product-slot templates)<Input value={form.productLink} onChange={(event) => set("productLink", event.target.value)} placeholder="offerpe://product/{slug}" /></label><label className="space-y-1.5 text-sm font-medium">Affiliate network<Select value={form.affiliate} onValueChange={(value) => set("affiliate", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["None", "Trackier", "Impact", "Involve Asia"].map((network) => <SelectItem key={network} value={network}>{network}</SelectItem>)}</SelectContent></Select></label></div></SectionCard><SectionCard title="Visibility & Flags"><div className="grid gap-3 sm:grid-cols-2"><label className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-muted/30 p-3"><Checkbox checked={form.featured} onCheckedChange={(value) => set("featured", value === true)} /><div><div className="text-sm font-semibold">Featured</div><div className="text-xs text-muted-foreground">Prioritise this offer in customer surfaces.</div></div></label><label className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-muted/30 p-3"><Checkbox checked={form.active} onCheckedChange={(value) => set("active", value === true)} /><div><div className="text-sm font-semibold">Active</div><div className="text-xs text-muted-foreground">Make the offer available to customers.</div></div></label></div></SectionCard></div><div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur md:left-64"><div className="mx-auto flex max-w-400 justify-end gap-2"><Button variant="destructiveSoft" onClick={onCancel}>Cancel</Button><Button onClick={save}>{isCreate ? "Create Offer" : "Save Changes"}</Button></div></div></div>;
}

const promoSections: PromoSection[] = ["HERO", "PREMIUM DEALS", "FLASH OFFERS", "NEW ON PLATFORM"];

function PromoBannersPage({ banners, onEdit, onCreate, onDelete }: { banners: PromoBanner[]; onEdit: (banner: PromoBanner) => void; onCreate: () => void; onDelete: (banner: PromoBanner) => void }) {
  const [query, setQuery] = useState(""); const [section, setSection] = useState("all"); const [status, setStatus] = useState("all"); const [ascending, setAscending] = useState(true); const [page, setPage] = useState(1); const pageSize = 6;
  const filtered = banners.filter((banner) => (!query || `${banner.headline} ${banner.tag} ${banner.ctaTarget}`.toLowerCase().includes(query.toLowerCase())) && (section === "all" || banner.section === section) && (status === "all" || (banner.active ? "Active" : "Inactive") === status)).sort((a, b) => ascending ? a.headline.localeCompare(b.headline) : b.headline.localeCompare(a.headline));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize)); const currentPage = Math.min(page, pageCount); const start = (currentPage - 1) * pageSize; const rows = filtered.slice(start, start + pageSize);
  const sectionClass = (value: PromoSection) => value === "HERO" ? "bg-accent text-accent-foreground" : value === "PREMIUM DEALS" ? "bg-info-soft text-info" : value === "FLASH OFFERS" ? "status-pending" : "bg-muted text-muted-foreground";
  return <><PageHeader title="Promo Banners" description="Manage customer-facing promotional banners, placement, scheduling, and visibility." actions={<Button onClick={onCreate}><Plus />Add new</Button>} /><div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search headline, tag, or CTA target…" /></div><Select value={section} onValueChange={(value) => { setSection(value); setPage(1); }}><SelectTrigger className="lg:w-52"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All sections</SelectItem>{promoSections.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select><Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}><SelectTrigger className="lg:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></div><div className="overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-310 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th>Section</th><th><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setAscending(!ascending)}>Headline<ChevronDown className={cn("transition-transform", !ascending && "rotate-180")} /></Button></th><th>Tag / CTA</th><th><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase">Order<ChevronDown /></Button></th><th>Schedule</th><th>Status</th><th className="text-right">Actions</th></tr></thead><tbody>{rows.map((banner) => <tr key={banner.id} className="border-t border-border hover:bg-muted/50"><td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold", sectionClass(banner.section))}>{banner.section}</span></td><td className="font-semibold">{banner.headline}</td><td><div className="flex items-center gap-2"><span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-bold">{banner.tag || "NO TAG"}</span><div className="max-w-48 truncate text-xs text-muted-foreground" title={banner.ctaTarget}>{banner.ctaText || "No CTA"}{banner.ctaTarget ? ` · ${banner.ctaTarget}` : ""}</div></div></td><td className="font-semibold">{banner.order}</td><td className="whitespace-nowrap text-xs text-muted-foreground">{format(new Date(banner.start), "dd MMM yyyy, HH:mm")}<span className="mx-1">–</span>{banner.end ? format(new Date(banner.end), "dd MMM yyyy, HH:mm") : "Open ended"}</td><td><StatusBadge status={banner.active ? "Active" : "Inactive"} /></td><td className="text-right"><span className="inline-flex"><IconButton className="h-7 w-7" label={`Edit ${banner.headline}`} onClick={() => onEdit(banner)}><Pencil className="h-3.5 w-3.5" /></IconButton><ConfirmDeleteDialog itemType="Promo Banner" name={banner.headline} onConfirm={() => onDelete(banner)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete ${banner.headline}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog></span></td></tr>)}</tbody></table></div></div><div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>Showing <strong className="text-foreground">{filtered.length ? start + 1 : 0}</strong> to <strong className="text-foreground">{Math.min(start + pageSize, filtered.length)}</strong> of <strong className="text-foreground">{filtered.length}</strong> results</span><div className="flex gap-1"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft />Previous</Button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <Button key={item} variant={item === currentPage ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setPage(item)}>{item}</Button>)}<Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight /></Button></div></div></>;
}

function PromoBannerFormPage({ banner, onCancel, onSave, onDelete }: { banner: PromoBanner | null; onCancel: () => void; onSave: (banner: PromoBanner) => void; onDelete: (banner: PromoBanner) => void }) {
  const isNew = !banner;
  const [form, setForm] = useState<PromoBanner>(() => banner ?? { id: `PB-${Date.now()}`, section: "HERO", headline: "", image: "", tag: "", ctaText: "", ctaTarget: "", order: 0, start: "2026-09-21T07:51", end: "", active: true });
  const [imageStatus, setImageStatus] = useState(""); const inputRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof PromoBanner>(key: K, value: PromoBanner[K]) => setForm((current) => ({ ...current, [key]: value }));
  const inspectFile = (file?: File) => { if (!file) return; if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { setImageStatus("Use a PNG, JPG, or WebP image."); return; } if (file.size > 2 * 1024 * 1024) { setImageStatus("Image exceeds the 2 MB limit."); return; } const reader = new FileReader(); reader.onload = () => { const result = typeof reader.result === "string" ? reader.result : ""; const image = new Image(); image.onload = () => { const ratio = image.width / image.height; if (image.width < 600) setImageStatus(`Too small (${image.width}×${image.height}); use at least 600px width.`); else if (Math.abs(ratio - 2) > 0.25) setImageStatus(`Check aspect ratio (${image.width}×${image.height}); 2:1 is recommended.`); else setImageStatus(`Valid dimensions (${image.width}×${image.height}) · ${(file.size / 1024).toFixed(0)} KB`); set("image", result); }; image.src = result; }; reader.readAsDataURL(file); };
  const save = () => { if (!form.headline.trim()) { toast.error("Headline is required"); return; } onSave(form); toast.success(isNew ? "Promo banner created" : "Promo banner updated", { description: `${form.headline} was saved successfully.` }); };
  return <div className="pb-20"><nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={onCancel}>Dashboard</Button><ChevronRight className="h-3.5 w-3.5" /><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={onCancel}>Promo Banners</Button><ChevronRight className="h-3.5 w-3.5" /><span className="font-medium text-foreground">{isNew ? "New" : "Edit"}</span></nav><header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="font-heading text-3xl font-bold">{isNew ? "New promo banner" : "Edit promo banner"}</h1><p className="mt-1 text-sm text-muted-foreground">Configure creative content, destination, schedule, and customer visibility.</p></div>{!isNew && <ConfirmDeleteDialog itemType="Promo Banner" name={form.headline} onConfirm={() => onDelete(form)}><Button variant="destructive"><Trash2 />Delete</Button></ConfirmDeleteDialog>}</header><div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]"><SectionCard title="Banner Details" description="Fields marked with an asterisk are required."><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Section <span className="text-destructive">*</span><Select value={form.section} onValueChange={(value) => set("section", value as PromoSection)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{promoSections.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">Display order <span className="text-destructive">*</span><Input type="number" min="0" value={form.order} onChange={(event) => set("order", Number(event.target.value))} /></label><label className="space-y-1.5 text-sm font-medium sm:col-span-2">Headline <span className="text-destructive">*</span><Input value={form.headline} onChange={(event) => set("headline", event.target.value)} placeholder="Flat cashback on your first order" /></label><label className="space-y-1.5 text-sm font-medium sm:col-span-2">Image URL<Input type="url" value={form.image.startsWith("data:") ? "" : form.image} onChange={(event) => { set("image", event.target.value); setImageStatus(event.target.value ? "Previewing image from URL" : ""); }} placeholder="https://…" /></label><div className="sm:col-span-2"><button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); inspectFile(event.dataTransfer.files[0]); }} className="flex min-h-28 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center hover:border-primary hover:bg-accent"><UploadCloud className="mb-2 h-6 w-6 text-primary" /><span className="text-sm font-semibold">Drop an image or choose a file</span><span className="mt-1 text-xs text-muted-foreground">PNG, JPG or WebP · maximum 2 MB</span><input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => inspectFile(event.target.files?.[0])} /></button>{imageStatus && <p className={cn("mt-2 rounded-md border px-3 py-2 text-xs font-medium", imageStatus.startsWith("Valid") || imageStatus.startsWith("Previewing") ? "border-border bg-accent text-accent-foreground" : "border-destructive-border bg-destructive-soft text-destructive")}>{imageStatus}</p>}<div className="mt-2 rounded-md bg-muted px-3 py-2 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Image guidelines:</strong> 1200 × 600 px (2:1) for HERO; 800 × 400 px for deals. Minimum width 600px.</div></div><label className="space-y-1.5 text-sm font-medium">Tag text<Input value={form.tag} onChange={(event) => set("tag", event.target.value)} placeholder="NEW USERS" /></label><label className="space-y-1.5 text-sm font-medium">CTA text<Input value={form.ctaText} onChange={(event) => set("ctaText", event.target.value)} placeholder="Shop Now" /></label><label className="space-y-1.5 text-sm font-medium sm:col-span-2">CTA target<Input value={form.ctaTarget} onChange={(event) => set("ctaTarget", event.target.value)} placeholder="offerpe://merchant/theobroma" /></label><label className="space-y-1.5 text-sm font-medium">Start <span className="text-destructive">*</span><Input type="datetime-local" value={form.start} onChange={(event) => set("start", event.target.value)} /></label><label className="space-y-1.5 text-sm font-medium">End <span className="font-normal text-muted-foreground">(optional)</span><Input type="datetime-local" value={form.end} onChange={(event) => set("end", event.target.value)} /></label><div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2.5 sm:col-span-2"><div><p className="text-sm font-semibold">Active</p><p className="text-xs text-muted-foreground">Publish during the scheduled period.</p></div><Switch checked={form.active} onCheckedChange={(value) => set("active", value)} aria-label="Active promo banner" /></div></div></SectionCard><aside className="xl:sticky xl:top-6"><SectionCard title="Live Banner Preview" description="Customer app preview updates as you edit."><div className="relative aspect-[2/1] overflow-hidden rounded-lg border border-border bg-primary"><div className="absolute inset-0 bg-muted">{form.image && <img src={form.image} alt="Banner preview" className="h-full w-full object-cover" />}</div><div className="absolute inset-0 bg-overlay" /><div className="absolute inset-0 flex flex-col justify-between p-5 text-primary-foreground"><div className="flex items-start justify-between gap-2"><span className="rounded-full bg-card px-2 py-1 text-[10px] font-bold text-foreground">{form.section}</span>{form.tag && <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">{form.tag}</span>}</div><div><h2 className="max-w-sm font-heading text-xl font-bold leading-tight">{form.headline || "Your banner headline"}</h2>{form.ctaText && <Button size="sm" className="mt-3">{form.ctaText}<ChevronRight /></Button>}</div></div></div><div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>{form.section}</span><span>Position #{form.order}</span></div></SectionCard></aside></div><div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur md:left-64"><div className="mx-auto flex max-w-400 justify-end gap-2"><Button variant="destructiveSoft" onClick={onCancel}>Cancel</Button><Button onClick={save}>Save</Button></div></div></div>;
}

function ImportModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [file, setFile] = useState<File | null>(null); const inputRef = useRef<HTMLInputElement>(null);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-xl"><DialogHeader><DialogTitle className="font-heading text-xl">Import Offline Report</DialogTitle><DialogDescription>Upload a CSV to create and resolve offline conversions in one step.</DialogDescription></DialogHeader><div className="rounded-md bg-muted p-3 text-sm leading-6 text-muted-foreground"><span className="mr-2 inline-flex rounded bg-info-soft px-2 py-0.5 text-xs font-semibold text-info">Required columns</span><code>click_token, order_id, order_amount, reported_commission, status</code></div><button type="button" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0] ?? null); }} className="flex min-h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed border-strong bg-muted/40 px-6 text-center hover:border-primary hover:bg-accent"><UploadCloud className="mb-3 h-8 w-8 text-primary" /><span className="font-semibold text-primary">{file ? file.name : "Choose a file"}</span><span className="mt-1 text-sm text-muted-foreground">or drag and drop a CSV here</span><input ref={inputRef} className="hidden" type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></button><DialogFooter><DialogClose asChild><Button variant="destructiveSoft">Cancel</Button></DialogClose><Button disabled={!file} onClick={() => onOpenChange(false)}><UploadCloud />Import report</Button></DialogFooter></DialogContent></Dialog>;
}

function dateFromDisplay(value: string) {
  const match = value.match(/(\d{1,2}) (\w{3}) (\d{4})/);
  if (!match) return undefined;
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(match[2] ?? "");
  return month < 0 ? undefined : new Date(Number(match[3]), month, Number(match[1]));
}

function formatInrInput(value: string) {
  const amount = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(amount) : "₹0.00";
}

function ReadonlyField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <label className="min-w-0 space-y-1.5 text-xs font-semibold text-muted-foreground"><span>{label}</span><div className={cn("truncate rounded-md border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground", mono && "font-mono text-xs")} title={value}>{value}</div></label>;
}

function ConversionModal({ row, mode, onClose, onSave, onDelete }: { row: Conversion | null; mode: "edit" | "delete" | null; onClose: () => void; onSave: (row: Conversion) => void; onDelete: (row: Conversion) => void }) {
  const [status, setStatus] = useState<Status>(row?.status ?? "Pending");
  const [orderValue, setOrderValue] = useState(row?.value.replace(/[^0-9.]/g, "") ?? "");
  const [reported, setReported] = useState(row?.reported.replace(/[^0-9.]/g, "") ?? "");
  const [orderDate, setOrderDate] = useState<Date | undefined>(row ? dateFromDisplay(row.orderDate) : undefined);
  const [rejection, setRejection] = useState(row?.rejection ?? "Not applicable");
  const [notes, setNotes] = useState(row?.notes ?? "");
  const [invoice, setInvoice] = useState(row?.invoice ?? "");
  const invoiceLocked = Boolean(row?.invoice);
  const save = () => {
    if (!row) return;
    onSave({ ...row, status, value: formatInrInput(orderValue), reported: formatInrInput(reported), orderDate: orderDate ? format(orderDate, "dd MMM yyyy") : row.orderDate, rejection: status === "Rejected" && rejection !== "Not applicable" ? rejection : null, notes, invoice: invoice.trim() || null });
    toast.success("Conversion updated", { description: `${row.cashback} was saved successfully.` });
    onClose();
  };
  return <Dialog open={!!row && !!mode} onOpenChange={(v) => !v && onClose()}><DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto bg-card p-0"><DialogHeader className="border-b border-border px-6 py-5"><DialogTitle className="font-heading text-xl">{mode === "delete" ? "Delete Conversion?" : "Edit Conversion"}</DialogTitle><DialogDescription>{mode === "delete" && row ? `Are you sure you want to delete '${row.cashback}'? This action will remove the record from OfferPe.` : "Update the conversion details while preserving its source identifiers."}</DialogDescription></DialogHeader>{mode === "delete" ? null : row && <div className="space-y-5 px-6"><section className="rounded-lg border border-border bg-muted/60 p-4"><h3 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Conversion identifiers</h3><div className="grid gap-3 sm:grid-cols-2"><ReadonlyField label="Cashback ID" value={row.cashback} mono /><ReadonlyField label="Click ID" value={row.click ?? "—"} mono /><ReadonlyField label="Order ID" value={row.order} mono /><ReadonlyField label="Merchant" value={row.merchant} /></div></section><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Order Value<div className="relative"><span className="absolute left-3 top-2 text-sm text-muted-foreground">₹</span><Input aria-label="Order Value" type="number" min="0" step="0.01" className="pl-7" value={orderValue} onChange={(e) => setOrderValue(e.target.value)} /></div></label><label className="space-y-1.5 text-sm font-medium">Status<Select value={status} onValueChange={(value) => setStatus(value as Status)}><SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger><SelectContent>{(["Pending", "Approved", "Rejected", "Requested", "Paid"] as Status[]).map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">Commission Reported<div className="relative"><span className="absolute left-3 top-2 text-sm text-muted-foreground">₹</span><Input aria-label="Commission Reported" type="number" min="0" step="0.01" className="pl-7" value={reported} onChange={(e) => setReported(e.target.value)} /></div></label><label className="space-y-1.5 text-sm font-medium">Order Date<Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start font-normal"><CalendarDays />{orderDate ? format(orderDate, "dd MMM yyyy") : "Choose date"}</Button></PopoverTrigger><PopoverContent className="pointer-events-auto w-auto p-0" align="start"><Calendar mode="single" selected={orderDate} onSelect={setOrderDate} /></PopoverContent></Popover></label></div><label className={cn("block space-y-1.5 rounded-lg border text-sm font-medium transition-colors", status === "Rejected" ? "border-destructive-border bg-destructive-soft p-3" : "border-transparent")}><span>Rejection Reason{status === "Rejected" && <span className="ml-2 text-xs font-normal text-destructive">Required for rejected conversions</span>}</span><Select value={rejection} onValueChange={setRejection}><SelectTrigger aria-label="Rejection Reason" className="bg-card"><SelectValue /></SelectTrigger><SelectContent>{["Cancelled by customer", "Return / Exchange", "Payment failed", "Affiliate terms breached", "Duplicate transaction", "Not applicable"].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></label><label className="block space-y-1.5 text-sm font-medium">Internal Notes<Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Add context for other administrators…" /></label><label className="block space-y-1.5 text-sm font-medium">Invoice Number<div className="relative"><Input value={invoice} onChange={(e) => setInvoice(e.target.value)} readOnly={invoiceLocked} className={cn(invoiceLocked && "bg-muted pr-9 text-muted-foreground")} placeholder="INV-2026/09-XXXX" />{invoiceLocked && <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />}</div>{invoiceLocked && <span className="block text-xs font-normal text-muted-foreground">Invoice numbers are locked after assignment.</span>}</label></div>}<DialogFooter className="border-t border-border px-6 py-4"><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>{mode === "delete" ? <Button variant="destructive" onClick={() => { if (row) onDelete(row); }}><Trash2 />Delete</Button> : <Button onClick={save}>Save changes</Button>}</DialogFooter></DialogContent></Dialog>;
}
function TransactionBadge({ status }: { status: TransactionStatus }) {
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", status === "Approved" ? "status-approved" : status === "Rejected" ? "status-rejected" : "status-pending")}>{status}</span>;
}

function TransactionPagination({ count }: { count: number }) {
  return <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>{count} total</span><div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled><ChevronLeft />Previous</Button><span className="px-2">Page 1 of 1</span><Button variant="outline" size="sm" disabled>Next<ChevronRight /></Button></div></div>;
}

function downloadCsv(rows: readonly object[], name: string) {
  if (rows.length === 0) { toast.error("Nothing to export", { description: "No rows match the current filters." }); return; }
  const headings = Object.keys(rows[0] as Record<string, unknown>);
  const body = rows.map((row) => headings.map((key) => {
    const value = (row as Record<string, unknown>)[key];
    return value && typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
  }));
  const csv = [headings, ...body].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url);
  toast.success("Export ready", { description: `${rows.length} rows downloaded as CSV.` });
}

function Transactions() {
  const [tab, setTab] = useState<"online" | "offline" | "ledger">("online");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const search = query.toLowerCase();
  const online = onlineTransactions.filter((row) => (!search || Object.values(row).join(" ").toLowerCase().includes(search)) && (status === "all" || row.status === status));
  const offline = offlineTransactions.filter((row) => (!search || Object.values(row).join(" ").toLowerCase().includes(search)) && (status === "all" || row.status === status));
  const ledger = ledgerEntries.filter((row) => !search || Object.values(row).join(" ").toLowerCase().includes(search)).sort((a, b) => sortDesc ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));
  const reset = () => { setQuery(""); setStatus("all"); setFrom(""); setTo(""); };
  const filterBar = <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
    <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tab === "ledger" ? "Search type, user ID, merchant, or offer…" : "Search transaction, merchant, user ID, or click…"} /></div>
    {tab !== "ledger" && <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Status: {status === "all" ? "All" : status}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48 border-border bg-card"><DropdownMenuItem onSelect={() => setStatus("all")}>Status: All</DropdownMenuItem>{["Pending", "Pending Bill", "Approved", "Rejected"].map((item) => <DropdownMenuItem key={item} onSelect={() => setStatus(item)}>Status: {item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
    <Input aria-label="From date" title="From date" type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="w-full shrink-0 lg:w-38" />
    <Input aria-label="To date" title="To date" type="date" value={to} onChange={(event) => setTo(event.target.value)} className="w-full shrink-0 lg:w-38" />
    {(query || status !== "all" || from || to) && <Button variant="ghost" size="sm" onClick={reset} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
    <Button variant="outline" size="sm" className="shrink-0" onClick={() => downloadCsv(tab === "online" ? online : tab === "offline" ? offline : ledger, `offerpe-transactions-${tab}.csv`)}><Download className="mr-1 h-3.5 w-3.5" />Export CSV</Button>
  </div>;
  return <><PageHeader title="Transactions" description="Review online conversions, in-store redemptions, and the unified customer transaction ledger." />
    <Tabs value={tab} onValueChange={(value) => { setTab(value as "online" | "offline" | "ledger"); reset(); }}>
      <TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0"><TabsTrigger value="online" className={tabTriggerClass}>Online Conversions</TabsTrigger><TabsTrigger value="offline" className={tabTriggerClass}>Offline Conversions</TabsTrigger><TabsTrigger value="ledger" className={tabTriggerClass}>Ledger</TabsTrigger></TabsList>
      {filterBar}
      <TabsContent value="online" className="mt-0"><div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-280 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>{["Status", "User ID", "Order Value", "Commission (Reported / Calculated)", "Rejection Reason", "Click", "Created", "Updated", "Resolve"].map((label) => <th key={label} className="sticky top-0 border-b border-border bg-muted/90 py-2 backdrop-blur">{label}</th>)}</tr></thead><tbody>{online.map((row) => <tr key={row.id} className="border-t border-border hover:bg-muted/50"><td><TransactionBadge status={row.status} /></td><td className="font-mono text-xs text-muted-foreground">{row.userId}</td><td className="font-semibold">{inr(row.orderValue)}</td><td><span className="font-medium">{inr(row.reported)}</span><span className="mx-1.5 text-muted-foreground">/</span><span className="font-semibold text-primary">{inr(row.calculated)}</span></td><td className="max-w-56 truncate text-muted-foreground" title={row.rejection}>{row.rejection}</td><td className="font-mono text-xs">{row.click}</td><td className="whitespace-nowrap text-xs text-muted-foreground">{row.created}</td><td className="whitespace-nowrap text-xs text-muted-foreground">{row.updated}</td><td><Button size="sm" variant="outline" className="h-7 px-2.5 text-xs">Resolve</Button></td></tr>)}</tbody></table></div></div><TransactionPagination count={online.length} /></TabsContent>
      <TabsContent value="offline" className="mt-0"><div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-300 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>{["Status", "User ID", "Bill Amount", "Discount", "Final Payable", "Commission", "Confirmed By", "Merchant", "Occurred"].map((label) => <th key={label} className="sticky top-0 border-b border-border bg-muted/90 py-2 backdrop-blur">{label}</th>)}</tr></thead><tbody>{offline.map((row) => <tr key={row.id} className="border-t border-border hover:bg-muted/50"><td><TransactionBadge status={row.status} /></td><td className="font-mono text-xs text-muted-foreground">{row.userId}</td><td className="font-semibold">{row.billAmount === null ? "—" : inr(row.billAmount)}</td><td>{row.discount === null ? "—" : inr(row.discount)}</td><td className="font-semibold">{row.payable === null ? "—" : inr(row.payable)}</td><td>{row.commission === null ? "—" : inr(row.commission)}</td><td>{row.confirmedBy}</td><td className="font-semibold">{row.merchant}</td><td className="whitespace-nowrap text-xs">{row.occurred}</td></tr>)}</tbody></table></div></div><TransactionPagination count={offline.length} /></TabsContent>
      <TabsContent value="ledger" className="mt-0"><div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-260 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr><th>Type</th><th><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortDesc(!sortDesc)}>Amount {sortDesc ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}</Button></th><th>User ID</th><th>Merchant</th><th>Offer</th><th>Pending / Resolution Chain</th><th>Occurred</th></tr></thead><tbody>{ledger.map((row) => <tr key={row.id} className={cn("border-t border-border hover:bg-muted/50", row.type === "ONLINE_PENDING" && "bg-accent/40")}><td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", row.type === "ONLINE_PENDING" ? "status-pending" : "bg-info-soft text-info")}>{row.type}</span></td><td className="font-semibold">{inr(row.amount)}</td><td className="font-mono text-xs text-muted-foreground">{row.userId}</td><td className="font-semibold">{row.merchant}</td><td>{row.offer}</td><td className={cn(row.type === "ONLINE_PENDING" && "font-medium text-primary")}>{row.resolution}</td><td className="whitespace-nowrap text-xs font-medium">{row.occurred}</td></tr>)}</tbody></table></div></div><TransactionPagination count={ledger.length} /></TabsContent>
    </Tabs>
  </>;
}

function Clicks() {
  const [userId, setUserId] = useState("");
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const merchantOptions = Array.from(new Set(clickRecords.map((row) => row.merchant))).sort();
  const rows = clickRecords
    .filter((row) => (!userId || row.userId.toLowerCase().includes(userId.toLowerCase())) && (!selectedMerchants.length || selectedMerchants.includes(row.merchant)) && (!from || row.date >= from) && (!to || row.date <= to))
    .sort((a, b) => sortDesc ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  const hasFilters = Boolean(userId || selectedMerchants.length || from || to);
  const reset = () => { setUserId(""); setSelectedMerchants([]); setFrom(""); setTo(""); };
  const toggleMerchant = (merchant: string) => setSelectedMerchants((current) => current.includes(merchant) ? current.filter((item) => item !== merchant) : [...current, merchant]);
  const rate = (type: ClickRecord["discountType"] | ClickRecord["commissionType"], value: number | null) => value === null || !type ? "Not set" : type === "Percentage" ? `${value}%` : inr(value);
  const exportRows = () => {
    const headings = ["Click Token", "Occurred", "User ID", "Merchant", "Offer", "Cashback", "Commission", "Minimum Bill", "Cashback Cap", "Commission Cap"];
    const values = rows.map((row) => [row.token, row.occurred, row.userId, row.merchant, row.offer, rate(row.discountType, row.discountValue), rate(row.commissionType, row.commissionValue), row.minBill === null ? "" : row.minBill, row.discountCap === null ? "" : row.discountCap, row.commissionCap === null ? "" : row.commissionCap]);
    const csv = [headings, ...values].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "offerpe-clicks.csv"; anchor.click(); URL.revokeObjectURL(url);
    toast.success("Clicks exported", { description: `${rows.length} filtered records downloaded as CSV.` });
  };
  return <><PageHeader title="Clicks" description="Track customer click-through activity and the exact offer pricing captured at click time." actions={<Button variant="outline" onClick={exportRows}><Download />Export CSV</Button>} />
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
      <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Filter by User ID" className="w-full pl-9" value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="Filter by User ID…" /></div>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Store className="mr-2 h-4 w-4 text-muted-foreground" />Merchants{selectedMerchants.length ? ` (${selectedMerchants.length})` : ": All"}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-64 border-border bg-card"><DropdownMenuCheckboxItem checked={!selectedMerchants.length} onCheckedChange={() => setSelectedMerchants([])}>All merchants</DropdownMenuCheckboxItem><DropdownMenuSeparator />{merchantOptions.map((merchant) => <DropdownMenuCheckboxItem key={merchant} checked={selectedMerchants.includes(merchant)} onSelect={(event) => event.preventDefault()} onCheckedChange={() => toggleMerchant(merchant)}>{merchant}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu>
      <Input aria-label="From date" title="From date" type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="w-full shrink-0 lg:w-38" />
      <Input aria-label="To date" title="To date" type="date" value={to} onChange={(event) => setTo(event.target.value)} className="w-full shrink-0 lg:w-38" />
      {hasFilters && <Button variant="ghost" size="sm" onClick={reset} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
    </div>
    <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-360 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr><th className="sticky left-0 top-0 z-30 bg-muted/95 shadow-sticky-left">Click Token</th><th className="sticky top-0 bg-muted/95"><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortDesc(!sortDesc)}>Occurred {sortDesc ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}</Button></th><th className="sticky top-0 bg-muted/95">User ID</th><th className="sticky top-0 bg-muted/95">Merchant</th><th className="sticky top-0 bg-muted/95">Offer</th><th className="sticky top-0 bg-muted/95">Pricing Snapshot</th></tr></thead><tbody>{rows.map((row) => <tr key={row.token} className="group border-t border-border hover:bg-muted/50"><td className="sticky left-0 z-20 bg-card font-mono text-xs font-semibold shadow-sticky-left group-hover:bg-muted"><span className="flex items-center gap-1.5">{row.token}<CopyButton value={row.token} /></span></td><td className="whitespace-nowrap text-xs font-medium">{row.occurred}</td><td className="font-mono text-xs text-muted-foreground">{row.userId}</td><td className="font-semibold">{row.merchant}</td><td>{row.offer}</td><td><div className="grid min-w-150 grid-cols-5 gap-2 py-1"><div><span className="block text-[10px] font-semibold uppercase text-muted-foreground">Cashback</span><strong className="text-primary">{rate(row.discountType, row.discountValue)}</strong></div><div><span className="block text-[10px] font-semibold uppercase text-muted-foreground">Commission</span><strong>{rate(row.commissionType, row.commissionValue)}</strong></div><div><span className="block text-[10px] font-semibold uppercase text-muted-foreground">Min. bill</span><strong>{row.minBill === null ? "Not set" : inr(row.minBill)}</strong></div><div><span className="block text-[10px] font-semibold uppercase text-muted-foreground">Cashback cap</span><strong>{row.discountCap === null ? "No cap" : inr(row.discountCap)}</strong></div><div><span className="block text-[10px] font-semibold uppercase text-muted-foreground">Commission cap</span><strong>{row.commissionCap === null ? "No cap" : inr(row.commissionCap)}</strong></div></div></td></tr>)}</tbody></table>{!rows.length && <div className="px-6 py-14 text-center"><MousePointerClick className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">No clicks found</h3><p className="mt-1 text-sm text-muted-foreground">Try changing or resetting the current filters.</p></div>}</div></div>
    <TransactionPagination count={rows.length} />
  </>;
}

function WithdrawalDecisionDialog({ withdrawal, mode, onClose, onSave }: { withdrawal: Withdrawal | null; mode: "paid" | "failed" | null; onClose: () => void; onSave: (withdrawal: Withdrawal, status: WithdrawalStatus, utr: string, notes: string) => void }) {
  const [utr, setUtr] = useState("");
  const [notes, setNotes] = useState("");
  if (!withdrawal || !mode) return null;
  const paid = mode === "paid";
  return <Dialog open onOpenChange={(open) => !open && onClose()}><DialogContent className="max-w-lg bg-card"><DialogHeader><DialogTitle className="font-heading text-xl">{paid ? "Mark withdrawal as paid" : "Mark withdrawal as failed"}</DialogTitle><DialogDescription>{paid ? `Record the payout reference for ${withdrawal.id}.` : `Record why ${withdrawal.id} could not be processed.`}</DialogDescription></DialogHeader><div className="rounded-lg border border-border bg-muted/60 p-3 text-sm"><div className="flex justify-between gap-4"><span className="text-muted-foreground">User ID</span><span className="font-mono font-semibold">{withdrawal.userId}</span></div><div className="mt-2 flex justify-between gap-4"><span className="text-muted-foreground">Amount</span><strong>{inr(withdrawal.amount)}</strong></div></div><div className="space-y-4">{paid && <label className="block space-y-1.5 text-sm font-medium">UTR / reference number <span className="text-destructive">*</span><Input aria-label="UTR / reference number" value={utr} onChange={(event) => setUtr(event.target.value)} placeholder="Enter bank or payment reference" /></label>}<label className="block space-y-1.5 text-sm font-medium">Notes {paid && <span className="font-normal text-muted-foreground">(optional)</span>}<Textarea aria-label="Processing notes" rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={paid ? "Add processing context…" : "Explain why the payout failed…"} /></label></div><DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button variant={paid ? "default" : "destructive"} disabled={paid ? !utr.trim() : !notes.trim()} onClick={() => onSave(withdrawal, paid ? "Paid" : "Failed", utr.trim(), notes.trim())}>{paid ? <Check /> : <X />}{paid ? "Confirm paid" : "Mark failed"}</Button></DialogFooter></DialogContent></Dialog>;
}

function Withdrawals() {
  const [rows, setRows] = useState(initialWithdrawals);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<WithdrawalStatus | "all">("all");
  const [mode, setMode] = useState<Withdrawal["mode"] | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fileName, setFileName] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [selected, setSelected] = useState<Withdrawal | null>(null);
  const [decision, setDecision] = useState<"paid" | "failed" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const filtered = rows.filter((row) => (!query || [row.id, row.userId, row.utr].join(" ").toLowerCase().includes(query.toLowerCase())) && (status === "all" || row.status === status) && (mode === "all" || row.mode === mode) && (!from || row.date >= from) && (!to || row.date <= to)).sort((a, b) => sortDesc ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  const hasFilters = Boolean(query || status !== "all" || mode !== "all" || from || to);
  const reset = () => { setQuery(""); setStatus("all"); setMode("all"); setFrom(""); setTo(""); };
  const exportRows = () => {
    const headings = ["Withdrawal ID", "User ID", "Amount", "Mode", "Payout Details", "Status", "Requested", "Resolved", "UTR", "Notes"];
    const values = filtered.map((row) => [row.id, row.userId, row.amount, row.mode, row.payoutDetails, row.status, row.requested, row.resolved, row.utr, row.notes]);
    const csv = [headings, ...values].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "offerpe-withdrawals.csv"; anchor.click(); URL.revokeObjectURL(url);
    toast.success("Withdrawals exported", { description: `${filtered.length} filtered records downloaded as CSV.` });
  };
  const processCsv = () => { if (!fileName) return; toast.success("CSV processed", { description: `${fileName} was validated and queued. Each row is handled independently.` }); setFileName(""); if (fileRef.current) fileRef.current.value = ""; };
  const saveDecision = (withdrawal: Withdrawal, nextStatus: WithdrawalStatus, utr: string, notes: string) => { setRows((current) => current.map((row) => row.id === withdrawal.id ? { ...row, status: nextStatus, utr: utr || "—", notes: notes || row.notes, resolved: "21 Sep 2026, 6:08 pm" } : row)); toast.success(nextStatus === "Paid" ? "Withdrawal marked paid" : "Withdrawal marked failed", { description: `${withdrawal.id} was updated.` }); setSelected(null); setDecision(null); };
  const statusBadge = (value: WithdrawalStatus) => <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", value === "Paid" ? "status-paid" : value === "Failed" ? "status-rejected" : "status-requested")}>{value}</span>;
  return <><PageHeader title="Withdrawals" description="Review payout requests and securely record transfer outcomes." />
    <section className="mb-5 rounded-lg border border-border bg-card p-4 shadow-card"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div className="min-w-0"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><h2 className="font-heading text-sm font-bold">Bulk process via CSV</h2><span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">Owner only</span></div><p className="mt-1 max-w-4xl text-xs leading-5 text-muted-foreground">Required columns: withdrawal_request_id, status (PAID or FAILED), utr_reference_number for paid requests, and optional notes. Invalid rows do not block valid records.</p></div><div className="flex shrink-0 flex-wrap items-center gap-2"><input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} /><Button variant="outline" onClick={() => fileRef.current?.click()}><FileSpreadsheet />{fileName || "Choose CSV"}</Button><Button disabled={!fileName} onClick={processCsv}><UploadCloud />Upload &amp; process</Button></div></div></section>
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center"><div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search withdrawals" className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search withdrawal ID, User ID, or UTR…" /></div><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter />Status: {status === "all" ? "All" : status}<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end">{(["all", "Requested", "Paid", "Failed"] as const).map((item) => <DropdownMenuItem key={item} onSelect={() => setStatus(item)}>Status: {item === "all" ? "All" : item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><WalletCards />Mode: {mode === "all" ? "All" : mode}<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end">{(["all", "Bank Account", "UPI", "Gift Card"] as const).map((item) => <DropdownMenuItem key={item} onSelect={() => setMode(item)}>Mode: {item === "all" ? "All" : item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu><Input aria-label="From date" type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="w-full shrink-0 lg:w-38" /><Input aria-label="To date" type="date" value={to} onChange={(event) => setTo(event.target.value)} className="w-full shrink-0 lg:w-38" />{hasFilters && <Button variant="ghost" size="sm" onClick={reset}><RotateCcw />Reset</Button>}<Button variant="outline" className="shrink-0" onClick={exportRows}><Download />Export CSV</Button></div>
    <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-390 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr><th className="sticky left-0 top-0 z-30 bg-muted/95 shadow-sticky-left">Withdrawal ID</th><th>User ID</th><th><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortDesc(!sortDesc)}>Amount {sortDesc ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}</Button></th><th>Mode</th><th>Payout Details</th><th>Status</th><th>Requested</th><th>Resolved</th><th>UTR</th><th>Notes</th><th className="sticky right-0 top-0 z-30 bg-muted/95 text-right shadow-sticky-right">Actions</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.id} className="group border-t border-border hover:bg-muted/50"><td className="sticky left-0 z-20 bg-card font-mono text-xs font-semibold shadow-sticky-left group-hover:bg-muted"><span className="flex items-center gap-1">{row.id}<CopyButton value={row.id} /></span></td><td className="font-mono text-xs text-muted-foreground">{row.userId}</td><td className="font-semibold">{inr(row.amount)}</td><td><span className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium">{row.mode}</span></td><td className="max-w-96"><span className="flex items-center gap-1.5 font-mono text-xs">{row.payoutDetails}<CopyButton value={row.payoutDetails} /></span></td><td>{statusBadge(row.status)}</td><td className="whitespace-nowrap text-xs">{row.requested}</td><td className="whitespace-nowrap text-xs text-muted-foreground">{row.resolved}</td><td className="font-mono text-xs">{row.utr}</td><td className="max-w-44 truncate text-muted-foreground" title={row.notes}>{row.notes}</td><td className="sticky right-0 z-20 bg-card text-right shadow-sticky-right group-hover:bg-muted">{row.status === "Requested" ? <span className="inline-flex gap-1"><Button size="sm" className="h-7 px-2.5 text-xs" onClick={() => { setSelected(row); setDecision("paid"); }}><Check />Paid</Button><Button variant="destructive" size="sm" className="h-7 px-2.5 text-xs" onClick={() => { setSelected(row); setDecision("failed"); }}><X />Fail</Button></span> : <span className="text-xs text-muted-foreground">Processed</span>}</td></tr>)}</tbody></table>{!filtered.length && <div className="px-6 py-14 text-center"><BadgeIndianRupee className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">No withdrawal requests found</h3><p className="mt-1 text-sm text-muted-foreground">Try changing or resetting the current filters.</p></div>}</div></div><TransactionPagination count={filtered.length} /><WithdrawalDecisionDialog key={`${selected?.id ?? "none"}-${decision ?? "none"}`} withdrawal={selected} mode={decision} onClose={() => { setSelected(null); setDecision(null); }} onSave={saveDecision} />
  </>;
}

type ResolutionOutcome = "APPROVED" | "REJECTED" | "PENDING";
type ResolutionQueueItem = { id: string; orderId: string; merchant: string; userId: string; reportedStatus: string; mappedOutcome: ResolutionOutcome | null; orderValue: number; reportedCommission: number; received: string; source: string; review: "Pending" | "Approved" | "Rejected"; appliedOutcome: ResolutionOutcome | null; reason: string; notes: string; reviewedOn: string; reviewedBy: string };

const resolutionQueueSeeds: ResolutionQueueItem[] = [
  { id: "RQ-4801", orderId: "OD-99120", merchant: "Croma", userId: "USR-10234", reportedStatus: "approved", mappedOutcome: "APPROVED", orderValue: 24999, reportedCommission: 1250, received: "21 Sep 2026, 4:12 pm", source: "Trackier postback", review: "Pending", appliedOutcome: null, reason: "", notes: "", reviewedOn: "—", reviewedBy: "—" },
  { id: "RQ-4802", orderId: "OD-99135", merchant: "Ajio", userId: "USR-10871", reportedStatus: "cancelled", mappedOutcome: "REJECTED", orderValue: 3199, reportedCommission: 0, received: "21 Sep 2026, 3:48 pm", source: "Trackier postback", review: "Pending", appliedOutcome: null, reason: "", notes: "", reviewedOn: "—", reviewedBy: "—" },
  { id: "RQ-4803", orderId: "OD-99148", merchant: "Myntra", userId: "USR-11002", reportedStatus: "partially_validated", mappedOutcome: null, orderValue: 6499, reportedCommission: 260, received: "21 Sep 2026, 2:05 pm", source: "Trackier postback", review: "Pending", appliedOutcome: null, reason: "", notes: "", reviewedOn: "—", reviewedBy: "—" },
  { id: "RQ-4804", orderId: "OD-99151", merchant: "Croma", userId: "USR-10442", reportedStatus: "pending", mappedOutcome: "PENDING", orderValue: 11499, reportedCommission: 575, received: "21 Sep 2026, 1:22 pm", source: "Trackier postback", review: "Pending", appliedOutcome: null, reason: "", notes: "", reviewedOn: "—", reviewedBy: "—" },
  { id: "RQ-4805", orderId: "OD-99166", merchant: "Hummel", userId: "USR-11190", reportedStatus: "returned", mappedOutcome: "REJECTED", orderValue: 2899, reportedCommission: 0, received: "21 Sep 2026, 11:36 am", source: "CSV bulk", review: "Pending", appliedOutcome: null, reason: "", notes: "", reviewedOn: "—", reviewedBy: "—" },
  { id: "RQ-4791", orderId: "OD-98844", merchant: "Ajio", userId: "USR-10120", reportedStatus: "approved", mappedOutcome: "APPROVED", orderValue: 7899, reportedCommission: 395, received: "20 Sep 2026, 6:10 pm", source: "Trackier postback", review: "Approved", appliedOutcome: "APPROVED", reason: "", notes: "Commission matched the merchant statement.", reviewedOn: "20 Sep 2026, 7:02 pm", reviewedBy: "Qaisar Farooq" },
  { id: "RQ-4792", orderId: "OD-98851", merchant: "Myntra", userId: "USR-10933", reportedStatus: "cancelled", mappedOutcome: "REJECTED", orderValue: 4599, reportedCommission: 0, received: "20 Sep 2026, 5:41 pm", source: "Trackier postback", review: "Approved", appliedOutcome: "REJECTED", reason: "Order cancelled by the customer", notes: "", reviewedOn: "20 Sep 2026, 6:15 pm", reviewedBy: "Qaisar Farooq" },
  { id: "RQ-4793", orderId: "OD-98860", merchant: "Croma", userId: "USR-10777", reportedStatus: "duplicate", mappedOutcome: null, orderValue: 15999, reportedCommission: 800, received: "20 Sep 2026, 4:03 pm", source: "CSV bulk", review: "Rejected", appliedOutcome: null, reason: "Duplicate postback for the same order", notes: "Dismissed without touching the conversion.", reviewedOn: "20 Sep 2026, 4:40 pm", reviewedBy: "Neha Rao" },
];

function ResolutionOutcomeBadge({ outcome }: { outcome: ResolutionOutcome | null }) {
  if (!outcome) return <span className="inline-flex rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">Unmapped</span>;
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", outcome === "APPROVED" ? "status-approved" : outcome === "REJECTED" ? "status-rejected" : "status-pending")}>{outcome}</span>;
}

function ResolveQueueDialog({ item, mode, reasons, onClose, onSave }: { item: ResolutionQueueItem | null; mode: "approve" | "reject" | null; reasons: RejectionReason[]; onClose: () => void; onSave: (item: ResolutionQueueItem, decision: "approve" | "reject", outcome: ResolutionOutcome | null, reason: string, notes: string, override: string) => void }) {
  const [outcome, setOutcome] = useState<ResolutionOutcome>(item?.mappedOutcome && item.mappedOutcome !== "PENDING" ? item.mappedOutcome : "APPROVED");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [override, setOverride] = useState("");
  if (!item || !mode) return null;
  const approving = mode === "approve";
  const needsReason = approving ? outcome === "REJECTED" : true;
  const activeReasons = reasons.filter((entry) => entry.active);
  return <Dialog open onOpenChange={(open) => !open && onClose()}><DialogContent className="max-w-lg bg-card"><DialogHeader><DialogTitle className="font-heading text-xl">{approving ? "Approve resolution report" : "Reject resolution report"}</DialogTitle><DialogDescription>{approving ? `Applies the chosen outcome to conversion ${item.orderId}.` : `Dismisses ${item.id} without touching the underlying conversion.`}</DialogDescription></DialogHeader>
    <div className="rounded-lg border border-border bg-muted/60 p-3 text-sm"><div className="flex justify-between gap-4"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-semibold">{item.orderId}</span></div><div className="mt-2 flex justify-between gap-4"><span className="text-muted-foreground">Reported status</span><span className="font-mono">{item.reportedStatus}</span></div><div className="mt-2 flex justify-between gap-4"><span className="text-muted-foreground">Mapped outcome</span><ResolutionOutcomeBadge outcome={item.mappedOutcome} /></div></div>
    <div className="space-y-4">
      {approving && <label className="block space-y-1.5 text-sm font-medium">Outcome to apply <span className="text-destructive">*</span><Select value={outcome} onValueChange={(value) => setOutcome(value as ResolutionOutcome)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="APPROVED">Approved</SelectItem><SelectItem value="REJECTED">Rejected</SelectItem></SelectContent></Select>{(!item.mappedOutcome || item.mappedOutcome === "PENDING") && <span className="block text-xs text-muted-foreground">This report is unmapped, so an outcome has to be chosen manually.</span>}</label>}
      {approving && outcome === "APPROVED" && <label className="block space-y-1.5 text-sm font-medium">Override commission amount <span className="font-normal text-muted-foreground">(optional)</span><Input inputMode="numeric" value={override} onChange={(event) => setOverride(event.target.value.replace(/[^\d.]/g, ""))} placeholder={String(item.reportedCommission)} /></label>}
      {needsReason && <label className="block space-y-1.5 text-sm font-medium">Rejection reason <span className="text-destructive">*</span><Select value={reason} onValueChange={setReason}><SelectTrigger><SelectValue placeholder="Select an active rejection reason" /></SelectTrigger><SelectContent>{activeReasons.map((entry) => <SelectItem key={entry.id} value={entry.reason}>{entry.reason}</SelectItem>)}</SelectContent></Select></label>}
      <label className="block space-y-1.5 text-sm font-medium">Admin notes <span className="font-normal text-muted-foreground">(optional)</span><Textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Context for the audit trail…" /></label>
    </div>
    <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button variant={approving ? "default" : "destructive"} disabled={needsReason && !reason} onClick={() => onSave(item, mode, approving ? outcome : null, reason, notes.trim(), override.trim())}>{approving ? <Check /> : <X />}{approving ? "Apply outcome" : "Dismiss report"}</Button></DialogFooter>
  </DialogContent></Dialog>;
}

function ConversionResolutions({ reasons }: { reasons: RejectionReason[] }) {
  const [rows, setRows] = useState<ResolutionQueueItem[]>(resolutionQueueSeeds);
  const [tab, setTab] = useState<"pending" | "reviewed">("pending");
  const [query, setQuery] = useState("");
  const [merchant, setMerchant] = useState("all");
  const [mapped, setMapped] = useState("all");
  const [reviewStatus, setReviewStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fileName, setFileName] = useState("");
  const [selected, setSelected] = useState<ResolutionQueueItem | null>(null);
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const merchantOptions = Array.from(new Set(resolutionQueueSeeds.map((row) => row.merchant))).sort();
  const search = query.toLowerCase();
  const matches = (row: ResolutionQueueItem) => (!search || `${row.id} ${row.orderId} ${row.userId} ${row.merchant} ${row.reportedStatus}`.toLowerCase().includes(search))
    && (merchant === "all" || row.merchant === merchant)
    && (mapped === "all" || (mapped === "unmapped" ? !row.mappedOutcome : row.mappedOutcome === mapped))
    && (!from || new Date(row.received.replace(",", "")).getTime() >= new Date(from).getTime())
    && (!to || new Date(row.received.replace(",", "")).getTime() <= new Date(to).getTime() + 86_400_000);
  const pending = rows.filter((row) => row.review === "Pending").filter(matches);
  const reviewed = rows.filter((row) => row.review !== "Pending").filter(matches).filter((row) => reviewStatus === "all" || row.review === reviewStatus);
  const hasFilters = Boolean(query || merchant !== "all" || mapped !== "all" || from || to || (tab === "reviewed" && reviewStatus !== "all"));
  const reset = () => { setQuery(""); setMerchant("all"); setMapped("all"); setReviewStatus("all"); setFrom(""); setTo(""); };
  const exportRows = (list: ResolutionQueueItem[], name: string) => {
    const headings = ["Queue ID", "Order ID", "Merchant", "User ID", "Reported Status", "Mapped Outcome", "Order Value", "Reported Commission", "Received", "Source", "Review", "Applied Outcome", "Reason", "Admin Notes", "Reviewed On", "Reviewed By"];
    const values = list.map((row) => [row.id, row.orderId, row.merchant, row.userId, row.reportedStatus, row.mappedOutcome ?? "Unmapped", row.orderValue, row.reportedCommission, row.received, row.source, row.review, row.appliedOutcome ?? "—", row.reason, row.notes, row.reviewedOn, row.reviewedBy]);
    const csv = [headings, ...values].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url);
    toast.success("Resolutions exported", { description: `${list.length} filtered records downloaded as CSV.` });
  };
  const processCsv = () => { if (!fileName) return; toast.success("CSV processed", { description: `${fileName} was validated and queued. Each row is processed independently — one bad row doesn't block the rest.` }); setFileName(""); if (fileRef.current) fileRef.current.value = ""; };
  const saveDecision = (item: ResolutionQueueItem, mode: "approve" | "reject", outcome: ResolutionOutcome | null, reason: string, notes: string, override: string) => {
    setRows((current) => current.map((row) => row.id === item.id ? { ...row, review: mode === "approve" ? "Approved" : "Rejected", appliedOutcome: outcome, reason, notes: notes || (override ? `Commission overridden to ${inr(Number(override))}.` : ""), reviewedOn: format(new Date(), "dd MMM yyyy, h:mm a"), reviewedBy: "Qaisar Farooq" } : row));
    toast.success(mode === "approve" ? "Resolution applied" : "Report dismissed", { description: mode === "approve" ? `${item.orderId} was resolved as ${outcome}.` : `${item.id} was dismissed without touching the conversion.` });
    setSelected(null); setDecision(null);
  };
  const filterBar = <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
    <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search resolutions" className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search queue ID, order ID, user ID, or merchant…" /></div>
    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Store className="mr-2 h-4 w-4 text-muted-foreground" />Merchant: {merchant === "all" ? "All" : merchant}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56 border-border bg-card"><DropdownMenuItem onSelect={() => setMerchant("all")}>Merchant: All</DropdownMenuItem>{merchantOptions.map((item) => <DropdownMenuItem key={item} onSelect={() => setMerchant(item)}>{item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Mapped: {mapped === "all" ? "All" : mapped === "unmapped" ? "Unmapped" : mapped}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52 border-border bg-card">{[{ value: "all", label: "All" }, { value: "APPROVED", label: "Approved" }, { value: "REJECTED", label: "Rejected" }, { value: "PENDING", label: "Pending" }, { value: "unmapped", label: "Unmapped" }].map((option) => <DropdownMenuItem key={option.value} onSelect={() => setMapped(option.value)}>Mapped: {option.label}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
    {tab === "reviewed" && <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />Review: {reviewStatus === "all" ? "All" : reviewStatus}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48 border-border bg-card">{["all", "Approved", "Rejected"].map((item) => <DropdownMenuItem key={item} onSelect={() => setReviewStatus(item)}>Review: {item === "all" ? "All" : item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
    <Input aria-label="From date" title="From date" type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="w-full shrink-0 lg:w-38" />
    <Input aria-label="To date" title="To date" type="date" value={to} onChange={(event) => setTo(event.target.value)} className="w-full shrink-0 lg:w-38" />
    {hasFilters && <Button variant="ghost" size="sm" onClick={reset} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
    <Button variant="outline" className="shrink-0" onClick={() => exportRows(tab === "pending" ? pending : reviewed, `offerpe-conversion-resolutions-${tab}.csv`)}><Download />Export CSV</Button>
  </div>;
  const emptyState = (label: string) => <div className="rounded-lg border border-border bg-card px-6 py-14 text-center shadow-card"><RotateCcw className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">{label}</h3><p className="mt-1 text-sm text-muted-foreground">Try changing or resetting the current filters.</p></div>;
  return <><PageHeader title="Conversion Resolutions" description="Resolution-type postbacks queued for review. Approving applies the mapped (or manually chosen) outcome to the conversion — the webhook itself never auto-applies anything, regardless of what status the network reports. Rejecting a report dismisses it without touching the underlying conversion." />
    <section className="mb-5 rounded-lg border border-border bg-card p-4 shadow-card"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div className="min-w-0"><div className="flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-primary" /><h2 className="font-heading text-sm font-bold">Bulk process via CSV</h2></div><p className="mt-1 max-w-4xl text-xs leading-5 text-muted-foreground">Columns: <span className="font-mono">queue_id</span>, <span className="font-mono">decision</span> (APPROVE or REJECT), <span className="font-mono">manual_outcome</span> (APPROVED or REJECTED — required when the row is unmapped or mapped to PENDING), <span className="font-mono">override_amount</span> (optional, APPROVE only), <span className="font-mono">rejection_reason_id</span> (must be an active Rejection Reasons row whenever the outcome being applied is REJECTED), <span className="font-mono">admin_notes</span> (optional). Each row is processed independently — one bad row doesn't block the rest.</p></div><div className="flex shrink-0 flex-wrap items-center gap-2"><input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} /><Button variant="outline" onClick={() => fileRef.current?.click()}><FileSpreadsheet />{fileName || "Choose CSV"}</Button><Button disabled={!fileName} onClick={processCsv}><UploadCloud />Upload &amp; process</Button></div></div></section>
    <Tabs value={tab} onValueChange={(value) => setTab(value as "pending" | "reviewed")}>
      <TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0"><TabsTrigger value="pending" className={tabTriggerClass}>Pending Review ({rows.filter((row) => row.review === "Pending").length})</TabsTrigger><TabsTrigger value="reviewed" className={tabTriggerClass}>Reviewed ({rows.filter((row) => row.review !== "Pending").length})</TabsTrigger></TabsList>
      {filterBar}
      <TabsContent value="pending" className="mt-0">
        {!pending.length ? emptyState("Nothing waiting for review")
          : <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-330 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr><th className="sticky left-0 top-0 z-30 bg-muted/95 shadow-sticky-left">Queue ID</th><th>Order ID</th><th>Merchant</th><th>User ID</th><th>Reported Status</th><th>Mapped Outcome</th><th>Order Value</th><th>Reported Commission</th><th>Source</th><th>Received</th><th className="sticky right-0 top-0 z-30 bg-muted/95 text-right shadow-sticky-right">Actions</th></tr></thead><tbody>{pending.map((row) => <tr key={row.id} className="group border-t border-border hover:bg-muted/50">
            <td className="sticky left-0 z-20 bg-card font-mono text-xs font-semibold shadow-sticky-left group-hover:bg-muted"><span className="flex items-center gap-1">{row.id}<CopyButton value={row.id} /></span></td>
            <td className="font-mono text-xs"><span className="flex items-center gap-1">{row.orderId}<CopyButton value={row.orderId} /></span></td>
            <td className="font-semibold">{row.merchant}</td>
            <td className="font-mono text-xs text-muted-foreground">{row.userId}</td>
            <td className="font-mono text-xs">{row.reportedStatus}</td>
            <td><ResolutionOutcomeBadge outcome={row.mappedOutcome} /></td>
            <td className="whitespace-nowrap font-semibold">{inr(row.orderValue)}</td>
            <td className="whitespace-nowrap font-semibold text-primary">{inr(row.reportedCommission)}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{row.source}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{row.received}</td>
            <td className="sticky right-0 z-20 bg-card text-right shadow-sticky-right group-hover:bg-muted"><span className="inline-flex gap-1"><Button size="sm" className="h-7 px-2.5 text-xs" onClick={() => { setSelected(row); setDecision("approve"); }}><Check />Approve</Button><Button size="sm" variant="destructive" className="h-7 px-2.5 text-xs" onClick={() => { setSelected(row); setDecision("reject"); }}><X />Reject</Button></span></td>
          </tr>)}</tbody></table></div></div>}
        <TransactionPagination count={pending.length} />
      </TabsContent>
      <TabsContent value="reviewed" className="mt-0">
        {!reviewed.length ? emptyState("Nothing reviewed yet")
          : <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-330 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr><th className="sticky left-0 top-0 z-30 bg-muted/95 shadow-sticky-left">Queue ID</th><th>Order ID</th><th>Merchant</th><th>User ID</th><th>Reported Status</th><th>Review</th><th>Applied Outcome</th><th>Reason</th><th>Admin Notes</th><th>Reviewed On</th><th>Reviewed By</th></tr></thead><tbody>{reviewed.map((row) => <tr key={row.id} className="group border-t border-border hover:bg-muted/50">
            <td className="sticky left-0 z-20 bg-card font-mono text-xs font-semibold shadow-sticky-left group-hover:bg-muted"><span className="flex items-center gap-1">{row.id}<CopyButton value={row.id} /></span></td>
            <td className="font-mono text-xs">{row.orderId}</td>
            <td className="font-semibold">{row.merchant}</td>
            <td className="font-mono text-xs text-muted-foreground">{row.userId}</td>
            <td className="font-mono text-xs">{row.reportedStatus}</td>
            <td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", row.review === "Approved" ? "status-approved" : "status-rejected")}>{row.review}</span></td>
            <td><ResolutionOutcomeBadge outcome={row.appliedOutcome} /></td>
            <td className="max-w-56 truncate text-muted-foreground" title={row.reason}>{row.reason || "—"}</td>
            <td className="max-w-56 truncate text-muted-foreground" title={row.notes}>{row.notes || "—"}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{row.reviewedOn}</td>
            <td className="whitespace-nowrap text-xs">{row.reviewedBy}</td>
          </tr>)}</tbody></table></div></div>}
        <TransactionPagination count={reviewed.length} />
      </TabsContent>
    </Tabs>
    <ResolveQueueDialog key={`${selected?.id ?? "none"}-${decision ?? "none"}`} item={selected} mode={decision} reasons={reasons} onClose={() => { setSelected(null); setDecision(null); }} onSave={saveDecision} />
  </>;
}

function Conversions() {
  const [conversionRows, setConversionRows] = useState(conversions); const [query, setQuery] = useState(""); const [statuses, setStatuses] = useState<Status[]>([]); const [importOpen, setImportOpen] = useState(false); const [selected, setSelected] = useState<Conversion | null>(null); const [mode, setMode] = useState<"edit" | "delete" | null>(null); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  const filtered = conversionRows.filter((r) => (!query || Object.values(r).join(" ").toLowerCase().includes(query.toLowerCase())) && (!statuses.length || statuses.includes(r.status)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);
  const setSearch = (value: string) => { setQuery(value); setPage(1); };
  const setStatusFilter = (value: Status[]) => { setStatuses(value); setPage(1); };
  const act = (row: Conversion, next: "edit" | "delete") => { setSelected(row); setMode(next); };
  const saveConversion = (updated: Conversion) => setConversionRows((current) => current.map((item) => item.cashback === updated.cashback ? updated : item));
  const deleteConversion = (row: Conversion) => { setConversionRows((current) => current.filter((item) => item.cashback !== row.cashback)); toast.success("Conversion deleted", { description: `${row.cashback} was removed.` }); setSelected(null); setMode(null); };
  const pageItems = Array.from(new Set([1, 2, currentPage - 1, currentPage, currentPage + 1, pageCount - 1, pageCount])).filter((item) => item >= 1 && item <= pageCount).sort((a, b) => a - b);
  return <><PageHeader title="Online Conversions" description="Review conversion lifecycle, commission values, and settlement status." actions={<><Button variant="outline" onClick={() => downloadCsv(filtered, "offerpe-online-conversions.csv")}><Download />Export CSV</Button><Button onClick={() => setImportOpen(true)}><UploadCloud />Import</Button></>} /><FilterBar query={query} setQuery={setSearch} statuses={statuses} setStatuses={setStatusFilter} /><div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar max-w-full overflow-x-auto"><table className="w-max min-w-520 border-separate border-spacing-0 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>{["Cashback ID", "Click ID", "Order ID", "Merchant", "Status", "Order Value", "Commission Reported", "Commission Calculated", "Order Date", "Date Created", "Date Approved/Rejected", "Rejection Reason", "Internal Notes", "Withdrawal ID", "Invoice Number"].map((label, index) => <th key={label} className={cn("sticky top-0 z-10 border-b border-border bg-muted/90 px-4 py-2 backdrop-blur", index === 0 && "left-0 z-30 shadow-sticky-left")}>{label}</th>)}<th className="sticky right-0 top-0 z-30 border-b border-border bg-muted/90 pr-4 text-right backdrop-blur shadow-sticky-right">Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r.cashback} className="group hover:bg-muted/50"><td className="sticky left-0 z-20 border-b border-border bg-card px-4 py-2 shadow-sticky-left group-hover:bg-muted"><span className="flex items-center gap-1 font-mono text-xs font-semibold">{r.cashback}<CopyButton value={r.cashback} /></span></td><td className="border-b border-border font-mono text-xs"><span className="flex items-center gap-1">{r.click ?? "—"}{r.click && <CopyButton value={r.click} />}</span></td><td className="border-b border-border font-mono text-xs"><span className="flex items-center gap-1">{r.order}<CopyButton value={r.order} /></span></td><td className="border-b border-border"><span className="inline-flex items-center gap-2 font-medium"><span className="flex h-5 w-5 items-center justify-center rounded bg-accent text-primary"><Store className="h-3 w-3" /></span>{r.merchant}</span></td><td className="border-b border-border"><StatusBadge status={r.status} /></td><td className="border-b border-border font-medium">{r.value}</td><td className="border-b border-border">{r.reported}</td><td className="border-b border-border font-semibold">{r.calculated}</td><td className="border-b border-border text-muted-foreground">{r.orderDate}</td><td className="border-b border-border text-muted-foreground">{r.created}</td><td className="border-b border-border text-muted-foreground">{r.resolved ?? "—"}</td><td className="border-b border-border">{r.rejection ?? "—"}</td><td className="max-w-52 truncate border-b border-border text-muted-foreground" title={r.notes}>{r.notes}</td><td className="border-b border-border font-mono text-xs">{r.withdrawal ?? "—"}</td><td className="border-b border-border font-mono text-xs">{r.invoice ?? "—"}</td><td className="sticky right-0 z-20 border-b border-border bg-card pr-3 text-right shadow-sticky-right group-hover:bg-muted"><span className="inline-flex items-center"><IconButton className="h-7 w-7" label={`Edit ${r.cashback}`} onClick={() => act(r, "edit")}><Pencil className="h-3.5 w-3.5" /></IconButton><CopyButton value={r.cashback} /><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`More actions for ${r.cashback}`}><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => act(r, "edit")}><Pencil />Edit details</DropdownMenuItem><DropdownMenuItem><ExternalLink />Open conversion</DropdownMenuItem>{!(["Requested", "Paid"] as Status[]).includes(r.status) && <><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:bg-destructive-soft focus:text-destructive" onSelect={() => act(r, "delete")}><Trash2 />Delete</DropdownMenuItem></>}</DropdownMenuContent></DropdownMenu></span></td></tr>)}</tbody></table></div></div><div className="mt-4 grid gap-4 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><div className="flex min-w-0 flex-wrap items-center gap-4"><span>Showing <strong className="text-foreground">{filtered.length ? start + 1 : 0}</strong> to <strong className="text-foreground">{Math.min(start + pageSize, filtered.length)}</strong> of <strong className="text-foreground">{filtered.length}</strong> results</span><div className="flex shrink-0 items-center gap-2"><span>Rows per page</span><Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}><SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger><SelectContent>{[10, 25, 50, 100].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select></div></div><div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-1 lg:justify-end"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft />Previous</Button>{pageItems.map((item, index) => { const previous = pageItems[index - 1]; return <span key={item} className="contents">{previous !== undefined && item - previous > 1 && <span className="px-1">…</span>}<Button variant={item === currentPage ? "default" : "outline"} size="icon" className="h-8 w-8 shrink-0" onClick={() => setPage(item)} aria-current={item === currentPage ? "page" : undefined}>{item}</Button></span>; })}<Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight /></Button></div></div><ImportModal open={importOpen} onOpenChange={setImportOpen} /><ConversionModal key={`${selected?.cashback ?? "none"}-${mode ?? "none"}`} row={selected} mode={mode} onSave={saveConversion} onDelete={deleteConversion} onClose={() => { setSelected(null); setMode(null); }} /></>;
}

function RejectCampaignDialog({ campaign, onReject, children }: { campaign: StagedCampaign; onReject: (campaign: StagedCampaign, reason: string, note: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(campaignRejectionReasons[0] as string);
  const [note, setNote] = useState("");
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild>{children}</DialogTrigger><DialogContent className="max-w-lg bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">Reject staged campaign</DialogTitle><DialogDescription>Campaign {campaign.trackierId} ({campaign.name}) will be removed from the import queue and will not be published to the catalog.</DialogDescription></DialogHeader><div className="space-y-4"><label className="block space-y-1.5 text-sm font-medium">Rejection reason <span className="text-destructive">*</span><Select value={reason} onValueChange={setReason}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{campaignRejectionReasons.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label><label className="block space-y-1.5 text-sm font-medium">Rejection note <span className="font-normal text-muted-foreground">(optional)</span><Textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add internal context for this decision…" /></label></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="destructive" onClick={() => { onReject(campaign, reason, note); setOpen(false); }}>Reject campaign</Button></DialogFooter></DialogContent></Dialog>;
}

function StagedField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">{label}<div className="font-sans text-sm normal-case">{children}</div></label>;
}

function CampaignCard({ campaign, categories, onChange, onApprove, onReject }: { campaign: StagedCampaign; categories: Category[]; onChange: (campaign: StagedCampaign) => void; onApprove: (campaign: StagedCampaign) => void; onReject: (campaign: StagedCampaign, reason: string, note: string) => void }) {
  const set = <K extends keyof StagedCampaign>(key: K, value: StagedCampaign[K]) => onChange({ ...campaign, [key]: value });
  const mapped = Boolean(campaign.categoryId);
  return <article className="rounded-lg border border-border bg-card p-4 shadow-card">
    <div className="flex flex-col gap-2 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {campaign.logo ? <img src={campaign.logo} alt="" className="h-8 w-8 rounded border border-border bg-muted object-contain" /> : <span className="flex h-8 w-8 items-center justify-center rounded border border-border bg-muted text-muted-foreground"><Store className="h-4 w-4" /></span>}
        <span className="font-heading text-base font-bold">{campaign.name}</span>
        <span className="font-mono text-xs text-muted-foreground">Trackier {campaign.trackierId}</span>
      </div>
      {!mapped && <span className="inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold status-pending"><AlertTriangle className="h-3 w-3" />Category unmapped — raw: {campaign.rawCategory}</span>}
    </div>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <StagedField label="Name"><Input value={campaign.name} onChange={(event) => set("name", event.target.value)} /></StagedField>
      <StagedField label="Category"><Select value={campaign.categoryId || "none"} onValueChange={(value) => set("categoryId", value === "none" ? "" : value)}><SelectTrigger><SelectValue placeholder="Select a category…" /></SelectTrigger><SelectContent><SelectItem value="none">Select a category…</SelectItem>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name} ({category.channel.toUpperCase()})</SelectItem>)}</SelectContent></Select></StagedField>
      <div className="md:col-span-2"><StagedField label="About (cleaned from Trackier's description)"><Textarea rows={3} value={campaign.about} onChange={(event) => set("about", event.target.value)} /></StagedField></div>
      <StagedField label="Logo URL"><Input value={campaign.logo} onChange={(event) => set("logo", event.target.value)} /></StagedField>
      <StagedField label="Website URL"><Input value={campaign.website} onChange={(event) => set("website", event.target.value)} /></StagedField>
      <StagedField label="Tracking time (minutes)"><Input value={campaign.trackingTime} onChange={(event) => set("trackingTime", event.target.value)} /></StagedField>
      <StagedField label="Approval time (days)"><Input value={campaign.approvalTime} onChange={(event) => set("approvalTime", event.target.value)} /></StagedField>
      <StagedField label="Display order (from Trackier Priority)"><Input value={campaign.displayOrder} onChange={(event) => set("displayOrder", event.target.value)} /></StagedField>
      <StagedField label="Attribution"><Select value={campaign.attribution} onValueChange={(value) => set("attribution", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Web", "App", "Web & App"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></StagedField>
    </div>
    <p className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"><Lock className="h-3 w-3" />Network tracking URL (verbatim, not editable): <span className="font-mono text-foreground">{campaign.trackingUrl}</span></p>
    <div className="mt-4">
      <h3 className="text-[11px] font-bold uppercase text-muted-foreground">Offers ({campaign.offers.length})</h3>
      <div className="mt-2 space-y-3">{campaign.offers.map((offer, index) => <div key={index} className="rounded-lg border border-border bg-muted/40 p-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2"><StagedField label="Headline"><Input readOnly value={offer.headline} className="bg-card" /></StagedField></div>
          <div className="md:col-span-2"><StagedField label="Terms (cleaned from Trackier's kpi)"><Textarea readOnly rows={3} value={offer.terms} className="bg-card" /></StagedField></div>
          <StagedField label="Discount"><div className="flex items-center gap-2"><span className="rounded border border-border bg-card px-2 py-1 text-xs font-semibold">{offer.discountType}</span><span className="font-heading text-base font-bold">{offer.discountValue}</span></div></StagedField>
          <StagedField label="Commission (informational)"><div className="flex items-center gap-2"><span className="rounded border border-border bg-card px-2 py-1 text-xs font-semibold">{offer.commissionType}</span><span className="font-heading text-base font-bold">{offer.commissionValue}</span></div></StagedField>
        </div>
      </div>)}</div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
      <Button size="sm" onClick={() => onApprove(campaign)}><Check />Approve</Button>
      <RejectCampaignDialog campaign={campaign} onReject={onReject}><Button size="sm" variant="destructive"><X />Reject</Button></RejectCampaignDialog>
    </div>
  </article>;
}

function SyncRunsTable({ runs }: { runs: SyncRun[] }) {
  const [status, setStatus] = useState("all");
  const [trigger, setTrigger] = useState("all");
  const rows = runs.filter((run) => (status === "all" || run.status === status) && (trigger === "all" || run.trigger === trigger));
  return <div>
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row">
      <label className="flex-1 space-y-1.5 text-xs font-semibold uppercase text-muted-foreground sm:max-w-52">Status<Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="SUCCEEDED">Succeeded</SelectItem><SelectItem value="FAILED">Failed</SelectItem></SelectContent></Select></label>
      <label className="flex-1 space-y-1.5 text-xs font-semibold uppercase text-muted-foreground sm:max-w-52">Triggered by<Select value={trigger} onValueChange={setTrigger}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="MANUAL">Manual</SelectItem><SelectItem value="SCHEDULED">Scheduled</SelectItem></SelectContent></Select></label>
    </div>
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-215 text-left text-sm">
      <thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th>Started</th><th>Triggered by</th><th>Status</th><th>Fetched</th><th>New staged</th><th>Updated</th><th>Field-locked skips</th><th>Errors</th></tr></thead>
      <tbody>{rows.map((run) => <tr key={run.id} className="border-t border-border hover:bg-muted/50">
        <td className="font-medium">{run.started}</td>
        <td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", run.trigger === "MANUAL" ? "bg-muted text-muted-foreground" : "status-requested")}>{run.trigger}</span></td>
        <td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", run.status === "SUCCEEDED" ? "status-approved" : "status-rejected")}>{run.status}</span></td>
        <td>{run.fetched}</td><td>{run.staged}</td><td>{run.updated}</td><td>{run.skips}</td>
        <td>{run.errors.length === 0 ? <span className="text-muted-foreground">—</span> : <Dialog><DialogTrigger asChild><button className="rounded-full bg-destructive-soft px-2 py-0.5 text-xs font-semibold text-destructive">{run.errors.length} error(s)</button></DialogTrigger><DialogContent className="max-w-lg bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">Sync errors</DialogTitle><DialogDescription>{run.started} · {run.trigger.toLowerCase()} run</DialogDescription></DialogHeader><ul className="space-y-2 text-sm">{run.errors.map((error) => <li key={error} className="rounded-md border border-destructive-border bg-destructive-soft p-2 text-destructive">{error}</li>)}</ul></DialogContent></Dialog>}</td>
      </tr>)}</tbody>
    </table></div></div>
    {rows.length === 0 && <p className="mt-4 text-sm text-muted-foreground">No sync runs match these filters.</p>}
  </div>;
}

function SyncConfirmDialog({ syncing, onSync, children }: { syncing: boolean; onSync: () => void; children: React.ReactNode }) {
  return <AlertDialog><AlertDialogTrigger asChild>{children}</AlertDialogTrigger><AlertDialogContent className="border-border bg-card"><AlertDialogHeader><AlertDialogTitle className="font-heading">Trigger Trackier campaign sync?</AlertDialogTitle><AlertDialogDescription>This will query the Trackier API for newly active and updated campaigns. Staged campaigns and pending reviews will be updated. Do you want to proceed?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-teal-600 text-white hover:bg-teal-700" onClick={onSync}><RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />Confirm &amp; Sync</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}

const affiliateMacroNote = "Recognized macros: {click_id} {user_id} {deeplink} {deeplink_encoded} {property_id} {tracking_url} {voucher_deeplink} {product_deeplink} {utm_params}. Also supports {URLENCODE}...{/URLENCODE} and [optional ...] blocks.";

function AffiliateNetworksPage({ networks, onCreate, onEdit, onDelete }: { networks: AffiliateNetwork[]; onCreate: () => void; onEdit: (network: AffiliateNetwork) => void; onDelete: (network: AffiliateNetwork) => void }) {
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("all"); const [ascending, setAscending] = useState(true); const [page, setPage] = useState(1); const pageSize = 5;
  const filtered = networks.filter((network) => (!query || `${network.name} ${network.propertyId}`.toLowerCase().includes(query.toLowerCase())) && (status === "all" || (network.active ? "Active" : "Inactive") === status)).sort((a, b) => ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize)); const currentPage = Math.min(page, pageCount); const start = (currentPage - 1) * pageSize; const rows = filtered.slice(start, start + pageSize);
  const reset = () => { setQuery(""); setStatus("all"); setPage(1); };
  return <><PageHeader title="Affiliate Networks" description="Configure affiliate network identifiers and URL templates used to generate tracked store, voucher, and product links." actions={<Button onClick={onCreate}><Plus />Add new</Button>} />
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center"><div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="w-full pl-9" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search by network name or property ID…" /></div><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Status: {status === "all" ? "All" : status}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48 border-border bg-card"><DropdownMenuItem onSelect={() => { setStatus("all"); setPage(1); }}>Status: All</DropdownMenuItem><DropdownMenuItem onSelect={() => { setStatus("Active"); setPage(1); }}>Status: Active</DropdownMenuItem><DropdownMenuItem onSelect={() => { setStatus("Inactive"); setPage(1); }}>Status: Inactive</DropdownMenuItem></DropdownMenuContent></DropdownMenu>{(query || status !== "all") && <Button variant="ghost" size="sm" onClick={reset} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}</div>
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-180 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setAscending(!ascending)}>Name<ChevronDown className={cn("transition-transform", !ascending && "rotate-180")} /></Button></th><th>Property ID</th><th>Status</th><th className="text-right">Actions</th></tr></thead><tbody>{rows.map((network) => <tr key={network.id} className="border-t border-border hover:bg-muted/50"><td className="py-2 font-semibold">{network.name}</td><td className="py-2 font-mono text-xs text-muted-foreground">{network.propertyId || "—"}</td><td className="py-2"><StatusBadge status={network.active ? "Active" : "Inactive"} /></td><td className="py-2 text-right"><span className="inline-flex"><IconButton className="h-7 w-7" label={`Edit ${network.name}`} onClick={() => onEdit(network)}><Pencil className="h-3.5 w-3.5" /></IconButton><ConfirmDeleteDialog itemType="affiliate network" name={network.name} onConfirm={() => onDelete(network)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete ${network.name}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog></span></td></tr>)}</tbody></table></div></div>
    <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>Showing <strong className="text-foreground">{filtered.length ? start + 1 : 0}</strong> to <strong className="text-foreground">{Math.min(start + pageSize, filtered.length)}</strong> of <strong className="text-foreground">{filtered.length}</strong> results</span><div className="flex gap-1"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft />Previous</Button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <Button key={item} variant={item === currentPage ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setPage(item)}>{item}</Button>)}<Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight /></Button></div></div></>;
}

function AffiliateNetworkFormPage({ network, onCancel, onSave, onDelete }: { network: AffiliateNetwork | null; onCancel: () => void; onSave: (network: AffiliateNetwork) => void; onDelete: (network: AffiliateNetwork) => void }) {
  const isNew = !network;
  const [form, setForm] = useState<AffiliateNetwork>(() => network ?? { id: `NET-${Date.now()}`, name: "", propertyId: "", storeTemplate: "", voucherTemplate: "", productTemplate: "", active: true });
  const set = <K extends keyof AffiliateNetwork>(key: K, value: AffiliateNetwork[K]) => setForm((current) => ({ ...current, [key]: value }));
  const save = () => { if (!form.name.trim()) { toast.error("Network name is required"); return; } onSave({ ...form, name: form.name.trim() }); toast.success(isNew ? "Affiliate network created" : "Affiliate network updated", { description: `${form.name.trim()} was saved successfully.` }); };
  const templateField = (label: string, key: "storeTemplate" | "voucherTemplate" | "productTemplate", placeholder: string) => <label className="block space-y-1.5 text-sm font-medium">{label}<Textarea className="font-mono text-xs" rows={3} value={form[key]} onChange={(event) => set(key, event.target.value)} placeholder={placeholder} /><span className="block text-xs font-normal leading-5 text-muted-foreground">{affiliateMacroNote}</span></label>;
  return <div className="pb-20"><nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={onCancel}>Dashboard</Button><ChevronRight className="h-3.5 w-3.5" /><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={onCancel}>Affiliate Networks</Button><ChevronRight className="h-3.5 w-3.5" /><span className="font-medium text-foreground">{isNew ? "New" : "Edit"}</span></nav>
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="font-heading text-3xl font-bold">{isNew ? "New affiliate network" : "Edit affiliate network"}</h1><p className="mt-1 text-sm text-muted-foreground">Configure the network identity and tracked destination templates.</p></div>{!isNew && <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive"><Trash2 />Delete</Button></AlertDialogTrigger><AlertDialogContent className="border-border bg-card"><AlertDialogHeader><AlertDialogTitle className="font-heading">Delete affiliate network?</AlertDialogTitle><AlertDialogDescription>Deleting &apos;{form.name}&apos; may affect merchants and offers that use its tracking templates. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => onDelete(form)}><Trash2 />Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>}</header>
    <section className="rounded-lg border border-border bg-card p-6 shadow-card"><div className="grid gap-5 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Name <span className="text-destructive">*</span><Input value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="Trackier" /></label><label className="space-y-1.5 text-sm font-medium">Property ID <span className="font-normal text-muted-foreground">(optional)</span><Input value={form.propertyId} onChange={(event) => set("propertyId", event.target.value)} placeholder="prop_102" /></label><div className="sm:col-span-2">{templateField("Store URL template", "storeTemplate", "https://network.example/click?click_id={click_id}&url={deeplink_encoded}")}</div><div className="sm:col-span-2">{templateField("Voucher URL template", "voucherTemplate", "https://network.example/voucher?click_id={click_id}&url={voucher_deeplink}")}</div><div className="sm:col-span-2">{templateField("Product URL template", "productTemplate", "https://network.example/product?click_id={click_id}&url={product_deeplink}")}</div><div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-3 sm:col-span-2"><div><p className="text-sm font-semibold">Active</p><p className="text-xs text-muted-foreground">Allow this network to generate tracked links.</p></div><Switch checked={form.active} onCheckedChange={(value) => set("active", value)} aria-label="Active affiliate network" /></div></div></section>
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur md:left-64"><div className="mx-auto flex max-w-400 justify-end gap-2"><Button variant="destructiveSoft" onClick={onCancel}>Cancel</Button><Button onClick={save}>Save</Button></div></div></div>;
}

function TrackierQueue({ campaigns, runs, categories, syncing, onSync, onChange, onApprove, onReject }: { campaigns: StagedCampaign[]; runs: SyncRun[]; categories: Category[]; syncing: boolean; onSync: () => void; onChange: (campaign: StagedCampaign) => void; onApprove: (campaign: StagedCampaign) => void; onReject: (campaign: StagedCampaign, reason: string, note: string) => void }) {
  const [tab, setTab] = useState("pending");
  const [query, setQuery] = useState("");
  const [mapping, setMapping] = useState("all");
  const categoryLabel = (campaign: StagedCampaign) => categories.find((category) => category.id === campaign.categoryId)?.name ?? campaign.rawCategory;
  const pending = campaigns
    .filter((campaign) => !query || `${campaign.name} ${campaign.trackierId} ${categoryLabel(campaign)}`.toLowerCase().includes(query.toLowerCase()))
    .filter((campaign) => mapping === "all" || (mapping === "mapped" ? Boolean(campaign.categoryId) : !campaign.categoryId));
  return <><PageHeader title="Trackier Import Queue" description="Review and approve affiliate campaigns fetched from Trackier API before publishing them to the live catalog." actions={<SyncConfirmDialog syncing={syncing} onSync={onSync}><Button disabled={syncing}><RefreshCw className={cn(syncing && "animate-spin")} />{syncing ? "Syncing…" : "Sync Now"}</Button></SyncConfirmDialog>} />
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0"><TabsTrigger value="pending" className={tabTriggerClass}>Pending Review ({campaigns.length})</TabsTrigger><TabsTrigger value="runs" className={tabTriggerClass}>Recent Sync Runs ({runs.length})</TabsTrigger></TabsList>
      <TabsContent value="pending" className="mt-0">
        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
          <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by campaign name, Trackier ID, or category…" /></div>
          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Mapping: {mapping === "all" ? "All" : mapping === "mapped" ? "Mapped" : "Unmapped"}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48 border-border bg-card"><DropdownMenuItem onSelect={() => setMapping("all")}>Mapping: All</DropdownMenuItem><DropdownMenuItem onSelect={() => setMapping("mapped")}>Mapping: Mapped</DropdownMenuItem><DropdownMenuItem onSelect={() => setMapping("unmapped")}>Mapping: Unmapped</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
          {(query || mapping !== "all") && <Button variant="ghost" size="sm" onClick={() => { setQuery(""); setMapping("all"); }} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
        </div>
        {pending.length === 0 ? <p className="text-sm text-muted-foreground">No staged campaigns waiting for review.</p>
          : <div className="space-y-4">{pending.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} categories={categories} onChange={onChange} onApprove={onApprove} onReject={onReject} />)}</div>}
      </TabsContent>
      <TabsContent value="runs" className="mt-0"><SyncRunsTable runs={runs} /></TabsContent>
    </Tabs>
  </>;
}

function RejectionReasonDialog({ reason, nextOrder, onClose, onSave }: { reason: RejectionReason | null; nextOrder: number; onClose: () => void; onSave: (reason: RejectionReason) => void }) {
  const [text, setText] = useState(reason?.reason ?? "");
  const [category, setCategory] = useState<RejectionCategory>(reason?.category ?? "Transaction Rejection Reason");
  const [order, setOrder] = useState(reason?.order ?? nextOrder);
  const [active, setActive] = useState(reason?.active ?? true);
  return <Dialog open onOpenChange={(open) => !open && onClose()}><DialogContent className="max-w-xl bg-card"><DialogHeader><DialogTitle className="font-heading text-xl">{reason ? "Edit rejection reason" : "New rejection reason"}</DialogTitle><DialogDescription>{reason ? "Update the label, ordering, or deactivate this reason." : "Add a reason to the whitelist used when conversions are rejected."}</DialogDescription></DialogHeader><div className="grid gap-5"><label className="space-y-1.5 text-sm font-medium">Reason <span className="text-destructive">*</span><Textarea aria-label="Reason" rows={3} value={text} onChange={(event) => setText(event.target.value)} placeholder="e.g. Payment failed" /><span className="block text-xs font-normal text-muted-foreground">Long reasons wrap onto multiple lines and stay fully visible.</span></label><label className="space-y-1.5 text-sm font-medium">Rejection reason category <span className="text-destructive">*</span><Select value={category} onValueChange={(value) => setCategory(value as RejectionCategory)}><SelectTrigger aria-label="Rejection reason category"><SelectValue /></SelectTrigger><SelectContent>{rejectionCategories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select><span className="block text-xs font-normal text-muted-foreground">Decides which admin flow offers this reason in its dropdown.</span></label><label className="space-y-1.5 text-sm font-medium">Display order <span className="text-destructive">*</span><Input aria-label="Display order" type="number" min={0} className="w-40" value={order} onChange={(event) => setOrder(Math.max(0, Number(event.target.value)))} /><span className="block text-xs font-normal text-muted-foreground">Lower numbers appear first in dropdowns and export templates.</span></label><label className="flex items-start gap-2.5 text-sm font-medium"><Checkbox checked={active} onCheckedChange={(checked) => setActive(checked === true)} aria-label="Active" className="mt-0.5" /><span className="space-y-0.5">Active<span className="block text-xs font-normal text-muted-foreground">Inactive reasons stay on historical conversions but can't be newly assigned.</span></span></label></div><DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!text.trim()} onClick={() => onSave({ id: reason?.id ?? `RR-${Date.now()}`, reason: text.trim(), category, order, active })}><Check />Save</Button></DialogFooter></DialogContent></Dialog>;
}

function RejectionReasons({ reasons, onSave }: { reasons: RejectionReason[]; onSave: (reason: RejectionReason, isNew: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | RejectionCategory>("all");
  const [sortKey, setSortKey] = useState<"reason" | "category" | "order">("order");
  const [sortAsc, setSortAsc] = useState(true);
  const [editing, setEditing] = useState<RejectionReason | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const search = query.toLowerCase();
  const rows = reasons
    .filter((item) => (!search || item.reason.toLowerCase().includes(search) || item.category.toLowerCase().includes(search)) && (statusFilter === "all" || (statusFilter === "active") === item.active) && (categoryFilter === "all" || item.category === categoryFilter))
    .sort((a, b) => { const result = sortKey === "reason" ? a.reason.localeCompare(b.reason) : sortKey === "category" ? a.category.localeCompare(b.category) || a.order - b.order : a.order - b.order; return sortAsc ? result : -result; });
  const toggleSort = (key: "reason" | "category" | "order") => { if (sortKey === key) setSortAsc(!sortAsc); else { setSortKey(key); setSortAsc(true); } };
  const openAdd = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (item: RejectionReason) => { setEditing(item); setDialogOpen(true); };
  return <>
    <PageHeader title="Rejection Reasons" description="The whitelist resolve_online_conversion / approve_conversion_resolution validate a rejection reason against. Deactivate a reason instead of deleting it — historical conversions rejected under it keep displaying its text correctly either way." actions={<Button onClick={openAdd}><Plus />Add new</Button>} />
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
      <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search reasons" className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by reason text or category…" /></div>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Category: {categoryFilter === "all" ? "All" : rejectionCategoryShort[categoryFilter]}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-72 border-border bg-card"><DropdownMenuItem onSelect={() => setCategoryFilter("all")}>Category: All</DropdownMenuItem>{rejectionCategories.map((item) => <DropdownMenuItem key={item} onSelect={() => setCategoryFilter(item)}>{item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Status: {statusFilter === "all" ? "All" : statusFilter === "active" ? "Active" : "Inactive"}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44 border-border bg-card">{["all", "active", "inactive"].map((item) => <DropdownMenuItem key={item} onSelect={() => setStatusFilter(item)}>Status: {item === "all" ? "All" : item === "active" ? "Active" : "Inactive"}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
      {(query || statusFilter !== "all" || categoryFilter !== "all") && <Button variant="ghost" size="sm" onClick={() => { setQuery(""); setStatusFilter("all"); setCategoryFilter("all"); }} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
    </div>
    <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-140 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr><th className="sticky top-0 bg-muted/95 py-2"><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => toggleSort("reason")}>Reason {sortKey === "reason" && (sortAsc ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />)}</Button></th><th className="sticky top-0 bg-muted/95 py-2"><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => toggleSort("category")}>Category {sortKey === "category" && (sortAsc ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />)}</Button></th><th className="sticky top-0 bg-muted/95 py-2"><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => toggleSort("order")}>Order {sortKey === "order" && (sortAsc ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />)}</Button></th><th className="sticky top-0 bg-muted/95 py-2">Status</th><th className="sticky top-0 bg-muted/95 py-2 text-right">Actions</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="border-t border-border hover:bg-muted/50"><td className="font-semibold">{item.reason}</td><td><span className="inline-block rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-primary" title={item.category}>{rejectionCategoryShort[item.category]}</span></td><td className="text-muted-foreground">{item.order}</td><td><StatusBadge status={item.active ? "Active" : "Inactive"} /></td><td className="text-right"><IconButton className="h-7 w-7" label={`Edit ${item.reason}`} onClick={() => openEdit(item)}><Pencil className="h-3.5 w-3.5" /></IconButton></td></tr>)}</tbody></table>{!rows.length && <div className="px-6 py-14 text-center"><Flag className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">No rejection reasons found</h3><p className="mt-1 text-sm text-muted-foreground">Try changing or resetting the current filters.</p></div>}</div></div>
    <TransactionPagination count={rows.length} />
    {dialogOpen && <RejectionReasonDialog reason={editing} nextOrder={reasons.reduce((max, item) => Math.max(max, item.order), 0) + 1} onClose={() => setDialogOpen(false)} onSave={(reason) => { onSave(reason, !editing); setDialogOpen(false); }} />}
  </>;
}

type CityRecord = { id: string; name: string; state: string; lat: number; lng: number; active: boolean };

const cityDirectory: Record<string, { name: string; lat: number; lng: number }[]> = {
  Karnataka: [{ name: "Bengaluru", lat: 12.9716, lng: 77.5946 }, { name: "Mysuru", lat: 12.2958, lng: 76.6394 }, { name: "Mangaluru", lat: 12.9141, lng: 74.856 }, { name: "Hubballi", lat: 15.3647, lng: 75.124 }],
  Maharashtra: [{ name: "Mumbai", lat: 19.076, lng: 72.8777 }, { name: "Pune", lat: 18.5204, lng: 73.8567 }, { name: "Nagpur", lat: 21.1458, lng: 79.0882 }, { name: "Nashik", lat: 19.9975, lng: 73.7898 }],
  Delhi: [{ name: "New Delhi", lat: 28.6139, lng: 77.209 }, { name: "Dwarka", lat: 28.5921, lng: 77.046 }],
  "Tamil Nadu": [{ name: "Chennai", lat: 13.0827, lng: 80.2707 }, { name: "Coimbatore", lat: 11.0168, lng: 76.9558 }, { name: "Madurai", lat: 9.9252, lng: 78.1198 }],
  Telangana: [{ name: "Hyderabad", lat: 17.385, lng: 78.4867 }, { name: "Warangal", lat: 17.9689, lng: 79.5941 }],
  Gujarat: [{ name: "Ahmedabad", lat: 23.0225, lng: 72.5714 }, { name: "Surat", lat: 21.1702, lng: 72.8311 }, { name: "Vadodara", lat: 22.3072, lng: 73.1812 }],
  "West Bengal": [{ name: "Kolkata", lat: 22.5726, lng: 88.3639 }, { name: "Siliguri", lat: 26.7271, lng: 88.3953 }],
  Rajasthan: [{ name: "Jaipur", lat: 26.9124, lng: 75.7873 }, { name: "Udaipur", lat: 24.5854, lng: 73.7125 }],
  Kerala: [{ name: "Kochi", lat: 9.9312, lng: 76.2673 }, { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 }],
  "Uttar Pradesh": [{ name: "Lucknow", lat: 26.8467, lng: 80.9462 }, { name: "Noida", lat: 28.5355, lng: 77.391 }, { name: "Varanasi", lat: 25.3176, lng: 82.9739 }],
};
const cityStates = Object.keys(cityDirectory);

const initialCities: CityRecord[] = [
  { id: "CITY-1", name: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946, active: true },
  { id: "CITY-2", name: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777, active: true },
  { id: "CITY-3", name: "New Delhi", state: "Delhi", lat: 28.6139, lng: 77.209, active: true },
  { id: "CITY-4", name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, active: true },
  { id: "CITY-5", name: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867, active: true },
  { id: "CITY-6", name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, active: true },
  { id: "CITY-7", name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714, active: true },
  { id: "CITY-8", name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, active: false },
  { id: "CITY-9", name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, active: true },
  { id: "CITY-10", name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673, active: false },
];

function CityDialog({ city, onClose, onSave }: { city: CityRecord | null; onClose: () => void; onSave: (city: CityRecord) => void }) {
  const [stateName, setStateName] = useState(city?.state ?? "");
  const [cityName, setCityName] = useState(city?.name ?? "");
  const [manual, setManual] = useState(false);
  const [lat, setLat] = useState(city ? String(city.lat) : "");
  const [lng, setLng] = useState(city ? String(city.lng) : "");
  const [active, setActive] = useState(city?.active ?? true);
  const cityOptions = stateName ? cityDirectory[stateName] ?? [] : [];
  const pickState = (value: string) => { setStateName(value); if (!manual) { setCityName(""); setLat(""); setLng(""); } };
  const pickCity = (value: string) => {
    setCityName(value);
    const match = cityOptions.find((item) => item.name === value);
    if (match) { setLat(String(match.lat)); setLng(String(match.lng)); }
  };
  const valid = Boolean(stateName && cityName.trim() && lat.trim() && lng.trim() && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng)));
  return <Dialog open onOpenChange={(open) => !open && onClose()}><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-xl">{city ? "Edit city" : "New city"}</DialogTitle><DialogDescription>Pick a state and city — latitude and longitude fill in automatically from the OfferPe city directory.</DialogDescription></DialogHeader><div className="space-y-5"><div><p className="mb-2 text-sm font-semibold">State &amp; city</p><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">State <span className="text-destructive">*</span><Select value={stateName} onValueChange={pickState}><SelectTrigger aria-label="State"><SelectValue placeholder="Select a state…" /></SelectTrigger><SelectContent>{cityStates.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">City <span className="text-destructive">*</span>{manual ? <Input aria-label="City" value={cityName} onChange={(event) => setCityName(event.target.value)} placeholder="Enter city name" /> : <Select value={cityName} onValueChange={pickCity} disabled={!stateName}><SelectTrigger aria-label="City"><SelectValue placeholder="Select a city…" /></SelectTrigger><SelectContent>{cityOptions.map((item) => <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select>}</label></div><Button variant="link" className="h-auto px-0 pt-2 text-sm text-primary" onClick={() => setManual(!manual)}>{manual ? "Back to the city list" : "City not listed? Enter manually"}</Button></div><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Latitude <span className="text-destructive">*</span><Input aria-label="Latitude" value={lat} onChange={(event) => setLat(event.target.value)} placeholder="12.9716" /></label><label className="space-y-1.5 text-sm font-medium">Longitude <span className="text-destructive">*</span><Input aria-label="Longitude" value={lng} onChange={(event) => setLng(event.target.value)} placeholder="77.5946" /></label></div><p className="text-xs text-muted-foreground">Coordinates are prefilled from the directory and stay editable for precise store-radius tuning.</p><label className="flex items-start gap-2.5 text-sm font-medium"><Checkbox checked={active} onCheckedChange={(checked) => setActive(checked === true)} aria-label="Active" className="mt-0.5" /><span className="space-y-0.5">Active<span className="block text-xs font-normal text-muted-foreground">Inactive cities stay on existing stores but can&apos;t be newly assigned.</span></span></label></div><DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!valid} onClick={() => onSave({ id: city?.id ?? `CITY-${Date.now()}`, name: cityName.trim(), state: stateName, lat: Number(lat), lng: Number(lng), active })}><Check />Save</Button></DialogFooter></DialogContent></Dialog>;
}

function CitiesPage() {
  const [rowsState, setRowsState] = useState<CityRecord[]>(initialCities);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<CityRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const search = query.toLowerCase();
  const rows = rowsState.filter((item) => (!search || item.name.toLowerCase().includes(search) || item.state.toLowerCase().includes(search)) && (stateFilter === "all" || item.state === stateFilter) && (statusFilter === "all" || (statusFilter === "active") === item.active));
  const save = (city: CityRecord) => {
    setRowsState((current) => current.some((item) => item.id === city.id) ? current.map((item) => item.id === city.id ? city : item) : [city, ...current]);
    toast.success(editing ? "City updated" : "City added", { description: `${city.name}, ${city.state} at ${city.lat}, ${city.lng}.` });
    setDialogOpen(false);
  };
  return <>
    <PageHeader title="Cities" description="Serviceable cities with their coordinates — used for offline store discovery radius and city-level merchant targeting." actions={<Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus />Add new</Button>} />
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
      <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search cities" className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by city or state…" /></div>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />State: {stateFilter === "all" ? "All" : stateFilter}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56 border-border bg-card"><DropdownMenuItem onSelect={() => setStateFilter("all")}>State: All</DropdownMenuItem>{cityStates.map((item) => <DropdownMenuItem key={item} onSelect={() => setStateFilter(item)}>{item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Status: {statusFilter === "all" ? "All" : statusFilter === "active" ? "Active" : "Inactive"}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44 border-border bg-card">{["all", "active", "inactive"].map((item) => <DropdownMenuItem key={item} onSelect={() => setStatusFilter(item)}>Status: {item === "all" ? "All" : item === "active" ? "Active" : "Inactive"}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
      {(query || stateFilter !== "all" || statusFilter !== "all") && <Button variant="ghost" size="sm" onClick={() => { setQuery(""); setStateFilter("all"); setStatusFilter("all"); }} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
    </div>
    <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-175 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr><th className="sticky top-0 bg-muted/95 py-2">City</th><th className="sticky top-0 bg-muted/95 py-2">State</th><th className="sticky top-0 bg-muted/95 py-2">Latitude</th><th className="sticky top-0 bg-muted/95 py-2">Longitude</th><th className="sticky top-0 bg-muted/95 py-2">Status</th><th className="sticky top-0 bg-muted/95 py-2 text-right">Actions</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="border-t border-border hover:bg-muted/50"><td className="font-semibold">{item.name}</td><td className="text-muted-foreground">{item.state}</td><td className="font-mono text-xs">{item.lat}</td><td className="font-mono text-xs">{item.lng}</td><td><StatusBadge status={item.active ? "Active" : "Inactive"} /></td><td className="text-right"><span className="inline-flex"><IconButton className="h-7 w-7" label={`Edit ${item.name}`} onClick={() => { setEditing(item); setDialogOpen(true); }}><Pencil className="h-3.5 w-3.5" /></IconButton><ConfirmDeleteDialog itemType="City" name={item.name} onConfirm={() => { setRowsState((current) => current.filter((row) => row.id !== item.id)); toast.success("City deleted", { description: `${item.name} was removed.` }); }}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete ${item.name}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog></span></td></tr>)}</tbody></table>{!rows.length && <div className="px-6 py-14 text-center"><Building2 className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">No cities found</h3><p className="mt-1 text-sm text-muted-foreground">Try changing or resetting the current filters.</p></div>}</div></div>
    <TransactionPagination count={rows.length} />
    {dialogOpen && <CityDialog key={editing?.id ?? "new"} city={editing} onClose={() => setDialogOpen(false)} onSave={save} />}
  </>;
}

function UserImportDialog({ open, onOpenChange, onImport }: { open: boolean; onOpenChange: (v: boolean) => void; onImport: (fileName: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const close = (nextOpen: boolean) => { onOpenChange(nextOpen); if (!nextOpen) setFile(null); };
  return <Dialog open={open} onOpenChange={close}><DialogContent className="max-w-xl bg-card"><DialogHeader><DialogTitle className="font-heading text-xl">Import users via CSV</DialogTitle><DialogDescription>Stage customer user records from a CSV. Duplicate phone numbers are rejected row-by-row and valid rows continue.</DialogDescription></DialogHeader><div className="rounded-md bg-muted p-3 text-sm leading-6 text-muted-foreground"><span className="mr-2 inline-flex rounded bg-info-soft px-2 py-0.5 text-xs font-semibold text-info">Required columns</span><code>phone_number</code><span className="mx-2 text-muted-foreground">Optional:</span><code>user_id, full_name, email, city, status</code></div><button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); setFile(event.dataTransfer.files[0] ?? null); }} className="flex min-h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed border-strong bg-muted/40 px-6 text-center hover:border-primary hover:bg-accent"><UploadCloud className="mb-3 h-8 w-8 text-primary" /><span className="font-semibold text-primary">{file ? file.name : "Choose a CSV file"}</span><span className="mt-1 text-sm text-muted-foreground">or drag and drop the users CSV here</span><input ref={inputRef} className="hidden" type="file" accept=".csv,text/csv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></button><DialogFooter><Button variant="destructiveSoft" onClick={() => close(false)}>Cancel</Button><Button disabled={!file} onClick={() => { if (file) onImport(file.name); close(false); }}><UploadCloud />Upload &amp; import</Button></DialogFooter></DialogContent></Dialog>;
}

function UsersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<UserStatus | "all">("all");
  const [deleted, setDeleted] = useState<DeletedFilter>("all");
  const [dateField, setDateField] = useState<UserDateField>("signedUp");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [importOpen, setImportOpen] = useState(false);
  const search = query.toLowerCase();
  const getDate = (row: UserRecord) => dateField === "lastLogin" ? row.lastLoginDate : dateField === "signedUp" ? row.signedUpDate : dateField === "deletedAt" ? row.deletedDate : row.reRegisteredDate;
  const filtered = initialUsers
    .filter((row) => (!search || `${row.id} ${row.phone} ${row.name}`.toLowerCase().includes(search)) && (status === "all" || row.status === status) && (deleted === "all" || row.deleted === (deleted === "yes")) && (!from || (getDate(row) && getDate(row) >= from)) && (!to || (getDate(row) && getDate(row) <= to)))
    .sort((a, b) => sortDesc ? b.signedUpDate.localeCompare(a.signedUpDate) : a.signedUpDate.localeCompare(b.signedUpDate));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);
  const pageItems = Array.from(new Set([1, 2, currentPage - 1, currentPage, currentPage + 1, pageCount - 1, pageCount])).filter((item) => item >= 1 && item <= pageCount).sort((a, b) => a - b);
  const hasFilters = Boolean(query || status !== "all" || deleted !== "all" || from || to || dateField !== "signedUp");
  const reset = () => { setQuery(""); setStatus("all"); setDeleted("all"); setDateField("signedUp"); setFrom(""); setTo(""); setPage(1); };
  const csvCell = (cell: string | number | boolean) => `"${String(cell).replaceAll('"', '""')}"`;
  const downloadCsv = (includePi: boolean) => {
    const headings = includePi ? ["User ID", "Name", "Mobile", "Email", "Status", "Deleted", "Re-registered", "Last Login IP", "Last Login User Agent", "Last Login At", "Signed Up", "Deleted At", "City", "Source", "Wallet"] : ["User ID", "Status", "Deleted", "Re-registered", "Last Login At", "Signed Up", "Deleted At", "City", "Source", "Wallet"];
    const values = filtered.map((row) => includePi ? [row.id, row.name, row.phone, row.email, row.status, row.deleted ? "Yes" : "No", row.reRegistered ? "Yes" : "No", row.lastLoginIp, row.lastLoginAgent, row.lastLoginAt, row.signedUp, row.deletedAt, row.city, row.source, row.wallet] : [row.id, row.status, row.deleted ? "Yes" : "No", row.reRegistered ? "Yes" : "No", row.lastLoginAt, row.signedUp, row.deletedAt, row.city, row.source, row.wallet]);
    const csv = [headings, ...values].map((line) => line.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = includePi ? "offerpe-users-with-pi.csv" : "offerpe-users-without-pi.csv"; anchor.click(); URL.revokeObjectURL(url);
    toast.success(includePi ? "Users exported with PI data" : "Users exported without PI data", { description: `${filtered.length} filtered users downloaded.` });
  };
  const importUsers = (fileName: string) => toast.success("User import queued", { description: `${fileName} was staged for validation. Duplicate phone numbers will be rejected row-by-row.` });
  return <><PageHeader title="Users" description="High-density customer account list for identity, lifecycle, login, and deletion review." actions={<><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline"><Download />Export CSV<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56 border-border bg-card"><DropdownMenuItem onSelect={() => downloadCsv(true)}><Download />Download with PI data</DropdownMenuItem><DropdownMenuItem onSelect={() => downloadCsv(false)}><ShieldCheck />Download without PI data</DropdownMenuItem></DropdownMenuContent></DropdownMenu><Button onClick={() => setImportOpen(true)}><UploadCloud />Import Users</Button></>} />
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
      <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search users" className="w-full pl-9" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search by User ID, mobile number, or name…" /></div>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Status: {status === "all" ? "All" : status}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44 border-border bg-card"><DropdownMenuItem onSelect={() => { setStatus("all"); setPage(1); }}>Status: All</DropdownMenuItem><DropdownMenuItem onSelect={() => { setStatus("Active"); setPage(1); }}>Status: Active</DropdownMenuItem><DropdownMenuItem onSelect={() => { setStatus("Inactive"); setPage(1); }}>Status: Inactive</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Trash2 className="mr-2 h-4 w-4 text-muted-foreground" />Deleted: {deleted === "all" ? "All" : deleted === "yes" ? "Yes" : "No"}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-40 border-border bg-card"><DropdownMenuItem onSelect={() => { setDeleted("all"); setPage(1); }}>Deleted: All</DropdownMenuItem><DropdownMenuItem onSelect={() => { setDeleted("yes"); setPage(1); }}>Deleted: Yes</DropdownMenuItem><DropdownMenuItem onSelect={() => { setDeleted("no"); setPage(1); }}>Deleted: No</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />Date: {dateField === "lastLogin" ? "Last login" : dateField === "signedUp" ? "Sign up" : dateField === "deletedAt" ? "Deleted" : "Re-registered"}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52 border-border bg-card"><DropdownMenuItem onSelect={() => { setDateField("lastLogin"); setPage(1); }}>Last login date</DropdownMenuItem><DropdownMenuItem onSelect={() => { setDateField("signedUp"); setPage(1); }}>Sign up date</DropdownMenuItem><DropdownMenuItem onSelect={() => { setDateField("deletedAt"); setPage(1); }}>Deleted date</DropdownMenuItem><DropdownMenuItem onSelect={() => { setDateField("reRegisteredAt"); setPage(1); }}>Re-registered date</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
      <Input aria-label="From date" title="From date" type="date" value={from} onChange={(event) => { setFrom(event.target.value); setPage(1); }} className="w-full shrink-0 lg:w-38" />
      <Input aria-label="To date" title="To date" type="date" value={to} onChange={(event) => { setTo(event.target.value); setPage(1); }} className="w-full shrink-0 lg:w-38" />
      {hasFilters && <Button variant="ghost" size="sm" onClick={reset} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
    </div>
    <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar max-w-full overflow-x-auto"><table className="w-max min-w-520 border-separate border-spacing-0 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>{["User ID", "Name", "Mobile", "Email", "Status", "Deleted", "Re-registered", "City", "Source", "Wallet", "Last Login IP", "Last Login User Agent", "Last Login At", "Signed Up", "Deleted At"].map((label, index) => <th key={label} className={cn("sticky top-0 z-10 border-b border-border bg-muted/95 px-4 py-2 backdrop-blur", index === 0 && "left-0 z-30 shadow-sticky-left")}>{label === "Signed Up" ? <Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortDesc(!sortDesc)}>Signed Up {sortDesc ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}</Button> : label}</th>)}<th className="sticky right-0 top-0 z-30 border-b border-border bg-muted/95 pr-4 text-right backdrop-blur shadow-sticky-right">Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="group hover:bg-muted/50"><td className="sticky left-0 z-20 border-b border-border bg-card px-4 py-2 shadow-sticky-left group-hover:bg-muted"><span className="flex items-center gap-1 font-mono text-xs font-semibold">{row.id}<CopyButton value={row.id} /></span></td><td className="border-b border-border font-semibold">{row.name}</td><td className="border-b border-border font-mono text-xs"><span className="flex items-center gap-1">{row.phone}<CopyButton value={row.phone} /></span></td><td className="border-b border-border text-muted-foreground">{row.email}</td><td className="border-b border-border"><StatusBadge status={row.status} /></td><td className="border-b border-border"><span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", row.deleted ? "status-rejected" : "status-approved")}>{row.deleted ? "Yes" : "No"}</span></td><td className="border-b border-border"><span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", row.reRegistered ? "status-requested" : "bg-muted text-muted-foreground")}>{row.reRegistered ? "Yes" : "No"}</span></td><td className="border-b border-border">{row.city}</td><td className="border-b border-border"><span className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium">{row.source}</span></td><td className="border-b border-border font-semibold">{inr(row.wallet)}</td><td className="border-b border-border font-mono text-xs text-muted-foreground">{row.lastLoginIp}</td><td className="max-w-64 truncate border-b border-border text-xs text-muted-foreground" title={row.lastLoginAgent}>{row.lastLoginAgent}</td><td className="border-b border-border whitespace-nowrap text-xs font-medium">{row.lastLoginAt}</td><td className="border-b border-border whitespace-nowrap text-xs text-muted-foreground">{row.signedUp}</td><td className="border-b border-border whitespace-nowrap text-xs text-muted-foreground">{row.deletedAt}</td><td className="sticky right-0 z-20 border-b border-border bg-card pr-3 text-right shadow-sticky-right group-hover:bg-muted"><span className="inline-flex items-center"><IconButton className="h-7 w-7" label={`View ${row.id}`}><Eye className="h-3.5 w-3.5" /></IconButton><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`More actions for ${row.id}`}><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem><Eye />Open user</DropdownMenuItem><DropdownMenuItem><FileText />View ledger</DropdownMenuItem><DropdownMenuItem><MousePointerClick />View clicks</DropdownMenuItem></DropdownMenuContent></DropdownMenu></span></td></tr>)}</tbody></table>{!rows.length && <div className="px-6 py-14 text-center"><Users className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">No users found</h3><p className="mt-1 text-sm text-muted-foreground">Try changing or resetting the current filters.</p></div>}</div></div>
    <div className="mt-4 grid gap-4 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><div className="flex min-w-0 flex-wrap items-center gap-4"><span>Showing <strong className="text-foreground">{filtered.length ? start + 1 : 0}</strong> to <strong className="text-foreground">{Math.min(start + pageSize, filtered.length)}</strong> of <strong className="text-foreground">{filtered.length}</strong> users</span><div className="flex shrink-0 items-center gap-2"><span>Rows per page</span><Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}><SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger><SelectContent>{[10, 25, 50, 100].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select></div></div><div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-1 lg:justify-end"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft />Previous</Button>{pageItems.map((item, index) => { const previous = pageItems[index - 1]; return <span key={item} className="contents">{previous !== undefined && item - previous > 1 && <span className="px-1">…</span>}<Button variant={item === currentPage ? "default" : "outline"} size="icon" className="h-8 w-8 shrink-0" onClick={() => setPage(item)} aria-current={item === currentPage ? "page" : undefined}>{item}</Button></span>; })}<Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight /></Button></div></div>
    <UserImportDialog open={importOpen} onOpenChange={setImportOpen} onImport={importUsers} />
  </>;
}


function permissionDescription(key: string) {
  const [resource = "", action = ""] = key.split(".");
  const resourceLabel = resource.replaceAll("_", " ").replace(/\b\w/g, (match) => match.toUpperCase());
  const actionText: Record<string, string> = {
    ADD: "Create new records and start setup workflows.",
    EDIT: "Update records, review decisions, or operational settings.",
    VIEW: "Open the screen and inspect records without making changes.",
    DELETE: "Remove records or revoke access after confirmation.",
    IMPORT: "Upload CSV or network data for bulk processing.",
    EXPORT: "Download filtered records for reconciliation or reporting.",
  };
  return `${actionText[action] ?? "Manage this access area."} Scope: ${resourceLabel}.`;
}

function AddRoleDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (v: boolean) => void; onCreate: (role: AdminRole) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const close = (nextOpen: boolean) => { onOpenChange(nextOpen); if (!nextOpen) { setName(""); setDescription(""); } };
  return <Dialog open={open} onOpenChange={close}><DialogContent className="max-w-xl bg-card"><DialogHeader><DialogTitle className="font-heading text-xl">Create role</DialogTitle><DialogDescription>Create the role first, then assign permissions on the full edit screen.</DialogDescription></DialogHeader><div className="grid gap-5"><label className="space-y-1.5 text-sm font-medium">Name <span className="text-destructive">*</span><Input aria-label="Role name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Finance Reviewer" /></label><label className="space-y-1.5 text-sm font-medium">Description<Textarea aria-label="Role description" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Briefly describe who should receive this role…" /></label></div><DialogFooter><Button variant="destructiveSoft" onClick={() => close(false)}>Cancel</Button><Button disabled={!name.trim()} onClick={() => { onCreate({ id: `ROLE-${Date.now()}`, name: name.trim(), description: description.trim() || "Custom admin role. Configure permissions before assigning admins.", permissions: [], admins: 0, system: false, updated: "21 Sep 2026, 7:06 pm" }); close(false); }}><Plus />Create role</Button></DialogFooter></DialogContent></Dialog>;
}

function RolesPage({ roles, onCreate, onEdit, onDelete }: { roles: AdminRole[]; onCreate: (role: AdminRole) => void; onEdit: (role: AdminRole) => void; onDelete: (role: AdminRole) => void }) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"all" | "system" | "custom">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [addOpen, setAddOpen] = useState(false);
  const search = query.toLowerCase();
  const rows = roles.filter((role) => (!search || `${role.name} ${role.description}`.toLowerCase().includes(search)) && (scope === "all" || (scope === "system") === role.system));
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const visibleRows = rows.slice(start, start + pageSize);
  const pageItems = Array.from(new Set([1, currentPage - 1, currentPage, currentPage + 1, pageCount])).filter((item) => item >= 1 && item <= pageCount).sort((a, b) => a - b);
  const hasFilters = Boolean(query || scope !== "all");
  return <><PageHeader title="Roles" description="Compact role list with permission counts, admin assignments, and full-page editing for complex access control." actions={<Button onClick={() => setAddOpen(true)}><Plus />Add new</Button>} />
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
      <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="w-full pl-9" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search role name or description…" /></div>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />Type: {scope === "all" ? "All" : scope === "system" ? "System" : "Custom"}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44 border-border bg-card"><DropdownMenuItem onSelect={() => { setScope("all"); setPage(1); }}>Type: All</DropdownMenuItem><DropdownMenuItem onSelect={() => { setScope("system"); setPage(1); }}>Type: System</DropdownMenuItem><DropdownMenuItem onSelect={() => { setScope("custom"); setPage(1); }}>Type: Custom</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
      {hasFilters && <Button variant="ghost" size="sm" onClick={() => { setQuery(""); setScope("all"); setPage(1); }} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
    </div>
    <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar max-w-full overflow-x-auto"><table className="w-max min-w-260 border-separate border-spacing-0 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>{["Role", "Description", "Permissions", "Admins", "Type", "Last Updated"].map((label, index) => <th key={label} className={cn("sticky top-0 z-10 border-b border-border bg-muted/95 px-4 py-2 backdrop-blur", index === 0 && "left-0 z-30 shadow-sticky-left")}>{label}</th>)}<th className="sticky right-0 top-0 z-30 border-b border-border bg-muted/95 pr-4 text-right backdrop-blur shadow-sticky-right">Actions</th></tr></thead><tbody>{visibleRows.map((role) => <tr key={role.id} className="group hover:bg-muted/50"><td className="sticky left-0 z-20 border-b border-border bg-card px-4 py-2 shadow-sticky-left group-hover:bg-muted"><span className="flex items-center gap-2 font-heading font-bold">{role.name}{role.system && <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">System</span>}</span></td><td className="max-w-160 truncate border-b border-border text-muted-foreground" title={role.description}>{role.description}</td><td className="border-b border-border"><span className="font-heading text-lg font-bold text-foreground">{role.permissions.length}</span><span className="ml-1 text-xs text-muted-foreground">of {allPermissionKeys.length}</span></td><td className="border-b border-border font-semibold">{role.admins}</td><td className="border-b border-border"><span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", role.system ? "bg-info-soft text-info" : "status-active")}>{role.system ? "Locked" : "Editable"}</span></td><td className="whitespace-nowrap border-b border-border text-xs text-muted-foreground">{role.updated}</td><td className="sticky right-0 z-20 border-b border-border bg-card pr-3 text-right shadow-sticky-right group-hover:bg-muted"><span className="inline-flex items-center"><IconButton className="h-7 w-7" label={`Edit ${role.name}`} onClick={() => onEdit(role)}><Pencil className="h-3.5 w-3.5" /></IconButton>{!role.system && <ConfirmDeleteDialog itemType="Role" name={role.name} onConfirm={() => onDelete(role)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete ${role.name}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog>}</span></td></tr>)}</tbody></table>{!visibleRows.length && <div className="px-6 py-14 text-center"><ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">No roles found</h3><p className="mt-1 text-sm text-muted-foreground">Try changing or resetting the current filters.</p></div>}</div></div>
    <div className="mt-4 grid gap-4 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><div className="flex min-w-0 flex-wrap items-center gap-4"><span>Showing <strong className="text-foreground">{rows.length ? start + 1 : 0}</strong> to <strong className="text-foreground">{Math.min(start + pageSize, rows.length)}</strong> of <strong className="text-foreground">{rows.length}</strong> roles</span><div className="flex shrink-0 items-center gap-2"><span>Rows per page</span><Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}><SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger><SelectContent>{[10, 25, 50].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select></div></div><div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-1 lg:justify-end"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft />Previous</Button>{pageItems.map((item) => <Button key={item} variant={item === currentPage ? "default" : "outline"} size="icon" className="h-8 w-8 shrink-0" onClick={() => setPage(item)} aria-current={item === currentPage ? "page" : undefined}>{item}</Button>)}<Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight /></Button></div></div>
    <AddRoleDialog open={addOpen} onOpenChange={setAddOpen} onCreate={(role) => { onCreate(role); setAddOpen(false); }} />
  </>;
}

function RoleEditPage({ role, onCancel, onSave, onDelete }: { role: AdminRole; onCancel: () => void; onSave: (role: AdminRole) => void; onDelete: (role: AdminRole) => void }) {
  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description);
  const [permissions, setPermissions] = useState<string[]>(role.permissions);
  const [activeGroup, setActiveGroup] = useState<PermissionGroupName>("Catalog");
  const [query, setQuery] = useState("");
  const locked = role.system;
  const search = query.toLowerCase();
  const selectedCount = permissions.length;
  const visibleGroupPermissions = (group: PermissionGroupName) => permissionCatalog[group].filter((permission) => !search || `${permission.key} ${permissionDescription(permission.key)}`.toLowerCase().includes(search));
  const groupSelectedCount = (group: PermissionGroupName) => permissionCatalog[group].filter((permission) => permissions.includes(permission.key)).length;
  const togglePermission = (key: string) => setPermissions((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  const setGroupPermissions = (group: PermissionGroupName, checked: boolean) => {
    const groupKeys = permissionCatalog[group].map((permission) => permission.key);
    setPermissions((current) => checked ? Array.from(new Set([...current, ...groupKeys])) : current.filter((key) => !groupKeys.includes(key)));
  };
  const save = () => { onSave({ ...role, name: name.trim(), description: description.trim(), permissions, updated: "21 Sep 2026, 7:06 pm" }); toast.success("Role permissions saved", { description: `${name.trim()} now has ${permissions.length} permissions.` }); };
  return <><div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><button type="button" onClick={onCancel} className="font-medium text-primary hover:underline">Roles</button><ChevronRight className="h-4 w-4" /><span>{role.name}</span><ChevronRight className="h-4 w-4" /><span className="text-foreground">Edit</span></div><PageHeader title={role.system ? `View role: ${role.name}` : `Edit role: ${role.name}`} description="Permissions are grouped by admin area, searchable, and paired with generated descriptions so admins can understand each grant before saving." actions={!locked && <ConfirmDeleteDialog itemType="Role" name={role.name} onConfirm={() => onDelete(role)}><Button variant="destructive"><Trash2 />Delete</Button></ConfirmDeleteDialog>} />
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-5">
        <section className="rounded-lg border border-border bg-card p-5 shadow-card"><div className="grid gap-5 lg:grid-cols-[minmax(260px,360px)_1fr]"><label className="space-y-1.5 text-sm font-medium">Name <span className="text-destructive">*</span><Input aria-label="Role name" value={name} onChange={(event) => setName(event.target.value)} readOnly={locked} className={cn(locked && "bg-muted text-muted-foreground")} /></label><label className="space-y-1.5 text-sm font-medium">Description<Textarea aria-label="Role description" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} readOnly={locked} className={cn(locked && "bg-muted text-muted-foreground")} /></label></div>{locked && <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"><Lock className="h-4 w-4" />System roles are view-only in this playground.</div>}</section>
        <section className="rounded-lg border border-border bg-card shadow-card"><div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:flex-wrap lg:items-center"><div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => { const value = event.target.value; setQuery(value); const nextGroup = (Object.keys(permissionCatalog) as PermissionGroupName[]).find((group) => permissionCatalog[group].some((permission) => `${permission.key} ${permissionDescription(permission.key)}`.toLowerCase().includes(value.toLowerCase()))); if (value && nextGroup) setActiveGroup(nextGroup); }} className="pl-9" placeholder="Search permissions or descriptions…" /></div><Button variant="outline" className="shrink-0" disabled={locked} onClick={() => setGroupPermissions(activeGroup, true)}><Check />Select group</Button><Button variant="outline" className="shrink-0" disabled={locked} onClick={() => setGroupPermissions(activeGroup, false)}><X />Clear group</Button>{query && <Button variant="ghost" size="sm" onClick={() => setQuery("")}><RotateCcw />Reset</Button>}</div><Tabs value={activeGroup} onValueChange={(value) => setActiveGroup(value as PermissionGroupName)}><TabsList className="h-auto w-full justify-start gap-6 overflow-x-auto rounded-none border-b border-border bg-transparent px-4 py-0">{(Object.keys(permissionCatalog) as PermissionGroupName[]).map((group) => <TabsTrigger key={group} value={group} className={tabTriggerClass}>{group}<span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">{groupSelectedCount(group)}/{permissionCatalog[group].length}</span></TabsTrigger>)}</TabsList>{(Object.keys(permissionCatalog) as PermissionGroupName[]).map((group) => { const groupPermissions = visibleGroupPermissions(group); return <TabsContent key={group} value={group} className="m-0"><div className="grid gap-2 p-4 md:grid-cols-2 xl:grid-cols-3">{groupPermissions.map((permission) => { const checked = permissions.includes(permission.key); return <label key={permission.key} className={cn("flex min-h-20 cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/60", checked && "border-primary bg-accent", locked && "cursor-default opacity-80")}><Checkbox checked={checked} disabled={locked} onCheckedChange={() => togglePermission(permission.key)} aria-label={permission.key} className="mt-1" /><span className="min-w-0"><span className="block break-words font-mono text-xs font-bold text-foreground">{permission.key}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{permissionDescription(permission.key)}</span></span></label>; })}</div>{!groupPermissions.length && <div className="px-6 py-14 text-center"><ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">No permissions found</h3><p className="mt-1 text-sm text-muted-foreground">Try a different permission search.</p></div>}</TabsContent>; })}</Tabs></section>
      </div>
      <aside className="h-fit rounded-lg border border-border bg-card p-4 shadow-card xl:sticky xl:top-6"><h2 className="font-heading text-base font-bold">Permission summary</h2><p className="mt-1 text-sm text-muted-foreground">{selectedCount} of {allPermissionKeys.length} permissions selected</p><div className="mt-4 space-y-3">{(Object.keys(permissionCatalog) as PermissionGroupName[]).map((group) => { const count = groupSelectedCount(group); const total = permissionCatalog[group].length; return <button key={group} type="button" onClick={() => setActiveGroup(group)} className={cn("w-full rounded-md border border-border p-3 text-left hover:bg-muted/60", activeGroup === group && "border-primary bg-accent")}><span className="flex items-center justify-between gap-3 text-sm font-semibold"><span>{group}</span><span>{count}/{total}</span></span><span className="mt-2 block h-1.5 rounded-full bg-muted"><span className="block h-1.5 rounded-full bg-primary" style={{ width: `${Math.round((count / total) * 100)}%` }} /></span></button>; })}</div></aside>
    </div>
    <div className="sticky bottom-0 z-20 mt-6 flex justify-end gap-2 border-t border-border bg-background/95 py-4 backdrop-blur"><Button variant="destructiveSoft" onClick={onCancel}>Cancel</Button><Button disabled={locked || !name.trim()} onClick={save}><Check />Save permissions</Button></div>
  </>;
}

function DeliveryBadge({ delivery }: { delivery: DispatchDelivery }) {
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold", delivery === "DELIVERED" || delivery === "SENT" ? "status-approved" : delivery === "FAILED" ? "status-rejected" : "status-pending")}>{delivery}</span>;
}

function JsonPropertiesDialog({ title, properties }: { title: string; properties: Record<string, string | number> }) {
  return <Dialog><DialogTrigger asChild><Button variant="link" size="sm" className="h-auto p-0 font-semibold text-info">View JSON</Button></DialogTrigger><DialogContent className="max-w-lg bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">{title}</DialogTitle><DialogDescription>Recorded event properties for this row.</DialogDescription></DialogHeader><pre className="max-h-80 overflow-auto rounded-lg border border-border bg-muted p-4 font-mono text-xs leading-5 text-foreground">{JSON.stringify(properties, null, 2)}</pre></DialogContent></Dialog>;
}

function CommunicationLogs() {
  const [tab, setTab] = useState<CommunicationTab>("analytics");
  const [query, setQuery] = useState("");
  const [eventGroup, setEventGroup] = useState("all");
  const [channel, setChannel] = useState<TemplateChannel | "all">("all");
  const [delivery, setDelivery] = useState<DispatchDelivery | "all">("all");
  const [read, setRead] = useState<"all" | "Yes" | "No">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const search = query.toLowerCase();
  const inDateRange = (date: string) => (!from || date >= from) && (!to || date <= to);
  const analyticsRows = analyticsEvents.filter((row) => (!search || `${row.event} ${row.screen} ${row.userId} ${row.session}`.toLowerCase().includes(search)) && (eventGroup === "all" || row.group === eventGroup) && inDateRange(row.date)).sort((a, b) => sortDesc ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));
  const dispatchRows = communicationDispatches.filter((row) => (!search || `${row.type} ${row.template} ${row.title} ${row.body} ${row.userId}`.toLowerCase().includes(search)) && (channel === "all" || row.channel === channel) && (delivery === "all" || row.delivery === delivery) && (read === "all" || row.read === read) && inDateRange(row.date)).sort((a, b) => sortDesc ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));
  const notificationRows = notificationLogs.filter((row) => (!search || `${row.type} ${row.title} ${row.body} ${row.userId} ${row.session}`.toLowerCase().includes(search)) && (delivery === "all" || row.delivery === delivery) && (read === "all" || row.read === read) && inDateRange(row.date)).sort((a, b) => sortDesc ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));
  const count = tab === "analytics" ? analyticsRows.length : tab === "dispatches" ? dispatchRows.length : notificationRows.length;
  const reset = () => { setQuery(""); setEventGroup("all"); setChannel("all"); setDelivery("all"); setRead("all"); setFrom(""); setTo(""); };
  const hasFilters = Boolean(query || eventGroup !== "all" || channel !== "all" || delivery !== "all" || read !== "all" || from || to);
  const csvCell = (cell: string | number | null) => `"${String(cell ?? "").replaceAll('"', '""')}"`;
  const exportRows = () => {
    const rows = tab === "analytics"
      ? [["Event", "Screen", "User ID", "Properties", "Session", "Occurred"], ...analyticsRows.map((row) => [row.event, row.screen, row.userId, row.properties ? JSON.stringify(row.properties) : "", row.session, row.occurred])]
      : tab === "dispatches"
        ? [["Type", "Template", "Channel", "Title", "Body", "Read", "Delivery", "User ID", "Occurred"], ...dispatchRows.map((row) => [row.type, row.template, row.channel, row.title, row.body, row.read, row.delivery, row.userId, row.occurred])]
        : [["Type", "Title", "Body", "Read", "Delivery", "User ID", "Session", "Occurred"], ...notificationRows.map((row) => [row.type, row.title, row.body, row.read, row.delivery, row.userId, row.session, row.occurred])];
    const csv = rows.map((line) => line.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `offerpe-${tab}.csv`; anchor.click(); URL.revokeObjectURL(url);
    toast.success("Export ready", { description: `${count} ${tab === "analytics" ? "events" : tab === "dispatches" ? "dispatches" : "notifications"} downloaded as CSV.` });
  };
  return <><PageHeader title="Dispatches & Notifications" description="High-density audit tables for app analytics events, outbound communication dispatches, and delivered notification records." />
    <Tabs value={tab} onValueChange={(value) => { setTab(value as CommunicationTab); reset(); }}>
      <TabsList className="mb-5 h-auto w-full justify-start gap-6 overflow-x-auto rounded-none border-b border-border bg-transparent p-0"><TabsTrigger value="analytics" className={tabTriggerClass}>Analytics Events</TabsTrigger><TabsTrigger value="dispatches" className={tabTriggerClass}>Communication Dispatches</TabsTrigger><TabsTrigger value="notifications" className={tabTriggerClass}>Notifications</TabsTrigger></TabsList>
      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tab === "analytics" ? "Search event, screen, User ID, or session…" : "Search type, title, body, template, or User ID…"} /></div>
        {tab === "analytics" && <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Group: {eventGroup === "all" ? "All" : eventGroup}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48 border-border bg-card"><DropdownMenuItem onSelect={() => setEventGroup("all")}>Group: All</DropdownMenuItem>{["Session", "Screen", "Action", "Engagement"].map((item) => <DropdownMenuItem key={item} onSelect={() => setEventGroup(item)}>Group: {item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
        {tab === "dispatches" && <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />Channel: {channel === "all" ? "All" : channel}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52 border-border bg-card"><DropdownMenuItem onSelect={() => setChannel("all")}>Channel: All</DropdownMenuItem>{templateChannels.map((item) => <DropdownMenuItem key={item} onSelect={() => setChannel(item)}>Channel: {item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
        {tab !== "analytics" && <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Delivery: {delivery === "all" ? "All" : delivery}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48 border-border bg-card"><DropdownMenuItem onSelect={() => setDelivery("all")}>Delivery: All</DropdownMenuItem>{["SENT", "DELIVERED", "FAILED", "QUEUED"].map((item) => <DropdownMenuItem key={item} onSelect={() => setDelivery(item as DispatchDelivery)}>Delivery: {item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
        {tab !== "analytics" && <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0">Read: {read}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-36 border-border bg-card"><DropdownMenuItem onSelect={() => setRead("all")}>Read: all</DropdownMenuItem><DropdownMenuItem onSelect={() => setRead("Yes")}>Read: Yes</DropdownMenuItem><DropdownMenuItem onSelect={() => setRead("No")}>Read: No</DropdownMenuItem></DropdownMenuContent></DropdownMenu>}
        <Input aria-label="From date" title="From date" type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="w-full shrink-0 lg:w-38" />
        <Input aria-label="To date" title="To date" type="date" value={to} onChange={(event) => setTo(event.target.value)} className="w-full shrink-0 lg:w-38" />
        {hasFilters && <Button variant="ghost" size="sm" onClick={reset} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
        <Button variant="outline" size="sm" className="shrink-0" onClick={exportRows}><Download className="mr-1 h-3.5 w-3.5" />Export CSV</Button>
      </div>
      <TabsContent value="analytics" className="mt-0"><div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-320 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>{["Event", "Screen", "User ID", "Properties", "Session", "Occurred"].map((label) => <th key={label} className="sticky top-0 border-b border-border bg-muted/95 py-2 backdrop-blur">{label === "Occurred" ? <Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortDesc(!sortDesc)}>Occurred {sortDesc ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}</Button> : label}</th>)}</tr></thead><tbody>{analyticsRows.map((row) => <tr key={row.id} className="border-t border-border hover:bg-muted/50"><td className="font-mono text-xs font-semibold">{row.event}</td><td className="font-semibold">{row.screen}</td><td className="font-mono text-xs text-muted-foreground">{row.userId}</td><td>{row.properties ? <JsonPropertiesDialog title={row.event} properties={row.properties} /> : <span className="text-muted-foreground">—</span>}</td><td className="font-mono text-xs text-muted-foreground">{row.session}</td><td className="whitespace-nowrap text-xs font-semibold">{row.occurred}</td></tr>)}</tbody></table>{!analyticsRows.length && <EmptyCommunicationState />}</div></div><TransactionPagination count={analyticsRows.length} /></TabsContent>
      <TabsContent value="dispatches" className="mt-0"><div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-390 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>{["Type", "Template", "Channel", "Title", "Body", "Read", "Delivery", "User ID", "Occurred"].map((label) => <th key={label} className="sticky top-0 border-b border-border bg-muted/95 py-2 backdrop-blur">{label === "Occurred" ? <Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortDesc(!sortDesc)}>Occurred {sortDesc ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}</Button> : label}</th>)}</tr></thead><tbody>{dispatchRows.map((row) => <tr key={row.id} className="border-t border-border hover:bg-muted/50"><td className="font-mono text-xs font-semibold">{row.type}</td><td>{row.template}</td><td><span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">{row.channel}</span></td><td className="font-semibold">{row.title}</td><td className="max-w-150 truncate text-muted-foreground" title={row.body}>{row.body}</td><td>{row.read}</td><td><DeliveryBadge delivery={row.delivery} /></td><td className="font-mono text-xs text-muted-foreground">{row.userId}</td><td className="whitespace-nowrap text-xs font-semibold">{row.occurred}</td></tr>)}</tbody></table>{!dispatchRows.length && <EmptyCommunicationState />}</div></div><TransactionPagination count={dispatchRows.length} /></TabsContent>
      <TabsContent value="notifications" className="mt-0"><div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-360 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>{["Type", "Title", "Body", "Read", "Delivery", "User ID", "Session", "Occurred"].map((label) => <th key={label} className="sticky top-0 border-b border-border bg-muted/95 py-2 backdrop-blur">{label === "Occurred" ? <Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortDesc(!sortDesc)}>Occurred {sortDesc ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}</Button> : label}</th>)}</tr></thead><tbody>{notificationRows.map((row) => <tr key={row.id} className="border-t border-border hover:bg-muted/50"><td className="font-mono text-xs font-semibold">{row.type}</td><td className="font-semibold">{row.title}</td><td className="max-w-150 truncate text-muted-foreground" title={row.body}>{row.body}</td><td>{row.read}</td><td><DeliveryBadge delivery={row.delivery} /></td><td className="font-mono text-xs text-muted-foreground">{row.userId}</td><td className="font-mono text-xs text-muted-foreground">{row.session}</td><td className="whitespace-nowrap text-xs font-semibold">{row.occurred}</td></tr>)}</tbody></table>{!notificationRows.length && <EmptyCommunicationState />}</div></div><TransactionPagination count={notificationRows.length} /></TabsContent>
    </Tabs>
  </>;
}

function EmptyCommunicationState() {
  return <div className="px-6 py-14 text-center"><Bell className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">No records found</h3><p className="mt-1 text-sm text-muted-foreground">Try changing or resetting the current filters.</p></div>;
}

function CommunicationTemplates({ templates, onChange }: { templates: CommunicationTemplate[]; onChange: (template: CommunicationTemplate) => void }) {
  const [selectedId, setSelectedId] = useState(templates[0]?.id ?? "");
  const [channel, setChannel] = useState<TemplateChannel>("Email");
  const selected = templates.find((template) => template.id === selectedId) ?? templates[0];
  const channelMeta: Record<TemplateChannel, { icon: React.ElementType; description: string }> = {
    Email: { icon: Mail, description: "Long-form subject and body copy for inbox delivery." },
    SMS: { icon: MessageSquare, description: "Short transactional text optimised for quick reading." },
    WhatsApp: { icon: MessageSquare, description: "Conversational copy used by the WhatsApp sender." },
    Notification: { icon: Bell, description: "In-app and push notification title and body." },
  };
  if (!selected) return null;
  const save = () => toast.success("Template saved", { description: `${selected.name} · ${channel} copy was updated.` });
  return <><PageHeader title="Communication Templates" description="Manage event-based customer copy by template and channel without scanning four separate cards at once." actions={<Button variant="outline"><Download />Export templates</Button>} />
    <section className="mb-5 rounded-lg border border-border bg-card p-4 shadow-card">
      <div className="grid gap-4 lg:grid-cols-[minmax(280px,420px)_1fr] lg:items-start">
        <label className="space-y-1.5 text-sm font-medium">Template name<Select value={selected.id} onValueChange={(value) => { setSelectedId(value); setChannel("Email"); }}><SelectTrigger className="h-10"><SelectValue /></SelectTrigger><SelectContent>{templates.map((template) => <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>)}</SelectContent></Select></label>
        <div className="rounded-lg border border-border bg-muted/40 p-3"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-semibold text-muted-foreground">{selected.event}</span><span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">{selected.trigger}</span></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{selected.description}</p></div>
      </div>
      <div className="mt-4 border-t border-border pt-4"><div className="mb-2 text-xs font-bold uppercase text-muted-foreground">Available variables</div>{selected.variables.length ? <div className="flex flex-wrap gap-2">{selected.variables.map((variable) => <span key={variable} className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-mono text-xs font-semibold text-foreground shadow-card">{variable}<CopyButton value={variable} /></span>)}</div> : <p className="text-sm text-muted-foreground">No variables — nothing fires this event yet.</p>}</div>
    </section>
    <Tabs value={channel} onValueChange={(value) => setChannel(value as TemplateChannel)}>
      <TabsList className="mb-5 h-auto w-full justify-start gap-6 overflow-x-auto rounded-none border-b border-border bg-transparent p-0">{templateChannels.map((item) => { const Icon = channelMeta[item].icon; const copy = selected.channels[item]; return <TabsTrigger key={item} value={item} className={tabTriggerClass}><span className="inline-flex items-center gap-2"><Icon className="h-4 w-4" />{item}<span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold", copy.enabled ? "bg-success-soft text-success" : "bg-muted text-muted-foreground")}>{copy.enabled ? "On" : "Off"}</span></span></TabsTrigger>; })}</TabsList>
      {templateChannels.map((item) => { const Icon = channelMeta[item].icon; const itemCopy = selected.channels[item]; const updateItemCopy = <K extends keyof TemplateCopy>(key: K, value: TemplateCopy[K]) => onChange({ ...selected, channels: { ...selected.channels, [item]: { ...itemCopy, [key]: value } } }); return <TabsContent key={item} value={item} className="mt-0"><section className="rounded-lg border border-border bg-card shadow-card"><div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-primary"><Icon className="h-4 w-4" /></span><h2 className="font-heading text-base font-bold">{item} copy</h2></div><p className="mt-2 text-sm text-muted-foreground">{channelMeta[item].description}</p></div><label className="flex items-center gap-2 text-sm font-semibold"><Switch checked={itemCopy.enabled} onCheckedChange={(checked) => updateItemCopy("enabled", checked)} aria-label={`${item} enabled`} />Enabled</label></div><div className="grid gap-5 p-5">{(item === "Email" || item === "Notification") && <label className="space-y-1.5 text-sm font-medium">{item === "Email" ? "Subject" : "Title"}<Input value={itemCopy.subject ?? ""} onChange={(event) => updateItemCopy("subject", event.target.value)} placeholder={item === "Email" ? "Email subject" : "Notification title"} /></label>}<label className="space-y-1.5 text-sm font-medium">Body template<Textarea className="min-h-48 leading-6" value={itemCopy.body} onChange={(event) => updateItemCopy("body", event.target.value)} placeholder="Write copy using the variables above…" /></label><div className="rounded-lg border border-border bg-muted/40 p-4"><div className="mb-2 text-xs font-bold uppercase text-muted-foreground">Preview</div>{itemCopy.subject && <p className="font-heading text-base font-bold">{itemCopy.subject}</p>}<p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">{itemCopy.body}</p></div></div><div className="flex justify-end gap-2 border-t border-border px-5 py-4"><Button variant="destructiveSoft" onClick={() => toast.info("Changes kept on screen", { description: "No live dispatch settings were changed in this playground." })}>Cancel</Button><Button onClick={save}><Check />Save</Button></div></section></TabsContent>; })}
    </Tabs>
  </>;
}

type AppBuild = { id: string; app: "Consumer" | "Merchant"; platform: "iOS" | "Android"; minVersion: string; latestVersion: string; message: string; storeUrl: string; forceUpdate: boolean; updatedAt: string; updatedBy: string };

const initialAppBuilds: AppBuild[] = [
  { id: "consumer-ios", app: "Consumer", platform: "iOS", minVersion: "3.4.0", latestVersion: "3.6.2", message: "A new OfferPe update is ready with faster cashback tracking. Please update to continue.", storeUrl: "https://apps.apple.com/in/app/offerpe/id6478123456", forceUpdate: true, updatedAt: "18 Sep 2026, 11:42 AM", updatedBy: "Qaisar Farooq" },
  { id: "consumer-android", app: "Consumer", platform: "Android", minVersion: "3.4.0", latestVersion: "3.6.1", message: "Update OfferPe to keep earning cashback without interruptions.", storeUrl: "https://play.google.com/store/apps/details?id=com.offerpe.consumer", forceUpdate: true, updatedAt: "18 Sep 2026, 11:44 AM", updatedBy: "Qaisar Farooq" },
  { id: "merchant-ios", app: "Merchant", platform: "iOS", minVersion: "2.1.0", latestVersion: "2.3.0", message: "New billing and settlement screens are available in this release.", storeUrl: "", forceUpdate: false, updatedAt: "02 Sep 2026, 04:10 PM", updatedBy: "Test Admin" },
  { id: "merchant-android", app: "Merchant", platform: "Android", minVersion: "2.1.0", latestVersion: "2.3.0", message: "New billing and settlement screens are available in this release.", storeUrl: "https://play.google.com/store/apps/details?id=com.offerpe.merchant", forceUpdate: false, updatedAt: "02 Sep 2026, 04:12 PM", updatedBy: "Test Admin" },
];

const semverPattern = /^\d+\.\d+\.\d+$/;
function compareVersions(a: string, b: string) {
  const left = a.split(".").map(Number); const right = b.split(".").map(Number);
  for (let index = 0; index < 3; index += 1) { const diff = (left[index] ?? 0) - (right[index] ?? 0); if (diff !== 0) return diff; }
  return 0;
}

function AppVersionCard({ build, onSave }: { build: AppBuild; onSave: (build: AppBuild) => void }) {
  const [draft, setDraft] = useState(build);
  const dirty = JSON.stringify(draft) !== JSON.stringify(build);
  const update = <K extends keyof AppBuild>(key: K, value: AppBuild[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const minValid = semverPattern.test(draft.minVersion);
  const latestValid = semverPattern.test(draft.latestVersion);
  const orderValid = !minValid || !latestValid || compareVersions(draft.minVersion, draft.latestVersion) <= 0;
  const canSave = dirty && minValid && latestValid && orderValid;
  const blocking = draft.forceUpdate && minValid && latestValid;

  return <section className="flex flex-col rounded-lg border border-border bg-card shadow-card">
    <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-primary"><Smartphone className="h-4 w-4" /></span>
        <div>
          <h2 className="font-heading text-sm font-bold uppercase tracking-wide">{build.app} — {build.platform}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Live: v{build.latestVersion} · minimum v{build.minVersion}</p>
        </div>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${blocking ? "status-rejected" : "status-active"}`}>{blocking ? "Force update" : "Soft prompt"}</span>
    </div>
    <div className="grid gap-4 p-5 sm:grid-cols-2">
      <label className="space-y-1.5 text-sm font-medium">Minimum supported version <span className="text-destructive">*</span>
        <Input value={draft.minVersion} onChange={(event) => update("minVersion", event.target.value)} placeholder="1.0.0" aria-invalid={!minValid} />
        {!minValid && <span className="block text-xs font-normal text-destructive">Use a semantic version like 3.4.0</span>}
      </label>
      <label className="space-y-1.5 text-sm font-medium">Latest version <span className="text-destructive">*</span>
        <Input value={draft.latestVersion} onChange={(event) => update("latestVersion", event.target.value)} placeholder="1.0.0" aria-invalid={!latestValid} />
        {!latestValid && <span className="block text-xs font-normal text-destructive">Use a semantic version like 3.6.2</span>}
      </label>
      {!orderValid && <p className="sm:col-span-2 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"><AlertTriangle className="h-3.5 w-3.5" />Minimum version cannot be higher than the latest version.</p>}
      <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Update message (shown to the user)
        <Textarea className="min-h-24 leading-6" maxLength={240} value={draft.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell users why they should update…" />
        <span className="block text-right text-xs font-normal text-muted-foreground">{draft.message.length}/240</span>
      </label>
      <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Store URL <span className="font-normal text-muted-foreground">(leave blank until a real store listing exists)</span>
        <Input value={draft.storeUrl} onChange={(event) => update("storeUrl", event.target.value)} placeholder="https://…" />
      </label>
      <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-3 py-2.5 sm:col-span-2">
        <div>
          <p className="text-sm font-semibold">Block older builds</p>
          <p className="text-xs text-muted-foreground">Users below v{draft.minVersion || "—"} see a full-screen prompt they cannot dismiss.</p>
        </div>
        <Switch checked={draft.forceUpdate} onCheckedChange={(checked) => update("forceUpdate", checked)} aria-label={`Block older ${build.app} ${build.platform} builds`} />
      </div>
      <div className="sm:col-span-2 rounded-lg border border-border bg-muted/40 p-4">
        <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">In-app preview</div>
        <p className="font-heading text-sm font-bold">{blocking ? "Update required" : "Update available"}</p>
        <p className="mt-1 text-sm leading-6 text-foreground">{draft.message || "No update message set."}</p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Update now</span>
          {!blocking && <span className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground">Later</span>}
        </div>
      </div>
    </div>
    <div className="mt-auto flex flex-col gap-2 border-t border-border px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">Last updated {build.updatedAt} by {build.updatedBy}</p>
      <div className="flex gap-2">
        <Button variant="destructiveSoft" disabled={!dirty} onClick={() => setDraft(build)}>Cancel</Button>
        <Button disabled={!canSave} onClick={() => { onSave({ ...draft, updatedAt: "21 Sep 2026, 07:47 PM", updatedBy: "Qaisar Farooq" }); toast.success(`${build.app} ${build.platform} versions saved`, { description: `Minimum v${draft.minVersion} · latest v${draft.latestVersion}.` }); }}><Check />Save</Button>
      </div>
    </div>
  </section>;
}

function AppVersionsPage({ builds, onSave }: { builds: AppBuild[]; onSave: (build: AppBuild) => void }) {
  const blockingCount = builds.filter((build) => build.forceUpdate).length;
  const missingStore = builds.filter((build) => !build.storeUrl).length;
  return <>
    <PageHeader title="App Versions" description="Checked by both apps at boot, before login. A minimum supported version above a user's installed build shows a full-screen prompt they cannot dismiss. A latest version above their build shows a dismissible banner instead." />
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      {[
        { label: "Build targets", value: `${builds.length}`, hint: "Consumer and Merchant apps across iOS and Android" },
        { label: "Forcing update", value: `${blockingCount}`, hint: "Older builds blocked at boot" },
        { label: "Store URL pending", value: `${missingStore}`, hint: "Update prompt has no store link yet" },
      ].map((stat) => <div key={stat.label} className="rounded-lg border border-border bg-card p-4 shadow-card">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
        <p className="mt-1 font-heading text-2xl font-bold">{stat.value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
      </div>)}
    </div>
    <div className="grid gap-5 xl:grid-cols-2">
      {builds.map((build) => <AppVersionCard key={build.id + build.updatedAt} build={build} onSave={onSave} />)}
    </div>
  </>;
}

function AdminUserDialog({ open, onOpenChange, admin, roles, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; admin: AdminUser | null; roles: AdminRole[]; onSave: (admin: AdminUser, isNew: boolean) => void }) {
  const isNew = !admin;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [ready, setReady] = useState(false);
  if (open && !ready) { setReady(true); setName(admin?.name ?? ""); setEmail(admin?.email ?? ""); setRole(admin?.role ?? ""); }
  const close = (nextOpen: boolean) => { onOpenChange(nextOpen); if (!nextOpen) setReady(false); };
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = Boolean(name.trim() && role && (isNew ? emailValid : true));
  return <Dialog open={open} onOpenChange={close}><DialogContent className="max-w-xl bg-card">
    <DialogHeader><DialogTitle className="font-heading text-xl">{isNew ? "Invite admin" : "Edit admin"}</DialogTitle><DialogDescription>{isNew ? "They'll receive an email invite to set their own password. Public email sign-up stays disabled for everyone else." : admin?.email}</DialogDescription></DialogHeader>
    <div className="grid gap-5">
      {isNew && <label className="space-y-1.5 text-sm font-medium">Email <span className="text-destructive">*</span><Input aria-label="Admin email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@offerpe.com" /></label>}
      <label className="space-y-1.5 text-sm font-medium">Full name <span className="text-destructive">*</span><Input aria-label="Admin full name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Neha Pillai" /></label>
      <div className="space-y-1.5 text-sm font-medium">Role <span className="text-destructive">*</span>
        <Select value={role} onValueChange={setRole}><SelectTrigger aria-label="Admin role"><SelectValue placeholder="Select a role" /></SelectTrigger><SelectContent>{roles.map((item) => <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select>
        {role && <p className="text-xs font-normal text-muted-foreground">{roles.find((item) => item.name === role)?.permissions.length ?? 0} of {allPermissionKeys.length} permissions granted by this role.</p>}
      </div>
    </div>
    <DialogFooter><Button variant="destructiveSoft" onClick={() => close(false)}>Cancel</Button><Button disabled={!canSubmit} onClick={() => { onSave({ id: admin?.id ?? `ADM-${String(Date.now()).slice(-4)}`, name: name.trim(), email: isNew ? email.trim() : admin!.email, role, status: admin?.status ?? "Invited", lastActive: admin?.lastActive ?? "—", created: admin?.created ?? "21 Sep 2026" }, isNew); close(false); }}>{isNew ? <><Mail />Send invite</> : <><Check />Save</>}</Button></DialogFooter>
  </DialogContent></Dialog>;
}

function AdminUsersPage({ admins, roles, onSave, onDelete }: { admins: AdminUser[]; roles: AdminRole[]; onSave: (admin: AdminUser, isNew: boolean) => void; onDelete: (admin: AdminUser) => void }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState<AdminUserStatus | "all">("all");
  const [sortDesc, setSortDesc] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const search = query.toLowerCase();
  const rows = admins
    .filter((admin) => (!search || `${admin.name} ${admin.email} ${admin.id}`.toLowerCase().includes(search)) && (role === "all" || admin.role === role) && (status === "all" || admin.status === status))
    .sort((a, b) => sortDesc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
  const hasFilters = Boolean(query || role !== "all" || status !== "all");
  const openInvite = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (admin: AdminUser) => { setEditing(admin); setDialogOpen(true); };
  const statusClass = (value: AdminUserStatus) => value === "Active" ? "status-active" : value === "Invited" ? "status-requested" : "status-rejected";
  return <><PageHeader title="Admins" description="Portal accounts with invite-only access. Assign a role to control exactly what each admin can reach." actions={<Button onClick={openInvite}><Plus />Invite admin</Button>} />
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
      <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search admins" className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email, or admin ID…" /></div>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />Role: {role === "all" ? "All" : role}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52 border-border bg-card"><DropdownMenuItem onSelect={() => setRole("all")}>Role: All</DropdownMenuItem>{roles.map((item) => <DropdownMenuItem key={item.id} onSelect={() => setRole(item.name)}>{item.name}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Status: {status === "all" ? "All" : status}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44 border-border bg-card">{(["all", "Active", "Invited", "Disabled"] as const).map((item) => <DropdownMenuItem key={item} onSelect={() => setStatus(item === "all" ? "all" : item)}>Status: {item === "all" ? "All" : item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
      {hasFilters && <Button variant="ghost" size="sm" onClick={() => { setQuery(""); setRole("all"); setStatus("all"); }} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
    </div>
    <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar max-w-full overflow-x-auto"><table className="w-max min-w-260 border-separate border-spacing-0 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>
      <th className="sticky left-0 top-0 z-30 border-b border-border bg-muted/95 px-4 py-2 backdrop-blur shadow-sticky-left"><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortDesc(!sortDesc)}>Name {sortDesc ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}</Button></th>
      {["Admin ID", "Email", "Role", "Status", "Last Active", "Created"].map((label) => <th key={label} className="sticky top-0 z-10 border-b border-border bg-muted/95 px-4 py-2 backdrop-blur">{label}</th>)}
      <th className="sticky right-0 top-0 z-30 border-b border-border bg-muted/95 pr-4 text-right backdrop-blur shadow-sticky-right">Actions</th>
    </tr></thead><tbody>{rows.map((admin) => <tr key={admin.id} className="group hover:bg-muted/50">
      <td className="sticky left-0 z-20 border-b border-border bg-card px-4 py-2 shadow-sticky-left group-hover:bg-muted"><span className="font-heading font-bold">{admin.name}</span></td>
      <td className="border-b border-border font-mono text-xs">{admin.id}</td>
      <td className="border-b border-border"><span className="flex items-center gap-1 text-muted-foreground">{admin.email}<CopyButton value={admin.email} /></span></td>
      <td className="border-b border-border font-semibold">{admin.role}</td>
      <td className="border-b border-border"><span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", statusClass(admin.status))}>{admin.status}</span></td>
      <td className="whitespace-nowrap border-b border-border text-xs text-muted-foreground">{admin.lastActive}</td>
      <td className="whitespace-nowrap border-b border-border text-xs text-muted-foreground">{admin.created}</td>
      <td className="sticky right-0 z-20 border-b border-border bg-card pr-3 text-right shadow-sticky-right group-hover:bg-muted"><span className="inline-flex items-center">
        <IconButton className="h-7 w-7" label={`Edit ${admin.name}`} onClick={() => openEdit(admin)}><Pencil className="h-3.5 w-3.5" /></IconButton>
        {admin.status === "Invited" && <IconButton className="h-7 w-7" label={`Resend invite to ${admin.name}`} onClick={() => toast.success("Invite resent", { description: `A fresh invite email is on its way to ${admin.email}.` })}><Mail className="h-3.5 w-3.5" /></IconButton>}
        {admin.role !== "Owner" && <ConfirmDeleteDialog itemType="Admin" name={admin.name} onConfirm={() => onDelete(admin)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete ${admin.name}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog>}
      </span></td>
    </tr>)}</tbody></table>{!rows.length && <div className="px-6 py-14 text-center"><Users className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">No admins found</h3><p className="mt-1 text-sm text-muted-foreground">Try changing or resetting the current filters.</p></div>}</div></div>
    <p className="mt-4 text-sm text-muted-foreground">Showing <strong className="text-foreground">{rows.length}</strong> of <strong className="text-foreground">{admins.length}</strong> admins</p>
    <AdminUserDialog open={dialogOpen} onOpenChange={setDialogOpen} admin={editing} roles={roles} onSave={onSave} />
  </>;
}

export function AdminPlayground() {
  const [view, setView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [merchantRows, setMerchantRows] = useState<readonly (typeof merchants[number])[]>(merchants);
  const [reviewRows, setReviewRows] = useState<Review[]>(initialReviews);
  const [applicationRows, setApplicationRows] = useState<Application[]>(initialApplications);
  const [claimRows, setClaimRows] = useState<Claim[]>(initialClaims);
  const [campaignRows, setCampaignRows] = useState<StagedCampaign[]>(initialCampaigns);
  const [syncRuns, setSyncRuns] = useState<SyncRun[]>(initialSyncRuns);
  const [syncing, setSyncing] = useState(false);
  const [affiliateNetworkRows, setAffiliateNetworkRows] = useState<AffiliateNetwork[]>(initialAffiliateNetworks);
  const [rejectionReasonRows, setRejectionReasonRows] = useState<RejectionReason[]>(initialRejectionReasons);
  const [communicationTemplateRows, setCommunicationTemplateRows] = useState<CommunicationTemplate[]>(initialCommunicationTemplates);
  const [roleRows, setRoleRows] = useState<AdminRole[]>(initialRoles);
  const [appBuildRows, setAppBuildRows] = useState(initialAppBuilds);
  const saveAppBuild = (build: AppBuild) => setAppBuildRows((current) => current.map((item) => item.id === build.id ? build : item));
  const [adminUserRows, setAdminUserRows] = useState<AdminUser[]>(initialAdminUsers);
  const saveAdminUser = (admin: AdminUser, isNew: boolean) => {
    setAdminUserRows((current) => isNew ? [admin, ...current] : current.map((item) => item.id === admin.id ? admin : item));
    toast.success(isNew ? "Invite sent" : "Admin updated", { description: isNew ? `${admin.email} was invited as ${admin.role}.` : `${admin.name} is now a ${admin.role}.` });
  };
  const deleteAdminUser = (admin: AdminUser) => { setAdminUserRows((current) => current.filter((item) => item.id !== admin.id)); toast.success("Admin removed", { description: `${admin.name} no longer has portal access.` }); };
  const [editingAffiliateNetwork, setEditingAffiliateNetwork] = useState<AffiliateNetwork | null>(null);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [onboardingSlideRows, setOnboardingSlideRows] = useState<OnboardingSlide[]>(onboardingSlideSeeds);
  const [onboardingApp, setOnboardingApp] = useState<OnboardingApp>("Consumer");
  const [editingSlide, setEditingSlide] = useState<OnboardingSlide | null>(null);
  const [editingMerchant, setEditingMerchant] = useState<typeof merchants[number] | null>(null);
  const [categoryRows, setCategoryRows] = useState<Category[]>(initialCategories);
  const [mappingRows, setMappingRows] = useState<RawMapping[]>(initialMappings);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [offerRows, setOfferRows] = useState(initialOffers);
  const [promoBannerRows, setPromoBannerRows] = useState<PromoBanner[]>(initialPromoBanners);
  const [editingPromoBanner, setEditingPromoBanner] = useState<PromoBanner | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerOrigin, setOfferOrigin] = useState<OfferOrigin>({ type: "listing" });
  const [merchantTab, setMerchantTab] = useState<"details" | "offers">("details");
  const editMerchant = (merchant: typeof merchants[number]) => { setEditingMerchant(merchant); setMerchantTab("details"); setView("merchant-edit"); };
  const setReviewStatus = (review: Review, status: ReviewStatus, reason = "", note = "") => setReviewRows((current) => current.map((item) => item.id === review.id ? { ...item, status, reason, note } : item));
  const approveReview = (review: Review) => { setReviewStatus(review, "Approved"); toast.success("Review approved", { description: `${review.user}'s review of ${review.merchant} is now public.` }); };
  const rejectReview = (review: Review, reason: string, note: string) => { setReviewStatus(review, "Rejected", reason, note); toast.success("Review rejected", { description: `${review.user}'s review was rejected: ${reason}.` }); };
  const revertReview = (review: Review) => { setReviewStatus(review, "Pending"); toast.success("Review moved back to pending", { description: `${review.user}'s review awaits moderation again.` }); };
  const deleteReview = (review: Review) => { setReviewRows((current) => current.filter((item) => item.id !== review.id)); toast.success("Review deleted", { description: `${review.user}'s review of ${review.merchant} was removed.` }); };
  const setApplicationStatus = (application: Application, status: ReviewStatus, reason = "", note = "") => setApplicationRows((current) => current.map((item) => item.id === application.id ? { ...item, status, reason, note } : item));
  const approveApplication = (application: Application) => { setApplicationStatus(application, "Approved"); toast.success("Application approved", { description: `${application.store} is live as an OFFLINE merchant — merchant-app login created for ${application.owner}.` }); };
  const rejectApplication = (application: Application, reason: string, note: string) => { setApplicationStatus(application, "Rejected", reason, note); toast.success("Application rejected", { description: `${application.store} was rejected: ${reason}.` }); };
  const revertApplication = (application: Application) => { setApplicationStatus(application, "Pending"); toast.success("Application moved back to pending", { description: `${application.store} awaits review again.` }); };
  const deleteApplication = (application: Application) => { setApplicationRows((current) => current.filter((item) => item.id !== application.id)); toast.success("Application deleted", { description: `${application.store} was removed from the queue.` }); };
  const setClaimStatus = (claim: Claim, status: ReviewStatus, reason = "", note = "") => setClaimRows((current) => current.map((item) => item.id === claim.id ? { ...item, status, reason, note } : item));
  const approveClaim = (claim: Claim) => { setClaimStatus(claim, "Approved", "", "Accepted into the online-conversion pipeline (source = CLAIM)."); toast.success("Claim approved", { description: `${claim.orderId} was staged as an online conversion — resolve it from Online Conversions to credit ₹${claim.expectedCashback.toLocaleString("en-IN")}.` }); };
  const rejectClaim = (claim: Claim, reason: string, note: string) => { setClaimStatus(claim, "Rejected", reason, note); toast.success("Claim rejected", { description: `${claim.user}'s claim on ${claim.orderId} was rejected: ${reason}.` }); };
  const revertClaim = (claim: Claim) => { setClaimStatus(claim, "Pending"); toast.success("Claim moved back to pending", { description: `${claim.id} awaits review again.` }); };
  const deleteClaim = (claim: Claim) => { setClaimRows((current) => current.filter((item) => item.id !== claim.id)); toast.success("Claim deleted", { description: `${claim.id} was removed.` }); };
  const runSync = () => {
    setSyncing(true);
    window.setTimeout(() => {
      const run: SyncRun = { id: `RUN-${Math.floor(Math.random() * 9000) + 1000}`, started: "21 Sept 2026, 08:26 am", trigger: "MANUAL", status: "SUCCEEDED", fetched: 62, staged: 2, updated: 59, skips: 1, errors: [] };
      setSyncRuns((current) => [run, ...current]);
      setSyncing(false);
      toast.success("Sync complete: 62 fetched, 2 new staged, 1 field-locked skip");
    }, 1400);
  };
  const changeCampaign = (updated: StagedCampaign) => setCampaignRows((current) => current.map((item) => item.id === updated.id ? updated : item));
  const approveCampaign = (campaign: StagedCampaign) => {
    if (!campaign.categoryId) { toast.error("Map a category first", { description: `Campaign ${campaign.trackierId} (${campaign.name}) has an unmapped category.` }); return; }
    const category = categoryRows.find((item) => item.id === campaign.categoryId);
    setCampaignRows((current) => current.filter((item) => item.id !== campaign.id));
    setMerchantRows((current) => [[campaign.name, "Online", category?.name ?? "", Number(campaign.displayOrder) || 0, "Active", campaign.offers.length, `${campaign.offers[0]?.commissionValue ?? 0}%`, ["Pan-India"]] as unknown as typeof merchants[number], ...current]);
    setOfferRows((current) => [...campaign.offers.map((offer, index) => ({ id: `OFF-${campaign.trackierId.replace("#", "")}${index}`, merchant: campaign.name, headline: offer.headline, subtext: "", details: campaign.about, terms: offer.terms, discountType: "Percentage" as const, discountValue: Number(offer.discountValue) || 0, commissionType: "Percentage" as const, commissionValue: Number(offer.commissionValue) || 0, start: "2026-09-21T00:00", end: "", minBill: 0, sortOrder: Number(campaign.displayOrder) || 0, discountCap: 0, commissionCap: 0, redirectUrl: campaign.trackingUrl, voucherLink: "", productLink: "", affiliate: "Trackier", featured: false, active: true })), ...current]);
    toast.success(`Campaign ${campaign.trackierId} (${campaign.name}) approved and published to catalog`);
  };
  const rejectCampaign = (campaign: StagedCampaign, reason: string, note: string) => {
    setCampaignRows((current) => current.filter((item) => item.id !== campaign.id));
    toast.success(`Campaign ${campaign.trackierId} (${campaign.name}) rejected`, { description: note ? `${reason} — ${note}` : reason });
  };
  const backToMerchants = () => { setEditingMerchant(null); setView("merchants"); };
  const deleteMerchant = () => { if (!editingMerchant) return; setMerchantRows((current) => current.filter((item) => item[0] !== editingMerchant[0])); toast.success("Merchant deleted", { description: `${editingMerchant[0]} was removed.` }); backToMerchants(); };
  const editCategory = (category: Category) => { setEditingCategory(category); setView("category-edit"); };
  const backToCategories = () => { setEditingCategory(null); setView("categories"); };
  const saveCategory = (updated: Category) => { setCategoryRows((current) => current.some((item) => item.id === updated.id) ? current.map((item) => item.id === updated.id ? updated : item) : [updated, ...current]); backToCategories(); };
  const deleteCategory = (category: Category) => { setCategoryRows((current) => current.filter((item) => item.id !== category.id)); toast.success("Category deleted", { description: `${category.name} was removed.` }); backToCategories(); };
  const openOffer = (offer: Offer | null, origin: OfferOrigin) => { setEditingOffer(offer); setOfferOrigin(origin); setView("offer-edit"); };
  const returnFromOffer = () => { if (offerOrigin.type === "merchant") { setEditingMerchant(offerOrigin.merchant); setMerchantTab("offers"); setView("merchant-edit"); } else { setView("offers"); } setEditingOffer(null); };
  const saveOffer = (updated: Offer) => { setOfferRows((current) => current.some((item) => item.id === updated.id) ? current.map((item) => item.id === updated.id ? updated : item) : [updated, ...current]); returnFromOffer(); };
  const deleteOffer = (offer: Offer) => { setOfferRows((current) => current.filter((item) => item.id !== offer.id)); toast.success("Offer deleted", { description: `${offer.headline} was removed.` }); if (view === "offer-edit") returnFromOffer(); };
  const backToPromoBanners = () => { setEditingPromoBanner(null); setView("promo-banners"); };
  const savePromoBanner = (updated: PromoBanner) => { setPromoBannerRows((current) => current.some((item) => item.id === updated.id) ? current.map((item) => item.id === updated.id ? updated : item) : [updated, ...current]); backToPromoBanners(); };
  const deletePromoBanner = (banner: PromoBanner) => { setPromoBannerRows((current) => current.filter((item) => item.id !== banner.id)); toast.success("Promo banner deleted", { description: `${banner.headline} was removed.` }); if (view === "promo-banner-edit") backToPromoBanners(); };
  const backToAffiliateNetworks = () => { setEditingAffiliateNetwork(null); setView("affiliate-networks"); };
  const saveAffiliateNetwork = (updated: AffiliateNetwork) => { setAffiliateNetworkRows((current) => current.some((item) => item.id === updated.id) ? current.map((item) => item.id === updated.id ? updated : item) : [updated, ...current]); backToAffiliateNetworks(); };
  const deleteAffiliateNetwork = (network: AffiliateNetwork) => { setAffiliateNetworkRows((current) => current.filter((item) => item.id !== network.id)); toast.success("Affiliate network deleted", { description: `${network.name} was removed.` }); if (view === "affiliate-network-edit") backToAffiliateNetworks(); };
  const backToRoles = () => { setEditingRole(null); setView("roles"); };
  const createRole = (role: AdminRole) => { setRoleRows((current) => [role, ...current]); setEditingRole(role); setView("role-edit"); toast.success("Role created", { description: `${role.name} is ready for permission assignment.` }); };
  const saveRole = (updated: AdminRole) => { setRoleRows((current) => current.map((item) => item.id === updated.id ? updated : item)); backToRoles(); };
  const deleteRole = (role: AdminRole) => { setRoleRows((current) => current.filter((item) => item.id !== role.id)); toast.success("Role deleted", { description: `${role.name} was removed.` }); if (view === "role-edit") backToRoles(); };
  const [merchantStaffRows, setMerchantStaffRows] = useState<MerchantStaff[]>(merchantStaffSeeds);
  const saveMerchantStaff = (member: MerchantStaff, isNew: boolean) => { setMerchantStaffRows((current) => isNew ? [member, ...current] : current.map((item) => item.id === member.id ? member : item)); toast.success(isNew ? "Staff member invited" : "Staff member updated", { description: `${member.name} (${member.phone}) — ${member.merchant}.` }); };
  const deleteMerchantStaff = (member: MerchantStaff) => { setMerchantStaffRows((current) => current.filter((item) => item.id !== member.id)); toast.success("Staff member removed", { description: `${member.name} can no longer sign in to the merchant app.` }); };
  const [legalPageRows, setLegalPageRows] = useState<LegalPage[]>(legalPageSeeds);
  const saveLegalPage = (page: LegalPage) => { const stamped = { ...page, updatedAt: format(new Date(), "dd MMM yyyy, h:mm a") }; setLegalPageRows((current) => current.map((item) => item.id === page.id ? stamped : item)); toast.success("Legal page saved", { description: `${page.name} is now ${page.published ? "published" : "unpublished"}.` }); };
  const deleteLegalPage = (page: LegalPage) => { setLegalPageRows((current) => current.filter((item) => item.id !== page.id)); toast.success("Legal page deleted", { description: `${page.name} was removed.` }); };
  const backToOnboardingSlides = () => { setEditingSlide(null); setView("onboarding-screens"); };
  const saveOnboardingSlide = (updated: OnboardingSlide) => { setOnboardingSlideRows((current) => current.some((item) => item.id === updated.id) ? current.map((item) => item.id === updated.id ? updated : item) : [...current, updated]); setOnboardingApp(updated.app); backToOnboardingSlides(); };
  const deleteOnboardingSlide = (slide: OnboardingSlide) => { setOnboardingSlideRows((current) => current.filter((item) => item.id !== slide.id)); toast.success("Onboarding slide deleted", { description: `${slide.title} was removed.` }); if (view !== "onboarding-screens") backToOnboardingSlides(); };
  const toggleOnboardingSlide = (slide: OnboardingSlide) => { setOnboardingSlideRows((current) => current.map((item) => item.id === slide.id ? { ...item, active: !item.active } : item)); toast.success(slide.active ? "Slide deactivated" : "Slide activated", { description: `${slide.title} is now ${slide.active ? "hidden from" : "shown in"} the carousel.` }); };
  const moveOnboardingSlide = (slide: OnboardingSlide, direction: -1 | 1) => setOnboardingSlideRows((current) => {
    const next = [...current];
    const from = next.findIndex((item) => item.id === slide.id);
    let to = from + direction;
    while (to >= 0 && to < next.length && next[to]!.app !== slide.app) to += direction;
    if (from < 0 || to < 0 || to >= next.length) return current;
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    return next;
  });
  const content = view === "dashboard" ? <Dashboard />
    : view === "merchants" ? <Merchants rows={merchantRows} onEdit={editMerchant} />
    : view === "reviews" ? <ReviewsPage reviews={reviewRows} merchantNames={merchantRows.map((row) => row[0])} onApprove={approveReview} onReject={rejectReview} onRevert={revertReview} onDelete={deleteReview} />
    : view === "trackier-queue" ? <TrackierQueue campaigns={campaignRows} runs={syncRuns} categories={categoryRows} syncing={syncing} onSync={runSync} onChange={changeCampaign} onApprove={approveCampaign} onReject={rejectCampaign} />
    : view === "affiliate-networks" ? <AffiliateNetworksPage networks={affiliateNetworkRows} onCreate={() => { setEditingAffiliateNetwork(null); setView("affiliate-network-new"); }} onEdit={(network) => { setEditingAffiliateNetwork(network); setView("affiliate-network-edit"); }} onDelete={deleteAffiliateNetwork} />
    : view === "affiliate-network-new" ? <AffiliateNetworkFormPage key="new-affiliate-network" network={null} onCancel={backToAffiliateNetworks} onSave={saveAffiliateNetwork} onDelete={deleteAffiliateNetwork} />
    : view === "affiliate-network-edit" && editingAffiliateNetwork ? <AffiliateNetworkFormPage key={editingAffiliateNetwork.id} network={editingAffiliateNetwork} onCancel={backToAffiliateNetworks} onSave={saveAffiliateNetwork} onDelete={deleteAffiliateNetwork} />
    : view === "merchant-onboarding-queue" ? <OnboardingQueue applications={applicationRows} onApprove={approveApplication} onReject={rejectApplication} onRevert={revertApplication} onDelete={deleteApplication} />
    : view === "cashback-claims" ? <CashbackClaims claims={claimRows} onApprove={approveClaim} onReject={rejectClaim} onRevert={revertClaim} onDelete={deleteClaim} />
    : view === "conversion-resolutions" ? <ConversionResolutions reasons={rejectionReasonRows} />
    : view === "transactions" ? <Transactions />
    : view === "clicks" ? <Clicks />
    : view === "withdrawals" ? <Withdrawals />
    : view === "rejection-reasons" ? <RejectionReasons reasons={rejectionReasonRows} onSave={(reason, isNew) => { setRejectionReasonRows((current) => current.some((item) => item.id === reason.id) ? current.map((item) => item.id === reason.id ? reason : item) : [reason, ...current]); toast.success(isNew ? "Rejection reason added" : "Rejection reason updated", { description: `${reason.reason} is now ${reason.active ? "active" : "inactive"} at display order ${reason.order}.` }); }} />
    : view === "communication-templates" ? <CommunicationTemplates templates={communicationTemplateRows} onChange={(template) => setCommunicationTemplateRows((current) => current.map((item) => item.id === template.id ? template : item))} />
    : view === "communication-dispatches" ? <CommunicationLogs />
    : view === "users" ? <UsersPage />
    : view === "cities" ? <CitiesPage />
    : view === "onboarding-screens" ? <OnboardingSlidesPage slides={onboardingSlideRows} app={onboardingApp} onAppChange={setOnboardingApp} onCreate={() => { setEditingSlide(null); setView("onboarding-slide-new"); }} onEdit={(slide) => { setEditingSlide(slide); setView("onboarding-slide-edit"); }} onToggle={toggleOnboardingSlide} onMove={moveOnboardingSlide} onDelete={deleteOnboardingSlide} />
    : view === "onboarding-slide-edit" || view === "onboarding-slide-new" ? <OnboardingSlideEditPage key={editingSlide?.id ?? "new-onboarding-slide"} slide={editingSlide} app={onboardingApp} index={Math.max(onboardingSlideRows.filter((item) => item.app === (editingSlide?.app ?? onboardingApp)).findIndex((item) => item.id === editingSlide?.id), 0)} total={onboardingSlideRows.filter((item) => item.app === (editingSlide?.app ?? onboardingApp)).length} onCancel={backToOnboardingSlides} onSave={saveOnboardingSlide} onDelete={deleteOnboardingSlide} />
    : view === "merchant-staff" ? <MerchantStaffPage staff={merchantStaffRows} onSave={saveMerchantStaff} onDelete={deleteMerchantStaff} />
    : view === "legal-pages" ? <LegalPagesPage pages={legalPageRows} onSave={saveLegalPage} onDelete={deleteLegalPage} />
    : view === "settings" ? <SettingsPage />
    : view === "app-versions" ? <AppVersionsPage builds={appBuildRows} onSave={saveAppBuild} />
    : view === "admin-users" ? <AdminUsersPage admins={adminUserRows} roles={roleRows} onSave={saveAdminUser} onDelete={deleteAdminUser} />
    : view === "roles" ? <RolesPage roles={roleRows} onCreate={createRole} onEdit={(role) => { setEditingRole(role); setView("role-edit"); }} onDelete={deleteRole} />
    : view === "role-edit" && editingRole ? <RoleEditPage key={editingRole.id} role={editingRole} onCancel={backToRoles} onSave={saveRole} onDelete={deleteRole} />
    : view === "merchant-edit" && editingMerchant ? <MerchantEditPage merchant={editingMerchant} offers={offerRows} reviews={reviewRows} onApproveReview={approveReview} onRejectReview={rejectReview} onRevertReview={revertReview} onDeleteReview={deleteReview} initialTab={merchantTab} onBack={backToMerchants} onDeleteMerchant={deleteMerchant} onEditOffer={(offer) => openOffer(offer, { type: "merchant", merchant: editingMerchant })} onCreateOffer={() => openOffer(null, { type: "merchant", merchant: editingMerchant })} onDeleteOffer={deleteOffer} />
    : view === "offers" ? <OffersPage offers={offerRows} onEdit={(offer) => openOffer(offer, { type: "listing" })} onCreate={() => openOffer(null, { type: "listing" })} onDelete={deleteOffer} />
    : view === "offer-edit" ? <OfferEditPage key={editingOffer?.id ?? "new"} offer={editingOffer} origin={offerOrigin} onCancel={returnFromOffer} onSave={saveOffer} onDelete={deleteOffer} />
    : view === "promo-banners" ? <PromoBannersPage banners={promoBannerRows} onEdit={(banner) => { setEditingPromoBanner(banner); setView("promo-banner-edit"); }} onCreate={() => { setEditingPromoBanner(null); setView("promo-banner-new"); }} onDelete={deletePromoBanner} />
    : view === "promo-banner-edit" ? <PromoBannerFormPage key={editingPromoBanner?.id} banner={editingPromoBanner} onCancel={backToPromoBanners} onSave={savePromoBanner} onDelete={deletePromoBanner} />
    : view === "promo-banner-new" ? <PromoBannerFormPage key="new-promo-banner" banner={null} onCancel={backToPromoBanners} onSave={savePromoBanner} onDelete={deletePromoBanner} />
    : view === "categories" || view === "category-mapping" ? <Categories categories={categoryRows} mappedCount={(category) => merchantRows.filter((row) => row[2] === category.name && row[4] === "Active").length} tab={view === "category-mapping" ? "mapping" : "categories"} onTabChange={(tab) => setView(tab === "mapping" ? "category-mapping" : "categories")} mappings={mappingRows} onSaveMapping={(raw, mappedTo) => setMappingRows((current) => current.map((item) => item.raw === raw ? { ...item, mappedTo } : item))} onEdit={editCategory} onCreate={() => { setEditingCategory(null); setView("category-new"); }} onDelete={deleteCategory} />
    : view === "category-edit" ? <CategoryFormPage key={editingCategory?.id} category={editingCategory} onCancel={backToCategories} onSave={saveCategory} onDelete={deleteCategory} />
    : view === "category-new" ? <CategoryFormPage key="new-category" category={null} onCancel={backToCategories} onSave={saveCategory} onDelete={deleteCategory} />
    : <Conversions />;
  return <div className="flex h-screen overflow-hidden bg-background text-foreground"><Sidebar view={view} setView={(next) => { setView(next); if (next !== "merchant-edit" && next !== "offer-edit") setEditingMerchant(null); if (next !== "category-edit" && next !== "category-new") setEditingCategory(null); if (next !== "promo-banner-edit" && next !== "promo-banner-new") setEditingPromoBanner(null); if (next !== "affiliate-network-edit" && next !== "affiliate-network-new") setEditingAffiliateNetwork(null); if (next !== "role-edit") setEditingRole(null); if (next !== "onboarding-slide-edit" && next !== "onboarding-slide-new") setEditingSlide(null); }} open={sidebarOpen} setOpen={setSidebarOpen} /><div className="min-w-0 flex-1 overflow-y-auto"><div className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-card/95 px-4 backdrop-blur md:hidden"><IconButton label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu /></IconButton><span className="ml-2 font-heading font-bold">OfferPe Admin</span></div><main className="mx-auto w-full max-w-400 p-4 sm:p-6 lg:p-8">{content}</main></div></div>;
}
