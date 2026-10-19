import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'outline' | 'cream' | 'ghost'

const base =
  'group relative inline-flex min-h-12 select-none items-center justify-center gap-2.5 rounded-full px-6 py-3 font-sans text-sm font-bold uppercase tracking-[0.08em] transition-[transform,background-color,color,box-shadow,border-color] duration-200 ease-out active:scale-[0.97] sm:text-[0.92rem]'

const variants: Record<Variant, string> = {
  primary:
    'bg-lime text-ink shadow-[0_0_0_0_rgba(200,255,46,0)] hover:shadow-[0_0_44px_6px_rgba(200,255,46,0.28)] hover:-translate-y-0.5',
  cream: 'bg-cream text-ink hover:-translate-y-0.5 hover:bg-white',
  outline:
    'border border-cream/35 text-cream hover:border-lime hover:text-lime hover:-translate-y-0.5',
  ghost: 'text-bone hover:text-lime',
}

interface SharedProps {
  variant?: Variant
  icon?: ReactNode
  children: ReactNode
  className?: string
}

type AnchorProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> & {
    href: string
    external?: boolean
    ref?: Ref<HTMLAnchorElement>
  }

type NativeButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    href?: undefined
    ref?: Ref<HTMLButtonElement>
  }

export function Button(props: AnchorProps | NativeButtonProps) {
  if (props.href !== undefined) {
    const { variant = 'primary', icon, children, className, external, ...rest } = props
    const classes = cn(base, variants[variant], className)
    return (
      <a
        {...rest}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
        {icon}
      </a>
    )
  }
  const { variant = 'primary', icon, children, className, type = 'button', ...rest } = props
  return (
    <button {...rest} type={type} className={cn(base, variants[variant], className)}>
      {children}
      {icon}
    </button>
  )
}
