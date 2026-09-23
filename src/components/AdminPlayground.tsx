import { IconButton } from "@/components/admin/IconButton";
import { Sidebar } from "@/components/admin/Sidebar";
import {
  settingsSeeds,
  merchantBannerSeeds,
  merchantCitySeeds,
  merchantPageSectionSeeds,
  merchantStepSeeds,
  allPermissionKeys,
  analyticsEvents,
  campaignRejectionReasons,
  chartData,
  cityDirectory,
  cityStates,
  claimRejectionReasons,
  clickRecords,
  communicationDispatches,
  conversions,
  groups,
  initialCities,
  initialUsers,
  initialWithdrawals,
  ledgerEntries,
  notificationLogs,
  offlineTransactions,
  onboardingRejectionReasons,
  onlineTransactions,
  permissionCatalog,
  promoSections,
  rejectionCategories,
  rejectionCategoryShort,
  rejectionReasons,
  resolutionQueueSeeds,
  templateChannels,
  initialAdminUsers,
  initialAffiliateNetworks,
  initialAppBuilds,
  initialApplications,
  initialCampaigns,
  initialCategories,
  initialClaims,
  initialCommunicationTemplates,
  initialMappings,
  initialOffers,
  initialPromoBanners,
  initialRejectionReasons,
  initialReviews,
  initialRoles,
  initialSyncRuns,
  legalPageSeeds,
  merchantStaffSeeds,
  merchants,
  onboardingSlideSeeds,
} from "@/data/mockData";
import { AdminUsersPage } from "@/screens/AdminUsersScreen";
import { AffiliateNetworkFormPage } from "@/screens/AffiliateNetworkFormScreen";
import { AffiliateNetworksPage } from "@/screens/AffiliateNetworksScreen";
import { AppVersionsPage } from "@/screens/AppVersionsScreen";
import { CashbackClaims } from "@/screens/CashbackClaimsScreen";
import { Categories } from "@/screens/CategoriesScreen";
import { CategoryFormPage } from "@/screens/CategoryFormScreen";
import { CitiesPage } from "@/screens/CitiesScreen";
import { Clicks } from "@/screens/ClicksScreen";
import { CommunicationLogs } from "@/screens/CommunicationLogsScreen";
import { CommunicationTemplates } from "@/screens/CommunicationTemplatesScreen";
import { ConversionResolutions } from "@/screens/ConversionResolutionsScreen";
import { Dashboard } from "@/screens/DashboardScreen";
import { LegalPagesPage } from "@/screens/LegalPagesScreen";
import { MerchantEditPage } from "@/screens/MerchantEditScreen";
import { OnboardingQueue } from "@/screens/MerchantOnboardingQueueScreen";
import { ReviewsPage } from "@/screens/MerchantReviewsScreen";
import { Merchants } from "@/screens/MerchantsScreen";
import { MerchantStaffPage } from "@/screens/MerchantStaffScreen";
import { OfferEditPage } from "@/screens/OfferEditScreen";
import { OffersPage } from "@/screens/OffersScreen";
import { OnboardingSlidesPage } from "@/screens/OnboardingScreensScreen";
import { OnboardingSlideEditPage } from "@/screens/OnboardingSlideEditScreen";
import { Conversions } from "@/screens/OnlineConversionsScreen";
import { PromoBannerFormPage } from "@/screens/PromoBannerFormScreen";
import { PromoBannersPage } from "@/screens/PromoBannersScreen";
import { RejectionReasons } from "@/screens/RejectionReasonsScreen";
import { RoleEditPage } from "@/screens/RoleEditScreen";
import { RolesPage } from "@/screens/RolesScreen";
import { SettingsPage } from "@/screens/SettingsScreen";
import { TrackierQueue } from "@/screens/TrackierQueueScreen";
import { Transactions } from "@/screens/TransactionsScreen";
import { UsersPage } from "@/screens/UsersScreen";
import { Withdrawals } from "@/screens/WithdrawalsScreen";
import type {
  AdminRole,
  AdminUser,
  AffiliateNetwork,
  AppBuild,
  Application,
  Category,
  Claim,
  CommunicationTemplate,
  LegalPage,
  Merchant,
  MerchantStaff,
  Offer,
  OfferOrigin,
  OnboardingApp,
  OnboardingSlide,
  PromoBanner,
  RawMapping,
  RejectionReason,
  Review,
  ReviewStatus,
  StagedCampaign,
  SyncRun,
  View,
} from "@/types/admin";
import { format } from "date-fns";
import { Menu } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AdminPlayground() {
  const [view, setView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [merchantRows, setMerchantRows] = useState<readonly Merchant[]>(merchants);
  const [reviewRows, setReviewRows] = useState<Review[]>(initialReviews);
  const [applicationRows, setApplicationRows] = useState<Application[]>(initialApplications);
  const [claimRows, setClaimRows] = useState<Claim[]>(initialClaims);
  const [campaignRows, setCampaignRows] = useState<StagedCampaign[]>(initialCampaigns);
  const [syncRuns, setSyncRuns] = useState<SyncRun[]>(initialSyncRuns);
  const [syncing, setSyncing] = useState(false);
  const [affiliateNetworkRows, setAffiliateNetworkRows] =
    useState<AffiliateNetwork[]>(initialAffiliateNetworks);
  const [rejectionReasonRows, setRejectionReasonRows] =
    useState<RejectionReason[]>(initialRejectionReasons);
  const [communicationTemplateRows, setCommunicationTemplateRows] = useState<
    CommunicationTemplate[]
  >(initialCommunicationTemplates);
  const [roleRows, setRoleRows] = useState<AdminRole[]>(initialRoles);
  const [appBuildRows, setAppBuildRows] = useState(initialAppBuilds);
  const saveAppBuild = (build: AppBuild) =>
    setAppBuildRows((current) => current.map((item) => (item.id === build.id ? build : item)));
  const [adminUserRows, setAdminUserRows] = useState<AdminUser[]>(initialAdminUsers);
  const saveAdminUser = (admin: AdminUser, isNew: boolean) => {
    setAdminUserRows((current) =>
      isNew ? [admin, ...current] : current.map((item) => (item.id === admin.id ? admin : item)),
    );
    toast.success(isNew ? "Invite sent" : "Admin updated", {
      description: isNew
        ? `${admin.email} was invited as ${admin.role}.`
        : `${admin.name} is now a ${admin.role}.`,
    });
  };
  const deleteAdminUser = (admin: AdminUser) => {
    setAdminUserRows((current) => current.filter((item) => item.id !== admin.id));
    toast.success("Admin removed", { description: `${admin.name} no longer has portal access.` });
  };
  const [editingAffiliateNetwork, setEditingAffiliateNetwork] = useState<AffiliateNetwork | null>(
    null,
  );
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [onboardingSlideRows, setOnboardingSlideRows] =
    useState<OnboardingSlide[]>(onboardingSlideSeeds);
  const [onboardingApp, setOnboardingApp] = useState<OnboardingApp>("Consumer");
  const [editingSlide, setEditingSlide] = useState<OnboardingSlide | null>(null);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [categoryRows, setCategoryRows] = useState<Category[]>(initialCategories);
  const [mappingRows, setMappingRows] = useState<RawMapping[]>(initialMappings);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [offerRows, setOfferRows] = useState(initialOffers);
  const [promoBannerRows, setPromoBannerRows] = useState<PromoBanner[]>(initialPromoBanners);
  const [editingPromoBanner, setEditingPromoBanner] = useState<PromoBanner | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerOrigin, setOfferOrigin] = useState<OfferOrigin>({ type: "listing" });
  const [merchantTab, setMerchantTab] = useState<"details" | "offers">("details");
  const editMerchant = (merchant: Merchant) => {
    setEditingMerchant(merchant);
    setMerchantTab("details");
    setView("merchant-edit");
  };
  const setReviewStatus = (review: Review, status: ReviewStatus, reason = "", note = "") =>
    setReviewRows((current) =>
      current.map((item) => (item.id === review.id ? { ...item, status, reason, note } : item)),
    );
  const approveReview = (review: Review) => {
    setReviewStatus(review, "Approved");
    toast.success("Review approved", {
      description: `${review.user}'s review of ${review.merchant} is now public.`,
    });
  };
  const rejectReview = (review: Review, reason: string, note: string) => {
    setReviewStatus(review, "Rejected", reason, note);
    toast.success("Review rejected", {
      description: `${review.user}'s review was rejected: ${reason}.`,
    });
  };
  const revertReview = (review: Review) => {
    setReviewStatus(review, "Pending");
    toast.success("Review moved back to pending", {
      description: `${review.user}'s review awaits moderation again.`,
    });
  };
  const deleteReview = (review: Review) => {
    setReviewRows((current) => current.filter((item) => item.id !== review.id));
    toast.success("Review deleted", {
      description: `${review.user}'s review of ${review.merchant} was removed.`,
    });
  };
  const setApplicationStatus = (
    application: Application,
    status: ReviewStatus,
    reason = "",
    note = "",
  ) =>
    setApplicationRows((current) =>
      current.map((item) =>
        item.id === application.id ? { ...item, status, reason, note } : item,
      ),
    );
  const approveApplication = (application: Application) => {
    setApplicationStatus(application, "Approved");
    toast.success("Application approved", {
      description: `${application.store} is live as an OFFLINE merchant — merchant-app login created for ${application.owner}.`,
    });
  };
  const rejectApplication = (application: Application, reason: string, note: string) => {
    setApplicationStatus(application, "Rejected", reason, note);
    toast.success("Application rejected", {
      description: `${application.store} was rejected: ${reason}.`,
    });
  };
  const revertApplication = (application: Application) => {
    setApplicationStatus(application, "Pending");
    toast.success("Application moved back to pending", {
      description: `${application.store} awaits review again.`,
    });
  };
  const deleteApplication = (application: Application) => {
    setApplicationRows((current) => current.filter((item) => item.id !== application.id));
    toast.success("Application deleted", {
      description: `${application.store} was removed from the queue.`,
    });
  };
  const setClaimStatus = (claim: Claim, status: ReviewStatus, reason = "", note = "") =>
    setClaimRows((current) =>
      current.map((item) => (item.id === claim.id ? { ...item, status, reason, note } : item)),
    );
  const approveClaim = (claim: Claim) => {
    setClaimStatus(
      claim,
      "Approved",
      "",
      "Accepted into the online-conversion pipeline (source = CLAIM).",
    );
    toast.success("Claim approved", {
      description: `${claim.orderId} was staged as an online conversion — resolve it from Online Conversions to credit ₹${claim.expectedCashback.toLocaleString("en-IN")}.`,
    });
  };
  const rejectClaim = (claim: Claim, reason: string, note: string) => {
    setClaimStatus(claim, "Rejected", reason, note);
    toast.success("Claim rejected", {
      description: `${claim.user}'s claim on ${claim.orderId} was rejected: ${reason}.`,
    });
  };
  const revertClaim = (claim: Claim) => {
    setClaimStatus(claim, "Pending");
    toast.success("Claim moved back to pending", {
      description: `${claim.id} awaits review again.`,
    });
  };
  const deleteClaim = (claim: Claim) => {
    setClaimRows((current) => current.filter((item) => item.id !== claim.id));
    toast.success("Claim deleted", { description: `${claim.id} was removed.` });
  };
  const runSync = () => {
    setSyncing(true);
    window.setTimeout(() => {
      const run: SyncRun = {
        id: `RUN-${Math.floor(Math.random() * 9000) + 1000}`,
        started: "21 Sept 2026, 08:26 am",
        trigger: "MANUAL",
        status: "SUCCEEDED",
        fetched: 62,
        staged: 2,
        updated: 59,
        skips: 1,
        errors: [],
      };
      setSyncRuns((current) => [run, ...current]);
      setSyncing(false);
      toast.success("Sync complete: 62 fetched, 2 new staged, 1 field-locked skip");
    }, 1400);
  };
  const changeCampaign = (updated: StagedCampaign) =>
    setCampaignRows((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  const approveCampaign = (campaign: StagedCampaign) => {
    if (!campaign.categoryId) {
      toast.error("Map a category first", {
        description: `Campaign ${campaign.trackierId} (${campaign.name}) has an unmapped category.`,
      });
      return;
    }
    const category = categoryRows.find((item) => item.id === campaign.categoryId);
    setCampaignRows((current) => current.filter((item) => item.id !== campaign.id));
    setMerchantRows((current) => [
      [
        campaign.name,
        "Online",
        category?.name ?? "",
        Number(campaign.displayOrder) || 0,
        "Active",
        campaign.offers.length,
        `${campaign.offers[0]?.commissionValue ?? 0}%`,
        ["Pan-India"],
      ] as unknown as Merchant,
      ...current,
    ]);
    setOfferRows((current) => [
      ...campaign.offers.map((offer, index) => ({
        id: `OFF-${campaign.trackierId.replace("#", "")}${index}`,
        merchant: campaign.name,
        headline: offer.headline,
        subtext: "",
        details: campaign.about,
        terms: offer.terms,
        discountType: "Percentage" as const,
        discountValue: Number(offer.discountValue) || 0,
        commissionType: "Percentage" as const,
        commissionValue: Number(offer.commissionValue) || 0,
        start: "2026-09-21T00:00",
        end: "",
        minBill: 0,
        sortOrder: Number(campaign.displayOrder) || 0,
        discountCap: 0,
        commissionCap: 0,
        redirectUrl: campaign.trackingUrl,
        voucherLink: "",
        productLink: "",
        affiliate: "Trackier",
        featured: false,
        active: true,
      })),
      ...current,
    ]);
    toast.success(
      `Campaign ${campaign.trackierId} (${campaign.name}) approved and published to catalog`,
    );
  };
  const rejectCampaign = (campaign: StagedCampaign, reason: string, note: string) => {
    setCampaignRows((current) => current.filter((item) => item.id !== campaign.id));
    toast.success(`Campaign ${campaign.trackierId} (${campaign.name}) rejected`, {
      description: note ? `${reason} — ${note}` : reason,
    });
  };
  const backToMerchants = () => {
    setEditingMerchant(null);
    setView("merchants");
  };
  const deleteMerchant = () => {
    if (!editingMerchant) return;
    setMerchantRows((current) => current.filter((item) => item[0] !== editingMerchant[0]));
    toast.success("Merchant deleted", { description: `${editingMerchant[0]} was removed.` });
    backToMerchants();
  };
  const editCategory = (category: Category) => {
    setEditingCategory(category);
    setView("category-edit");
  };
  const backToCategories = () => {
    setEditingCategory(null);
    setView("categories");
  };
  const saveCategory = (updated: Category) => {
    setCategoryRows((current) =>
      current.some((item) => item.id === updated.id)
        ? current.map((item) => (item.id === updated.id ? updated : item))
        : [updated, ...current],
    );
    backToCategories();
  };
  const deleteCategory = (category: Category) => {
    setCategoryRows((current) => current.filter((item) => item.id !== category.id));
    toast.success("Category deleted", { description: `${category.name} was removed.` });
    backToCategories();
  };
  const openOffer = (offer: Offer | null, origin: OfferOrigin) => {
    setEditingOffer(offer);
    setOfferOrigin(origin);
    setView("offer-edit");
  };
  const returnFromOffer = () => {
    if (offerOrigin.type === "merchant") {
      setEditingMerchant(offerOrigin.merchant);
      setMerchantTab("offers");
      setView("merchant-edit");
    } else {
      setView("offers");
    }
    setEditingOffer(null);
  };
  const saveOffer = (updated: Offer) => {
    setOfferRows((current) =>
      current.some((item) => item.id === updated.id)
        ? current.map((item) => (item.id === updated.id ? updated : item))
        : [updated, ...current],
    );
    returnFromOffer();
  };
  const deleteOffer = (offer: Offer) => {
    setOfferRows((current) => current.filter((item) => item.id !== offer.id));
    toast.success("Offer deleted", { description: `${offer.headline} was removed.` });
    if (view === "offer-edit") returnFromOffer();
  };
  const backToPromoBanners = () => {
    setEditingPromoBanner(null);
    setView("promo-banners");
  };
  const savePromoBanner = (updated: PromoBanner) => {
    setPromoBannerRows((current) =>
      current.some((item) => item.id === updated.id)
        ? current.map((item) => (item.id === updated.id ? updated : item))
        : [updated, ...current],
    );
    backToPromoBanners();
  };
  const deletePromoBanner = (banner: PromoBanner) => {
    setPromoBannerRows((current) => current.filter((item) => item.id !== banner.id));
    toast.success("Promo banner deleted", { description: `${banner.headline} was removed.` });
    if (view === "promo-banner-edit") backToPromoBanners();
  };
  const backToAffiliateNetworks = () => {
    setEditingAffiliateNetwork(null);
    setView("affiliate-networks");
  };
  const saveAffiliateNetwork = (updated: AffiliateNetwork) => {
    setAffiliateNetworkRows((current) =>
      current.some((item) => item.id === updated.id)
        ? current.map((item) => (item.id === updated.id ? updated : item))
        : [updated, ...current],
    );
    backToAffiliateNetworks();
  };
  const deleteAffiliateNetwork = (network: AffiliateNetwork) => {
    setAffiliateNetworkRows((current) => current.filter((item) => item.id !== network.id));
    toast.success("Affiliate network deleted", { description: `${network.name} was removed.` });
    if (view === "affiliate-network-edit") backToAffiliateNetworks();
  };
  const backToRoles = () => {
    setEditingRole(null);
    setView("roles");
  };
  const createRole = (role: AdminRole) => {
    setRoleRows((current) => [role, ...current]);
    setEditingRole(role);
    setView("role-edit");
    toast.success("Role created", {
      description: `${role.name} is ready for permission assignment.`,
    });
  };
  const saveRole = (updated: AdminRole) => {
    setRoleRows((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    backToRoles();
  };
  const deleteRole = (role: AdminRole) => {
    setRoleRows((current) => current.filter((item) => item.id !== role.id));
    toast.success("Role deleted", { description: `${role.name} was removed.` });
    if (view === "role-edit") backToRoles();
  };
  const [merchantStaffRows, setMerchantStaffRows] = useState<MerchantStaff[]>(merchantStaffSeeds);
  const saveMerchantStaff = (member: MerchantStaff, isNew: boolean) => {
    setMerchantStaffRows((current) =>
      isNew ? [member, ...current] : current.map((item) => (item.id === member.id ? member : item)),
    );
    toast.success(isNew ? "Staff member invited" : "Staff member updated", {
      description: `${member.name} (${member.phone}) — ${member.merchant}.`,
    });
  };
  const deleteMerchantStaff = (member: MerchantStaff) => {
    setMerchantStaffRows((current) => current.filter((item) => item.id !== member.id));
    toast.success("Staff member removed", {
      description: `${member.name} can no longer sign in to the merchant app.`,
    });
  };
  const [legalPageRows, setLegalPageRows] = useState<LegalPage[]>(legalPageSeeds);
  const saveLegalPage = (page: LegalPage) => {
    const stamped = { ...page, updatedAt: format(new Date(), "dd MMM yyyy, h:mm a") };
    setLegalPageRows((current) => current.map((item) => (item.id === page.id ? stamped : item)));
    toast.success("Legal page saved", {
      description: `${page.name} is now ${page.published ? "published" : "unpublished"}.`,
    });
  };
  const deleteLegalPage = (page: LegalPage) => {
    setLegalPageRows((current) => current.filter((item) => item.id !== page.id));
    toast.success("Legal page deleted", { description: `${page.name} was removed.` });
  };
  const backToOnboardingSlides = () => {
    setEditingSlide(null);
    setView("onboarding-screens");
  };
  const saveOnboardingSlide = (updated: OnboardingSlide) => {
    setOnboardingSlideRows((current) =>
      current.some((item) => item.id === updated.id)
        ? current.map((item) => (item.id === updated.id ? updated : item))
        : [...current, updated],
    );
    setOnboardingApp(updated.app);
    backToOnboardingSlides();
  };
  const deleteOnboardingSlide = (slide: OnboardingSlide) => {
    setOnboardingSlideRows((current) => current.filter((item) => item.id !== slide.id));
    toast.success("Onboarding slide deleted", { description: `${slide.title} was removed.` });
    if (view !== "onboarding-screens") backToOnboardingSlides();
  };
  const toggleOnboardingSlide = (slide: OnboardingSlide) => {
    setOnboardingSlideRows((current) =>
      current.map((item) => (item.id === slide.id ? { ...item, active: !item.active } : item)),
    );
    toast.success(slide.active ? "Slide deactivated" : "Slide activated", {
      description: `${slide.title} is now ${slide.active ? "hidden from" : "shown in"} the carousel.`,
    });
  };
  const moveOnboardingSlide = (slide: OnboardingSlide, direction: -1 | 1) =>
    setOnboardingSlideRows((current) => {
      const next = [...current];
      const from = next.findIndex((item) => item.id === slide.id);
      let to = from + direction;
      while (to >= 0 && to < next.length && next[to]!.app !== slide.app) to += direction;
      if (from < 0 || to < 0 || to >= next.length) return current;
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved!);
      return next;
    });
  const content =
    view === "dashboard" ? (
      <Dashboard chartData={chartData} />
    ) : view === "merchants" ? (
      <Merchants rows={merchantRows} onEdit={editMerchant} />
    ) : view === "reviews" ? (
      <ReviewsPage
        rejectionReasons={rejectionReasons}
        reviews={reviewRows}
        merchantNames={merchantRows.map((row) => row[0])}
        onApprove={approveReview}
        onReject={rejectReview}
        onRevert={revertReview}
        onDelete={deleteReview}
      />
    ) : view === "trackier-queue" ? (
      <TrackierQueue
        campaignRejectionReasons={campaignRejectionReasons}
        campaigns={campaignRows}
        runs={syncRuns}
        categories={categoryRows}
        syncing={syncing}
        onSync={runSync}
        onChange={changeCampaign}
        onApprove={approveCampaign}
        onReject={rejectCampaign}
      />
    ) : view === "affiliate-networks" ? (
      <AffiliateNetworksPage
        networks={affiliateNetworkRows}
        onCreate={() => {
          setEditingAffiliateNetwork(null);
          setView("affiliate-network-new");
        }}
        onEdit={(network) => {
          setEditingAffiliateNetwork(network);
          setView("affiliate-network-edit");
        }}
        onDelete={deleteAffiliateNetwork}
      />
    ) : view === "affiliate-network-new" ? (
      <AffiliateNetworkFormPage
        key="new-affiliate-network"
        network={null}
        onCancel={backToAffiliateNetworks}
        onSave={saveAffiliateNetwork}
        onDelete={deleteAffiliateNetwork}
      />
    ) : view === "affiliate-network-edit" && editingAffiliateNetwork ? (
      <AffiliateNetworkFormPage
        key={editingAffiliateNetwork.id}
        network={editingAffiliateNetwork}
        onCancel={backToAffiliateNetworks}
        onSave={saveAffiliateNetwork}
        onDelete={deleteAffiliateNetwork}
      />
    ) : view === "merchant-onboarding-queue" ? (
      <OnboardingQueue
        onboardingRejectionReasons={onboardingRejectionReasons}
        applications={applicationRows}
        onApprove={approveApplication}
        onReject={rejectApplication}
        onRevert={revertApplication}
        onDelete={deleteApplication}
      />
    ) : view === "cashback-claims" ? (
      <CashbackClaims
        claimRejectionReasons={claimRejectionReasons}
        claims={claimRows}
        onApprove={approveClaim}
        onReject={rejectClaim}
        onRevert={revertClaim}
        onDelete={deleteClaim}
      />
    ) : view === "conversion-resolutions" ? (
      <ConversionResolutions
        resolutionQueueSeeds={resolutionQueueSeeds}
        reasons={rejectionReasonRows}
      />
    ) : view === "transactions" ? (
      <Transactions
        ledgerEntries={ledgerEntries}
        offlineTransactions={offlineTransactions}
        onlineTransactions={onlineTransactions}
      />
    ) : view === "clicks" ? (
      <Clicks clickRecords={clickRecords} />
    ) : view === "withdrawals" ? (
      <Withdrawals initialWithdrawals={initialWithdrawals} />
    ) : view === "rejection-reasons" ? (
      <RejectionReasons
        rejectionCategories={rejectionCategories}
        rejectionCategoryShort={rejectionCategoryShort}
        reasons={rejectionReasonRows}
        onSave={(reason, isNew) => {
          setRejectionReasonRows((current) =>
            current.some((item) => item.id === reason.id)
              ? current.map((item) => (item.id === reason.id ? reason : item))
              : [reason, ...current],
          );
          toast.success(isNew ? "Rejection reason added" : "Rejection reason updated", {
            description: `${reason.reason} is now ${reason.active ? "active" : "inactive"} at display order ${reason.order}.`,
          });
        }}
      />
    ) : view === "communication-templates" ? (
      <CommunicationTemplates
        templateChannels={templateChannels}
        templates={communicationTemplateRows}
        onChange={(template) =>
          setCommunicationTemplateRows((current) =>
            current.map((item) => (item.id === template.id ? template : item)),
          )
        }
      />
    ) : view === "communication-dispatches" ? (
      <CommunicationLogs
        analyticsEvents={analyticsEvents}
        communicationDispatches={communicationDispatches}
        notificationLogs={notificationLogs}
        templateChannels={templateChannels}
      />
    ) : view === "users" ? (
      <UsersPage initialUsers={initialUsers} />
    ) : view === "cities" ? (
      <CitiesPage
        cityDirectory={cityDirectory}
        cityStates={cityStates}
        initialCities={initialCities}
      />
    ) : view === "onboarding-screens" ? (
      <OnboardingSlidesPage
        slides={onboardingSlideRows}
        app={onboardingApp}
        onAppChange={setOnboardingApp}
        onCreate={() => {
          setEditingSlide(null);
          setView("onboarding-slide-new");
        }}
        onEdit={(slide) => {
          setEditingSlide(slide);
          setView("onboarding-slide-edit");
        }}
        onToggle={toggleOnboardingSlide}
        onMove={moveOnboardingSlide}
        onDelete={deleteOnboardingSlide}
      />
    ) : view === "onboarding-slide-edit" || view === "onboarding-slide-new" ? (
      <OnboardingSlideEditPage
        key={editingSlide?.id ?? "new-onboarding-slide"}
        slide={editingSlide}
        app={onboardingApp}
        index={Math.max(
          onboardingSlideRows
            .filter((item) => item.app === (editingSlide?.app ?? onboardingApp))
            .findIndex((item) => item.id === editingSlide?.id),
          0,
        )}
        total={
          onboardingSlideRows.filter((item) => item.app === (editingSlide?.app ?? onboardingApp))
            .length
        }
        onCancel={backToOnboardingSlides}
        onSave={saveOnboardingSlide}
        onDelete={deleteOnboardingSlide}
      />
    ) : view === "merchant-staff" ? (
      <MerchantStaffPage
        merchants={merchants}
        staff={merchantStaffRows}
        onSave={saveMerchantStaff}
        onDelete={deleteMerchantStaff}
      />
    ) : view === "legal-pages" ? (
      <LegalPagesPage pages={legalPageRows} onSave={saveLegalPage} onDelete={deleteLegalPage} />
    ) : view === "settings" ? (
      <SettingsPage settingsSeeds={settingsSeeds} />
    ) : view === "app-versions" ? (
      <AppVersionsPage builds={appBuildRows} onSave={saveAppBuild} />
    ) : view === "admin-users" ? (
      <AdminUsersPage
        allPermissionKeys={allPermissionKeys}
        admins={adminUserRows}
        roles={roleRows}
        onSave={saveAdminUser}
        onDelete={deleteAdminUser}
      />
    ) : view === "roles" ? (
      <RolesPage
        allPermissionKeys={allPermissionKeys}
        roles={roleRows}
        onCreate={createRole}
        onEdit={(role) => {
          setEditingRole(role);
          setView("role-edit");
        }}
        onDelete={deleteRole}
      />
    ) : view === "role-edit" && editingRole ? (
      <RoleEditPage
        allPermissionKeys={allPermissionKeys}
        permissionCatalog={permissionCatalog}
        key={editingRole.id}
        role={editingRole}
        onCancel={backToRoles}
        onSave={saveRole}
        onDelete={deleteRole}
      />
    ) : view === "merchant-edit" && editingMerchant ? (
      <MerchantEditPage
        rejectionReasons={rejectionReasons}
        merchantCitySeeds={merchantCitySeeds}
        merchantStepSeeds={merchantStepSeeds}
        merchantPageSectionSeeds={merchantPageSectionSeeds}
        merchantBannerSeeds={merchantBannerSeeds}
        merchant={editingMerchant}
        offers={offerRows}
        reviews={reviewRows}
        onApproveReview={approveReview}
        onRejectReview={rejectReview}
        onRevertReview={revertReview}
        onDeleteReview={deleteReview}
        initialTab={merchantTab}
        onBack={backToMerchants}
        onDeleteMerchant={deleteMerchant}
        onEditOffer={(offer) => openOffer(offer, { type: "merchant", merchant: editingMerchant })}
        onCreateOffer={() => openOffer(null, { type: "merchant", merchant: editingMerchant })}
        onDeleteOffer={deleteOffer}
      />
    ) : view === "offers" ? (
      <OffersPage
        merchants={merchants}
        offers={offerRows}
        onEdit={(offer) => openOffer(offer, { type: "listing" })}
        onCreate={() => openOffer(null, { type: "listing" })}
        onDelete={deleteOffer}
      />
    ) : view === "offer-edit" ? (
      <OfferEditPage
        merchants={merchants}
        key={editingOffer?.id ?? "new"}
        offer={editingOffer}
        origin={offerOrigin}
        onCancel={returnFromOffer}
        onSave={saveOffer}
        onDelete={deleteOffer}
      />
    ) : view === "promo-banners" ? (
      <PromoBannersPage
        promoSections={promoSections}
        banners={promoBannerRows}
        onEdit={(banner) => {
          setEditingPromoBanner(banner);
          setView("promo-banner-edit");
        }}
        onCreate={() => {
          setEditingPromoBanner(null);
          setView("promo-banner-new");
        }}
        onDelete={deletePromoBanner}
      />
    ) : view === "promo-banner-edit" ? (
      <PromoBannerFormPage
        promoSections={promoSections}
        key={editingPromoBanner?.id}
        banner={editingPromoBanner}
        onCancel={backToPromoBanners}
        onSave={savePromoBanner}
        onDelete={deletePromoBanner}
      />
    ) : view === "promo-banner-new" ? (
      <PromoBannerFormPage
        promoSections={promoSections}
        key="new-promo-banner"
        banner={null}
        onCancel={backToPromoBanners}
        onSave={savePromoBanner}
        onDelete={deletePromoBanner}
      />
    ) : view === "categories" || view === "category-mapping" ? (
      <Categories
        categories={categoryRows}
        mappedCount={(category) =>
          merchantRows.filter((row) => row[2] === category.name && row[4] === "Active").length
        }
        tab={view === "category-mapping" ? "mapping" : "categories"}
        onTabChange={(tab) => setView(tab === "mapping" ? "category-mapping" : "categories")}
        mappings={mappingRows}
        onSaveMapping={(raw, mappedTo) =>
          setMappingRows((current) =>
            current.map((item) => (item.raw === raw ? { ...item, mappedTo } : item)),
          )
        }
        onEdit={editCategory}
        onCreate={() => {
          setEditingCategory(null);
          setView("category-new");
        }}
        onDelete={deleteCategory}
      />
    ) : view === "category-edit" ? (
      <CategoryFormPage
        key={editingCategory?.id}
        category={editingCategory}
        onCancel={backToCategories}
        onSave={saveCategory}
        onDelete={deleteCategory}
      />
    ) : view === "category-new" ? (
      <CategoryFormPage
        key="new-category"
        category={null}
        onCancel={backToCategories}
        onSave={saveCategory}
        onDelete={deleteCategory}
      />
    ) : (
      <Conversions conversions={conversions} />
    );
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        groups={groups}
        view={view}
        setView={(next) => {
          setView(next);
          if (next !== "merchant-edit" && next !== "offer-edit") setEditingMerchant(null);
          if (next !== "category-edit" && next !== "category-new") setEditingCategory(null);
          if (next !== "promo-banner-edit" && next !== "promo-banner-new")
            setEditingPromoBanner(null);
          if (next !== "affiliate-network-edit" && next !== "affiliate-network-new")
            setEditingAffiliateNetwork(null);
          if (next !== "role-edit") setEditingRole(null);
          if (next !== "onboarding-slide-edit" && next !== "onboarding-slide-new")
            setEditingSlide(null);
        }}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-card/95 px-4 backdrop-blur md:hidden">
          <IconButton label="Open navigation" onClick={() => setSidebarOpen(true)}>
            <Menu />
          </IconButton>
          <span className="ml-2 font-heading font-bold">OfferPe Admin</span>
        </div>
        <main className="mx-auto w-full max-w-400 p-4 sm:p-6 lg:p-8">{content}</main>
      </div>
    </div>
  );
}
