import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Shared button styles. Apply to any <Link>, <a> or <button> via className so the
 * underlying element (and its behaviour) never changes. Classes live in globals.css.
 */
export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn-primary',
      dark: 'btn-dark',
      outline: 'btn-outline',
      ghostLight: 'btn-ghost-light',
    },
    size: {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    },
    block: {
      true: 'btn-block',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    block: false,
  },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
