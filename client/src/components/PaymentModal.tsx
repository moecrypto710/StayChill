import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from '@/lib/queryClient';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PaymentForm from './PaymentForm';
import { Loader2 } from 'lucide-react';

// Load Stripe outside of a component's render to avoid recreating the Stripe object on every render.
// Use the publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  amount: number;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  bookingId,
  amount,
  onPaymentSuccess
}: PaymentModalProps) {
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create a payment intent on the server when modal opens
  useEffect(() => {
    if (isOpen && bookingId) {
      setIsLoading(true);
      setError(null);
      
      const createPaymentIntent = async () => {
        try {
          const response = await apiRequest('POST', '/api/payments/create-payment-intent', {
            bookingId,
            amount
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to initialize payment');
          }
          
          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'An unexpected error occurred';
          setError(message);
          toast({
            title: 'Payment initialization failed',
            description: message,
            variant: 'destructive'
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      createPaymentIntent();
    }
  }, [isOpen, bookingId, amount, toast]);
  
  const handlePaymentError = (errorMessage: string) => {
    toast({
      title: 'Payment failed',
      description: errorMessage,
      variant: 'destructive'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete your booking</DialogTitle>
          <DialogDescription>
            Enter your payment details to secure your reservation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-ocean-600" />
              <span className="ml-2">Preparing payment...</span>
            </div>
          ) : error ? (
            <div className="py-6 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          ) : clientSecret ? (
            <Elements 
              stripe={stripePromise} 
              options={{ clientSecret, appearance: { theme: 'stripe' } }}
            >
              <PaymentForm 
                clientSecret={clientSecret}
                amount={amount}
                bookingId={bookingId}
                onSuccess={onPaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          ) : (
            <div className="py-6 text-center text-red-500">
              Unable to initialize payment. Please try again.
            </div>
          )}
        </div>
        
        {!isLoading && !error && clientSecret && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}