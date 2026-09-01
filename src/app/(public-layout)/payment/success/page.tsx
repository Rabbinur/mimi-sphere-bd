'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import OrderSuccess from './_components/OrderSuccess';

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return <OrderSuccess orderId={orderId} />;
};

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;
