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
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from '@react-navigation/native';

function UserDetails() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assignments, setAssignments] = useState({});
  const [dropdownOpenStates, setDropdownOpenStates] = useState({});
  const [pickupDate, setPickupDate] = useState(""); // State for Pickup Date
  const [items, setItems] = useState([
    { label: "Unassigned", value: "Unassigned" },
    { label: "John Doe", value: "John Doe" },
    { label: "Jane Smith", value: "Jane Smith" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          "https://sheet.best/api/sheets/27658b60-3dca-4cc2-bd34-f65124b8a27d"
        );
        setUserData(result.data);
      } catch (error) {
        console.error("Error fetching data from Google Sheets API:", error);
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAccept = (index) => {
    console.log("Accepted user at index:", index);
  };

  const handleAssignmentChange = (index, value) => {
    setAssignments({ ...assignments, [index]: value });
  };

  const handleDropdownOpen = (index, open) => {
    setDropdownOpenStates((prevState) => ({
      ...prevState,
      [index]: open,
    }));
  };

  const handleCardPress = (user) => {
    navigation.navigate('DetailScreen', { user });
  };

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
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#6f42c1" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {userData.map((user, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(user)}>
              <View style={styles.card}>
                <View style={styles.detailSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>AWB No:</Text>
                    <Text style={styles.value}>{user.AWB_NUMBER || ""}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{user.NAME || ""}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{user.ADDRESS || ""}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Weight Apx:</Text>
                    <Text style={styles.value}>{user.WEIGHTAPX || ""}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Preferred Date&Time:</Text>
                    <Text style={styles.value}>
                      {user.PREFERRED_DATE_TIME || ""}
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
                    onPress={() => handleAccept(index)}
                  >
                    <Image
                      style={styles.image}
                      source={{ uri: "/assets/rootIcon.svg" }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.assignmentSection}>
                  <Text style={styles.label}>Assign:</Text>
                  <DropDownPicker
                    open={dropdownOpenStates[index] || false}
                    value={assignments[index] || "Unassigned"}
                    items={items}
                    setOpen={(open) => handleDropdownOpen(index, open)}
                    setValue={(value) => handleAssignmentChange(index, value)}
                    setItems={setItems}
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    dropDownContainerStyle={styles.dropdownMenu}
                  />
                </View>
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
    backgroundColor:"#f0f2f5",
    padding: 10,
    zIndex: 1000,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    justifyContent:"flex-start",
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    height:"100vh",
    overflow:"scroll",
    paddingTop: 30, // Adjust for sticky header
    paddingBottom: 150, // Adjust for sticky header
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
    shadowRadius: 3,
    elevation: 3,
  },
  detailSection: {
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#555",
    textAlign: "right",
  },
  error: {
    color: "#d9534f",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#4b0082",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  image: {
    width: 18,
    height: 18,
  },
  assignmentSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 5,
  },
  dropdown: {
    backgroundColor: "#f0f2f5",
    borderWidth: 0,
    minHeight: 30,
  },
  dropdownContainer: {
    width: 150,
  },
  dropdownMenu: {
    backgroundColor: "#f0f2f5",
  },
});

export default UserDetails;
