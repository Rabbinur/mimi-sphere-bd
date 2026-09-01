import Image from "next/image";

const AdsCard = () => {
  return (
    <div className="w-full overflow-hidden flex items-center justify-center flex-col bg-primary rounded-xl">


      <button className="py-2 px-6 rounded-md  bg-secondary text-white font-[400] text-[1rem] mx-auto mb-5 mt-4">
        Shop Now
      </button>

      <Image
        width={400}
        height={400}
        alt="product/image"
        src="/assets/ads-1.png"
        className="w-[400px] mx-auto"
      />
    </div>
  );
};

export default AdsCard;
