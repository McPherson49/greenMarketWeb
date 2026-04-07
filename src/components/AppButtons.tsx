import Link from "next/link";
import Image from "next/image";

export const GooglePlayButton = ({
  url,
  className = "",
}: {
  url: string;
  theme?: string;
  className?: string;
}) => (
  <Link href={url} target="_blank" rel="noopener noreferrer">
    <Image
      src="/assets/google.png"
      alt="Google Play"
      width={150}
      height={100}
    />
    {/* <div className="flex flex-col leading-tight">
      <span className="text-[9px] font-light">GET IT ON</span>
      <span className="text-sm font-semibold">Google Play</span>
    </div> */}
  </Link>
);

export const AppStoreButton = ({
  url,
  className = "",
}: {
  url: string;
  theme?: string;
  className?: string;
}) => (
  <Link href={url} target="_blank" rel="noopener noreferrer">
    <Image src="/assets/apple.png" alt="App Store" width={150} height={100} />
    <div className="flex flex-col leading-tight"></div>
  </Link>
);
