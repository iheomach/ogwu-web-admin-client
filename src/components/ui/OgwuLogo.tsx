export function OgwuLogo({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/ogwu-mark.png"
      alt="Ogwu"
      style={{ width: size, height: size, display: 'block', flexShrink: 0 }}
    />
  );
}
