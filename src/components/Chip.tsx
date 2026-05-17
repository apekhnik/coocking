interface ChipProps {
  children: React.ReactNode
  variant?: 'dark' | 'veg' | 'quick' | 'plum' | 'honey' | 'default'
}

export default function Chip({ children, variant = 'default' }: ChipProps) {
  return <span className={`chip ${variant !== 'default' ? variant : ''}`}>{children}</span>
}
