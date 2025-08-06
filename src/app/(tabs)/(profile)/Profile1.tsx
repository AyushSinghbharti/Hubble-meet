import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  findNodeHandle,
  UIManager,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NavHeader from "../../../components/NavHeader";
import TagDropdown from "../../../components/TagDropdown";
import { FONT } from "../../../../assets/constants/fonts";
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
import Divider from "@/src/components/Divider";

export default function SettingsScreen() {
  const profileData: UserProfile | null = useAuthStore((state) => state.user);
  const { mutate: updateUserProfile, isPending: pendingUpdateUserProfile } =
    useUpdateUserProfile();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(profileData?.full_name || "");
  const [dob, setDob] = useState<Date | null>(
    profileData?.date_of_birth ? new Date(profileData.date_of_birth) : null
  );
  const [gender, setGender] = useState(profileData?.gender || "male");
  const [bio, setBio] = useState(profileData?.bio || "");
  const [image, setImage] = useState(profileData?.profile_picture_url || null);
  const [uploadingImage, setUploadImage] = useState(false);
  const [swipedIds, setSwipedIds] = useState([]);
  const [swipeCount, setSwipeCount] = useState(0);
  const [companies, setCompanies] = useState(profileData?.current_company || []);
  const [industries, setIndustries] = useState(profileData?.current_industry || []);
  const [email, setEmail] = useState(profileData?.email || "");
  const [location, setLocation] = useState(profileData?.city || "");
  const [jobTitle, setJobTitle] = useState(profileData?.job_title || "");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  useEffect(() => {
    if (error && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [error]);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date) => {
    setDob(date);
    hideDatePicker();
  };

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
        const s3Response = await uploadFileToS3(res.assets[0]);
        const url = s3Response.url;
        setImage(url);
      } catch (err) {
        setError("Error uploading image, please try again");
      } finally {
        setUploadImage(false);
      }
    }
  };

  const isProfileComplete = () => name && bio && email && companies.length && jobTitle && location && dob;

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

  useEffect(() => {
    AsyncStorage.setItem("swipedIds", JSON.stringify(swipedIds));
    AsyncStorage.setItem("swipeCount", swipeCount.toString());
  }, [swipedIds, swipeCount]);

  const performSearch = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: query, format: "json", addressdetails: 1, limit: 5 },
        headers: { "Accept-Language": "en", "User-Agent": "MyReactNativeApp/1.0" },
      });
      const results = response.data.map((item) => ({
        label: item.display_name,
        value: item.display_name,
        city: item.address.city || item.address.town || item.address.village || "",
      }));
      setSuggestions(results);
    } catch (error) {
      setError("Could not load location suggestions");
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
      fullName: name,
      bio: bio,
      currentCompany: companies,
      jobTitle: jobTitle,
      city: location,
      currentIndustry: industries,
      profilePictureUrl: image,
      dateOfBirth: dob?.toISOString().split("T")[0],
      gender: gender,
    };
    updateUserProfile(
      { userId: profileData.user_id, data: formData },
      {
        onSuccess: () => alert("Profile updated successfully"),
        onError: () => setError("Failed to update profile"),
      }
    );
  };

  const handleUndo = () => {
    // Reset all fields to original profile data
    setName(profileData?.full_name || "");
    setDob(profileData?.date_of_birth ? new Date(profileData.date_of_birth) : null);
    setGender(profileData?.gender || "male");
    setBio(profileData?.bio || "");
    setImage(profileData?.profile_picture_url || null);
    setCompanies(profileData?.current_company || []);
    setIndustries(profileData?.current_industry || []);
    setEmail(profileData?.email || "");
    setLocation(profileData?.city || "");
    setJobTitle(profileData?.job_title || "");
    setError(null);
  };

  return (
    <View style={styles.container}>
      <NavHeader title="Edit Profile" />
      <ScrollView
        style={styles.scrollView}
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View style={styles.profileContainer}>
          {uploadingImage ? (
            <View style={[styles.profileImageContainer, styles.loadingContainer]}>
              <ActivityIndicator color="#A3CB38" size="large" />
            </View>
          ) : (
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: image || "https://via.placeholder.com/120" }}
                style={styles.profileImage}
              />
            </View>
          )}
          <TouchableOpacity onPress={pickImage} style={styles.changeButton}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Section */}
        <View style={{ backgroundColor: "#1E1E1E", paddingHorizontal: 20, borderRadius: 20, paddingVertical: 10, marginBottom: 30 }} >

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>What's your full name?</Text>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Shyam Kumar"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>When were you born?</Text>
              <TouchableOpacity onPress={showDatePicker}>
                <Input
                  value={dob ? dob.toLocaleDateString('en-GB') : ""}
                  placeholder="Select date"
                  editable={false}
                  rightIcon="calendar-outline"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>How do you identify?</Text>
              <View style={styles.genderContainer}>
                {[
                  { key: "male", label: "Male", icon: "♂" },
                  { key: "female", label: "Female", icon: "♀" },
                  { key: "non-binary", label: "Non-Binary", icon: "⚧" }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.genderButton,
                      gender === option.key && styles.selectedGenderBorder
                    ]}
                    onPress={() => setGender(option.key)}
                  >
                    <Text style={styles.genderIcon}>{option.icon}</Text>
                    <Text
                      style={[
                        styles.genderText,
                        gender === option.key && styles.selectedGenderText
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>

                ))}
              </View>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: "#d1d1d1" }]}>Your Bio</Text>
            <View style={styles.fieldContainer}>
              <Input
                value={bio}
                onChangeText={setBio}
                placeholder="I am a passionate and details oriented Product designer with a strong focus on creating user-centric designs that enhances usability and delivery"
                multiline
                numberOfLines={4}
                maxLength={100}
              />
              <Text style={styles.counter}>{bio.length}/100</Text>
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: "#d1d1d1" }]}>Where can people reach you professionally?</Text>
            <View style={styles.fieldContainer}>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="jhondoe254@gmail.com"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* City Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: "#d1d1d1" }]}>City</Text>
            <View style={styles.fieldContainer}>
              <View style={styles.autocompleteContainer}>
                <TextInput
                  style={styles.locationInput}
                  value={location}
                  onChangeText={(text) => {
                    setLocation(text);
                    performSearch(text);
                  }}
                  placeholder="Jaipur, India"
                  placeholderTextColor="#666"
                />
                {suggestions.length > 0 && (
                  <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.suggestionList}
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
            </View>
          </View>

        </View>



        <View style={styles.section}>


          <Text style={[styles.sectionTitle]}>Interests & Background</Text>


          <View style={{ backgroundColor: "#1E1E1E", paddingHorizontal: 20, borderRadius: 20, paddingVertical: 10, marginBottom: 30 }} >
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Industries you work in?</Text>
              <TagDropdown

                options={industriesChipData}
                selected={industries}
                onChange={setIndustries}
                placeholder="Select industries"
              />
            </View>

            <Divider />

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Job Title</Text>
              <Input
                value={jobTitle}
                onChangeText={setJobTitle}
                placeholder="General Manager"
              />
            </View>

            <Divider />

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Interested Industries</Text>
              <TagDropdown
                options={industriesChipData}
                selected={industries}
                onChange={setIndustries}
                placeholder="Select industries"
              />
            </View>

            <Divider />

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Interested Job Roles</Text>
              <TagDropdown
                options={topCompaniesForChipData}
                selected={companies}
                onChange={setCompanies}
                placeholder="Select job roles"
              />
            </View>

            <Divider />

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Cities on your radar</Text>
              <Input
                value={location}
                onChangeText={setLocation}
                placeholder="Bangalore, Gurgaon"
              />
            </View>

          </View>


        </View>

        {/* Add extra padding at bottom for the fixed buttons */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.undoButton}
          onPress={handleUndo}
        >
          <Text style={styles.undoButtonText}>Undo & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={pendingUpdateUserProfile}
        >
          {pendingUpdateUserProfile ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={dob || new Date()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
      />

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
    </View>
  );
}

const Input = ({
  value,
  onChangeText,
  placeholder,
  multiline,
  numberOfLines,
  editable = true,
  rightIcon,
  keyboardType,
  maxLength
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#666"
      multiline={multiline}
      numberOfLines={multiline ? numberOfLines : 1}
      editable={editable}
      keyboardType={keyboardType}
      maxLength={maxLength}
    />
    {rightIcon && (
      <Ionicons
        name={rightIcon}
        size={20}
        color="#666"
        style={styles.inputIcon}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60, // Space for status bar
  },
  bottomPadding: {
    height: 100, // Space for fixed bottom buttons
  },

  // Profile Image Section
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImageContainer: {
    width: "100%",
    height: 400,
    overflow: "hidden",
    backgroundColor: "#2A2A2A",
    marginBottom: 12,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  changeButton: {
    paddingVertical: 4,
  },
  changeText: {
    color: "#A3CB38",
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: FONT?.MEDIUM,
  },

  // Section Styles
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#BBCF8D",
    fontSize: 18,
    fontFamily: FONT?.MONSERRATMEDIUM,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#CCCCCC",
    fontSize: 14,
    fontFamily: FONT?.MEDIUM,
    marginBottom: 8,
  },

  // Input Styles
  inputContainer: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#404040",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONT?.MEDIUM,
  },
  multilineInput: {
    textAlignVertical: "top",
    minHeight: 80,
  },
  inputIcon: {
    marginLeft: 8,
  },
  counter: {
    color: "#666",
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
    fontFamily: FONT?.REGULAR,
  },

  // Location Input
  locationInput: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#404040",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONT?.MEDIUM,
  },
  autocompleteContainer: {
    position: "relative",
    zIndex: 1000,
  },
  suggestionList: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    borderColor: "#404040",
    borderWidth: 1,
    maxHeight: 150,
    marginTop: 4,
  },
  suggestionItem: {
    padding: 12,
    borderBottomColor: "#404040",
    borderBottomWidth: 1,
  },
  suggestionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONT?.MEDIUM,
  },

  // Gender Selection
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#404040",
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedGender: {
    backgroundColor: "#A3CB38",
    borderColor: "#A3CB38",
  },
  genderIcon: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  genderText: {
    color: "#d1d1d1",
    fontSize: 12,
    fontFamily: FONT?.MEDIUM,
  },
  selectedGenderText: {
    color: "#BBCF8D",
  },

  // Fixed Bottom Buttons
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34, // Extra padding for safe area
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#404040",
  },
  undoButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  undoButtonText: {
    color: "#BBCF8D",
    fontSize: 16,
    fontFamily: FONT?.MONSERRATMEDIUM,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#BBCF8D",
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#000000",
    fontSize: 16,
    fontFamily: FONT?.SEMIBOLD,
  },
  selectedGenderBorder: {
    borderColor: '#BBCF8D' // Change to your desired selected color
  },
});