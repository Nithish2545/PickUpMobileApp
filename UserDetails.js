import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import debounce from "lodash.debounce";

const API_URL =
  "https://sheet.best/api/sheets/27658b60-3dca-4cc2-bd34-f65124b8a27d";
const SHEETDB_API_URL = "https://sheetdb.io/api/v1/prfchcqerqk07";

function UserDetails() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assignments, setAssignments] = useState({});
  const [pickupDate, setPickupDate] = useState("");
  const [userRole, setUserRole] = useState(null);

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const user = JSON.parse(token);
          setUserRole(user.PickUpPersonName); // Set the PickUpPersonName as userRole
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await axios.get(API_URL);
        setUserData(result.data);
      } catch (error) {
        console.error("Error fetching data from API:", error);
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updatePickUpPersonWithRetry = async (
    awbNumber,
    pickUpPerson,
    retryCount = 0
  ) => {

    try {
      const url = `${SHEETDB_API_URL}/id/${awbNumber}`;
      const response = await axios.patch(
        url,
        { data: { PickUpPersonName: pickUpPerson } },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update the row");
      }

      console.log("PickUpPersonName updated successfully");
    } catch (error) {
      if (error.response && error.response.status === 429 && retryCount < 3) {
        console.warn("Rate limit exceeded, retrying...");
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        ); // Exponential backoff
        await updatePickUpPersonWithRetry(
          awbNumber,
          pickUpPerson,
          retryCount + 1
        );
      } else {
        console.error("Error updating PickUpPersonName:", error);
      }
    }
  };

  const handleAssignmentChange = async (index, value) => {
    const selectedUser = userData[index];
    const awbNumber = selectedUser.AWB_NUMBER;
    await updatePickUpPersonWithRetry(awbNumber, value);
    setAssignments((prevAssignments) => ({
      ...prevAssignments,
      [index]: value,
    }));
  };

  const handleCardPress = (user) => {
    navigation.navigate("DetailScreen", { user });
  };

  const handleOpenMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error opening Google Maps:", err)
    );
  };

  const pickupPersons = ["Unassigned", "anish", "sathish"];

  // Filter userData based on role and PickUpPersonName
  const filteredUserData = userData.filter((user) => {
    if (userRole === "admin") {
      // Show all users if role is admin
      return true;
    } else if (userRole === "deepak") {
      // Show all users if userRole is deepak
      return true;
    } else if (userRole === "anish" || userRole === "sathish") {
      // Show only users with PickUpPersonName matching the current user
      return user.PickUpPersonName === userRole;
    }
    return false; // Hide users if role is unknown
  });

  return (
    <View style={styles.container}>
      <View style={styles.stickyHeader}>
        <Text style={styles.label}>Pickup Date:</Text>
        <TextInput
          style={styles.input}
          placeholder="Select Date"
          value={pickupDate}
          onChangeText={setPickupDate}
        />
        <TouchableOpacity
          style={styles.signOutButtonContainer}
          onPress={signOut}
        >
          <Text style={styles.signOutButton}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text>{userRole}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#6f42c1" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {filteredUserData.map((user, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(user)}>
              <View style={styles.card}>
                <View style={styles.detailSection}>
                  {user.STATUS == "PENDING" ? (
                    <View style={styles.pending}>
                      <Text style={styles.text}>{user.STATUS}</Text>
                    </View>
                  ) : (
                    <View style={styles.status}>
                      <Text style={styles.text}>{user.STATUS}</Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>AWB No:</Text>
                    <Text style={styles.value}>{user.AWB_NUMBER || ""}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{user.NAME || ""}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Weight Apx:</Text>
                    <Text style={styles.value}>{user.WEIGHTAPX || ""}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Preferred Date&Time:</Text>
                    <Text style={styles.value}>
                      {user.PICKUP_DATETIME || ""}
                    </Text>
                  </View>
                </View>
                <View style={styles.buttonSection}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleAccept(index)}
                  >
                    <Text style={styles.buttonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleOpenMap(user.LATITUDE, user.LONGITUDE)}
                  >
                    <Text style={styles.buttonText}>Open Map</Text>
                  </TouchableOpacity>
                </View>
                {console.log(userRole)}
                {(userRole === "admin" || userRole === "deepak") && (
                  <View style={styles.assignmentSection}>
                    <Text style={styles.label}>Assign:</Text>
                    <View style={styles.radioGroup}>
                      {pickupPersons.map((person) => (
                        <TouchableOpacity
                          key={person}
                          style={styles.radioButton}
                          onPress={() => handleAssignmentChange(index, person)}
                        >
                          <View
                            style={[
                              styles.radioCircle,
                              assignments[index] === person &&
                                styles.selectedRadioCircle,
                            ]}
                          />
                          <Text style={styles.radioText}>{person}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  stickyHeader: {
    position: "sticky",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f0f2f5",
    padding: 10,
    zIndex: 1000,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    width: 100,
    marginLeft: 10,
  },
  scrollContainer: {
    overflow: "scroll",
    height: "100%",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 150,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  detailSection: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
    width: 150,
  },
  value: {
    flex: 1,
  },
  buttonSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#6f42c1",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  assignmentSection: {
    marginTop: 10,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#6f42c1",
    marginRight: 5,
  },
  selectedRadioCircle: {
    backgroundColor: "#6f42c1",
  },
  radioText: {
    fontSize: 16,
  },
  signOutButtonContainer: {
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  signOutButton: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  status: {
    padding: 3,
    backgroundColor: "green",
    color: "white",
    alignSelf: "flex-end",
  },
  text: {
    color: "white",
    fontSize: "13px",
  },
  pending: {
    padding: 3,
    backgroundColor: "red",
    color: "white",
    alignSelf: "flex-end",
  },
});

export default UserDetails;