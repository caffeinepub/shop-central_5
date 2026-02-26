import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  // Types for old state
  type OldUserProfile = {
    name : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  // Types for new state
  type NewUserProfile = {
    name : Text;
    phoneNumber : Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  // Migration function focusing on mapping old profiles to new format
  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        { oldProfile with phoneNumber = "" }; // Initialize phoneNumber as empty Text
      }
    );
    { userProfiles = newUserProfiles };
  };
};
