import Image from "next/image";
import logo from "@/public/brand/logo.png";

/** Foto do produto com moldura neutra. Sem foto: símbolo da marca, sem imagem genérica. */
export function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  muted = false,
  className = "",
}: {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  muted?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#e9e3d8] ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03] ${muted ? "grayscale opacity-60" : ""}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-stone">
          <Image src={logo} alt="" className="w-1/4 max-w-20 opacity-15" />
          <span className="sr-only">{alt} — foto em breve</span>
        </div>
      )}
    </div>
  );
}
