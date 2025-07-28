import React, { useEffect, useRef, useState } from "react";
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
  Pressable,
  Alert,
  FlatList,
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
import ErrorAlert from "@/src/components/errorAlert";
import { useRouter } from "expo-router";
import {
  industriesChipData,
  topCompaniesForChipData,
} from "@/src/dummyData/chipOptions";
import { uploadFileToS3 } from "@/src/api/aws";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function SettingsScreen() {
  const profileData: UserProfile | null = useAuthStore((state) => state.user);
  const { mutate: updateUserProfile, isPending: pendingUpdateUserProfile } =
    useUpdateUserProfile();

  const [error, setError] = useState<string | null>();
  const [name, setName] = useState(profileData?.full_name || "");
  const [phone, setPhone] = useState(profileData?.phone?.slice(3) || "");
  const [email, setEmail] = useState(profileData?.email || "");
  const [location, setLocation] = useState(profileData?.city || "");
  const [jobTitle, setJobTitle] = useState(profileData?.job_title || "");
  const [bio, setBio] = useState(profileData?.bio || "");
  const [image, setImage] = useState(profileData?.profile_picture_url || null);
  const [uploadingImage, setUploadImage] = useState(false);
  const [swipedIds, setSwipedIds] = useState([]);
  const [swipeCount, setSwipeCount] = useState(0);
  const [companies, setCompanies] = useState(profileData?.current_company || []);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [industries, setIndustries] = useState(profileData?.current_industry || []);
  const [dob, setDob] = useState<Date | null>(
    profileData?.date_of_birth ? new Date(profileData.date_of_birth) : null
  );
  const scrollViewRef = useRef<ScrollView>(null);

  // For autocomplete suggestions
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (error && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [error]);

  // Phone country flag and dial code info
  const [selectedFlag, setSelectedFlag] = useState({
    flag: "https://flagcdn.com/w40/in.png",
    dial_code: profileData?.phone?.slice(0, 3) || "+91",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [flagBoxPosition, setFlagBoxPosition] = useState({ x: 0, y: 0 });
  const flagBoxRef = useRef(null);
  const router = useRouter();

  // Date Picker Handlers
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date) => {
    setDob(date);
    hideDatePicker();
  };

  // Image picker and upload
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      try {
        setUploadImage(true);
        try {
          const s3Response = await uploadFileToS3(res.assets[0]);
          const url = s3Response.url;
          setImage(url);
        } catch {
          setError("Error uploading image to server");
        }
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

  const isProfileComplete = () => {
    return name && bio && email && companies?.length && jobTitle && location && dob;
  };

  // Swipe data loading from AsyncStorage
  useEffect(() => {
    const loadSwipeData = async () => {
      try {
        const storedIds = await AsyncStorage.getItem("swipedIds");
        const storedCount = await AsyncStorage.getItem("swipeCount");
        if (storedIds) setSwipedIds(JSON.parse(storedIds));
        if (storedCount) setSwipeCount(parseInt(storedCount));
      } catch (err) {
        console.log("Failed to load swipe data:", err);
      }
    };
    loadSwipeData();
  }, []);

  // Save swipe data to AsyncStorage when changed
  useEffect(() => {
    AsyncStorage.setItem("swipedIds", JSON.stringify(swipedIds));
    AsyncStorage.setItem("swipeCount", swipeCount.toString());
  }, [swipedIds, swipeCount]);

  // City autocomplete search function
  const performSearch = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: query,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
        headers: {
          "Accept-Language": "en",
          "User-Agent": "MyReactNativeApp/1.0 (myemail@example.com)", // Customize as needed
        },
      });

      const results = response.data.map((item) => ({
        label: item.display_name,
        value: item.display_name,
        lat: item.lat,
        lon: item.lon,
        city:
          item.address.city ||
          item.address.town ||
          item.address.village ||
          item.address.county ||
          "",
      }));

      setSuggestions(results);
    } catch (error) {
      console.error("Failed to fetch location suggestions:", error);
      Alert.alert(
        "Error",
        "Could not load location suggestions. Please try again later."
      );
      setSuggestions([]);
    }
  };

  const handleSave = () => {
    if (!profileData?.user_id) {
      setError("Invalid user session. Please re-login.");
      return;
    }

    if (!name || !bio || !email) {
      setError("Please fill all required fields");
      return;
    }

    const formData = {
      fullName: name || undefined,
      bio: bio || undefined,
      currentCompany: companies || [],
      jobTitle: jobTitle || "",
      city: location || "",
      currentIndustry: industries?.length ? industries : [],
      industriesOfInterest: profileData?.industries_of_interest || [],
      profilePictureUrl: image || undefined,
      dateOfBirth: dob?.toISOString().split("T")[0] || undefined,
    };

    updateUserProfile(
      { userId: profileData.user_id, data: formData },
      {
        onSuccess: (res) => {
          console.log("Profile updated successfully", JSON.stringify(res, null, 2));
          Alert.alert("Profile updated successfully");
        },
        onError: (err) => {
          console.error("Error updating profile", err);
          setError("Failed to update profile. Please try again later.");
        },
      }
    );
  };

  return (
    <ScrollView
      style={styles.container}
      ref={scrollViewRef}
      contentContainerStyle={{ paddingBottom: 100 }}
      keyboardShouldPersistTaps="handled"
    >
      <NavHeader title="Profile" onBackPress={() => router.replace("/profile")} />

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
        <Pressable
          style={styles.countryCode}
          // onPress={handleOpenModal}
          ref={flagBoxRef}
        >
          {selectedFlag && (
            <>
              <Image
                source={{ uri: selectedFlag.flag }}
                style={{ width: 24, height: 18, marginRight: 6 }}
              />
              <Text style={[styles.input, { flex: 0 }]}>{selectedFlag.dial_code}</Text>
            </>
          )}
        </Pressable>
        <View style={{ flex: 1 }}>
          <Input
            placeholder="525 735 4556"
            editable={false}
            containerStyle={{ marginLeft: 8 }}
            value={phone}
            onChangeText={setPhone}
          />
        </View>
      </View>
      <Text style={styles.otpText}>Verify with OTP</Text>

      <FormLabel label="Email" />
      <Input placeholder="r.g.rhodes@aol.com" value={email} onChangeText={setEmail} />
      <Text style={styles.otpText}>Verify with OTP</Text>

      <FormLabel label="Country/City" />
      <View style={[styles.autocompleteContainer]}>
        <TextInput
          style={[styles.input, { height: 50, paddingLeft: 10 }]}
          value={location}
          onChangeText={(text) => {
            setLocation(text);
            performSearch(text);
          }}
          placeholder="City..."
          placeholderTextColor={"#000"}
          autoCorrect={false}
        />
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            style={styles.suggestionList}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  setLocation(item.city || item.label);
                  setSuggestions([]);
                }}
              >
                <Text style={styles.suggestionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

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
        options={topCompaniesForChipData}
        selected={companies}
        onChange={setCompanies}
        placeholder="Select companies"
        mode="Light"
      />

      <FormLabel label="Job Title" />
      <Input placeholder="General Manager" value={jobTitle} onChangeText={setJobTitle} />

      <FormLabel label="Industries" />
      <TagDropdown
        options={industriesChipData}
        selected={industries}
        onChange={setIndustries}
        placeholder="Select industries"
        mode="Light"
      />

      <Button label="Save settings" onPress={handleSave} enableRedirect={false} />

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
        Platform.OS === "ios" && { lineHeight: 20 },
        Platform.OS === "android" && {
          textAlignVertical: multiline ? "top" : "center",
        },
      ]}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      multiline={multiline}
      numberOfLines={numberOfLines}
      maxLength={maxLength}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
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
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    backgroundColor: "#F8FBFF",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "InterMedium",
    padding: 0,
    backgroundColor: "#F8FBFF",
    borderRadius: 10,

  },
  textArea: {
    minHeight: 80,
    height: "auto",
    textAlignVertical: "top",
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
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
  // Autocomplete specific styles
  autocompleteContainer: {
    position: "relative",
    zIndex: 1000,
    marginTop: 8,
    marginBottom: 16,
  },
  suggestionList: {
    backgroundColor: "#F8FBFF",
    borderRadius: 8,
    borderColor: "#cfd4dc",
    borderWidth: 1,
    maxHeight: 150,
    marginTop: 4,
  },
  suggestionItem: {
    padding: 12,
    borderBottomColor: "#d1d1d1",
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "InterMedium",
  },
});
