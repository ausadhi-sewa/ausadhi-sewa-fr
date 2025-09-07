import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { 
  setCurrentUserId,
  fetchUserCart,
  addToUserCart,
  setAuthenticated,
  loadGuestCart,
} from '../../features/cart/cartSlice';
import { cartStorage } from '../cartStorage';

export const useCartInitialization = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);


  const initializationRef = useRef<{
    userId: string | null;
    hasInitialized: boolean;
  }>({
    userId: null,
    hasInitialized: false,
  });


  useEffect(() => {
    const currentUserId = user?.id || null;
    const hasUserChanged = initializationRef.current.userId !== currentUserId;
    
    
    if (hasUserChanged) {
      initializationRef.current = {
        userId: currentUserId,
        hasInitialized: false,
      };
    }

   
    if (initializationRef.current.hasInitialized) {
      return;
    }

    if (user && !isAuthenticated) {
     
     
      dispatch(setAuthenticated(true));
      dispatch(setCurrentUserId(user.id));
      

      const guestCartItems = cartStorage.getGuestCartItemsForTransfer();
      
      if (guestCartItems.length > 0) {
       
       
        guestCartItems.forEach(item => {
          dispatch(addToUserCart({ 
            productId: item.productId, 
            quantity: item.quantity 
          }));
        });
        
       
        cartStorage.clearGuestCart();
      } else {
        dispatch(fetchUserCart());
      }
      
     
      initializationRef.current.hasInitialized = true;
      
    } else if (!user && isAuthenticated) {
      
     
      dispatch(setAuthenticated(false));
      dispatch(setCurrentUserId(null));
      dispatch(loadGuestCart()); // Load guest cart from localStorage
      

      initializationRef.current.hasInitialized = true;
      
    } else if (!user && !isAuthenticated) {
      // No user, load guest cart from localStorage
     
      dispatch(loadGuestCart());
      
      
      
      initializationRef.current.hasInitialized = true;
    }
  }, [user, isAuthenticated, dispatch]);
};