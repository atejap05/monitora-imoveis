declare module "react-calendar-heatmap" {
  import * as React from "react";

  export interface CalendarHeatmapValue {
    date: string;
    count?: number;
    [key: string]: any;
  }

  export interface CalendarHeatmapProps {
    startDate: string | Date;
    endDate: string | Date;
    values: CalendarHeatmapValue[];
    classForValue?: (value: CalendarHeatmapValue) => string | undefined;
    titleForValue?: (value: CalendarHeatmapValue) => string | undefined;
    showWeekdayLabels?: boolean;
    gutterSize?: number;
    renderBlock?: (
      value: CalendarHeatmapValue,
      x: number,
      y: number,
      size: number
    ) => React.ReactNode;
    // ...other props as needed
  }

  const CalendarHeatmap: React.FC<CalendarHeatmapProps>;
  export default CalendarHeatmap;
}
