import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    imageUrl : Text;
    stockQuantity : Nat;
  };

  type OldActor = {
    products : Map.Map<Nat, OldProduct>;
    nextProductId : Nat;
  };

  type NewProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : { #electronics; #clothing; #books; #food };
    imageUrl : Text;
    stockQuantity : Nat;
    deliveryType : { #oneHourDelivery; #takeaway };
  };

  type NewActor = {
    products : Map.Map<Nat, NewProduct>;
    nextProductId : Nat;
  };

  func getCategory(oldCategory : Text) : { #electronics; #clothing; #books; #food } {
    switch (oldCategory) {
      case ("electronics") { #electronics };
      case ("clothing") { #clothing };
      case ("books") { #books };
      case ("food") { #food };
      case (_) { #electronics };
    };
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Nat, OldProduct, NewProduct>(
      func(_id, oldProduct) {
        {
          oldProduct with
          category = getCategory(oldProduct.category);
          deliveryType = #oneHourDelivery; // Default for migrated products
        };
      }
    );
    {
      old with
      products = newProducts;
    };
  };
};
