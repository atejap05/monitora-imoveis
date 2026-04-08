import { StyleSheet, Font } from "@react-pdf/renderer";

Font.registerHyphenationCallback((word) => [word]);

export const COLORS = {
  primary: "#1B4332",
  primaryLight: "#2D6A4F",
  accent: "#40916C",
  text: "#1a1a1a",
  textSecondary: "#4a5568",
  textMuted: "#718096",
  border: "#e2e8f0",
  borderLight: "#edf2f7",
  backgroundLight: "#f7fafc",
  backgroundAccent: "#f0fdf4",
  white: "#ffffff",
  kpiBlue: "#2563eb",
  kpiGreen: "#16a34a",
  kpiAmber: "#d97706",
  kpiRed: "#dc2626",
} as const;

export const FONT_SIZES = {
  xs: 7,
  sm: 8,
  base: 9,
  md: 10,
  lg: 12,
  xl: 14,
  "2xl": 16,
  "3xl": 20,
} as const;

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 40,
  },

  // Header
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES["2xl"],
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerBadge: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: FONT_SIZES.xs,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  headerDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 6,
  },
  footerText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  footerPage: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    fontFamily: "Helvetica-Bold",
  },

  // Sections
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },

  // KPI Grid
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    minWidth: "22%",
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 4,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  kpiLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: 3,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: FONT_SIZES.xl,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
  },
  kpiSubtext: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Filters summary
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
    padding: 8,
    backgroundColor: COLORS.backgroundAccent,
    borderRadius: 4,
  },
  filterBadge: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  filterBadgeLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  filterBadgeValue: {
    fontSize: FONT_SIZES.xs,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
  },

  // Table
  table: {
    width: "100%",
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tableHeaderCell: {
    padding: 6,
    fontSize: FONT_SIZES.xs,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.backgroundLight,
  },
  tableCell: {
    padding: 5,
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
  },

  // Chart image
  chartContainer: {
    marginBottom: 12,
    alignItems: "center",
  },
  chartImage: {
    maxWidth: "100%",
    maxHeight: 220,
    objectFit: "contain",
  },
  chartCaption: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 4,
  },

  // Info row
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontFamily: "Helvetica-Bold",
  },
  infoValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },

  // Disclaimer
  disclaimer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 3,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.accent,
  },
  disclaimerText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    fontStyle: "italic",
  },

  // Resumo executivo / insights / qualidade de dados (template v2)
  executiveBox: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: COLORS.backgroundAccent,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  executiveTitle: {
    fontSize: FONT_SIZES.md,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
    marginBottom: 6,
  },
  executiveLead: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 1.35,
  },
  insightList: {
    marginTop: 4,
  },
  insightItem: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  insightBullet: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.accent,
    width: 12,
    fontFamily: "Helvetica-Bold",
  },
  insightText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    flex: 1,
    lineHeight: 1.35,
  },
  dataQualityBox: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#fffbeb",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  dataQualityTitle: {
    fontSize: FONT_SIZES.xs,
    fontFamily: "Helvetica-Bold",
    color: "#92400e",
    marginBottom: 4,
  },
  dataQualityText: {
    fontSize: FONT_SIZES.xs,
    color: "#78350f",
    lineHeight: 1.35,
  },
  appendixSectionTitle: {
    fontSize: FONT_SIZES.md,
    fontFamily: "Helvetica-Bold",
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 4,
  },
  compactTableCell: {
    padding: 4,
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontFamily: "Helvetica",
  },
});
