import CountdownTimer from "@/components/ui/CountdownTimer";

export default function ExclusiveOffer() {


  return (
    <div className="py-4 bg-slate-200 rounded-2xl">
      <div className="mb-4 text-primary flex flex-col md:flex-row justify-around items-center text-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl md:text-4xl font-bold">Exclusive Offer</h2>
          <p className="text-xl md:text-2xl mt-2">🔥 45% OFF 🔥</p>
        </div>
        <CountdownTimer title="Ends in" expiryDays={4}/>
      </div>
    </div>
  );
}