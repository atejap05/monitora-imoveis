/**
 * Constantes centralizadas para layout e estilo responsivo
 * Garante consistência de design em toda a aplicação
 */

// Altura do header em pixels (utilizado para posicionamento sticky)
export const HEADER_HEIGHT = 94;

// Classes Tailwind CSS para padding responsivo (lateral)
export const RESPONSIVE_PADDING = "px-4 sm:px-6 md:px-8";

// Classes Tailwind CSS para gaps responsivos (vertical entre elementos)
export const RESPONSIVE_GAP = "gap-4 md:gap-6 lg:gap-8";

// Classes Tailwind CSS para grid de KPI cards (4 colunas adaptáveis)
export const KPI_GRID_CLASSES =
  "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

// Classes Tailwind CSS para container máximo centralizado
export const CONTAINER_MAX_WIDTH = "w-full mx-auto";

// Classes Tailwind CSS para container centralizado com padding responsivo
export const CONTAINER_CLASSES = `${CONTAINER_MAX_WIDTH} ${RESPONSIVE_PADDING}`;

// Classes Tailwind CSS para seções com layout flex vertical e gap responsivo
export const FLEX_COL_GAP_CLASSES = `flex flex-col ${RESPONSIVE_GAP}`;

// Altura do sticky header em formato CSS (para uso em estilos inline)
export const HEADER_HEIGHT_PX = `${HEADER_HEIGHT}px`;
