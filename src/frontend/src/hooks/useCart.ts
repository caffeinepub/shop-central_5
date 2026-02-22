import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ShoppingCart, ProductId, UserOrderHistory } from '../backend';

export function useGetCart() {
  const { actor, isFetching } = useActor();

  return useQuery<ShoppingCart>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return { items: [], total: BigInt(0) };
      return actor.getCart();
    },
    enabled: !!actor && !isFetching
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: ProductId; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToCart(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: ProductId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}

export function useUpdateCartQuantity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, newQuantity }: { productId: ProductId; newQuantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCartQuantity(productId, newQuantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}

export function useCheckout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkout();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orderHistory'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
}

export function useGetOrderHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<UserOrderHistory>({
    queryKey: ['orderHistory'],
    queryFn: async () => {
      if (!actor) return { orders: [] };
      return actor.getOrderHistory();
    },
    enabled: !!actor && !isFetching
  });
}

