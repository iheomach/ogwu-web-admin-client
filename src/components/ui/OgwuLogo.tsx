export function OgwuLogo({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/ogwu-logo-ios.png"
      alt="Ogwu"
      style={{ width: size, height: size, borderRadius: size * 0.22, display: 'block', flexShrink: 0 }}
    />
  );
}
