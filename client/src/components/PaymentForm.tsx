import { useState } from 'react';
import { 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  bookingId: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function PaymentForm({
  clientSecret,
  amount,
  bookingId,
  onSuccess,
  onError
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }
    
    setIsProcessing(true);
    setCardError(null);
    
    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      
      if (error) {
        setCardError(error.message || 'An error occurred during payment processing');
      } else if (paymentIntent.status === 'succeeded') {
        // Payment successful - update booking status
        await apiRequest('PATCH', `/api/bookings/${bookingId}/payment-status`, {
          paymentStatus: 'paid',
          paymentIntentId: paymentIntent.id
        });
        onSuccess();
      } else {
        setCardError('Payment failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setCardError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border rounded-md p-4 bg-gray-50">
        <CardElement options={cardElementOptions} />
      </div>
      
      {cardError && (
        <div className="text-red-500 text-sm">{cardError}</div>
      )}
      
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Total amount:</span>
          <span className="font-bold">${amount.toFixed(2)}</span>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>
    </form>
  );
}