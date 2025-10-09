import { cn } from '../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import NextLink from 'next/link';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

const linkVariants = cva(
    'inline-block relative underline-offset-4 transition-all duration-300 text-sm font-medium',
    {
        variants: {
            indent: {
                base: '',
                outline: '',
            },
            variant: {
                default: 'text-primary hover:text-primary/90 hover:underline',
                underline: 'text-primary hover:text-primary/90 underline',
                'hover-underline': 'hover:underline',
                lighter: 'opacity-60 hover:opacity-100',
                contrast: 'text-primary-foreground hover:text-secondary-foreground',
                dashed: 'underline decoration-dashed underline-offset-4 hover:decoration-solid',
            },
        },
        defaultVariants: {
            indent: 'base',
            variant: 'default',
        },
    },
);

interface ExtendedLinkProps
    extends ComponentPropsWithoutRef<typeof NextLink>,
        VariantProps<typeof linkVariants> {}

const Link = forwardRef<HTMLAnchorElement, ExtendedLinkProps>(
    ({ className, indent, variant, ...restProps }: ExtendedLinkProps, ref) => {
        return (
            <NextLink
                ref={ref}
                className={cn(linkVariants({ indent, variant, className }))}
                {...restProps}
            />
        );
    },
);

Link.displayName = 'Link';

export { Link, linkVariants };
