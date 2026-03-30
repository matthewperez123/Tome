"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "group/tabs-list relative inline-flex w-fit items-center gap-1 border-b border-border bg-transparent text-muted-foreground group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:border-b-0 group-data-vertical/tabs:border-r",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  children,
  ...props
}: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-full flex-1 items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-[var(--tome-accent)] focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:text-foreground group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <TabsIndicator />
    </TabsPrimitive.Tab>
  )
}

function TabsIndicator() {
  return (
    <motion.span
      className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground group-data-vertical/tabs:bottom-auto group-data-vertical/tabs:left-auto group-data-vertical/tabs:right-0 group-data-vertical/tabs:top-0 group-data-vertical/tabs:h-full group-data-vertical/tabs:w-0.5 hidden data-active:block"
      layoutId="tome-tabs-indicator"
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      style={{ display: "var(--indicator-display, none)" }}
    />
  )
}

function TabsTriggerWithIndicator({
  className,
  children,
  ...props
}: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-full flex-1 items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-[var(--tome-accent)] focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:text-foreground motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Tab>
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsTriggerWithIndicator, TabsContent }
