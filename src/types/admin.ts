import type { LucideIcon } from "lucide-react";

export type NavItem = { label: string; icon: LucideIcon; view: View };

export type NavGroup = { label: string; icon: LucideIcon; items: NavItem[] };

export type Merchant = readonly [string, "Online" | "Offline", string, number, "Active" | "Inactive", number, string, readonly string[]];

export type View = "conversion-resolutions" | "dashboard" | "merchants" | "reviews" | "merchant-onboarding-queue" | "trackier-queue" | "affiliate-networks" | "affiliate-network-new" | "affiliate-network-edit" | "merchant-edit" | "offers" | "offer-edit" | "promo-banners" | "promo-banner-edit" | "promo-banner-new" | "categories" | "category-mapping" | "category-edit" | "category-new" | "cashback-claims" | "transactions" | "clicks" | "withdrawals" | "rejection-reasons" | "communication-templates" | "communication-dispatches" | "users" | "app-versions" | "settings" | "cities" | "onboarding-screens" | "onboarding-slide-edit" | "onboarding-slide-new" | "legal-pages" | "merchant-staff" | "admin-users" | "roles" | "role-edit" | "conversions";

export type RawMapping = { raw: string; mappedTo: string };

export type ReviewStatus = "Pending" | "Approved" | "Rejected";

export type Review = { id: string; user: string; merchant: string; rating: number; comment: string; photos: string[]; submitted: string; status: ReviewStatus; reason: string; note: string };

export type Status = "Active" | "Inactive" | "Pending" | "Approved" | "Rejected" | "Requested" | "Paid";

export type TemplateChannel = "Email" | "SMS" | "WhatsApp" | "Notification";

export type TemplateCopy = { enabled: boolean; subject?: string; body: string };

export type CommunicationTemplate = { id: string; name: string; event: string; description: string; trigger: string; variables: string[]; channels: Record<TemplateChannel, TemplateCopy> };

export type Offer = { id: string; merchant: string; headline: string; subtext: string; details: string; terms: string; discountType: "Percentage" | "Flat amount"; discountValue: number; commissionType: "Percentage" | "Flat amount"; commissionValue: number; start: string; end: string; minBill: number; sortOrder: number; discountCap: number; commissionCap: number; redirectUrl: string; voucherLink: string; productLink: string; affiliate: string; featured: boolean; active: boolean };

export type Banner = { id: string; title: string; placement: string; target: string; image: string; start: string; end: string; active: boolean };

export type PromoSection = "HERO" | "PREMIUM DEALS" | "FLASH OFFERS" | "NEW ON PLATFORM";

export type PromoBanner = { id: string; section: PromoSection; headline: string; image: string; tag: string; ctaText: string; ctaTarget: string; order: number; start: string; end: string; active: boolean };

export type Category = { id: string; channel: "Online" | "Offline"; name: string; order: number; active: boolean; image: string; line1: string; line2: string };

export type AffiliateNetwork = { id: string; name: string; propertyId: string; storeTemplate: string; voucherTemplate: string; productTemplate: string; active: boolean };

export type OfferOrigin = { type: "merchant"; merchant: Merchant } | { type: "listing" };

export type Application = { id: string; store: string; category: string; owner: string; phone: string; email: string; address: string; city: string; commission: string; documents: string[]; submitted: string; status: ReviewStatus; reason: string; note: string };

export type Claim = { id: string; userId: string; user: string; merchant: string; orderId: string; clickId: string; claimDate: string; claimTime: string; orderDate: string; orderValue: number; expectedCashback: number; proof: string; comment: string; status: ReviewStatus; reason: string; note: string };

export type RejectionCategory = "Transaction Rejection Reason" | "Retailer Onboarding Rejection Reason" | "Review Rejection Reason" | "Cashback Claims Rejection Reason" | "Withdrawal Rejection Reason";

export type RejectionReason = { id: string; reason: string; category: RejectionCategory; order: number; active: boolean };

export type StagedOffer = { headline: string; terms: string; discountType: string; discountValue: string; commissionType: string; commissionValue: string };

export type StagedCampaign = { id: string; trackierId: string; name: string; categoryId: string; rawCategory: string; about: string; logo: string; website: string; trackingTime: string; approvalTime: string; displayOrder: string; attribution: string; trackingUrl: string; offers: StagedOffer[] };

export type SyncRun = { id: string; started: string; trigger: "MANUAL" | "SCHEDULED"; status: "SUCCEEDED" | "FAILED"; fetched: number; staged: number; updated: number; skips: number; errors: string[] };

export type Conversion = {
  cashback: string; click: string | null; order: string; merchant: string; status: Status;
  value: string; reported: string; calculated: string; orderDate: string; created: string;
  resolved: string | null; rejection: string | null; notes: string; withdrawal: string | null; invoice: string | null;
};

export type TransactionStatus = "Pending" | "Approved" | "Rejected" | "Pending Bill";

export type OnlineTransaction = { id: string; status: TransactionStatus; userId: string; orderValue: number; reported: number; calculated: number; rejection: string; click: string; created: string; updated: string };

export type OfflineTransaction = { id: string; status: TransactionStatus; userId: string; billAmount: number | null; discount: number | null; payable: number | null; commission: number | null; confirmedBy: string; merchant: string; occurred: string };

export type LedgerEntry = { id: string; type: "OFFLINE_REDEMPTION" | "ONLINE_PENDING"; userId: string; amount: number; merchant: string; offer: string; resolution: string; occurred: string };

export type ClickRecord = { token: string; occurred: string; date: string; userId: string; merchant: string; offer: string; discountType: "Percentage" | "Flat amount"; discountValue: number; commissionType: "Percentage" | "Flat amount" | null; commissionValue: number | null; minBill: number | null; discountCap: number | null; commissionCap: number | null };

export type WithdrawalStatus = "Requested" | "Paid" | "Failed";

export type Withdrawal = { id: string; userId: string; amount: number; mode: "Bank Account" | "UPI" | "Gift Card"; payoutDetails: string; status: WithdrawalStatus; requested: string; date: string; resolved: string; utr: string; notes: string };

export type CommunicationTab = "analytics" | "dispatches" | "notifications";

export type AnalyticsEvent = { id: string; event: string; group: "Session" | "Screen" | "Action" | "Engagement"; screen: string; userId: string; properties: Record<string, string | number> | null; session: string; occurred: string; date: string };

export type DispatchDelivery = "SENT" | "FAILED" | "QUEUED" | "DELIVERED";

export type CommunicationDispatch = { id: string; type: string; template: string; channel: TemplateChannel; title: string; body: string; read: "Yes" | "No"; delivery: DispatchDelivery; userId: string; occurred: string; date: string };

export type NotificationLog = { id: string; type: string; title: string; body: string; read: "Yes" | "No"; delivery: DispatchDelivery; userId: string; session: string; occurred: string; date: string };

export type UserStatus = "Active" | "Inactive";

export type DeletedFilter = "all" | "yes" | "no";

export type UserDateField = "lastLogin" | "signedUp" | "deletedAt" | "reRegisteredAt";

export type UserRecord = { id: string; name: string; phone: string; email: string; status: UserStatus; deleted: boolean; reRegistered: boolean; lastLoginIp: string; lastLoginAgent: string; lastLoginAt: string; lastLoginDate: string; signedUp: string; signedUpDate: string; deletedAt: string; deletedDate: string; reRegisteredAt: string; reRegisteredDate: string; city: string; source: string; wallet: number };

export type PermissionGroupName = "Catalog" | "Operations" | "Financial" | "Communication" | "System";

export type Permission = { key: string; group: PermissionGroupName };

export type AdminRole = { id: string; name: string; description: string; permissions: string[]; admins: number; system: boolean; updated: string };

export type AdminUserStatus = "Active" | "Invited" | "Disabled";

export type AdminUser = { id: string; name: string; email: string; role: string; status: AdminUserStatus; lastActive: string; created: string };

export type LegalPage = { id: string; name: string; slug: string; title: string; version: string; content: string; published: boolean; updatedAt: string };

export type MerchantStaff = { id: string; name: string; phone: string; merchant: string; role: "Owner" | "Staff"; status: "Active" | "Pending"; invitedOn: string; lastActive: string };

export type OnboardingApp = "Consumer" | "Merchant";

export type OnboardingSlide = { id: string; app: OnboardingApp; title: string; body: string; image: string; active: boolean };

export type LayoutMode = "list" | "grid";

export type ResolutionOutcome = "APPROVED" | "REJECTED" | "PENDING";

export type ResolutionQueueItem = { id: string; orderId: string; merchant: string; userId: string; reportedStatus: string; mappedOutcome: ResolutionOutcome | null; orderValue: number; reportedCommission: number; received: string; source: string; review: "Pending" | "Approved" | "Rejected"; appliedOutcome: ResolutionOutcome | null; reason: string; notes: string; reviewedOn: string; reviewedBy: string };

export type CityRecord = { id: string; name: string; state: string; lat: number; lng: number; active: boolean };

export type AppBuild = { id: string; app: "Consumer" | "Merchant"; platform: "iOS" | "Android"; minVersion: string; latestVersion: string; message: string; storeUrl: string; forceUpdate: boolean; updatedAt: string; updatedBy: string };
