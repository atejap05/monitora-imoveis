import { View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";

/** Camada A — resumo executivo (contexto + bullets). */
export type ExecutiveSummaryProps = {
  title?: string;
  lead: string;
  insights?: string[];
};

export function ExecutiveSummary({
  title = "Resumo executivo",
  lead,
  insights,
}: ExecutiveSummaryProps) {
  return (
    <View style={styles.executiveBox}>
      <Text style={styles.executiveTitle}>{title}</Text>
      <Text style={styles.executiveLead}>{lead}</Text>
      {insights && insights.length > 0 && (
        <View style={styles.insightList}>
          {insights.map((line, i) => (
            <View key={i} style={styles.insightItem} wrap={false}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>{line}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

/** Alertas de qualidade / completude dos dados (ex.: volumetria, última atualização). */
export type DataQualityAlertProps = {
  title?: string;
  children: string;
};

export function DataQualityAlert({
  title = "Qualidade e completude dos dados",
  children,
}: DataQualityAlertProps) {
  return (
    <View style={styles.dataQualityBox}>
      <Text style={styles.dataQualityTitle}>{title}</Text>
      <Text style={styles.dataQualityText}>{children}</Text>
    </View>
  );
}

/** Título da camada C — anexo / detalhamento técnico. */
export function AppendixSectionTitle({ children }: { children: string }) {
  return <Text style={styles.appendixSectionTitle}>{children}</Text>;
}
