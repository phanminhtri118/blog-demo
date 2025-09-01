import Image from "next/image";
import banner from "@/assets/images/banners/banner.webp";

export const AirdropBanner = () => {
  return (
    <div>
      <Image src={banner} alt="banner" />
    </div>
  );
};
