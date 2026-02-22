import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ShoppingCart {
    total: bigint;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
}
export interface UserOrderHistory {
    orders: Array<Order>;
}
export interface OrderItem {
    productId: ProductId;
    quantity: bigint;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    total: bigint;
    timestamp: bigint;
    items: Array<OrderItem>;
}
export type ProductId = bigint;
export interface Product {
    id: ProductId;
    stockQuantity: bigint;
    name: string;
    description: string;
    deliveryType: DeliveryType;
    imageUrl: string;
    category: Category;
    price: bigint;
}
export enum Category {
    clothing = "clothing",
    food = "food",
    books = "books",
    electronics = "electronics"
}
export enum DeliveryType {
    oneHourDelivery = "oneHourDelivery",
    takeaway = "takeaway"
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(productId: ProductId, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkout(): Promise<void>;
    createProduct(name: string, description: string, price: bigint, category: Category, imageUrl: string, stockQuantity: bigint, deliveryType: DeliveryType): Promise<Product>;
    deleteProduct(id: ProductId): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<ShoppingCart>;
    getOrderHistory(): Promise<UserOrderHistory>;
    getProduct(id: ProductId): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFromCart(productId: ProductId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCartQuantity(productId: ProductId, newQuantity: bigint): Promise<void>;
    updateProduct(id: ProductId, name: string, description: string, price: bigint, category: Category, imageUrl: string, stockQuantity: bigint, deliveryType: DeliveryType): Promise<void>;
}
