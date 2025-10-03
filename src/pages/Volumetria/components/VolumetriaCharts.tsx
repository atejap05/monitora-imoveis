import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Componente de Gráfico de Linha Genérico
type LineChartData = {
    name: string;
    [key: string]: string | number;
};

type LineChartProps = {
    data: LineChartData[];
    xKey: string;
    lines: Array<{
        dataKey: string;
        name: string;
        color: string;
    }>;
    height?: number;
};

export const GenericLineChart = ({
    data,
    xKey,
    lines,
    height = 300,
}: LineChartProps) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                {lines.map((line, index) => (
                    <Line
                        key={index}
                        type="monotone"
                        dataKey={line.dataKey}
                        name={line.name}
                        stroke={line.color}
                        strokeWidth={2}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

// Componente de Gráfico de Barras Genérico
type BarChartData = {
    name: string;
    value: number;
};

type BarChartProps = {
    data: BarChartData[];
    xKey: string;
    dataKey: string;
    color: string;
    height?: number;
};

export const GenericBarChart = ({
    data,
    xKey,
    dataKey,
    color,
    height = 300,
}: BarChartProps) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Bar dataKey={dataKey} fill={color} />
            </BarChart>
        </ResponsiveContainer>
    );
};

// Componente de Gráfico de Pizza Genérico
type PieChartData = {
    name: string;
    value: number;
    fill: string;
};

type PieChartProps = {
    data: PieChartData[];
    height?: number;
};

export const GenericPieChart = ({ data, height = 300 }: PieChartProps) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

