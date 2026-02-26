import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type ProductId = Nat;
  public type Category = {
    #electronics;
    #clothing;
    #books;
    #food;
  };

  public type DeliveryType = {
    #oneHourDelivery;
    #takeaway;
  };

  public type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    imageUrl : Text;
    stockQuantity : Nat;
    deliveryType : DeliveryType;
  };

  public type OrderItem = {
    productId : ProductId;
    quantity : Nat;
  };

  public type OrderStatus = {
    #pending;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type Order = {
    id : Nat;
    items : [OrderItem];
    total : Nat;
    status : OrderStatus;
    timestamp : Int;
  };

  public type ShoppingCart = {
    items : [OrderItem];
    total : Nat;
  };

  public type UserOrderHistory = {
    orders : [Order];
  };

  var nextProductId = 1;
  var nextOrderId = 1;

  let products = Map.empty<ProductId, Product>();
  let userCarts = Map.empty<Principal, ShoppingCart>();
  let userOrderHistories = Map.empty<Principal, UserOrderHistory>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management (Admin-only for modifications)
  public shared ({ caller }) func createProduct(
    name : Text,
    description : Text,
    price : Nat,
    category : Category,
    imageUrl : Text,
    stockQuantity : Nat,
    deliveryType : DeliveryType,
  ) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    let productId = nextProductId;
    nextProductId += 1;

    let newProduct : Product = {
      id = productId;
      name;
      description;
      price;
      category;
      imageUrl;
      stockQuantity;
      deliveryType;
    };

    products.add(productId, newProduct);
    newProduct;
  };

  public shared ({ caller }) func updateProduct(
    id : ProductId,
    name : Text,
    description : Text,
    price : Nat,
    category : Category,
    imageUrl : Text,
    stockQuantity : Nat,
    deliveryType : DeliveryType,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduct : Product = {
          id;
          name;
          description;
          price;
          category;
          imageUrl;
          stockQuantity;
          deliveryType;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (_) {
        products.remove(id);
      };
    };
  };

  // Product Viewing (Public - no authentication required)
  public query func getProduct(id : ProductId) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  // Shopping Cart Management (User-only)
  public shared ({ caller }) func addToCart(productId : ProductId, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        if (quantity > product.stockQuantity) {
          Runtime.trap("Not enough stock available");
        };

        let cart = switch (userCarts.get(caller)) {
          case (null) { { items = []; total = 0 } };
          case (?existingCart) { existingCart };
        };

        let existingItem = cart.items.find(func(item) { item.productId == productId });

        let newItems = switch (existingItem) {
          case (?item) {
            cart.items.map(func(cartItem) {
              if (cartItem.productId == productId) {
                { productId; quantity = cartItem.quantity + quantity };
              } else {
                cartItem;
              };
            });
          };
          case (null) {
            cart.items.concat([ { productId; quantity } ]);
          };
        };

        let newTotal = cart.total + (product.price * quantity);
        let newCart : ShoppingCart = { items = newItems; total = newTotal };
        userCarts.add(caller, newCart);
      };
    };
  };

  public shared ({ caller }) func removeFromCart(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };

    switch (userCarts.get(caller)) {
      case (null) { Runtime.trap("Shopping cart not found") };
      case (?cart) {
        switch (cart.items.find(func(item) { item.productId == productId })) {
          case (null) { Runtime.trap("Product not found in cart") };
          case (?item) {
            let newItems = cart.items.filter(func(item) { item.productId != productId });
            let updatedTotal = cart.total - (getProductPrice(productId) * item.quantity);
            let newCart = { items = newItems; total = updatedTotal };
            userCarts.add(caller, newCart);
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateCartQuantity(productId : ProductId, newQuantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart quantities");
    };

    switch (userCarts.get(caller)) {
      case (null) { Runtime.trap("Shopping cart not found") };
      case (?cart) {
        switch (cart.items.find(func(item) { item.productId == productId })) {
          case (null) { Runtime.trap("Product not found in cart") };
          case (?_) {
            let updatedItems = cart.items.map(
              func(item) {
                if (item.productId == productId) {
                  { productId; quantity = newQuantity };
                } else {
                  item;
                };
              }
            );

            var newTotal = 0;
            for (item in updatedItems.values()) {
              newTotal += getProductPrice(item.productId) * item.quantity;
            };

            let newCart = { items = updatedItems; total = newTotal };
            userCarts.add(caller, newCart);
          };
        };
      };
    };
  };

  public query ({ caller }) func getCart() : async ShoppingCart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their cart");
    };

    switch (userCarts.get(caller)) {
      case (null) { { items = []; total = 0 } };
      case (?cart) { cart };
    };
  };

  // Order Management (User-only)
  public shared ({ caller }) func checkout() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can checkout");
    };

    switch (userCarts.get(caller)) {
      case (null) { Runtime.trap("Shopping cart is empty") };
      case (?cart) {
        if (cart.items.size() == 0) {
          Runtime.trap("Shopping cart is empty");
        };

        cart.items.forEach(func(item) { processOrderItem(item) });

        let order : Order = {
          id = nextOrderId;
          items = cart.items;
          total = cart.total;
          status = #pending;
          timestamp = getCurrentTimestamp();
        };

        let userHistory = switch (userOrderHistories.get(caller)) {
          case (null) { { orders = [] } };
          case (?history) { history };
        };

        let updatedOrders = userHistory.orders.concat([ order ]);
        userOrderHistories.add(
          caller,
          {
            orders = updatedOrders;
          },
        );
        nextOrderId += 1;
        userCarts.remove(caller);
      };
    };
  };

  public query ({ caller }) func getOrderHistory() : async UserOrderHistory {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order history");
    };

    switch (userOrderHistories.get(caller)) {
      case (null) { { orders = [] } };
      case (?history) { history };
    };
  };

  // Helper Functions
  func processOrderItem(item : OrderItem) {
    switch (products.get(item.productId)) {
      case (null) {};
      case (?product) {
        if (item.quantity <= product.stockQuantity) {
          let updatedProduct : Product = {
            id = product.id;
            name = product.name;
            description = product.description;
            price = product.price;
            category = product.category;
            imageUrl = product.imageUrl;
            stockQuantity = product.stockQuantity - item.quantity;
            deliveryType = product.deliveryType;
          };
          products.add(item.productId, updatedProduct);
        };
      };
    };
  };

  func getProductPrice(productId : ProductId) : Nat {
    switch (products.get(productId)) {
      case (null) { 0 };
      case (?product) { product.price };
    };
  };

  func getCurrentTimestamp() : Int {
    0;
  };
};
