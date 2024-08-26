import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

function UidUI() {
  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const uidValue = watch("uid"); // Watch the UID field value

  const isButtonEnabled = !errors.uid && uidValue && uidValue.length >= 1;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await axios.get(
        "https://sheet.best/api/sheets/27658b60-3dca-4cc2-bd34-f65124b8a27d"
      );
      const uidExists = result.data.find((d) => d.UID == data.uid);

      if (!uidExists) {
        setError("uid", {
          type: "manual",
          message: "Invalid UID: No ID has been generated for pickup confirmation.",
        });
        return;
      }
      console.log(uidExists);
    } catch (error) {
      setError("uid", { type: "manual", message: "Something went wrong. Please try again later." });
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Enter Your UID</Text>
        <Controller
          control={control}
          name="uid"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                style={[styles.input, errors.uid && styles.inputError]}
                placeholder="UID"
                placeholderTextColor="#9b59b6"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.uid && (
                <Text style={styles.errorText}>{errors.uid.message}</Text>
              )}
            </View>
          )}
          rules={{
            required: "UID is required",
            minLength: {
              value: 1,
              message: "UID must be at least 1 character",
            },
            maxLength: {
              value: 10,
              message: "UID must not exceed 10 characters",
            },
          }}
        />
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isButtonEnabled ? "#4b0082" : "#d6c7e5", // Dark color when enabled, light lavender when disabled
            },
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={!isButtonEnabled || loading} // Disable button if UID is invalid or loading
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

export default UidUI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9ecef",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#6f42c1",
    fontWeight: "700",
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#6f42c1",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f4f4f4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});