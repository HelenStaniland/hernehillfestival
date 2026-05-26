import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-festival-cream text-festival-bg hover:bg-festival-cream/90 shadow-lg shadow-black/20",
  secondary:
    "border border-festival-cream/40 text-festival-cream hover:border-festival-cream hover:bg-festival-cream/10",
  ghost: "text-festival-cream/80 hover:text-festival-cream",
};

type SharedProps = {
  variant?: ButtonVariant;
  className?: string;
};

type ButtonAsLink = SharedProps &
  ComponentPropsWithoutRef<typeof Link> & { href: string };

type ButtonAsButton = SharedProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ButtonProps = ButtonAsLink | ButtonAsButton;

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-festival-accent";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return <Link href={href} className={classes} {...linkProps} />;
  }

  const buttonProps = props as ButtonAsButton;
  return <button type="button" className={classes} {...buttonProps} />;
}
