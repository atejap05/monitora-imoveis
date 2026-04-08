import {
  Document,
  Page,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { styles, COLORS } from "./styles";

// ─── Report Document Wrapper ──────────────────────────────────────

type ReportDocumentProps = {
  title: string;
  children: ReactNode;
};

export function ReportDocument({ title, children }: ReportDocumentProps) {
  return (
    <Document title={title} author="Painel NFSe - COGEF/RFB" language="pt-BR">
      {children}
    </Document>
  );
}

// ─── Report Page ──────────────────────────────────────────────────

type ReportPageProps = {
  children: ReactNode;
};

export function ReportPage({ children }: ReportPageProps) {
  return (
    <Page size="A4" style={styles.page}>
      {children}
      <ReportFooter />
    </Page>
  );
}

// ─── Header ───────────────────────────────────────────────────────

type ReportHeaderProps = {
  title: string;
  subtitle?: string;
  badge?: string;
};

export function ReportHeader({ title, subtitle, badge }: ReportHeaderProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.headerRight}>
        {badge && <Text style={styles.headerBadge}>{badge}</Text>}
        <Text style={styles.headerDate}>{`${dateStr} às ${timeStr}`}</Text>
      </View>
    </View>
  );
}

// ─── Footer ───────────────────────────────────────────────────────

function ReportFooter() {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>
        Painel NFSe — COGEF/RFB — Documento gerado automaticamente
      </Text>
      <Text
        style={styles.footerPage}
        render={({ pageNumber, totalPages }) =>
          `${pageNumber} / ${totalPages}`
        }
      />
    </View>
  );
}

// ─── Section Title ────────────────────────────────────────────────

type SectionTitleProps = {
  children: string;
};

export function SectionTitle({ children }: SectionTitleProps) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

// ─── Filters Summary ──────────────────────────────────────────────

type FilterItem = {
  label: string;
  value: string;
};

type FiltersSummaryProps = {
  filters: FilterItem[];
};

export function FiltersSummary({ filters }: FiltersSummaryProps) {
  if (filters.length === 0) return null;

  return (
    <View style={styles.filtersContainer}>
      {filters.map((f, i) => (
        <View key={i} style={styles.filterBadge}>
          <Text>
            <Text style={styles.filterBadgeLabel}>{f.label}: </Text>
            <Text style={styles.filterBadgeValue}>{f.value}</Text>
          </Text>
        </View>
      ))}
    </View>
  );
}

// ─── KPI Grid ─────────────────────────────────────────────────────

type KpiItem = {
  label: string;
  value: string;
  subtext?: string;
  color?: string;
};

type KpiGridProps = {
  items: KpiItem[];
};

export function KpiGrid({ items }: KpiGridProps) {
  return (
    <View style={styles.kpiGrid}>
      {items.map((item, i) => (
        <View
          key={i}
          style={[
            styles.kpiCard,
            item.color ? { borderLeftColor: item.color } : {},
          ]}
        >
          <Text style={styles.kpiLabel}>{item.label}</Text>
          <Text
            style={[
              styles.kpiValue,
              item.color ? { color: item.color } : {},
            ]}
          >
            {item.value}
          </Text>
          {item.subtext && (
            <Text style={styles.kpiSubtext}>{item.subtext}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

// ─── PDF Table ────────────────────────────────────────────────────

type PdfTableColumn = {
  header: string;
  accessor: string;
  width?: string;
  align?: "left" | "center" | "right";
  format?: (value: unknown) => string;
};

type PdfTableProps = {
  columns: PdfTableColumn[];
  data: Record<string, unknown>[];
  maxRows?: number;
  /** Células menores — recomendado para rankings com muitas colunas. */
  compact?: boolean;
};

export function PdfTable({ columns, data, maxRows, compact }: PdfTableProps) {
  const rows = maxRows ? data.slice(0, maxRows) : data;
  const truncated = maxRows && data.length > maxRows;

  const defaultWidth = `${Math.floor(100 / columns.length)}%`;

  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        {columns.map((col, i) => (
          <Text
            key={i}
            style={[
              styles.tableHeaderCell,
              {
                width: col.width || defaultWidth,
                textAlign: col.align || "left",
              },
            ]}
          >
            {col.header}
          </Text>
        ))}
      </View>
      {rows.map((row, rowIdx) => (
        <View
          key={rowIdx}
          style={rowIdx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
        >
          {columns.map((col, colIdx) => {
            const rawValue = row[col.accessor];
            const displayValue = col.format
              ? col.format(rawValue)
              : String(rawValue ?? "");

            return (
              <Text
                key={colIdx}
                style={[
                  compact ? styles.compactTableCell : styles.tableCell,
                  {
                    width: col.width || defaultWidth,
                    textAlign: col.align || "left",
                  },
                ]}
              >
                {displayValue}
              </Text>
            );
          })}
        </View>
      ))}
      {truncated && (
        <View style={{ paddingVertical: 6, alignItems: "center" }}>
          <Text style={{ fontSize: 7, color: COLORS.textMuted }}>
            {`Exibindo ${maxRows} de ${data.length} registros`}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Chart Image ──────────────────────────────────────────────────

type ChartImageProps = {
  src: string;
  caption?: string;
};

export function ChartImage({ src, caption }: ChartImageProps) {
  return (
    <View style={styles.chartContainer}>
      <Image src={src} style={styles.chartImage} />
      {caption && <Text style={styles.chartCaption}>{caption}</Text>}
    </View>
  );
}

// ─── Info Row (key-value) ─────────────────────────────────────────

type InfoRowProps = {
  label: string;
  value: string;
};

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

// ─── Disclaimer ───────────────────────────────────────────────────

type DisclaimerProps = {
  text?: string;
};

export function Disclaimer({ text }: DisclaimerProps) {
  return (
    <View style={styles.disclaimer}>
      <Text style={styles.disclaimerText}>
        {text ||
          "Este relatório foi gerado automaticamente pelo Painel NFSe (COGEF/RFB). Os dados refletem o estado no momento da geração e podem sofrer atualizações."}
      </Text>
    </View>
  );
}
