export function OgwuLogo({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/ogwu-logo.svg"
      alt="Ogwu"
      width={size}
      height={size}
      style={{ borderRadius: size * 0.22, display: 'block' }}
    />
  );
}
