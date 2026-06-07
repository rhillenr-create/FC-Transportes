import Image from "next/image"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description: string
  className?: string
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,255,136,0.12)]">
          <Image
            src="/fc-transportes-icon.svg"
            alt="Ícone FC Transportes"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-white tracking-tight">{title}</h2>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium">{description}</p>
        </div>
      </div>
    </div>
  )
}
