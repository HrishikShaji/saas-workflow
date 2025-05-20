"use client"

import { GenericMap } from "@/components/maps/GenericMap"
import { stateIncomeData } from "@/lib/constants"
import { useState } from "react"

// Example color scale
const incomeColorScale = (income: number) => {
  if (income >= 80000) return "#0f766e"
  if (income >= 70000) return "#14b8a6"
  if (income >= 60000) return "#2dd4bf"
  if (income >= 50000) return "#5eead4"
  return "#ccfbf1"
}

export default function Page() {

  return (
    <GenericMap
      geoUrl="https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"
      data={stateIncomeData.map(item => ({
        id: item.id,
        name: item.state,
        value: item.income
      }))}
      colorScale={incomeColorScale}
    />
  )
}
