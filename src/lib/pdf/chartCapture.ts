/**
 * Captura gráficos Recharts (SVG) como imagens PNG base64 para uso em PDFs.
 * Também suporta captura de elementos HTML genéricos via canvas.
 */

export async function svgToBase64Png(
  svgElement: SVGSVGElement,
  scale = 2,
): Promise<string> {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  const bbox = svgElement.getBoundingClientRect();
  const width = bbox.width * scale;
  const height = bbox.height * scale;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Falha ao criar contexto canvas"));
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Falha ao carregar imagem SVG"));
    };
    img.src = url;
  });
}

export function captureChartFromContainer(
  container: HTMLElement,
  scale = 2,
): Promise<string> | null {
  const svg = container.querySelector(
    ".recharts-wrapper svg, .recharts-surface",
  ) as SVGSVGElement | null;
  if (!svg) return null;
  return svgToBase64Png(svg, scale);
}

export async function captureAllCharts(
  selectors: Record<string, string>,
  scale = 2,
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  for (const [key, selector] of Object.entries(selectors)) {
    const container = document.querySelector(selector) as HTMLElement | null;
    if (!container) continue;

    try {
      const result = captureChartFromContainer(container, scale);
      if (result) {
        results[key] = await result;
      }
    } catch {
      // Gráfico não capturado - continua sem ele
    }
  }

  return results;
}
