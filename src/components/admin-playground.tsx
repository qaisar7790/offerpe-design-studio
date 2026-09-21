"use client";

import { useMemo, useRef, useState } from "react";
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
  GripVertical,
  LayoutDashboard,
  Lock,
  Image as ImageIcon,
  Megaphone,
  Menu,
  MoreHorizontal,
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
  Star,
  Store,
  Tag,
  Trash2,
  UploadCloud,
  Users,
  WalletCards,
  X,
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

type View = "dashboard" | "merchants" | "reviews" | "merchant-onboarding-queue" | "trackier-queue" | "affiliate-networks" | "affiliate-network-new" | "affiliate-network-edit" | "merchant-edit" | "offers" | "offer-edit" | "promo-banners" | "promo-banner-edit" | "promo-banner-new" | "categories" | "category-mapping" | "category-edit" | "category-new" | "cashback-claims" | "conversions";
type RawMapping = { raw: string; mappedTo: string };
type ReviewStatus = "Pending" | "Approved" | "Rejected";
type Review = { id: string; user: string; merchant: string; rating: number; comment: string; photos: string[]; submitted: string; status: ReviewStatus; reason: string; note: string };
type Status = "Active" | "Inactive" | "Pending" | "Approved" | "Rejected" | "Requested" | "Paid";
type Offer = { id: string; merchant: string; headline: string; subtext: string; details: string; terms: string; discountType: "Percentage" | "Flat amount"; discountValue: number; commissionType: "Percentage" | "Flat amount"; commissionValue: number; start: string; end: string; minBill: number; sortOrder: number; discountCap: number; commissionCap: number; redirectUrl: string; voucherLink: string; productLink: string; affiliate: string; featured: boolean; active: boolean };
type Banner = { id: string; title: string; placement: string; target: string; image: string; start: string; end: string; active: boolean };
type PromoSection = "HERO" | "PREMIUM DEALS" | "FLASH OFFERS" | "NEW ON PLATFORM";
type PromoBanner = { id: string; section: PromoSection; headline: string; image: string; tag: string; ctaText: string; ctaTarget: string; order: number; start: string; end: string; active: boolean };
type Category = { id: string; channel: "Online" | "Offline"; name: string; order: number; active: boolean; image: string; line1: string; line2: string };
type AffiliateNetwork = { id: string; name: string; propertyId: string; storeTemplate: string; voucherTemplate: string; productTemplate: string; active: boolean };
type OfferOrigin = { type: "merchant"; merchant: typeof merchants[number] } | { type: "listing" };

const groups = [
  { label: "Catalog", icon: ShoppingBag, items: [{ label: "Merchants", icon: Store, view: "merchants" as View }, { label: "Cashback Offers", icon: Tag, view: "offers" as View }, { label: "Promo Banners", icon: Megaphone, view: "promo-banners" as View }, { label: "Merchant Reviews", icon: Star, view: "reviews" as View }, { label: "Categories", icon: Tag, view: "categories" as View }, { label: "Cities", icon: Building2 }] },
  { label: "Operations", icon: Settings2, items: [{ label: "Merchant Onboarding Queue", icon: ClipboardCheck, view: "merchant-onboarding-queue" as View }, { label: "Trackier Import Queue", icon: DownloadCloud, view: "trackier-queue" as View }, { label: "Affiliate Networks", icon: Share2, view: "affiliate-networks" as View }, { label: "Online Conversions", icon: CircleDollarSign, view: "conversions" as View }, { label: "Category Mapping", icon: Tag, view: "category-mapping" as View }, { label: "Users", icon: Users }] },
  { label: "Financial", icon: WalletCards, items: [{ label: "Cashback Claims", icon: CircleDollarSign, view: "cashback-claims" as View }, { label: "Withdrawals", icon: BadgeIndianRupee }, { label: "Missing Claims", icon: FileSpreadsheet }] },
  { label: "Communication", icon: Megaphone, items: [{ label: "Notifications", icon: Megaphone }] },
  { label: "System", icon: SlidersHorizontal, items: [{ label: "Admin Roles", icon: ShieldCheck }, { label: "Settings", icon: Settings2 }] },
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

type Claim = { id: string; user: string; email: string; merchant: string; orderId: string; clickId: string; orderDate: string; orderValue: number; expectedCashback: number; proof: string; comment: string; submitted: string; status: ReviewStatus; reason: string; note: string };

const claimRejectionReasons = ["No matching click found", "Order placed outside OfferPe click window", "Order cancelled or returned", "Proof of purchase unreadable", "Duplicate claim for the same order", "Merchant category excluded from cashback"];

const initialClaims: Claim[] = [
  { id: "CLM-5042", user: "Ananya Rao", email: "ananya.rao@example.com", merchant: "Myntra", orderId: "MYN-77120934", clickId: "clk_9f42ab7c", orderDate: "14 Sep 2026", orderValue: 4299, expectedCashback: 344, proof: "order-confirmation.png", comment: "Cashback did not track even though I came through the OfferPe app.", submitted: "21 Sep 2026, 09:12", status: "Pending", reason: "", note: "" },
  { id: "CLM-5041", user: "Rahul Menon", email: "rahul.menon@example.com", merchant: "Croma", orderId: "CRM-4408217", clickId: "clk_2b71de09", orderDate: "12 Sep 2026", orderValue: 28990, expectedCashback: 1449, proof: "invoice-croma.pdf", comment: "Bought a washing machine, cashback still missing after 7 days.", submitted: "20 Sep 2026, 18:44", status: "Pending", reason: "", note: "" },
  { id: "CLM-5040", user: "Sneha Iyer", email: "sneha.iyer@example.com", merchant: "Nykaa", orderId: "NYK-33019876", clickId: "clk_77c1a4e2", orderDate: "11 Sep 2026", orderValue: 2150, expectedCashback: 215, proof: "nykaa-order.png", comment: "Order delivered, no cashback in wallet.", submitted: "20 Sep 2026, 11:05", status: "Pending", reason: "", note: "" },
  { id: "CLM-5039", user: "Imran Shaikh", email: "imran.shaikh@example.com", merchant: "Myntra", orderId: "MYN-77118420", clickId: "clk_51ba0d33", orderDate: "08 Sep 2026", orderValue: 1899, expectedCashback: 152, proof: "myntra-order.png", comment: "Missing cashback on a fashion order.", submitted: "19 Sep 2026, 16:20", status: "Approved", reason: "", note: "Click found in logs, conversion created with source = CLAIM." },
  { id: "CLM-5038", user: "Priya Nair", email: "priya.nair@example.com", merchant: "Croma", orderId: "CRM-4407004", clickId: "", orderDate: "05 Sep 2026", orderValue: 7499, expectedCashback: 375, proof: "screenshot.jpg", comment: "Cashback not credited.", submitted: "18 Sep 2026, 10:02", status: "Rejected", reason: "No matching click found", note: "No OfferPe click recorded within 30 days of the order date." },
  { id: "CLM-5037", user: "Devansh Gupta", email: "devansh.gupta@example.com", merchant: "Nykaa", orderId: "NYK-33015512", clickId: "clk_1de9f004", orderDate: "02 Sep 2026", orderValue: 999, expectedCashback: 100, proof: "nykaa-invoice.pdf", comment: "Placed via app, no cashback.", submitted: "17 Sep 2026, 14:37", status: "Approved", reason: "", note: "" },
  { id: "CLM-5036", user: "Meera Krishnan", email: "meera.k@example.com", merchant: "Myntra", orderId: "MYN-77101288", clickId: "clk_84aa22b1", orderDate: "29 Aug 2026", orderValue: 3499, expectedCashback: 280, proof: "order.png", comment: "Returned one item but kept the rest.", submitted: "16 Sep 2026, 09:55", status: "Rejected", reason: "Order cancelled or returned", note: "Merchant reported the full order as returned." },
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
    const activeView = view === "merchant-edit" ? "merchants" : view === "offer-edit" ? "offers" : view === "promo-banner-edit" || view === "promo-banner-new" ? "promo-banners" : view === "category-edit" || view === "category-new" ? "categories" : view === "affiliate-network-edit" || view === "affiliate-network-new" ? "affiliate-networks" : view;
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
                   {group.items.map((item) => <Button key={item.label} variant="ghost" disabled={!item.view} className={cn("my-0.5 h-9 w-full justify-start gap-2.5 px-3 text-[13px] text-sidebar-foreground disabled:opacity-55", (item.view === view || (view === "merchant-edit" && item.view === "merchants") || (view === "offer-edit" && item.view === "offers") || ((view === "promo-banner-edit" || view === "promo-banner-new") && item.view === "promo-banners") || ((view === "category-edit" || view === "category-new") && item.view === "categories") || ((view === "affiliate-network-edit" || view === "affiliate-network-new") && item.view === "affiliate-networks")) && "bg-sidebar-accent font-semibold text-sidebar-primary hover:bg-sidebar-accent")} onClick={() => item.view && chooseGroupedItem(item.view, group.label)}><item.icon className="h-4 w-4" />{item.label}</Button>)}
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
  return <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:items-center"><div className="relative min-w-64 flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder={showChannel ? "Search merchants or categories…" : "Search cashback, order, or merchant…"} /></div><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline"><Filter />Status{statuses.length > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{statuses.length}</span>}<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44">{options.map((status) => <DropdownMenuCheckboxItem key={status} checked={statuses.includes(status)} onCheckedChange={() => setStatuses(statuses.includes(status) ? statuses.filter((s) => s !== status) : [...statuses, status])}>{status}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu>{showChannel ? <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Channel<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuCheckboxItem checked>Online</DropdownMenuCheckboxItem><DropdownMenuCheckboxItem>Offline</DropdownMenuCheckboxItem></DropdownMenuContent></DropdownMenu> : <DateFilter />}{(query || statuses.length > 0) && <Button variant="ghost" onClick={() => { setQuery(""); setStatuses([]); }}>Clear</Button>}</div>;
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
  return <article className="rounded-lg border border-border bg-card p-4 shadow-card">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
    <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>
    {review.photos.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{review.photos.map((photo) => <ReviewPhoto key={photo} src={photo} user={review.user} />)}</div>}
  </article>;
}

function ReviewsPanel({ reviews, merchantNames, scopedMerchant, onApprove, onReject, onRevert, onDelete }: { reviews: Review[]; merchantNames: string[]; scopedMerchant?: string; onApprove: (review: Review) => void; onReject: (review: Review, reason: string, note: string) => void; onRevert: (review: Review) => void; onDelete: (review: Review) => void }) {
  const [status, setStatus] = useState("all");
  const [merchantFilter, setMerchantFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("newest");
  const scoped = scopedMerchant ? reviews.filter((review) => review.merchant === scopedMerchant) : reviews;
  const pending = scoped.filter((review) => review.status === "Pending");
  const reviewed = useMemo(() => {
    const parse = (value: string) => new Date(value.replace(",", "")).getTime();
    return scoped.filter((review) => review.status !== "Pending")
      .filter((review) => status === "all" || review.status === status)
      .filter((review) => scopedMerchant || merchantFilter === "all" || review.merchant === merchantFilter)
      .filter((review) => !from || parse(review.submitted) >= new Date(from).getTime())
      .filter((review) => !to || parse(review.submitted) <= new Date(to).getTime() + 86_400_000)
      .sort((a, b) => sort === "oldest" ? parse(a.submitted) - parse(b.submitted) : sort === "rating-high" ? b.rating - a.rating : sort === "rating-low" ? a.rating - b.rating : parse(b.submitted) - parse(a.submitted));
  }, [scoped, status, merchantFilter, from, to, sort, scopedMerchant]);
  return <div className="space-y-8">
    <section>
      <h2 className="font-heading text-lg font-bold">Pending review ({pending.length})</h2>
      {pending.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No reviews waiting for review.</p>
        : <div className="mt-3 space-y-3">{pending.map((review) => <PendingReviewCard key={review.id} review={review} showMerchant={!scopedMerchant} onApprove={onApprove} onReject={onReject} />)}</div>}
    </section>
    <section>
      <h2 className="font-heading text-lg font-bold">Reviewed</h2>
      <div className="mt-3 grid gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:grid-cols-2 xl:grid-cols-5">
        <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">Status<Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select></label>
        {!scopedMerchant && <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">Merchant<Select value={merchantFilter} onValueChange={setMerchantFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{merchantNames.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></label>}
        <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">From<Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
        <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">To<Input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label>
        <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">Sort by<Select value={sort} onValueChange={setSort}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest submitted</SelectItem><SelectItem value="oldest">Oldest submitted</SelectItem><SelectItem value="rating-high">Rating: High to Low</SelectItem><SelectItem value="rating-low">Rating: Low to High</SelectItem></SelectContent></Select></label>
      </div>
      {reviewed.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">Nothing reviewed yet.</p>
        : <div className="mt-3 space-y-3">{reviewed.map((review) => <article key={review.id} className="rounded-lg border border-border bg-card p-4 shadow-card">
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
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>
          {review.status === "Rejected" && <p className="mt-2 text-xs font-semibold text-destructive">Reason: {review.reason}{review.note && <span className="font-normal text-muted-foreground"> — {review.note}</span>}</p>}
          {review.photos.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{review.photos.map((photo) => <ReviewPhoto key={photo} src={photo} user={review.user} />)}</div>}
        </article>)}</div>}
    </section>
  </div>;
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
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("newest");
  const categories = Array.from(new Set(applications.map((application) => application.category)));
  const pending = applications.filter((application) => application.status === "Pending");
  const reviewed = useMemo(() => {
    const parse = (value: string) => new Date(value.replace(",", "")).getTime();
    return applications.filter((application) => application.status !== "Pending")
      .filter((application) => status === "all" || application.status === status)
      .filter((application) => category === "all" || application.category === category)
      .filter((application) => !from || parse(application.submitted) >= new Date(from).getTime())
      .filter((application) => !to || parse(application.submitted) <= new Date(to).getTime() + 86_400_000)
      .sort((a, b) => sort === "oldest" ? parse(a.submitted) - parse(b.submitted) : sort === "store" ? a.store.localeCompare(b.store) : parse(b.submitted) - parse(a.submitted));
  }, [applications, status, category, from, to, sort]);
  return <><PageHeader title="Merchant Onboarding Queue" description={'Applications submitted via the web form or the merchant app\'s "Register your store" path. Approving creates a live OFFLINE merchant and grants the applicant immediate merchant-app login — no separate invite step. Rejecting requires a reason from the Onboarding Rejection Reasons list.'} />
    <div className="space-y-8">
      <section>
        <h2 className="font-heading text-lg font-bold">Pending review ({pending.length})</h2>
        {pending.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No submissions waiting for review.</p>
          : <div className="mt-3 space-y-3">{pending.map((application) => <article key={application.id} className="rounded-lg border border-border bg-card p-4 shadow-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <ApplicationHeadline application={application} />
              <div className="flex shrink-0 gap-2">
                <Button size="sm" onClick={() => onApprove(application)}><Check />Approve</Button>
                <RejectApplicationDialog application={application} onReject={onReject}><Button size="sm" variant="destructive"><X />Reject</Button></RejectApplicationDialog>
              </div>
            </div>
            <ApplicationDetails application={application} />
          </article>)}</div>}
      </section>
      <section>
        <h2 className="font-heading text-lg font-bold">Reviewed</h2>
        <div className="mt-3 grid gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">Status<Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">Category<Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">From<Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">To<Input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">Sort by<Select value={sort} onValueChange={setSort}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest submitted</SelectItem><SelectItem value="oldest">Oldest submitted</SelectItem><SelectItem value="store">Store name: A to Z</SelectItem></SelectContent></Select></label>
        </div>
        {reviewed.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">Nothing reviewed yet.</p>
          : <div className="mt-3 space-y-3">{reviewed.map((application) => <article key={application.id} className="rounded-lg border border-border bg-card p-4 shadow-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <ApplicationHeadline application={application} />
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                  <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", application.status === "Approved" ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive")}>{application.status}</span>
                  <span className="text-muted-foreground">{application.owner} · {application.city}</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Dialog><DialogTrigger asChild><Button size="sm" variant="outline"><ExternalLink />View details</Button></DialogTrigger><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">{application.store}</DialogTitle><DialogDescription>Application {application.id} · submitted {application.submitted}</DialogDescription></DialogHeader><ApplicationDetails application={application} />{application.status === "Rejected" && <p className="mt-3 text-sm font-semibold text-destructive">Reason: {application.reason}{application.note && <span className="font-normal text-muted-foreground"> — {application.note}</span>}</p>}</DialogContent></Dialog>
                <Button size="sm" variant="outline" onClick={() => onRevert(application)}><RotateCcw />Re-evaluate</Button>
                <ConfirmDeleteDialog itemType="Application" name={application.store} onConfirm={() => onDelete(application)}><Button size="sm" variant="ghost" className="text-destructive" aria-label={`Delete application ${application.id}`}><Trash2 /></Button></ConfirmDeleteDialog>
              </div>
            </div>
            {application.status === "Rejected" && <p className="mt-2 text-xs font-semibold text-destructive">Reason: {application.reason}{application.note && <span className="font-normal text-muted-foreground"> — {application.note}</span>}</p>}
          </article>)}</div>}
      </section>
    </div>
  </>;
}

const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function ClaimDetails({ claim }: { claim: Claim }) {
  return <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Claimant</div><div className="mt-0.5 font-medium">{claim.user}</div><div className="text-muted-foreground">{claim.email}</div></div>
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Order</div><div className="mt-0.5 font-mono text-xs">{claim.orderId}</div><div className="text-muted-foreground">{claim.orderDate}</div></div>
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
  const merchantNames = Array.from(new Set(claims.map((claim) => claim.merchant)));
  const pending = claims.filter((claim) => claim.status === "Pending");
  const reviewed = useMemo(() => {
    const parse = (value: string) => new Date(value.replace(",", "")).getTime();
    return claims.filter((claim) => claim.status !== "Pending")
      .filter((claim) => !query || `${claim.orderId} ${claim.id} ${claim.user}`.toLowerCase().includes(query.toLowerCase()))
      .filter((claim) => status === "all" || claim.status === status)
      .filter((claim) => merchant === "all" || claim.merchant === merchant)
      .filter((claim) => !from || parse(claim.submitted) >= new Date(from).getTime())
      .filter((claim) => !to || parse(claim.submitted) <= new Date(to).getTime() + 86_400_000)
      .sort((a, b) => sort === "oldest" ? parse(a.submitted) - parse(b.submitted) : sort === "value-high" ? b.orderValue - a.orderValue : sort === "value-low" ? a.orderValue - b.orderValue : parse(b.submitted) - parse(a.submitted));
  }, [claims, query, status, merchant, from, to, sort]);
  const pendingValue = pending.reduce((total, claim) => total + claim.expectedCashback, 0);
  return <><PageHeader title="Cashback Claims" description="Online missing-cashback claims raised by customers. Approving accepts a claim into the same online-conversion pipeline a real network webhook uses (source = CLAIM) — it does not itself credit the wallet. Resolve the resulting conversion from Online Conversions to actually credit it." actions={<DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline"><UploadCloud />Import &amp; Export<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem><Download />Export claims CSV</DropdownMenuItem><DropdownMenuItem><UploadCloud />Import claim decisions</DropdownMenuItem></DropdownMenuContent></DropdownMenu>} />
    <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-semibold shadow-card"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{pending.length} pending review</span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-semibold shadow-card">Cashback at stake <span className="text-primary">{inr(pendingValue)}</span></span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-semibold shadow-card">{claims.length - pending.length} reviewed</span>
    </div>
    <div className="space-y-8">
      <section>
        <h2 className="font-heading text-lg font-bold">Pending review ({pending.length})</h2>
        {pending.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No claims waiting for review.</p>
          : <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-290 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th>Claim</th><th>Customer</th><th>Merchant</th><th>Order ID</th><th>Click match</th><th>Order value</th><th>Cashback</th><th>Proof</th><th className="pr-4 text-right">Actions</th></tr></thead><tbody>{pending.map((claim) => <tr key={claim.id} className="border-t border-border hover:bg-muted/50">
            <td className="px-4 py-2 font-mono text-xs">{claim.id}<div className="font-sans text-xs text-muted-foreground">{claim.submitted}</div></td>
            <td><div className="font-medium">{claim.user}</div><div className="text-xs text-muted-foreground">{claim.email}</div></td>
            <td className="font-medium">{claim.merchant}</td>
            <td className="font-mono text-xs">{claim.orderId}<div className="font-sans text-xs text-muted-foreground">{claim.orderDate}</div></td>
            <td>{claim.clickId ? <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success"><Check className="h-3 w-3" />Matched</span> : <span className="inline-flex items-center gap-1 rounded-full status-pending px-2 py-0.5 text-xs font-semibold"><X className="h-3 w-3" />No match</span>}</td>
            <td className="whitespace-nowrap font-semibold">{inr(claim.orderValue)}</td>
            <td className="whitespace-nowrap font-semibold text-primary">{inr(claim.expectedCashback)}</td>
            <td><span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium"><ImageIcon className="h-3 w-3" />{claim.proof}</span></td>
            <td className="pr-3 text-right"><div className="flex justify-end gap-1">
              <Dialog><DialogTrigger asChild><IconButton className="h-7 w-7" label={`View claim ${claim.id}`}><ExternalLink className="h-3.5 w-3.5" /></IconButton></DialogTrigger><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">{claim.merchant} · {claim.orderId}</DialogTitle><DialogDescription>Claim {claim.id} · submitted {claim.submitted}</DialogDescription></DialogHeader><ClaimDetails claim={claim} /></DialogContent></Dialog>
              <Button size="sm" className="h-7 px-2.5 text-xs" onClick={() => onApprove(claim)}><Check />Approve</Button>
              <RejectClaimDialog claim={claim} onReject={onReject}><Button size="sm" variant="destructive" className="h-7 px-2.5 text-xs"><X />Reject</Button></RejectClaimDialog>
            </div></td>
          </tr>)}</tbody></table></div></div>}
      </section>
      <section>
        <h2 className="font-heading text-lg font-bold">Reviewed</h2>
        <div className="mt-3 grid gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:grid-cols-2 xl:grid-cols-6">
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground xl:col-span-2">Order ID<div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order ID, claim ID, or customer…" /></div></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">Status<Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">Merchant<Select value={merchant} onValueChange={setMerchant}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{merchantNames.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">From<Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">To<Input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label>
          <label className="space-y-1.5 text-xs font-semibold uppercase text-muted-foreground xl:col-span-2">Sort by<Select value={sort} onValueChange={setSort}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest submitted</SelectItem><SelectItem value="oldest">Oldest submitted</SelectItem><SelectItem value="value-high">Order value: High to Low</SelectItem><SelectItem value="value-low">Order value: Low to High</SelectItem></SelectContent></Select></label>
        </div>
        {reviewed.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">Nothing reviewed yet.</p>
          : <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-250 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th>Claim</th><th>Customer</th><th>Merchant</th><th>Order ID</th><th>Order value</th><th>Cashback</th><th>Status</th><th className="pr-4 text-right">Actions</th></tr></thead><tbody>{reviewed.map((claim) => <tr key={claim.id} className="border-t border-border align-top hover:bg-muted/50">
            <td className="px-4 py-2 font-mono text-xs">{claim.id}<div className="font-sans text-xs text-muted-foreground">{claim.submitted}</div></td>
            <td className="font-medium">{claim.user}</td>
            <td>{claim.merchant}</td>
            <td className="font-mono text-xs">{claim.orderId}</td>
            <td className="font-semibold">{inr(claim.orderValue)}</td>
            <td className="font-semibold text-primary">{inr(claim.expectedCashback)}</td>
            <td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", claim.status === "Approved" ? "status-approved" : "status-rejected")}>{claim.status}</span>{claim.status === "Rejected" && <div className="mt-1 max-w-56 whitespace-normal text-xs text-destructive">{claim.reason}</div>}</td>
            <td className="pr-3 text-right"><div className="flex justify-end gap-1">
              <Dialog><DialogTrigger asChild><IconButton className="h-7 w-7" label={`View claim ${claim.id}`}><ExternalLink className="h-3.5 w-3.5" /></IconButton></DialogTrigger><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">{claim.merchant} · {claim.orderId}</DialogTitle><DialogDescription>Claim {claim.id} · submitted {claim.submitted}</DialogDescription></DialogHeader><ClaimDetails claim={claim} />{claim.status === "Rejected" && <p className="mt-3 text-sm font-semibold text-destructive">Reason: {claim.reason}{claim.note && <span className="font-normal text-muted-foreground"> — {claim.note}</span>}</p>}{claim.status === "Approved" && claim.note && <p className="mt-3 text-sm text-muted-foreground">{claim.note}</p>}</DialogContent></Dialog>
              <IconButton className="h-7 w-7" label={`Re-evaluate claim ${claim.id}`} onClick={() => onRevert(claim)}><RotateCcw className="h-3.5 w-3.5" /></IconButton>
              <ConfirmDeleteDialog itemType="Claim" name={claim.id} onConfirm={() => onDelete(claim)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete claim ${claim.id}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog>
            </div></td>
          </tr>)}</tbody></table></div></div>}
      </section>
    </div>
  </>;
}

function ReviewsPage(props: { reviews: Review[]; merchantNames: string[]; onApprove: (review: Review) => void; onReject: (review: Review, reason: string, note: string) => void; onRevert: (review: Review) => void; onDelete: (review: Review) => void }) {
  return <><PageHeader title="Merchant Reviews" description="Vendor/store reviews submitted by verified purchasers. Approving makes the review (and any photos) publicly visible on the store's Store Detail page; rejecting requires a reason from the Rejection Reasons list." actions={<DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline"><UploadCloud />Import &amp; Export<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem><Download />Export reviews CSV</DropdownMenuItem><DropdownMenuItem><UploadCloud />Import moderation decisions</DropdownMenuItem></DropdownMenuContent></DropdownMenu>} /><ReviewsPanel {...props} /></>;
}

function Merchants({ rows: merchantRows, onEdit }: { rows: readonly (typeof merchants[number])[]; onEdit: (merchant: typeof merchants[number]) => void }) {
  const [query, setQuery] = useState(""); const [statuses, setStatuses] = useState<Status[]>([]); const [sortAsc, setSortAsc] = useState(true);
  const rows = useMemo(() => merchantRows.filter((m) => (!query || `${m[0]} ${m[2]}`.toLowerCase().includes(query.toLowerCase())) && (!statuses.length || statuses.includes(m[4] as Status))).sort((a, b) => sortAsc ? a[0].localeCompare(b[0]) : b[0].localeCompare(a[0])), [query, statuses, sortAsc, merchantRows]);
  return <><PageHeader title="Merchants" description="Manage merchant availability, categorisation, and channel details." actions={<Button><Plus />Add new</Button>} /><FilterBar query={query} setQuery={setQuery} statuses={statuses} setStatuses={setStatuses} showChannel /><div className="overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-310 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th className="sticky left-0 z-10 bg-muted px-4 py-2 shadow-sticky-left"><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortAsc(!sortAsc)}>Name <ChevronDown className={cn("transition-transform", !sortAsc && "rotate-180")} /></Button></th><th>Channel</th><th>Category</th><th>Offers</th><th>Commission</th><th>Cities</th><th>Order</th><th>Status</th><th className="pr-4 text-right">Actions</th></tr></thead><tbody>{rows.map((m) => <tr key={m[0]} className="group border-t border-border hover:bg-muted/50"><td className="sticky left-0 z-10 bg-card px-4 py-2 font-semibold shadow-sticky-left group-hover:bg-muted">{m[0]}</td><td><span className="inline-flex items-center gap-1.5 font-medium"><span className={cn("h-2 w-2 rounded-full", m[1] === "Online" ? "bg-success" : "bg-info")} />{m[1]}</span></td><td>{m[2]}</td><td><span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground"><Tag className="h-3 w-3" />{m[5]} active</span></td><td className="whitespace-nowrap font-semibold">{m[6]}</td><td><div className="flex min-w-64 items-center gap-1">{m[7].slice(0, 3).map((city) => <span key={city} className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium">{city}</span>)}{m[7].length > 3 && <TooltipProvider><UiTooltip><UiTooltipTrigger asChild><button type="button" className="rounded-full border border-border bg-accent px-2 py-0.5 text-xs font-semibold text-primary">+{m[7].length - 3} more</button></UiTooltipTrigger><UiTooltipContent>{m[7].join(", ")}</UiTooltipContent></UiTooltip></TooltipProvider>}</div></td><td>{m[3]}</td><td><StatusBadge status={m[4] as Status} /></td><td className="pr-3 text-right"><IconButton className="h-7 w-7" label={`Edit ${m[0]}`} onClick={() => onEdit(m)}><Pencil className="h-3.5 w-3.5" /></IconButton><IconButton className="h-7 w-7" label={`Open ${m[0]}`} onClick={() => onEdit(m)}><ExternalLink className="h-3.5 w-3.5" /></IconButton></td></tr>)}</tbody></table></div></div><div className="mt-4 flex items-center justify-between text-sm text-muted-foreground"><span>Showing {rows.length} of {merchantRows.length} merchants</span><div className="flex gap-1"><Button variant="outline" size="icon" disabled><ChevronLeft /></Button><Button variant="outline" size="icon"><ChevronRight /></Button></div></div></>;
}

function OffersPage({ offers, onEdit, onCreate, onDelete }: { offers: Offer[]; onEdit: (offer: Offer) => void; onCreate: () => void; onDelete: (offer: Offer) => void }) {
  const [query, setQuery] = useState(""); const [statuses, setStatuses] = useState<Status[]>([]); const [merchantFilter, setMerchantFilter] = useState("all"); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  const filtered = offers.filter((offer) => (!query || `${offer.headline} ${offer.merchant}`.toLowerCase().includes(query.toLowerCase())) && (!statuses.length || statuses.includes(offer.active ? "Active" : "Inactive")) && (merchantFilter === "all" || offer.merchant === merchantFilter));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize)); const currentPage = Math.min(page, pageCount); const start = (currentPage - 1) * pageSize; const rows = filtered.slice(start, start + pageSize);
  return <><PageHeader title="Cashback Offers" description="Manage customer cashback, merchant commissions, validity, and visibility." actions={<Button onClick={onCreate}><Plus />Add new offer</Button>} /><div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search offer headline or merchant…" /></div><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline"><Filter />Status{statuses.length ? ` (${statuses.length})` : ""}<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent>{(["Active", "Inactive"] as Status[]).map((status) => <DropdownMenuCheckboxItem key={status} checked={statuses.includes(status)} onCheckedChange={() => { setStatuses(statuses.includes(status) ? statuses.filter((item) => item !== status) : [...statuses, status]); setPage(1); }}>{status}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu><Select value={merchantFilter} onValueChange={(value) => { setMerchantFilter(value); setPage(1); }}><SelectTrigger className="w-full lg:w-52"><SelectValue placeholder="All merchants" /></SelectTrigger><SelectContent><SelectItem value="all">All merchants</SelectItem>{merchants.map((merchant) => <SelectItem key={merchant[0]} value={merchant[0]}>{merchant[0]}</SelectItem>)}</SelectContent></Select></div><OfferTable offers={rows} onEdit={onEdit} onDelete={onDelete} showMerchant /><div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap items-center gap-4"><span>Showing <strong className="text-foreground">{filtered.length ? start + 1 : 0}</strong> to <strong className="text-foreground">{Math.min(start + pageSize, filtered.length)}</strong> of <strong className="text-foreground">{filtered.length}</strong> results</span><div className="flex items-center gap-2">Rows per page<Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}><SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger><SelectContent>{[10, 25, 50, 100].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select></div></div><div className="flex gap-1"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft />Previous</Button><Button size="icon" className="h-8 w-8">{currentPage}</Button><Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight /></Button></div></div></>;
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
  return <><PageHeader title="Online Conversions" description="Review conversion lifecycle, commission values, and settlement status." actions={<><Button variant="outline"><Download />Export CSV</Button><Button onClick={() => setImportOpen(true)}><UploadCloud />Import & Export</Button></>} /><FilterBar query={query} setQuery={setSearch} statuses={statuses} setStatuses={setStatusFilter} /><div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar max-w-full overflow-x-auto"><table className="w-max min-w-520 border-separate border-spacing-0 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>{["Cashback ID", "Click ID", "Order ID", "Merchant", "Status", "Order Value", "Commission Reported", "Commission Calculated", "Order Date", "Date Created", "Date Approved/Rejected", "Rejection Reason", "Internal Notes", "Withdrawal ID", "Invoice Number"].map((label, index) => <th key={label} className={cn("sticky top-0 z-10 border-b border-border bg-muted/90 px-4 py-2 backdrop-blur", index === 0 && "left-0 z-30 shadow-sticky-left")}>{label}</th>)}<th className="sticky right-0 top-0 z-30 border-b border-border bg-muted/90 pr-4 text-right backdrop-blur shadow-sticky-right">Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r.cashback} className="group hover:bg-muted/50"><td className="sticky left-0 z-20 border-b border-border bg-card px-4 py-2 shadow-sticky-left group-hover:bg-muted"><span className="flex items-center gap-1 font-mono text-xs font-semibold">{r.cashback}<CopyButton value={r.cashback} /></span></td><td className="border-b border-border font-mono text-xs"><span className="flex items-center gap-1">{r.click ?? "—"}{r.click && <CopyButton value={r.click} />}</span></td><td className="border-b border-border font-mono text-xs"><span className="flex items-center gap-1">{r.order}<CopyButton value={r.order} /></span></td><td className="border-b border-border"><span className="inline-flex items-center gap-2 font-medium"><span className="flex h-5 w-5 items-center justify-center rounded bg-accent text-primary"><Store className="h-3 w-3" /></span>{r.merchant}</span></td><td className="border-b border-border"><StatusBadge status={r.status} /></td><td className="border-b border-border font-medium">{r.value}</td><td className="border-b border-border">{r.reported}</td><td className="border-b border-border font-semibold">{r.calculated}</td><td className="border-b border-border text-muted-foreground">{r.orderDate}</td><td className="border-b border-border text-muted-foreground">{r.created}</td><td className="border-b border-border text-muted-foreground">{r.resolved ?? "—"}</td><td className="border-b border-border">{r.rejection ?? "—"}</td><td className="max-w-52 truncate border-b border-border text-muted-foreground" title={r.notes}>{r.notes}</td><td className="border-b border-border font-mono text-xs">{r.withdrawal ?? "—"}</td><td className="border-b border-border font-mono text-xs">{r.invoice ?? "—"}</td><td className="sticky right-0 z-20 border-b border-border bg-card pr-3 text-right shadow-sticky-right group-hover:bg-muted"><span className="inline-flex items-center"><IconButton className="h-7 w-7" label={`Edit ${r.cashback}`} onClick={() => act(r, "edit")}><Pencil className="h-3.5 w-3.5" /></IconButton><CopyButton value={r.cashback} /><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`More actions for ${r.cashback}`}><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => act(r, "edit")}><Pencil />Edit details</DropdownMenuItem><DropdownMenuItem><ExternalLink />Open conversion</DropdownMenuItem>{!(["Requested", "Paid"] as Status[]).includes(r.status) && <><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:bg-destructive-soft focus:text-destructive" onSelect={() => act(r, "delete")}><Trash2 />Delete</DropdownMenuItem></>}</DropdownMenuContent></DropdownMenu></span></td></tr>)}</tbody></table></div></div><div className="mt-4 grid gap-4 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><div className="flex min-w-0 flex-wrap items-center gap-4"><span>Showing <strong className="text-foreground">{filtered.length ? start + 1 : 0}</strong> to <strong className="text-foreground">{Math.min(start + pageSize, filtered.length)}</strong> of <strong className="text-foreground">{filtered.length}</strong> results</span><div className="flex shrink-0 items-center gap-2"><span>Rows per page</span><Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}><SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger><SelectContent>{[10, 25, 50, 100].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select></div></div><div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-1 lg:justify-end"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft />Previous</Button>{pageItems.map((item, index) => { const previous = pageItems[index - 1]; return <span key={item} className="contents">{previous !== undefined && item - previous > 1 && <span className="px-1">…</span>}<Button variant={item === currentPage ? "default" : "outline"} size="icon" className="h-8 w-8 shrink-0" onClick={() => setPage(item)} aria-current={item === currentPage ? "page" : undefined}>{item}</Button></span>; })}<Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight /></Button></div></div><ImportModal open={importOpen} onOpenChange={setImportOpen} /><ConversionModal key={`${selected?.cashback ?? "none"}-${mode ?? "none"}`} row={selected} mode={mode} onSave={saveConversion} onDelete={deleteConversion} onClose={() => { setSelected(null); setMode(null); }} /></>;
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
  const [editingAffiliateNetwork, setEditingAffiliateNetwork] = useState<AffiliateNetwork | null>(null);
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
  const content = view === "dashboard" ? <Dashboard />
    : view === "merchants" ? <Merchants rows={merchantRows} onEdit={editMerchant} />
    : view === "reviews" ? <ReviewsPage reviews={reviewRows} merchantNames={merchantRows.map((row) => row[0])} onApprove={approveReview} onReject={rejectReview} onRevert={revertReview} onDelete={deleteReview} />
    : view === "trackier-queue" ? <TrackierQueue campaigns={campaignRows} runs={syncRuns} categories={categoryRows} syncing={syncing} onSync={runSync} onChange={changeCampaign} onApprove={approveCampaign} onReject={rejectCampaign} />
    : view === "affiliate-networks" ? <AffiliateNetworksPage networks={affiliateNetworkRows} onCreate={() => { setEditingAffiliateNetwork(null); setView("affiliate-network-new"); }} onEdit={(network) => { setEditingAffiliateNetwork(network); setView("affiliate-network-edit"); }} onDelete={deleteAffiliateNetwork} />
    : view === "affiliate-network-new" ? <AffiliateNetworkFormPage key="new-affiliate-network" network={null} onCancel={backToAffiliateNetworks} onSave={saveAffiliateNetwork} onDelete={deleteAffiliateNetwork} />
    : view === "affiliate-network-edit" && editingAffiliateNetwork ? <AffiliateNetworkFormPage key={editingAffiliateNetwork.id} network={editingAffiliateNetwork} onCancel={backToAffiliateNetworks} onSave={saveAffiliateNetwork} onDelete={deleteAffiliateNetwork} />
    : view === "merchant-onboarding-queue" ? <OnboardingQueue applications={applicationRows} onApprove={approveApplication} onReject={rejectApplication} onRevert={revertApplication} onDelete={deleteApplication} />
    : view === "cashback-claims" ? <CashbackClaims claims={claimRows} onApprove={approveClaim} onReject={rejectClaim} onRevert={revertClaim} onDelete={deleteClaim} />
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
  return <div className="flex h-screen overflow-hidden bg-background text-foreground"><Sidebar view={view} setView={(next) => { setView(next); if (next !== "merchant-edit" && next !== "offer-edit") setEditingMerchant(null); if (next !== "category-edit" && next !== "category-new") setEditingCategory(null); if (next !== "promo-banner-edit" && next !== "promo-banner-new") setEditingPromoBanner(null); if (next !== "affiliate-network-edit" && next !== "affiliate-network-new") setEditingAffiliateNetwork(null); }} open={sidebarOpen} setOpen={setSidebarOpen} /><div className="min-w-0 flex-1 overflow-y-auto"><div className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-card/95 px-4 backdrop-blur md:hidden"><IconButton label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu /></IconButton><span className="ml-2 font-heading font-bold">OfferPe Admin</span></div><main className="mx-auto w-full max-w-400 p-4 sm:p-6 lg:p-8">{content}</main></div></div>;
}
