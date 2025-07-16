import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  findNodeHandle,
  UIManager,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NavHeader from "../../../components/NavHeader";
import SelectCountryModal from "../../../components/selectCountryModal";
import TagDropdown from "../../../components/TagDropdown";
import { FONT } from "../../../../assets/constants/fonts";
import colorTheme from "../../../theme/colourTheme";
import Button from "../../../components/Button";
import { useAuthStore } from "@/src/store/auth";
import { UserProfile } from "@/src/interfaces/profileInterface";
import { useUpdateUserProfile } from "@/src/hooks/useProfile";
import { useUpdateVbcCard } from "@/src/hooks/useVbc";
import { useVbcStore } from "@/src/store/vbc";
import { uploadToCloudinary } from "@/src/api/cloudinary";
import ErrorAlert from "@/src/components/errorAlert";

export default function SettingsScreen() {
  const profileData: UserProfile | null = useAuthStore((state) => state.user);
  const vbcStore = useVbcStore((state) => state.vbcId);
  const { mutate: updateUserProfile, isPending: pendingUpdateUserProfile } =
    useUpdateUserProfile();
  const { mutate: updateVbcCard, isPending: pendingUpdateVbcCard } =
    useUpdateVbcCard();

  const [error, setError] = useState<string | null>();
  const [name, setName] = useState(profileData?.full_name || "");
  const [phone, setPhone] = useState(profileData?.phone?.slice(3) || "");
  const [email, setEmail] = useState(profileData?.email || "");
  const [location, setLocation] = useState(profileData?.city || "");
  const [jobTitle, setJobTitle] = useState(profileData?.job_title || "");
  const [bio, setBio] = useState(profileData?.bio || "");
  const [image, setImage] = useState(profileData?.profile_picture_url || null);
  const [uploadingImage, setUploadImage] = useState(false);
  const [companies, setCompanies] = useState(["Google", "Netflix"]);
  const [industries, setIndustries] = useState(
    profileData?.current_industry || []
  );
  const [dob, setDob] = useState<Date | null>(
    profileData?.date_of_birth ? new Date(profileData.date_of_birth) : null
  );

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [selectedFlag, setSelectedFlag] = useState({
    flag: "https://flagcdn.com/w40/in.png",
    dial_code: profileData?.phone?.slice(0, 3) || "+91",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [flagBoxPosition, setFlagBoxPosition] = useState({ x: 0, y: 0 });
  const flagBoxRef = useRef(null);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date) => {
    setDob(date);
    hideDatePicker();
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      try {
        setUploadImage(true);
        const url = await uploadToCloudinary(res.assets[0].uri);
        setImage(url);
      } catch (err) {
        console.log(err);
        setError("Error uploading image, please try again");
      } finally {
        setUploadImage(false);
      }
    }
  };

  const handleOpenModal = () => {
    const handle = findNodeHandle(flagBoxRef.current);
    if (handle) {
      UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
        setFlagBoxPosition({ x: pageX, y: pageY });
        setModalVisible(true);
      });
    }
  };

  const handleSave = () => {
    if (!profileData?.user_id) {
      setError("Invalid user session. Please re-login.");
      return;
    }

    const formData = {
      fullName: name || undefined,
      bio: bio || undefined,
      currentCompany: companies?.[0] || undefined,
      jobTitle: jobTitle || undefined,
      city: location || undefined,
      currentIndustry: industries?.length ? industries : undefined,
      industriesOfInterest: profileData?.industries_of_interest || undefined,
      citiesOnRadar: profileData?.cities_on_radar || undefined,
      connectionPreferences: profileData?.connection_preferences || undefined,
      profilePictureUrl: image || undefined,
      dateOfBirth: dob?.toISOString().split("T")[0] || undefined,
    };

    const vbcData = {
      display_name: name,
      job_title: jobTitle || undefined,
      company_name: companies?.[0] || undefined,
      location: location,
      allow_vbc_sharing: true,
    };

    updateUserProfile(
      { userId: profileData.user_id, data: formData },
      {
        onSuccess: (res) => {
          console.log("Profile updated successfully", res);
        },
        onError: (err) => {
          console.error("Error updating profile", err);
          setError("Failed to update profile. Please try again later.");
        },
      }
    );

    updateVbcCard(
      {
        id: vbcStore || "",
        data: vbcData,
      },
      {
        onSuccess: (res) => {
          console.log("VBC updated successfully", res);
        },
        onError: (error) => {
          console.log("VBC update error", error);
          setError("Failed to update VBC info. Try again.");
        },
      }
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      keyboardShouldPersistTaps="handled"
    >
      <NavHeader title="Profile" />

      <View style={[styles.profileContainer]}>
        {uploadingImage ? (
          <View
            style={[
              styles.profileImage,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <ActivityIndicator color={"#f7f7f7"} size={"large"} />
          </View>
        ) : (
          <Image
            source={{
              uri:
                image ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRooEnD32-UtBw55GBfDTxxUZApMhWWnRaoLw&s",
            }}
            style={styles.profileImage}
          />
        )}
        <Text style={styles.profileName}>{profileData?.full_name}</Text>
        <TouchableOpacity style={{ marginTop: 2 }} onPress={pickImage}>
          <Text
            style={{
              color: "#fff",
              fontFamily: FONT.MEDIUM,
              fontSize: 12,
              textDecorationLine: "underline",
              letterSpacing: 0.5,
            }}
          >
            Change
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        User Name <Text style={{ color: "red" }}>*</Text>
      </Text>
      <Input placeholder="Enter name" value={name} onChangeText={setName} />

      <Text style={styles.label}>
        DOB <Text style={{ color: "red" }}>*</Text>
      </Text>
      <TouchableOpacity onPress={showDatePicker}>
        <Input
          placeholder="Select date"
          value={dob ? dob.toLocaleDateString() : ""}
          icon="calendar-clear-outline"
          editable={false}
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={dob || new Date(1990, 0, 1)}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Text style={styles.label}>
        Phone Number <Text style={{ color: "red" }}>*</Text>
      </Text>
      <View style={styles.phoneContainer}>
        <TouchableOpacity
          style={styles.countryCode}
          onPress={handleOpenModal}
          ref={flagBoxRef}
        >
          {selectedFlag && (
            <>
              <Image
                source={{ uri: selectedFlag.flag }}
                style={{ width: 24, height: 18, marginRight: 6 }}
              />
              <Text style={[styles.input, { flex: 0 }]}>
                {selectedFlag.dial_code}
              </Text>
            </>
          )}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Input
            placeholder="525 735 4556"
            containerStyle={{ marginLeft: 8 }}
            value={phone}
            onChangeText={setPhone}
          />
        </View>
      </View>
      <Text style={styles.otpText}>Verify with OTP</Text>

      <FormLabel label="Email" />
      <Input
        placeholder="r.g.rhodes@aol.com"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.otpText}>Verify with OTP</Text>

      <FormLabel label="Country/City" />
      <Input placeholder="Jaipur" value={location} onChangeText={setLocation} />

      <FormLabel label="Your Bio" />
      <Input
        placeholder="Write something..."
        multiline
        numberOfLines={4}
        maxLength={100}
        value={bio}
        onChangeText={setBio}
      />
      <Text style={styles.counter}>{bio.length}/100</Text>

      <FormLabel label="Company" />
      <TagDropdown
        options={["Google", "Microsoft", "Amazon", "Apple", "Netflix"]}
        selected={companies}
        onChange={setCompanies}
        placeholder="Select companies"
        mode="Light"
      />

      <FormLabel label="Job Title" />
      <Input
        placeholder="General Manager"
        value={jobTitle}
        onChangeText={setJobTitle}
      />

      <FormLabel label="Industries" />
      <TagDropdown
        options={["Technology", "Healthcare", "Finance", "Education", "Retail"]}
        selected={industries}
        onChange={setIndustries}
        placeholder="Select industries"
        mode="Light"
      />

      <Button label="Save settings" onPress={handleSave} />

      <SelectCountryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(country) => {
          setSelectedFlag({ flag: country.flag, dial_code: country.dial_code });
          setModalVisible(false);
        }}
        position={flagBoxPosition}
      />

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
    </ScrollView>
  );
}

const FormLabel = ({ label }) => <Text style={styles.label}>{label}</Text>;

const Input = ({
  placeholder,
  icon,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  value,
  onChangeText,
  containerStyle = {},
}) => (
  <View style={[styles.inputContainer, containerStyle]}>
    <TextInput
      style={[
        styles.input,
        multiline && styles.textArea,
        // Platform specific adjustments for line height
        Platform.OS === "ios" && { lineHeight: 20 }, // Adjust for iOS if needed
        Platform.OS === "android" && {
          textAlignVertical: multiline ? "top" : "center",
        }, // Ensure vertical alignment
      ]}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      multiline={multiline}
      numberOfLines={numberOfLines}
      maxLength={maxLength}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      // 'none' prevents interaction with the TextInput when editable is false
      pointerEvents={editable ? "auto" : "none"}
    />
    {icon && <Ionicons name={icon} size={20} color="gray" />}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 30,
    backgroundColor: "#3E3E3E",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 8,
  },
  profileName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    color: "#fff",
    fontFamily: FONT.SEMIBOLD,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#cfd4dc",
    borderRadius: 8,
    // Unified padding for better consistency
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10, // Slight adjustment for iOS vs Android
    backgroundColor: "#F8FBFF",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48, // Set a minimum height for single-line inputs
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "InterMedium",
    // Remove padding here as it's handled by inputContainer
    padding: 0, // Important: remove default TextInput padding
  },
  textArea: {
    minHeight: 80, // Minimum height for multiline inputs
    height: "auto", // Allow height to adjust based on content
    textAlignVertical: "top", // Ensures text starts from the top on Android
    paddingVertical: Platform.OS === "ios" ? 12 : 10, // Maintain vertical padding for multiline
  },
  phoneContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#f1f1f1",
  },
  otpText: {
    color: "green",
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
    fontFamily: FONT.BOLD,
  },
  counter: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#888",
  },
  button: {
    marginTop: 24,
    backgroundColor: colorTheme.buttonPrimary,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
  },
  buttonText: {
    color: "#000",
    fontFamily: "InterBold",
    fontSize: 16,
  },
});
