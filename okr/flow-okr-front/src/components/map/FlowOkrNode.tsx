import React, {memo, useState} from "react";
import {Handle, Position} from "reactflow";
import {FlowOkrNode} from "@/interfaces/FlowOkrNode.interface";
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import FlowOkrNodeDetail from "@/components/map/FlowOkrNodeDetail";

const chartConfig = {
    rate: {
        label: "달성률",
        color: "hsl(var(--chart-2))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig


export default memo(({ data }: FlowOkrNode) => {

    const [chartData, setChartData] = useState([{kpi: "kpi", rate: data.rate, fill: "var(--color-rate)"}, {kpi: "other", rate: 100 - data.rate, fill: "var(--color-other)"}])
    const [showDetail, setShowDetail] = useState(false);

    const onNodeClickEvent = () => {
        setShowDetail(!showDetail);
    }

    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={true}
            />
            <Card className="flex flex-col" onClick={onNodeClickEvent}>
                <CardHeader className="flex flex-row gap-5 items-center justify-between">
                    <div className="items-center pb-0">
                        <CardTitle>{data.title}</CardTitle>
                        <CardDescription className='text-blue-500'>{data.content}</CardDescription>
                    </div>
                    {data.rate && data.type &&
                        <FlowOkrNodeDetail title={data.title} content={data.content} id={data.id} />
                    }
                </CardHeader>
                {data.rate && data.type &&
                    <>
                        <CardContent className="flex-1 pb-0">
                            <ChartContainer
                                config={chartConfig}
                                className="mx-auto aspect-square max-h-[250px]"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                        data={chartData}
                                        dataKey="rate"
                                        nameKey="kpi"
                                        innerRadius={60}
                                        strokeWidth={5}
                                    >
                                        <Label
                                            content={({ viewBox }) => {
                                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                    return (
                                                        <text
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                        >
                                                            <tspan
                                                                x={viewBox.cx}
                                                                y={viewBox.cy}
                                                                className="fill-foreground text-3xl font-bold"
                                                            >
                                                                {data.rate}
                                                            </tspan>
                                                            <tspan
                                                                x={viewBox.cx}
                                                                y={(viewBox.cy || 0) + 24}
                                                                className="fill-muted-foreground"
                                                            >
                                                                {data.type.toLocaleString()}
                                                            </tspan>
                                                        </text>
                                                    )
                                                }
                                            }}
                                        />
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2 font-medium leading-none">
                                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="leading-none text-muted-foreground">
                                Showing total visitors for the last 6 months
                            </div>
                        </CardFooter>
                    </>
                }
            </Card>
            <Handle
                type="source"
                position={Position.Bottom}
                id="a"
                isConnectable={true}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                isConnectable={true}
            />
        </>
    );
});