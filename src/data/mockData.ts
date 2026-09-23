import { Categories } from "@/screens/CategoriesScreen";
import { Clicks } from "@/screens/ClicksScreen";
import { Merchants } from "@/screens/MerchantsScreen";
import { Conversions } from "@/screens/OnlineConversionsScreen";
import { Transactions } from "@/screens/TransactionsScreen";
import { Withdrawals } from "@/screens/WithdrawalsScreen";
import type { AdminRole, AdminUser, AffiliateNetwork, AnalyticsEvent, AppBuild, Application, Category, CityRecord, Claim, ClickRecord, CommunicationDispatch, CommunicationTemplate, Conversion, LedgerEntry, LegalPage, Merchant, MerchantStaff, NotificationLog, Offer, OfflineTransaction, OnboardingSlide, OnlineTransaction, Permission, PermissionGroupName, PromoBanner, PromoSection, RawMapping, RejectionCategory, RejectionReason, ResolutionQueueItem, Review, StagedCampaign, SyncRun, TemplateChannel, UserRecord, View, Withdrawal } from "@/types/admin";
import { ArrowDown, BadgeIndianRupee, Bell, Building2, Check, CircleDollarSign, ClipboardCheck, DownloadCloud, FileText, Flag, Image as ImageIcon, Mail, Megaphone, MessageSquare, MousePointerClick, RotateCcw, Settings2, Share2, ShieldCheck, ShoppingBag, SlidersHorizontal, Smartphone, Star, Store, Tag, Users, WalletCards } from "lucide-react";

export const groups = [
  { label: "Catalog", icon: ShoppingBag, items: [{ label: "Merchants", icon: Store, view: "merchants" as View }, { label: "Offers", icon: Tag, view: "offers" as View }, { label: "Promo Banners", icon: Megaphone, view: "promo-banners" as View }, { label: "Merchant Reviews", icon: Star, view: "reviews" as View }, { label: "Categories", icon: Tag, view: "categories" as View }] },
  { label: "Operations", icon: Settings2, items: [{ label: "Merchant Onboarding Queue", icon: ClipboardCheck, view: "merchant-onboarding-queue" as View }, { label: "Trackier Import Queue", icon: DownloadCloud, view: "trackier-queue" as View }, { label: "Affiliate Networks", icon: Share2, view: "affiliate-networks" as View }, { label: "Category Mapping", icon: Tag, view: "category-mapping" as View }] },
  { label: "Financial", icon: WalletCards, items: [{ label: "Cashback Claims", icon: CircleDollarSign, view: "cashback-claims" as View }, { label: "Conversion Resolutions", icon: RotateCcw, view: "conversion-resolutions" as View }, { label: "Online Conversions", icon: CircleDollarSign, view: "conversions" as View }, { label: "Transactions", icon: ArrowDown, view: "transactions" as View }, { label: "Clicks", icon: MousePointerClick, view: "clicks" as View }, { label: "Withdrawals", icon: BadgeIndianRupee, view: "withdrawals" as View }, { label: "Rejection Reasons", icon: Flag, view: "rejection-reasons" as View }] },
  { label: "Communication", icon: Megaphone, items: [{ label: "Templates", icon: MessageSquare, view: "communication-templates" as View }, { label: "Dispatches & Notifications", icon: Bell, view: "communication-dispatches" as View }] },
  { label: "System", icon: SlidersHorizontal, items: [{ label: "Users", icon: Users, view: "users" as View }, { label: "Cities", icon: Building2, view: "cities" as View }, { label: "App Versions", icon: Smartphone, view: "app-versions" as View }, { label: "Onboarding Screens", icon: ImageIcon, view: "onboarding-screens" as View }, { label: "Merchant Staff", icon: Store, view: "merchant-staff" as View }, { label: "Legal Pages", icon: FileText, view: "legal-pages" as View }, { label: "Admins", icon: Mail, view: "admin-users" as View }, { label: "Roles", icon: ShieldCheck, view: "roles" as View }, { label: "Settings", icon: Settings2, view: "settings" as View }] },
];

export const merchants = [
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

export const initialOffers: Offer[] = [
  { id: "OFF-1042", merchant: "Theobroma", headline: "Flat 10% cashback", subtext: "On all bakery items", details: "Get 10% of your bill amount credited as OfferPe wallet balance.", terms: "Valid on in-store purchases only.", discountType: "Percentage", discountValue: 10, commissionType: "Percentage", commissionValue: 5, start: "2026-08-29T06:53", end: "2026-09-30T23:59", minBill: 299, sortOrder: 1, discountCap: 100, commissionCap: 50, redirectUrl: "https://offerpe.link/r/theobroma-bakery", voucherLink: "offerpe://voucher/{id}", productLink: "offerpe://product/{slug}", affiliate: "None", featured: true, active: true },
  { id: "OFF-1041", merchant: "Theobroma", headline: "Celebration cakes", subtext: "A sweeter celebration", details: "Earn a flat cashback on celebration cakes.", terms: "Minimum bill value applies.", discountType: "Flat amount", discountValue: 150, commissionType: "Flat amount", commissionValue: 220, start: "2026-09-01T00:00", end: "2026-10-15T23:59", minBill: 999, sortOrder: 2, discountCap: 150, commissionCap: 220, redirectUrl: "", voucherLink: "offerpe://voucher/{id}", productLink: "", affiliate: "None", featured: false, active: true },
  { id: "OFF-1040", merchant: "Theobroma", headline: "First order bonus", subtext: "New customers only", details: "Extra cashback on your first purchase.", terms: "One redemption per customer.", discountType: "Percentage", discountValue: 10, commissionType: "Percentage", commissionValue: 12, start: "2026-09-10T00:00", end: "2026-12-31T23:59", minBill: 499, sortOrder: 3, discountCap: 200, commissionCap: 250, redirectUrl: "", voucherLink: "", productLink: "offerpe://product/{slug}", affiliate: "None", featured: true, active: true },
  { id: "OFF-1039", merchant: "Croma", headline: "Electronics weekend cashback", subtext: "Selected electronics", details: "Cashback on eligible electronics purchased online.", terms: "Exclusions apply.", discountType: "Percentage", discountValue: 4, commissionType: "Percentage", commissionValue: 6, start: "2026-09-01T00:00", end: "2026-11-30T23:59", minBill: 4999, sortOrder: 1, discountCap: 1500, commissionCap: 2000, redirectUrl: "https://offerpe.link/r/croma", voucherLink: "", productLink: "", affiliate: "Trackier", featured: true, active: true },
  { id: "OFF-1038", merchant: "Nykaa", headline: "Beauty essentials cashback", subtext: "Across selected brands", details: "Earn cashback on qualifying beauty purchases.", terms: "Selected products only.", discountType: "Percentage", discountValue: 8, commissionType: "Percentage", commissionValue: 11, start: "2026-08-15T00:00", end: "2026-10-31T23:59", minBill: 799, sortOrder: 2, discountCap: 500, commissionCap: 650, redirectUrl: "https://offerpe.link/r/nykaa", voucherLink: "", productLink: "", affiliate: "Impact", featured: false, active: true },
  { id: "OFF-1037", merchant: "Myntra", headline: "Fashion season offer", subtext: "App-only savings", details: "Cashback on fashion orders.", terms: "Not valid with select coupons.", discountType: "Percentage", discountValue: 6, commissionType: "Percentage", commissionValue: 9, start: "2026-07-01T00:00", end: "2026-08-31T23:59", minBill: 999, sortOrder: 4, discountCap: 400, commissionCap: 600, redirectUrl: "https://offerpe.link/r/myntra", voucherLink: "", productLink: "", affiliate: "Involve Asia", featured: false, active: false },
];

export const initialCategories: Category[] = [
  { id: "CAT-101", channel: "Offline", name: "Restaurants", order: 1, active: true, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=240", line1: "Eat out. Earn more.", line2: "Cashback at restaurants near you." },
  { id: "CAT-102", channel: "Online", name: "Fashion", order: 2, active: true, image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=240", line1: "Fresh styles, rewarding prices.", line2: "Shop fashion from leading brands." },
  { id: "CAT-103", channel: "Online", name: "Electronics", order: 3, active: true, image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=240", line1: "Upgrade and earn.", line2: "Cashback on the latest technology." },
  { id: "CAT-104", channel: "Online", name: "Beauty", order: 4, active: true, image: "", line1: "Beauty that gives back.", line2: "Discover everyday essentials." },
  { id: "CAT-105", channel: "Offline", name: "Department Stores", order: 5, active: false, image: "", line1: "Everything in one place.", line2: "More value on every visit." },
  { id: "CAT-106", channel: "Online", name: "Travel", order: 6, active: true, image: "", line1: "Go farther for less.", line2: "Rewards on flights and stays." },
];

export const initialMappings: RawMapping[] = [
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

export const initialAffiliateNetworks: AffiliateNetwork[] = [
  { id: "NET-101", name: "Trackier", propertyId: "", storeTemplate: "{tracking_url}&source={click_id}", voucherTemplate: "{voucher_deeplink}&source={click_id}", productTemplate: "{product_deeplink}&source={click_id}", active: true },
  { id: "NET-102", name: "Cuelinks", propertyId: "offerpe_in", storeTemplate: "https://linksredirect.com/?cid={property_id}&source={click_id}&url={deeplink_encoded}", voucherTemplate: "https://linksredirect.com/?cid={property_id}&source={click_id}&url={voucher_deeplink}", productTemplate: "https://linksredirect.com/?cid={property_id}&source={click_id}&url={product_deeplink}", active: true },
  { id: "NET-103", name: "vCommission", propertyId: "VC-48291", storeTemplate: "https://tracking.vcommission.com/aff_c?offer_id={property_id}&aff_sub={click_id}&url={deeplink_encoded}", voucherTemplate: "", productTemplate: "", active: false },
];

export const initialPromoBanners: PromoBanner[] = [
  { id: "PB-101", section: "HERO", headline: "Flat cashback on your first order", image: "", tag: "NEW USERS", ctaText: "Claim Cashback", ctaTarget: "offerpe://offers/first-order", order: 1, start: "2026-08-29T10:19", end: "", active: true },
  { id: "PB-102", section: "PREMIUM DEALS", headline: "Absolute Barbecues: unlimited grills, 15% cashback", image: "", tag: "DINING", ctaText: "View Offer", ctaTarget: "offerpe://merchant/absolute-barbecues", order: 1, start: "2026-09-01T09:00", end: "2026-10-31T23:59", active: true },
  { id: "PB-103", section: "FLASH OFFERS", headline: "Croma: extra 5% cashback in-store", image: "", tag: "LIMITED TIME", ctaText: "Shop Now", ctaTarget: "offerpe://merchant/croma", order: 1, start: "2026-09-10T08:00", end: "2026-09-30T23:59", active: true },
  { id: "PB-104", section: "NEW ON PLATFORM", headline: "MakeMyTrip is now live on OfferPe", image: "", tag: "NEW", ctaText: "Explore", ctaTarget: "offerpe://merchant/makemytrip", order: 1, start: "2026-09-12T09:00", end: "", active: true },
  { id: "PB-105", section: "NEW ON PLATFORM", headline: "Big Bazaar is now live on OfferPe", image: "", tag: "NEW", ctaText: "Explore", ctaTarget: "offerpe://merchant/big-bazaar", order: 2, start: "2026-09-14T09:00", end: "", active: true },
  { id: "PB-106", section: "HERO", headline: "Festive season is here", image: "", tag: "FESTIVE", ctaText: "Discover Deals", ctaTarget: "offerpe://category/festive", order: 2, start: "2026-09-18T09:00", end: "2026-11-05T23:59", active: true },
  { id: "PB-107", section: "FLASH OFFERS", headline: "Nykaa: flash sale, up to 10% cashback", image: "", tag: "FLASH SALE", ctaText: "Shop Now", ctaTarget: "offerpe://merchant/nykaa", order: 2, start: "2026-09-20T09:00", end: "2026-09-25T23:59", active: true },
  { id: "PB-108", section: "PREMIUM DEALS", headline: "Myntra: up to 12% cashback on fashion", image: "", tag: "FASHION", ctaText: "View Offer", ctaTarget: "offerpe://merchant/myntra", order: 2, start: "2026-09-21T09:00", end: "2026-10-15T23:59", active: true },
];

export const onboardingRejectionReasons = ["Invalid GST/FSSAI documents", "Store category outside OfferPe scope", "Commission rate below platform threshold", "Unverifiable store location / storefront", "Duplicate merchant registration"];

export const initialApplications: Application[] = [
  { id: "APP-3012", store: "Blue Tokai Coffee Roasters", category: "Cafes & Dining", owner: "Nikhil Desai", phone: "+91 98200 41122", email: "nikhil@bluetokai.example", address: "Linking Road, Bandra West", city: "Mumbai", commission: "12%", documents: ["GST registration", "FSSAI license", "Storefront photo"], submitted: "21 Sep 2026, 08:40", status: "Pending", reason: "", note: "" },
  { id: "APP-3011", store: "Third Wave Coffee Roasters", category: "Cafes & Dining", owner: "Shruti Kulkarni", phone: "+91 99019 77340", email: "shruti@thirdwave.example", address: "100 Feet Road, Indiranagar", city: "Bengaluru", commission: "10%", documents: ["GST registration", "FSSAI license"], submitted: "20 Sep 2026, 17:12", status: "Pending", reason: "", note: "" },
  { id: "APP-3010", store: "Urban Threads Studio", category: "Retail", owner: "Farhan Qureshi", phone: "+91 98111 22003", email: "farhan@urbanthreads.example", address: "Khan Market", city: "New Delhi", commission: "9%", documents: ["GST registration", "Storefront photo"], submitted: "19 Sep 2026, 12:05", status: "Approved", reason: "", note: "" },
  { id: "APP-3009", store: "Sunrise Kirana Mart", category: "Grocery", owner: "Rekha Patil", phone: "+91 90040 55871", email: "rekha@sunrisemart.example", address: "Kothrud", city: "Pune", commission: "4%", documents: ["GST registration"], submitted: "18 Sep 2026, 10:22", status: "Rejected", reason: "Commission rate below platform threshold", note: "Offered 4%, platform minimum for grocery is 6%." },
  { id: "APP-3008", store: "Glow Aesthetics Clinic", category: "Wellness", owner: "Dr. Ira Menon", phone: "+91 97400 31188", email: "ira@glowaesthetics.example", address: "Jubilee Hills", city: "Hyderabad", commission: "14%", documents: ["GST registration", "Storefront photo"], submitted: "17 Sep 2026, 15:48", status: "Approved", reason: "", note: "" },
  { id: "APP-3007", store: "Cafe Mocha Lane", category: "Cafes & Dining", owner: "Vikram Joshi", phone: "+91 98330 90210", email: "vikram@mochalane.example", address: "Salt Lake Sector V", city: "Kolkata", commission: "11%", documents: ["Storefront photo"], submitted: "16 Sep 2026, 09:31", status: "Rejected", reason: "Invalid GST/FSSAI documents", note: "GST certificate was illegible and FSSAI licence missing." },
];

export const claimRejectionReasons = ["No matching click found", "Order placed outside OfferPe click window", "Order cancelled or returned", "Proof of purchase unreadable", "Duplicate claim for the same order", "Merchant category excluded from cashback"];

export const rejectionCategories = ["Transaction Rejection Reason", "Retailer Onboarding Rejection Reason", "Review Rejection Reason", "Cashback Claims Rejection Reason", "Withdrawal Rejection Reason"] as const;

export const rejectionCategoryShort: Record<RejectionCategory, string> = { "Transaction Rejection Reason": "Transaction", "Retailer Onboarding Rejection Reason": "Retailer Onboarding", "Review Rejection Reason": "Review", "Cashback Claims Rejection Reason": "Cashback Claims", "Withdrawal Rejection Reason": "Withdrawal" };

export const initialRejectionReasons: RejectionReason[] = [
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

export const templateChannels: TemplateChannel[] = ["Email", "SMS", "WhatsApp", "Notification"];

export const initialCommunicationTemplates: CommunicationTemplate[] = [
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

export const initialClaims: Claim[] = [
  { id: "CLM-5042", userId: "USR-88214", user: "Ananya Rao", merchant: "Myntra", orderId: "MYN-77120934", clickId: "clk_9f42ab7c", claimDate: "21 Sep 2026", claimTime: "09:12", orderDate: "14 Sep 2026", orderValue: 4299, expectedCashback: 344, proof: "order-confirmation.png", comment: "Cashback did not track even though I came through the OfferPe app.", status: "Pending", reason: "", note: "" },
  { id: "CLM-5041", userId: "USR-75903", user: "Rahul Menon", merchant: "Croma", orderId: "CRM-4408217", clickId: "clk_2b71de09", claimDate: "20 Sep 2026", claimTime: "18:44", orderDate: "12 Sep 2026", orderValue: 28990, expectedCashback: 1449, proof: "invoice-croma.pdf", comment: "Bought a washing machine, cashback still missing after 7 days.", status: "Pending", reason: "", note: "" },
  { id: "CLM-5040", userId: "USR-91247", user: "Sneha Iyer", merchant: "Nykaa", orderId: "NYK-33019876", clickId: "clk_77c1a4e2", claimDate: "20 Sep 2026", claimTime: "11:05", orderDate: "11 Sep 2026", orderValue: 2150, expectedCashback: 215, proof: "nykaa-order.png", comment: "Order delivered, no cashback in wallet.", status: "Pending", reason: "", note: "" },
  { id: "CLM-5039", userId: "USR-68450", user: "Imran Shaikh", merchant: "Myntra", orderId: "MYN-77118420", clickId: "clk_51ba0d33", claimDate: "19 Sep 2026", claimTime: "16:20", orderDate: "08 Sep 2026", orderValue: 1899, expectedCashback: 152, proof: "myntra-order.png", comment: "Missing cashback on a fashion order.", status: "Approved", reason: "", note: "Click found in logs, conversion created with source = CLAIM." },
  { id: "CLM-5038", userId: "USR-83172", user: "Priya Nair", merchant: "Croma", orderId: "CRM-4407004", clickId: "", claimDate: "18 Sep 2026", claimTime: "10:02", orderDate: "05 Sep 2026", orderValue: 7499, expectedCashback: 375, proof: "screenshot.jpg", comment: "Cashback not credited.", status: "Rejected", reason: "No matching click found", note: "No OfferPe click recorded within 30 days of the order date." },
  { id: "CLM-5037", userId: "USR-59310", user: "Devansh Gupta", merchant: "Nykaa", orderId: "NYK-33015512", clickId: "clk_1de9f004", claimDate: "17 Sep 2026", claimTime: "14:37", orderDate: "02 Sep 2026", orderValue: 999, expectedCashback: 100, proof: "nykaa-invoice.pdf", comment: "Placed via app, no cashback.", status: "Approved", reason: "", note: "" },
  { id: "CLM-5036", userId: "USR-70188", user: "Meera Krishnan", merchant: "Myntra", orderId: "MYN-77101288", clickId: "clk_84aa22b1", claimDate: "16 Sep 2026", claimTime: "09:55", orderDate: "29 Aug 2026", orderValue: 3499, expectedCashback: 280, proof: "order.png", comment: "Returned one item but kept the rest.", status: "Rejected", reason: "Order cancelled or returned", note: "Merchant reported the full order as returned." },
];

export const campaignRejectionReasons = ["Duplicate merchant", "Inactive affiliate program", "Commission below platform threshold", "Category outside OfferPe scope", "Incomplete campaign data"];

export const initialCampaigns: StagedCampaign[] = [
  { id: "TRK-1123", trackierId: "#1123", name: "Strch", categoryId: "CAT-102", rawCategory: "fashion", about: "Strch, India's first and softest activewear brand, crafts high-quality sportswear that feels as good as it looks. Our clothing is made with engineered Nylon Spandex fabric, designed to provide the perfect balance of comfort, flexibility, and durability. Brand Bidding/PPC/Meta ads, etc., are strictly prohibited.", logo: "https://static.vnative.co/images/6aa91555eb372.png", website: "https://strch.com", trackingTime: "5", approvalTime: "45", displayOrder: "3", attribution: "Web", trackingUrl: "https://track.techtrack.in/click?campaign_id=1123&pub_id=679", offers: [{ headline: "Strch", terms: "Do not visit the merchant's website through any other source before using our link. Try to complete your purchase within 30 minutes of clicking our tracking link. Use only coupon codes available on our platform. Third-party coupon codes may invalidate your cashback.", discountType: "%", discountValue: "19.2", commissionType: "%", commissionValue: "32" }] },
  { id: "TRK-1125", trackierId: "#1125", name: "Bersache", categoryId: "", rawCategory: "Men's Footwear", about: "", logo: "", website: "https://bersache.com", trackingTime: "10", approvalTime: "60", displayOrder: "1", attribution: "Web", trackingUrl: "https://track.techtrack.in/click?campaign_id=1125&pub_id=679", offers: [{ headline: "Bersache", terms: "Complete the purchase in a single session after clicking the tracking link. Cashback is void on cancelled or returned orders.", discountType: "%", discountValue: "18", commissionType: "%", commissionValue: "30" }] },
  { id: "TRK-1128", trackierId: "#1128", name: "Bombay Shaving Company", categoryId: "CAT-104", rawCategory: "health and personal care", about: "Bombay Shaving Company builds precision grooming products for men and women — razors, beard care, skincare and gifting ranges designed and manufactured in India.", logo: "https://static.vnative.co/images/9bd21a44ce118.png", website: "https://bombayshavingcompany.com", trackingTime: "8", approvalTime: "30", displayOrder: "2", attribution: "Web", trackingUrl: "https://track.techtrack.in/click?campaign_id=1128&pub_id=679", offers: [{ headline: "Bombay Shaving Company", terms: "Cashback applies on prepaid orders only. Combo and gift-card purchases are excluded from the cashback programme.", discountType: "%", discountValue: "12.5", commissionType: "%", commissionValue: "22" }] },
];

export const initialSyncRuns: SyncRun[] = [
  { id: "RUN-4019", started: "19 Sept 2026, 12:20 pm", trigger: "MANUAL", status: "SUCCEEDED", fetched: 61, staged: 2, updated: 57, skips: 1, errors: ["Campaign #1131: logo URL returned HTTP 404"] },
  { id: "RUN-4018", started: "2 Sept 2026, 4:21 pm", trigger: "MANUAL", status: "SUCCEEDED", fetched: 64, staged: 19, updated: 44, skips: 1, errors: [] },
  { id: "RUN-4017", started: "2 Sept 2026, 5:43 am", trigger: "MANUAL", status: "SUCCEEDED", fetched: 13, staged: 0, updated: 12, skips: 1, errors: [] },
  { id: "RUN-4016", started: "2 Sept 2026, 5:36 am", trigger: "SCHEDULED", status: "SUCCEEDED", fetched: 13, staged: 0, updated: 12, skips: 1, errors: [] },
];

export const rejectionReasons = ["Profanity / abusive content", "Irrelevant / spam", "False or misleading claims", "Competitor promotion", "Personal identification information (PII)"];

export const initialReviews: Review[] = [
  { id: "REV-2041", user: "Ananya Sharma", merchant: "Theobroma", rating: 5, comment: "The brownies were fresh and the staff applied my OfferPe cashback instantly at billing. Great experience overall.", photos: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=320", "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=320"], submitted: "21 Sep 2026, 09:14", status: "Pending", reason: "", note: "" },
  { id: "REV-2040", user: "Rahul Mehta", merchant: "Croma", rating: 4, comment: "Bought a soundbar in-store. Cashback tracked within a day, though the billing queue was long on a weekend.", photos: [], submitted: "20 Sep 2026, 18:42", status: "Pending", reason: "", note: "" },
  { id: "REV-2039", user: "Priya Nair", merchant: "Absolute Barbecues", rating: 5, comment: "Buffet spread was excellent and the team knew exactly how the OfferPe QR flow works.", photos: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=320"], submitted: "20 Sep 2026, 13:05", status: "Pending", reason: "", note: "" },
  { id: "REV-2038", user: "Kabir Singh", merchant: "Nykaa", rating: 4, comment: "Ordered skincare during the sale. Cashback reflected correctly in the wallet.", photos: [], submitted: "19 Sep 2026, 11:30", status: "Approved", reason: "", note: "" },
  { id: "REV-2037", user: "Meera Iyer", merchant: "Theobroma", rating: 5, comment: "Celebration cake was delivered on time and the store honoured the running offer.", photos: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=320"], submitted: "18 Sep 2026, 16:20", status: "Approved", reason: "", note: "" },
  { id: "REV-2036", user: "Devansh Gupta", merchant: "Myntra", rating: 2, comment: "Check out shopdealz dot in instead, much better prices than here.", photos: [], submitted: "17 Sep 2026, 08:55", status: "Rejected", reason: "Competitor promotion", note: "Review promotes an external marketplace." },
  { id: "REV-2035", user: "Sana Khan", merchant: "Croma", rating: 3, comment: "Decent service. Call me on my number for details about the offer.", photos: [], submitted: "16 Sep 2026, 19:10", status: "Rejected", reason: "Personal identification information (PII)", note: "Contact details shared in public review." },
  { id: "REV-2034", user: "Arjun Rao", merchant: "MakeMyTrip", rating: 5, comment: "Flight booking cashback was credited faster than expected. Smooth process.", photos: [], submitted: "15 Sep 2026, 21:48", status: "Approved", reason: "", note: "" },
];

export const conversionSeeds: Conversion[] = [
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

export const conversions: Conversion[] = Array.from({ length: 148 }, (_, index) => {
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

export const onlineTransactions: OnlineTransaction[] = [
  { id: "TXN-94128", status: "Pending", userId: "USR-10294", orderValue: 4299, reported: 344, calculated: 322, rejection: "—", click: "clk_9f42ab7c", created: "21 Sep 2026, 09:18", updated: "21 Sep 2026, 09:22" },
  { id: "TXN-94127", status: "Approved", userId: "USR-08471", orderValue: 1890, reported: 151, calculated: 151, rejection: "—", click: "clk_2b71de09", created: "20 Sep 2026, 18:44", updated: "21 Sep 2026, 08:10" },
  { id: "TXN-94125", status: "Rejected", userId: "USR-06322", orderValue: 7499, reported: 375, calculated: 0, rejection: "No matching click found", click: "—", created: "20 Sep 2026, 11:05", updated: "20 Sep 2026, 16:34" },
  { id: "TXN-94122", status: "Pending", userId: "USR-11806", orderValue: 2150, reported: 215, calculated: 204, rejection: "—", click: "clk_77c1a4e2", created: "19 Sep 2026, 17:26", updated: "19 Sep 2026, 17:26" },
  { id: "TXN-94119", status: "Approved", userId: "USR-04519", orderValue: 28990, reported: 1449, calculated: 1377, rejection: "—", click: "clk_51ba0d33", created: "19 Sep 2026, 10:02", updated: "20 Sep 2026, 09:41" },
];

export const offlineTransactions: OfflineTransaction[] = [
  { id: "OFF-78321", status: "Pending Bill", userId: "USR-09734", billAmount: null, discount: null, payable: null, commission: null, confirmedBy: "—", merchant: "Absolute Barbecues", occurred: "19 Sep 2026, 06:08" },
  { id: "OFF-78318", status: "Approved", userId: "USR-08152", billAmount: 2380, discount: 238, payable: 2142, commission: 286, confirmedBy: "Rahul S.", merchant: "Theobroma", occurred: "18 Sep 2026, 20:14" },
  { id: "OFF-78312", status: "Approved", userId: "USR-06290", billAmount: 1650, discount: 165, payable: 1485, commission: 198, confirmedBy: "Neha P.", merchant: "Blue Tokai Coffee", occurred: "18 Sep 2026, 17:42" },
  { id: "OFF-78304", status: "Rejected", userId: "USR-11045", billAmount: 899, discount: null, payable: null, commission: null, confirmedBy: "—", merchant: "Croma", occurred: "17 Sep 2026, 13:09" },
];

export const ledgerEntries: LedgerEntry[] = [
  { id: "LED-6201", type: "OFFLINE_REDEMPTION", userId: "USR-07853", amount: 250, merchant: "—", offer: "—", resolution: "—", occurred: "19 Sep 2026, 11:50" },
  { id: "LED-6202", type: "OFFLINE_REDEMPTION", userId: "USR-09127", amount: 250, merchant: "—", offer: "—", resolution: "—", occurred: "19 Sep 2026, 14:36" },
  { id: "LED-6203", type: "OFFLINE_REDEMPTION", userId: "USR-06418", amount: 250, merchant: "—", offer: "—", resolution: "—", occurred: "19 Sep 2026, 16:06" },
  { id: "LED-6204", type: "ONLINE_PENDING", userId: "USR-10294", amount: 60, merchant: "Croma", offer: "Up to 4% cashback", resolution: "Still pending", occurred: "19 Sep 2026, 19:17" },
  { id: "LED-6205", type: "ONLINE_PENDING", userId: "USR-10294", amount: 60, merchant: "Croma", offer: "Up to 4% cashback", resolution: "Still pending", occurred: "19 Sep 2026, 19:18" },
  { id: "LED-6206", type: "ONLINE_PENDING", userId: "USR-10294", amount: 20, merchant: "Croma", offer: "Up to 4% cashback", resolution: "Still pending", occurred: "19 Sep 2026, 19:20" },
  { id: "LED-6207", type: "OFFLINE_REDEMPTION", userId: "USR-08836", amount: 250, merchant: "—", offer: "—", resolution: "—", occurred: "19 Sep 2026, 19:21" },
  { id: "LED-6208", type: "ONLINE_PENDING", userId: "USR-10294", amount: 60, merchant: "Croma", offer: "Up to 4% cashback", resolution: "Still pending", occurred: "20 Sep 2026, 04:07" },
];

export const clickRecords: ClickRecord[] = [
  { token: "5a63726b883505650248e9c6", occurred: "21 Sep 2026, 12:18 pm", date: "2026-09-21", userId: "USR-10294", merchant: "MakeMyTrip", offer: "Up to 8% cashback", discountType: "Percentage", discountValue: 8, commissionType: null, commissionValue: null, minBill: null, discountCap: null, commissionCap: null },
  { token: "7c81bd24917a4e0f962d315b", occurred: "21 Sep 2026, 11:42 am", date: "2026-09-21", userId: "USR-08471", merchant: "Nykaa", offer: "Beauty essentials cashback", discountType: "Percentage", discountValue: 8, commissionType: "Percentage", commissionValue: 11, minBill: 799, discountCap: 500, commissionCap: 650 },
  { token: "21ef748a53c890db77bc422d", occurred: "21 Sep 2026, 10:16 am", date: "2026-09-21", userId: "USR-06322", merchant: "Croma", offer: "Electronics weekend cashback", discountType: "Percentage", discountValue: 4, commissionType: "Percentage", commissionValue: 6, minBill: 4999, discountCap: 1500, commissionCap: 2000 },
  { token: "af902d77c0124a15b15d0bc8", occurred: "20 Sep 2026, 8:37 pm", date: "2026-09-20", userId: "USR-11806", merchant: "Myntra", offer: "Fashion season offer", discountType: "Percentage", discountValue: 6, commissionType: "Percentage", commissionValue: 9, minBill: 999, discountCap: 400, commissionCap: 600 },
  { token: "b6392c50a43f449aa5da182e", occurred: "20 Sep 2026, 6:04 pm", date: "2026-09-20", userId: "USR-04519", merchant: "Theobroma", offer: "Flat 10% cashback", discountType: "Percentage", discountValue: 10, commissionType: "Percentage", commissionValue: 5, minBill: 299, discountCap: 100, commissionCap: 50 },
  { token: "cf401958299744b8a696f5d4", occurred: "20 Sep 2026, 2:51 pm", date: "2026-09-20", userId: "USR-09734", merchant: "Absolute Barbecues", offer: "Weekend dining rewards", discountType: "Flat amount", discountValue: 250, commissionType: "Percentage", commissionValue: 8, minBill: 1999, discountCap: 250, commissionCap: 350 },
];

export const initialWithdrawals: Withdrawal[] = [
  { id: "WD-009842", userId: "USR-10294", amount: 1250, mode: "Bank Account", payoutDetails: "HDFC Bank • A/C 50100234871642 • IFSC HDFC0001732 • Qaisar Farooq", status: "Requested", requested: "21 Sep 2026, 11:46 am", date: "2026-09-21", resolved: "—", utr: "—", notes: "KYC verified" },
  { id: "WD-009841", userId: "USR-08471", amount: 780, mode: "UPI", payoutDetails: "ananya.shah@okhdfcbank", status: "Requested", requested: "21 Sep 2026, 10:12 am", date: "2026-09-21", resolved: "—", utr: "—", notes: "—" },
  { id: "WD-009839", userId: "USR-06322", amount: 2400, mode: "Bank Account", payoutDetails: "ICICI Bank • A/C 684201001529 • IFSC ICIC0006842 • Rohan Mehta", status: "Paid", requested: "20 Sep 2026, 4:38 pm", date: "2026-09-20", resolved: "21 Sep 2026, 9:30 am", utr: "HDFC20260921018463", notes: "Processed in morning batch" },
  { id: "WD-009836", userId: "USR-11806", amount: 500, mode: "Gift Card", payoutDetails: "Amazon Pay • priya.nair@example.com", status: "Failed", requested: "20 Sep 2026, 12:17 pm", date: "2026-09-20", resolved: "20 Sep 2026, 5:04 pm", utr: "—", notes: "Invalid gift card contact" },
  { id: "WD-009831", userId: "USR-04519", amount: 3150, mode: "UPI", payoutDetails: "vikram.singh@paytm", status: "Paid", requested: "19 Sep 2026, 6:52 pm", date: "2026-09-19", resolved: "20 Sep 2026, 10:02 am", utr: "PAYTM260920018972", notes: "—" },
  { id: "WD-009827", userId: "USR-09734", amount: 925, mode: "Bank Account", payoutDetails: "Axis Bank • A/C 918010047526331 • IFSC UTIB0000918 • Meera Iyer", status: "Requested", requested: "19 Sep 2026, 2:06 pm", date: "2026-09-19", resolved: "—", utr: "—", notes: "First withdrawal" },
];

export const analyticsEvents: AnalyticsEvent[] = [
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

export const communicationDispatches: CommunicationDispatch[] = [
  { id: "DSP-7108", type: "ONLINE_CASHBACK_PENDING", template: "Purchase Tracked", channel: "SMS", title: "Cashback tracked", body: "Your Rs. 60.00 cashback from Croma is now tracked and pending approval.", read: "No", delivery: "FAILED", userId: "USR-10294", occurred: "19 Sept 2026, 6:08 am", date: "2026-09-19" },
  { id: "DSP-7107", type: "ONLINE_CASHBACK_PENDING", template: "Purchase Tracked", channel: "WhatsApp", title: "Cashback tracked", body: "Your Rs. 60.00 cashback from Croma is now tracked and pending approval.", read: "No", delivery: "FAILED", userId: "USR-10294", occurred: "19 Sept 2026, 6:08 am", date: "2026-09-19" },
  { id: "DSP-7106", type: "ONLINE_CASHBACK_PENDING", template: "Purchase Tracked", channel: "Notification", title: "Cashback tracked", body: "Your Rs. 20.00 cashback from Croma is now tracked and pending approval.", read: "No", delivery: "QUEUED", userId: "USR-10294", occurred: "19 Sept 2026, 6:09 am", date: "2026-09-19" },
  { id: "DSP-7105", type: "CASHBACK_APPROVED", template: "Cashback Approved", channel: "SMS", title: "Cashback approved", body: "Congrats! You earned 151 reward points on OfferPe for shopping at Theobroma.", read: "Yes", delivery: "SENT", userId: "USR-08471", occurred: "20 Sept 2026, 8:10 am", date: "2026-09-20" },
  { id: "DSP-7104", type: "MERCHANT_REVIEW_APPROVED", template: "Review Approved", channel: "Email", title: "Your review of Nykaa is live", body: "Hi Ananya, your review of Nykaa has been approved and is now visible to other shoppers.", read: "Yes", delivery: "DELIVERED", userId: "USR-06322", occurred: "20 Sept 2026, 3:24 pm", date: "2026-09-20" },
  { id: "DSP-7103", type: "MERCHANT_ONBOARDING_SUBMITTED", template: "Merchant Onboarding Submitted", channel: "Email", title: "Application received for Blue Tokai Coffee Roasters", body: "Hi Nikhil Desai, we received your application for Blue Tokai Coffee Roasters.", read: "No", delivery: "DELIVERED", userId: "MER-APP-3012", occurred: "21 Sept 2026, 8:40 am", date: "2026-09-21" },
  { id: "DSP-7102", type: "MERCHANT_ONBOARDING_REJECTED", template: "Merchant Onboarding Rejected", channel: "WhatsApp", title: "Application update", body: "Hi Rekha Patil, unfortunately your OfferPe application for Sunrise Kirana Mart was not approved.", read: "No", delivery: "SENT", userId: "MER-APP-3009", occurred: "18 Sept 2026, 1:32 pm", date: "2026-09-18" },
  { id: "DSP-7101", type: "CASHBACK_REJECTED", template: "Cashback Rejected", channel: "Notification", title: "Cashback not approved", body: "Your Rs. 375 cashback claim from Croma was not approved.", read: "No", delivery: "SENT", userId: "USR-83172", occurred: "18 Sept 2026, 10:16 am", date: "2026-09-18" },
];

export const notificationLogs: NotificationLog[] = [
  { id: "NTF-8042", type: "ONLINE_CASHBACK_PENDING", title: "Cashback tracked", body: "Your Rs. 60.00 cashback from Croma is now tracked and pending approval.", read: "No", delivery: "FAILED", userId: "USR-10294", session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:08 am", date: "2026-09-19" },
  { id: "NTF-8041", type: "ONLINE_CASHBACK_PENDING", title: "Cashback tracked", body: "Your Rs. 20.00 cashback from Croma is now tracked and pending approval.", read: "No", delivery: "FAILED", userId: "USR-10294", session: "ec28707a-2f68-497f-821c-4edf9b2aa6dd", occurred: "19 Sept 2026, 6:09 am", date: "2026-09-19" },
  { id: "NTF-8040", type: "CASHBACK_APPROVED", title: "Cashback approved", body: "You earned Rs. 151 cashback from Theobroma!", read: "Yes", delivery: "DELIVERED", userId: "USR-08471", session: "f840db2c-1d37-4f7e-a165-c720998d1121", occurred: "20 Sept 2026, 8:10 am", date: "2026-09-20" },
  { id: "NTF-8039", type: "REVIEW_APPROVED", title: "Review approved", body: "Your review of Nykaa is live!", read: "Yes", delivery: "SENT", userId: "USR-06322", session: "d791617b-4073-4b38-a32f-a1a336c4dc77", occurred: "20 Sept 2026, 3:24 pm", date: "2026-09-20" },
  { id: "NTF-8038", type: "REVIEW_REJECTED", title: "Review not approved", body: "Your review of Croma was not approved.", read: "No", delivery: "SENT", userId: "USR-11806", session: "ba7b1fd9-2861-41f5-bfc5-b7710506bd57", occurred: "20 Sept 2026, 5:45 pm", date: "2026-09-20" },
  { id: "NTF-8037", type: "MERCHANT_ONBOARDING_APPROVED", title: "Merchant approved", body: "Urban Threads Studio is approved and live!", read: "No", delivery: "QUEUED", userId: "MER-APP-3010", session: "merchant-app", occurred: "19 Sept 2026, 12:09 pm", date: "2026-09-19" },
];

export const userSeeds: UserRecord[] = [
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

export const initialUsers: UserRecord[] = userSeeds.flatMap((row, index): UserRecord[] => [row, { ...row, id: `USR-${String(20000 + index).padStart(5, "0")}`, phone: `${row.phone.slice(0, -2)}${String(index + 21).padStart(2, "0")}`, wallet: Math.max(0, row.wallet + index * 37), deleted: index % 7 === 0 ? true : row.deleted, status: index % 7 === 0 ? "Inactive" : row.status }]);

export const buildPermissions = (group: PermissionGroupName, keys: string[]): Permission[] => keys.map((key) => ({ key, group }));

export const permissionCatalog: Record<PermissionGroupName, Permission[]> = {
  Catalog: buildPermissions("Catalog", ["categories.EDIT", "categories.ADD", "categories.DELETE", "categories.VIEW", "cities.ADD", "cities.DELETE", "cities.EDIT", "cities.VIEW", "gift_card_types.ADD", "gift_card_types.EDIT", "gift_card_types.DELETE", "gift_card_types.VIEW", "legal_pages.EDIT", "legal_pages.VIEW", "merchant_banners.VIEW", "merchant_banners.EDIT", "merchant_banners.ADD", "merchant_banners.DELETE", "merchant_page_sections.ADD", "merchant_page_sections.EDIT", "merchant_page_sections.DELETE", "merchant_page_sections.VIEW", "merchant_reviews.VIEW", "merchant_reviews.EDIT", "merchants.ADD", "merchants.EDIT", "merchants.DELETE", "merchants.VIEW", "offers.ADD", "offers.EDIT", "offers.DELETE", "offers.VIEW", "onboarding_settings.EDIT", "onboarding_slides.ADD", "onboarding_slides.VIEW", "onboarding_slides.EDIT", "onboarding_slides.DELETE", "promo_banners.ADD", "promo_banners.EDIT", "promo_banners.DELETE", "promo_banners.VIEW"]),
  Operations: buildPermissions("Operations", ["affiliate_networks.ADD", "affiliate_networks.EDIT", "affiliate_networks.DELETE", "affiliate_networks.VIEW", "merchant_onboarding.VIEW", "merchant_onboarding.EDIT", "merchant_onboarding_rejection_reasons.ADD", "merchant_onboarding_rejection_reasons.EDIT", "merchant_onboarding_rejection_reasons.VIEW", "merchant_staff.ADD", "merchant_staff.EDIT", "merchant_staff.DELETE", "merchant_staff.VIEW", "sync_settings.VIEW", "sync_settings.EDIT", "trackier_categories.EDIT", "trackier_categories.VIEW", "trackier_import_queue.ADD", "trackier_import_queue.DELETE", "trackier_import_queue.IMPORT", "trackier_import_queue.VIEW", "trackier_statuses.EDIT", "trackier_statuses.VIEW"]),
  Financial: buildPermissions("Financial", ["cashback_claims.EDIT", "cashback_claims.VIEW", "claims_settings.EDIT", "claims_settings.VIEW", "clicks.VIEW", "conversion_resolutions.EDIT", "conversion_resolutions.IMPORT", "conversion_resolutions.VIEW", "ledger.VIEW", "offline_redemptions.VIEW", "online_conversions.DELETE", "online_conversions.EDIT", "online_conversions.EXPORT", "online_conversions.IMPORT", "online_conversions.VIEW", "reconciliation_log.EXPORT", "reconciliation_log.VIEW", "referral_settings.EDIT", "referral_settings.VIEW", "rejection_reasons.ADD", "rejection_reasons.EDIT", "rejection_reasons.VIEW", "withdrawal_settings.EDIT", "withdrawal_settings.VIEW", "withdrawals.EDIT", "withdrawals.EXPORT", "withdrawals.IMPORT", "withdrawals.VIEW"]),
  Communication: buildPermissions("Communication", ["communication_dispatches.VIEW", "communication_templates.EDIT", "communication_templates.VIEW", "notifications.VIEW"]),
  System: buildPermissions("System", ["admin_users.ADD", "admin_users.DELETE", "admin_users.EDIT", "admin_users.VIEW", "analytics_events.VIEW", "app_versions.EDIT", "app_versions.VIEW", "role_management.ADD", "role_management.DELETE", "role_management.EDIT", "role_management.VIEW", "users.EXPORT", "users.IMPORT", "users.VIEW"]),
};

export const allPermissionKeys = Object.values(permissionCatalog).flat().map((permission) => permission.key);

export const initialRoles: AdminRole[] = [
  { id: "ROLE-OWNER", name: "Owner", description: "Every permission in the system. System role — cannot be edited or deleted.", permissions: allPermissionKeys, admins: 6, system: true, updated: "21 Sep 2026, 10:19 am" },
  { id: "ROLE-CONTENT", name: "Content Manager", description: "Every permission except SUPER_ADMIN-only resources such as payout config, admin user management, and affiliate network config.", permissions: allPermissionKeys.filter((key) => !key.startsWith("admin_users") && !key.startsWith("role_management") && !key.startsWith("withdrawal_settings") && !key.startsWith("affiliate_networks")), admins: 7, system: false, updated: "20 Sep 2026, 4:12 pm" },
  { id: "ROLE-FINANCE", name: "Finance Manager", description: "Owns cashback claims, conversions, ledger review, withdrawals, and financial exports.", permissions: [...permissionCatalog.Financial.map((permission) => permission.key), "users.VIEW", "communication_dispatches.VIEW"], admins: 3, system: false, updated: "19 Sep 2026, 6:42 pm" },
  { id: "ROLE-OPS", name: "Operations Manager", description: "Handles merchant onboarding, Trackier imports, affiliate network hygiene, and catalog publishing checks.", permissions: [...permissionCatalog.Operations.map((permission) => permission.key), "merchants.VIEW", "offers.VIEW", "categories.VIEW", "promo_banners.VIEW"], admins: 4, system: false, updated: "18 Sep 2026, 11:20 am" },
  { id: "ROLE-SUPPORT", name: "Support Analyst", description: "Read-focused access for customer support with limited claim and review moderation actions.", permissions: ["users.VIEW", "cashback_claims.VIEW", "cashback_claims.EDIT", "clicks.VIEW", "online_conversions.VIEW", "ledger.VIEW", "communication_dispatches.VIEW", "notifications.VIEW", "merchant_reviews.VIEW", "merchant_reviews.EDIT"], admins: 9, system: false, updated: "17 Sep 2026, 3:04 pm" },
];

export const initialAdminUsers: AdminUser[] = [
  { id: "ADM-0001", name: "Qaisar Farooq", email: "qaisarfarooq0511@gmail.com", role: "Owner", status: "Active", lastActive: "21 Sep 2026, 10:14 am", created: "02 Jan 2026" },
  { id: "ADM-0002", name: "Neha Pillai", email: "neha.pillai@offerpe.com", role: "Content Manager", status: "Active", lastActive: "21 Sep 2026, 9:38 am", created: "14 Feb 2026" },
  { id: "ADM-0003", name: "Rahul Sharma", email: "rahul.sharma@offerpe.com", role: "Finance Manager", status: "Active", lastActive: "20 Sep 2026, 7:52 pm", created: "03 Mar 2026" },
  { id: "ADM-0004", name: "Ananya Rao", email: "ananya.rao@offerpe.com", role: "Operations Manager", status: "Active", lastActive: "20 Sep 2026, 4:05 pm", created: "18 Mar 2026" },
  { id: "ADM-0005", name: "Dev Kapoor", email: "dev.kapoor@offerpe.com", role: "Support Analyst", status: "Invited", lastActive: "—", created: "19 Sep 2026" },
  { id: "ADM-0006", name: "Ishita Menon", email: "ishita.menon@offerpe.com", role: "Support Analyst", status: "Active", lastActive: "19 Sep 2026, 1:22 pm", created: "22 Apr 2026" },
  { id: "ADM-0007", name: "Vikram Nair", email: "vikram.nair@offerpe.com", role: "Content Manager", status: "Disabled", lastActive: "02 Aug 2026, 11:47 am", created: "11 May 2026" },
  { id: "ADM-0008", name: "Sana Qureshi", email: "sana.qureshi@offerpe.com", role: "Finance Manager", status: "Active", lastActive: "18 Sep 2026, 6:30 pm", created: "07 Jun 2026" },
];

export const chartData = {
  users: [{ name: "Today", value: 7 }, { name: "Yesterday", value: 12 }, { name: "7d", value: 49 }, { name: "30d", value: 184 }],
  clicks: [{ name: "Today", value: 42 }, { name: "Yesterday", value: 57 }, { name: "7d", value: 319 }, { name: "30d", value: 1240 }],
  transactions: [{ name: "Today", value: 12 }, { name: "Yesterday", value: 18 }, { name: "7d", value: 94 }, { name: "30d", value: 382 }],
  withdrawals: [{ name: "Today", value: 4 }, { name: "Yesterday", value: 8 }, { name: "7d", value: 31 }, { name: "30d", value: 108 }],
  claims: [{ name: "Today", value: 2 }, { name: "Yesterday", value: 3 }, { name: "7d", value: 11 }, { name: "30d", value: 38 }],
};

export const legalPageSeeds: LegalPage[] = [
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

export const merchantStaffSeeds: MerchantStaff[] = [
  { id: "MS-1041", name: "Rohit Kulkarni", phone: "919000000001", merchant: "Theobroma", role: "Owner", status: "Active", invitedOn: "02 Aug 2026", lastActive: "21 Sep 2026, 6:12 pm" },
  { id: "MS-1042", name: "Sneha Pawar", phone: "919000000002", merchant: "Theobroma", role: "Staff", status: "Active", invitedOn: "05 Aug 2026", lastActive: "20 Sep 2026, 1:44 pm" },
  { id: "MS-1043", name: "Imran Shaikh", phone: "919000000003", merchant: "Absolute Barbecues", role: "Owner", status: "Active", invitedOn: "11 Aug 2026", lastActive: "21 Sep 2026, 9:05 am" },
  { id: "MS-1044", name: "Divya Menon", phone: "919000000004", merchant: "Absolute Barbecues", role: "Staff", status: "Pending", invitedOn: "18 Sep 2026", lastActive: "—" },
  { id: "MS-1045", name: "Arjun Nair", phone: "919000000005", merchant: "Big Bazaar", role: "Staff", status: "Pending", invitedOn: "19 Sep 2026", lastActive: "—" },
  { id: "MS-1046", name: "Farhan Qureshi", phone: "919000000006", merchant: "Hummel", role: "Owner", status: "Active", invitedOn: "27 Jul 2026", lastActive: "18 Sep 2026, 4:30 pm" },
  { id: "MS-1047", name: "Meera Iyer", phone: "919000000007", merchant: "Nippon Paint FX10", role: "Staff", status: "Active", invitedOn: "01 Sep 2026", lastActive: "21 Sep 2026, 11:20 am" },
  { id: "MS-1048", name: "Kabir Sethi", phone: "919000000008", merchant: "Theobroma", role: "Staff", status: "Pending", invitedOn: "20 Sep 2026", lastActive: "—" },
];

export const onboardingSlideSeeds: OnboardingSlide[] = [
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

export const promoSections: PromoSection[] = ["HERO", "PREMIUM DEALS", "FLASH OFFERS", "NEW ON PLATFORM"];

export const resolutionQueueSeeds: ResolutionQueueItem[] = [
  { id: "RQ-4801", orderId: "OD-99120", merchant: "Croma", userId: "USR-10234", reportedStatus: "approved", mappedOutcome: "APPROVED", orderValue: 24999, reportedCommission: 1250, received: "21 Sep 2026, 4:12 pm", source: "Trackier postback", review: "Pending", appliedOutcome: null, reason: "", notes: "", reviewedOn: "—", reviewedBy: "—" },
  { id: "RQ-4802", orderId: "OD-99135", merchant: "Ajio", userId: "USR-10871", reportedStatus: "cancelled", mappedOutcome: "REJECTED", orderValue: 3199, reportedCommission: 0, received: "21 Sep 2026, 3:48 pm", source: "Trackier postback", review: "Pending", appliedOutcome: null, reason: "", notes: "", reviewedOn: "—", reviewedBy: "—" },
  { id: "RQ-4803", orderId: "OD-99148", merchant: "Myntra", userId: "USR-11002", reportedStatus: "partially_validated", mappedOutcome: null, orderValue: 6499, reportedCommission: 260, received: "21 Sep 2026, 2:05 pm", source: "Trackier postback", review: "Pending", appliedOutcome: null, reason: "", notes: "", reviewedOn: "—", reviewedBy: "—" },
  { id: "RQ-4804", orderId: "OD-99151", merchant: "Croma", userId: "USR-10442", reportedStatus: "pending", mappedOutcome: "PENDING", orderValue: 11499, reportedCommission: 575, received: "21 Sep 2026, 1:22 pm", source: "Trackier postback", review: "Pending", appliedOutcome: null, reason: "", notes: "", reviewedOn: "—", reviewedBy: "—" },
  { id: "RQ-4805", orderId: "OD-99166", merchant: "Hummel", userId: "USR-11190", reportedStatus: "returned", mappedOutcome: "REJECTED", orderValue: 2899, reportedCommission: 0, received: "21 Sep 2026, 11:36 am", source: "CSV bulk", review: "Pending", appliedOutcome: null, reason: "", notes: "", reviewedOn: "—", reviewedBy: "—" },
  { id: "RQ-4791", orderId: "OD-98844", merchant: "Ajio", userId: "USR-10120", reportedStatus: "approved", mappedOutcome: "APPROVED", orderValue: 7899, reportedCommission: 395, received: "20 Sep 2026, 6:10 pm", source: "Trackier postback", review: "Approved", appliedOutcome: "APPROVED", reason: "", notes: "Commission matched the merchant statement.", reviewedOn: "20 Sep 2026, 7:02 pm", reviewedBy: "Qaisar Farooq" },
  { id: "RQ-4792", orderId: "OD-98851", merchant: "Myntra", userId: "USR-10933", reportedStatus: "cancelled", mappedOutcome: "REJECTED", orderValue: 4599, reportedCommission: 0, received: "20 Sep 2026, 5:41 pm", source: "Trackier postback", review: "Approved", appliedOutcome: "REJECTED", reason: "Order cancelled by the customer", notes: "", reviewedOn: "20 Sep 2026, 6:15 pm", reviewedBy: "Qaisar Farooq" },
  { id: "RQ-4793", orderId: "OD-98860", merchant: "Croma", userId: "USR-10777", reportedStatus: "duplicate", mappedOutcome: null, orderValue: 15999, reportedCommission: 800, received: "20 Sep 2026, 4:03 pm", source: "CSV bulk", review: "Rejected", appliedOutcome: null, reason: "Duplicate postback for the same order", notes: "Dismissed without touching the conversion.", reviewedOn: "20 Sep 2026, 4:40 pm", reviewedBy: "Neha Rao" },
];

export const cityDirectory: Record<string, { name: string; lat: number; lng: number }[]> = {
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

export const cityStates = Object.keys(cityDirectory);

export const initialCities: CityRecord[] = [
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

export const initialAppBuilds: AppBuild[] = [
  { id: "consumer-ios", app: "Consumer", platform: "iOS", minVersion: "3.4.0", latestVersion: "3.6.2", message: "A new OfferPe update is ready with faster cashback tracking. Please update to continue.", storeUrl: "https://apps.apple.com/in/app/offerpe/id6478123456", forceUpdate: true, updatedAt: "18 Sep 2026, 11:42 AM", updatedBy: "Qaisar Farooq" },
  { id: "consumer-android", app: "Consumer", platform: "Android", minVersion: "3.4.0", latestVersion: "3.6.1", message: "Update OfferPe to keep earning cashback without interruptions.", storeUrl: "https://play.google.com/store/apps/details?id=com.offerpe.consumer", forceUpdate: true, updatedAt: "18 Sep 2026, 11:44 AM", updatedBy: "Qaisar Farooq" },
  { id: "merchant-ios", app: "Merchant", platform: "iOS", minVersion: "2.1.0", latestVersion: "2.3.0", message: "New billing and settlement screens are available in this release.", storeUrl: "", forceUpdate: false, updatedAt: "02 Sep 2026, 04:10 PM", updatedBy: "Test Admin" },
  { id: "merchant-android", app: "Merchant", platform: "Android", minVersion: "2.1.0", latestVersion: "2.3.0", message: "New billing and settlement screens are available in this release.", storeUrl: "https://play.google.com/store/apps/details?id=com.offerpe.merchant", forceUpdate: false, updatedAt: "02 Sep 2026, 04:12 PM", updatedBy: "Test Admin" },
];
