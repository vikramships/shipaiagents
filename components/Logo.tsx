interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <div className={`${className} flex items-center justify-center`} style={{ width: size, height: size }}>
      <span style={{ fontSize: size * 0.7 }}>⚡</span>
    </div>
  );
}