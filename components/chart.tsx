import * as React from "react"
import { AreaChart, Card, Text, Title } from "@tremor/react"
import { dataFormatter } from "@/utils/data-formatter"

interface ChartProps {
  title: string
  data: {
    serverless: Array<any>
    regional: Array<any>
    global: Array<any>
  }
  param: "queryDuration" | "elapsed" | string
  attempts: number
  children: React.ReactNode
}

export function Chart({ title, data, param, attempts, children }: ChartProps) {
  return (
    <Card>
      <Title className="truncate">{title}</Title>
      <Text className="h-14">{children}</Text>
      <AreaChart
        data={new Array(attempts).fill(0).map((_, i) => {
          return {
            attempt: `#${i + 1}`,
            Serverless: data.serverless[i] ? data.serverless[i][param] : null,
            Regional: data.regional[i] ? data.regional[i][param] : null,
            Global: data.global[i] ? data.global[i][param] : null,
          }
        })}
        index="attempt"
        categories={["Global", "Regional", "Serverless"]}
        colors={["indigo", "cyan", "yellow"]}
        valueFormatter={dataFormatter}
        className="mt-6"
        yAxisWidth={48}
      />
    </Card>
  )
}
