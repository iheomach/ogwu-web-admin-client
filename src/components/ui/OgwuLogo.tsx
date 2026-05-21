export function OgwuLogo({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/ogwu-mark.png"
      alt="Ogwu"
      style={{borderRadius: size * 0.22, display: 'block', flexShrink: 0 }}
    />
  );
}
