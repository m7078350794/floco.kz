interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'new' | 'sale' | 'popular';
}

const badgeStyles = {
  default: 'bg-navy/10 text-navy',
  new: 'bg-success/10 text-success',
  sale: 'bg-error/10 text-error',
  popular: 'bg-gold-light/20 text-gold',
};

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${badgeStyles[variant]}`}>
      {children}
    </span>
  );
}
