import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Animated,
  ActivityIndicator,
  Switch,
  Dimensions,
} from "react-native";
import {
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ProfileCard from "../../components/profileSetupComps/profileCard";
import FinalSetupPage from "../../components/profileSetupComps/finalScreen";
import TagDropdown from "../../components/TagDropdown";
import colourPalette from "../../theme/darkPaletter";
import RandomBackgroundImages, {
  RandomBGImagesRef,
} from "../../components/RandomBGImage";
import { useAuthStore } from "@/src/store/auth";
import { useCreateUserProfile } from "@/src/hooks/useProfile";
import ErrorAlert from "@/src/components/errorAlert";
import { uploadFileToS3 } from "@/src/api/aws";
import {
  industriesChipData,
  cityWithCountryChipData,
  rolesLookingForChipData,
  topCompaniesForChipData,
} from "@/src/dummyData/chipOptions";
import { logout } from "@/src/hooks/useAuth";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import OtpModal from "./otpVerify";
import { FONT } from "@/assets/constants/fonts";
import ProfileSummary from "@/src/components/ProfileSummary";
import { UserProfile } from "@/src/interfaces/profileInterface";

const { height: screenHeight } = Dimensions.get("window");

const ChipInput = ({
  label = "",
  placeholder = "",
  isSubHeading = false,
  items = [""],
  setItems,
  subtitle = "",
  options = [""],
  isSingleSelection = false,
}) => {
  return (
    <View
      style={[
        styles.chipContainer,
        { paddingHorizontal: isSubHeading ? 5 : 0 },
      ]}
    >
      <Text style={!isSubHeading ? styles.label : styles.miniLabel}>
        {label}
        {subtitle && <Text style={styles.subLabel}>{subtitle}</Text>}
      </Text>
      <TagDropdown
        options={options}
        selected={items}
        onChange={setItems}
        placeholder={placeholder}
        mode={"Transparent"}
        isSingleSelection={isSingleSelection}
      />
    </View>
  );
};

const SubChipInput = ({
  label = "",
  placeholder = "",
  isSubHeading = false,
  items = [""],
  setItems,
  subtitle = "",
  options = [""],
  isSingleSelection = false,
}) => {
  const isEmpty = items.length === 0;

  return (
    <View style={styles.chipContainer}>
      {isSubHeading ? (
        <>
          <View style={styles.subHeadingRow}>
            <View style={styles.textBlock}>
              <Text style={styles.miniLabel}>{label}</Text>
              {subtitle && (
                <Text style={styles.subLabel}>
                  Ex. <Text style={styles.subLabelBold}>{subtitle}</Text>
                </Text>
              )}
            </View>
            {isEmpty && (
              <TagDropdown
                options={options}
                selected={items}
                onChange={setItems}
                placeholder={placeholder}
                mode={"Transparent"}
                isSingleSelection={isSingleSelection}
              />
            )}
          </View>
          {!isEmpty && (
            <View style={styles.bottomDropdown}>
              <TagDropdown
                options={options}
                selected={items}
                onChange={setItems}
                placeholder={placeholder}
                mode={"Transparent"}
                isSingleSelection={isSingleSelection}
              />
            </View>
          )}
        </>
      ) : (
        <>
          <Text style={styles.label}>
            {label}
            {"\n"}
            {subtitle && <Text style={styles.subLabel}>Ex. {subtitle}</Text>}
          </Text>
          <TagDropdown
            options={options}
            selected={items}
            onChange={setItems}
            placeholder={placeholder}
            mode={"Transparent"}
            isSingleSelection={isSingleSelection}
          />
        </>
      )}
    </View>
  );
};

export default function ProfileSetup() {
  const router = useRouter();

  // Fetch Local info
  const user = useAuthStore((state) => state.user);
  const userId = useAuthStore((state) => state.userId);

  const [error, setError] = useState<string | null>();
  const [finalScreen, setFinalScreen] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState<string | null>(user?.full_name || "");
  const [dob, setDOB] = useState<Date | null>(null);
  const [formatedDob, setFromatedDOB] = useState("");
  const [gender, setGender] = useState(null);
  const [bio, setBio] = useState<string | null>(null);
  const [email, setEmail] = useState(user?.email);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone);
  const [jobTitle, setJobTitle] = useState("");
  const [address, setAddress] = useState("");
  const [worklist, setWorklist] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [connectPeople, setConnectPeople] = useState([]);
  const [shareVBC, setShareVBC] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [radarCities, setRadarCities] = useState([]);
  const [rolesLookingFor, setRolesLookingFor] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [uploadingImage, setUploadImage] = useState(false);
  const [showEmailVerify, setEmailVerify] = useState(false);
  const [showPhoneVerify, setPhoneVerify] = useState(false);

  const backgroundRef = useRef<RandomBGImagesRef>(null);
  const translateX = useRef(new Animated.Value(0)).current;

  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const utcMidnightDate = new Date(Date.UTC(year, month, day));

    setDOB(utcMidnightDate);

    const formattedDate = `${day.toString().padStart(2, "0")}/${(month + 1)
      .toString()
      .padStart(2, "0")}/${year}`;
    setFromatedDOB(formattedDate);

    hideDatePicker();
  };

  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: step,
      duration: 300,
      useNativeDriver: false,
    }).start();

    const handleChangeBackground = () => {
      backgroundRef.current?.newImage();
    };

    handleChangeBackground();
  }, [step]);

  // Swipe gesture handler
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;

      // Swipe right (go back)
      if (translationX > 50 || velocityX > 500) {
        if (step > 0) {
          prev();
        }
      }
      // Swipe left (go forward)
      else if (translationX < -50 || velocityX < -500) {
        if (step < 4) {
          next();
        }
      }

      // Reset animation
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const pickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "livePhotos"],
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!res.canceled && res.assets?.[0]?.uri) {
        setUploadImage(true);
        setImage(null);
        let imageUrl = "";

        try {
          const s3Response = await uploadFileToS3(res.assets?.[0]);

          if (s3Response.success && s3Response.url) {
            imageUrl = s3Response.url;
          } else {
            throw new Error("S3 upload failed");
          }
        } catch (err) {
          console.log("Upload Error:", err);
          setError("Error uploading image. Please try again.");
        } finally {
          setImage(imageUrl);
          setUploadImage(false);
        }
      }
    } catch (err) {
      console.error("Image Picker Error:", err);
      setError("Failed to open image picker.");
    }
  };

  const next = () => {
    if (step === 0 && (!name || !dob || !gender)) {
      setError("Please fill all fields");
      return;
    } else if (step === 1 && (!bio || !email || !phoneNumber)) {
      setError("Please fill all fields");
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));
  const skip = () => setStep(4);

  const {
    mutateAsync: createProfile,
    isPending,
    isError,
    error: CreateProfileError,
  } = useCreateUserProfile();

  const submit = async () => {
    if (!userId) {
      setError("Error while fetching data from server, please login directly");
      setFinalScreen(!finalScreen);
      await logout();
      return;
    }
    if (!name || !dob || !gender || !bio || !email || !phoneNumber) {
      setError("Please fill all required fields");
      setFinalScreen(!finalScreen);
      return;
    }
    const profileData = {
      userId: userId,
      fullName: name,
      dateOfBirth: dob.toISOString(),
      gender: gender,
      bio: bio,
      email: email,
      phone: phoneNumber,
      currentCompany: worklist || [],
      jobTitle: jobTitle,
      city: address,
      currentIndustry: spaces,
      industriesOfInterest: connectPeople,
      citiesOnRadar: radarCities,
      connectionPreferences: rolesLookingFor,
      profilePictureUrl:
        image || "https://xsgames.co/randomusers/assets/images/favicon.png",
      allowVbcSharing: shareVBC,
    };

    const profileRes = await createProfile(profileData);
    console.log("✅ Profile created:", profileRes);

    if (profileRes) {
      router.replace("/connect");
    }
    setFinalScreen(!finalScreen);
  };

  const handleVerifyOtp = (type: "email" | "phone") => {
    if (type === "email") {
      if (!email) return;
      setEmailVerify(true);
    } else if (type === "phone") {
      if (!phoneNumber) return;
      setPhoneVerify(true);
    }
  };

  const genderOptions = ["Male", "Female", "Non-binary"];

  const Steps = [
    // Step 0 — name, dob, gender
    () => (
      <>
        <Text style={styles.label}>
          What's your full name? <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>
          When were you born? <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.helperText}>We'll send cupcakes... Not really</Text>
        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          onPress={() => setDatePickerVisibility(!isDatePickerVisible)}
        >
          <Text
            style={[styles.dateText, !formatedDob && styles.placeholderText]}
          >
            {formatedDob || "DD/MM/YYYY"}
          </Text>
          <FontAwesome5 name="calendar-alt" size={20} color="#FFF" />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={new Date(2000, 0, 1)}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <Text style={styles.label}>
          How do you identify? <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.genderContainer}>
          {genderOptions.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genderBtn, gender === g && styles.selectedGender]}
              onPress={() => setGender(g)}
            >
              <View>
                {g === "Male" && (
                  // <Ionicons name="male" size={20} color={"#fff"} />
                  <MaterialCommunityIcons
                    name="gender-male"
                    size={30}
                    color={gender !== g ? "#fff" : "#BBCF8D"}
                  />
                )}
                {g === "Female" && (
                  // <Ionicons name="female" size={20} color={"#fff"} />
                  <MaterialCommunityIcons
                    name="gender-female"
                    size={30}
                    color={gender !== g ? "#fff" : "#BBCF8D"}
                  />
                )}
                {g === "Non-binary" && (
                  <MaterialCommunityIcons
                    name="gender-non-binary"
                    size={30}
                    color={gender !== g ? "#fff" : "#BBCF8D"}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.genderText,
                  gender === g && styles.selectedGenderText,
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    ),

    // Step 1 — bio + contact
    () => (
      <View>
        <Text style={styles.label}>
          A quick bio{"\n"}
          <Text style={styles.subLabel}>(who are you, what drives you)</Text>
        </Text>

        <View style={styles.bioContainer}>
          <TextInput
            style={styles.bioInput}
            placeholder="Tell us about yourself...."
            placeholderTextColor="#FFF"
            multiline
            maxLength={200}
            value={bio}
            onChangeText={setBio}
          />
          <View style={styles.enhanceBox}>
            <Image
              style={styles.enhanceIcon}
              source={require("@/assets/icons/ai.png")}
            />
            <Text style={styles.enhanceText}>Enhance</Text>
          </View>
        </View>

        <Text style={styles.label}>
          Where can people reach you professionally?
        </Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={styles.flexInput}
            placeholder="johndoe254@gmail.com"
            placeholderTextColor="#AAA"
            value={email}
            onChangeText={setEmail}
          />
          <View
            style={{
              width: 2,
              paddingVertical: 12,
              marginLeft: 4,
              backgroundColor: "#BBCF8D",
            }}
          />
          <TouchableOpacity
            style={styles.verifyBtn}
            onPress={() => handleVerifyOtp("email")}
          >
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputWithButton}>
          <TextInput
            style={styles.flexInput}
            placeholder="990 334 4556"
            placeholderTextColor="#AAA"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Image
            style={styles.iconGear}
            source={require("@/assets/icons/success.png")}
          />
        </View>
      </View>
    ),

    // Step 2 — work / space
    () => (
      <>
        <ChipInput
          options={topCompaniesForChipData}
          label="Where are you working these days?"
          subtitle={"Startup? MNC? Freelancing? We're cool with all "}
          placeholder="Add your workspace"
          items={worklist}
          setItems={setWorklist}
        />
        <ChipInput
          options={rolesLookingForChipData}
          label={"What do you call yourself at work ?\n"}
          subtitle={"Product Designer, Sales Ninja... you name it"}
          placeholder="Add your Job Title"
          items={jobTitle ? [jobTitle] : []} // Ensure 'items' is always an array
          setItems={(options) => setJobTitle(options[0] || "")} // Take the first item or an empty string
          isSingleSelection={true} // Specify single selection mode
        />
        <ChipInput
          options={industriesChipData}
          label={"What industry/sector are you in?\n"}
          subtitle={"Finance, AI, Retail, Hospitality... anything goes"}
          placeholder="Add Space"
          items={spaces}
          setItems={setSpaces}
        />
      </>
    ),

    // Step 3 — location + connection preferences
    () => (
      <>
        <Text style={styles.label}>Where are you making things happen?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter City"
          value={address}
          placeholderTextColor="#666"
          onChangeText={setAddress}
        />

        <SubChipInput
          isSubHeading={true}
          options={industriesChipData}
          label="Interested Industries"
          subtitle="Fintech, Fashion, Agentic AI..."
          placeholder="Add"
          items={connectPeople}
          setItems={setConnectPeople}
        />
        <View
          style={{
            borderWidth: 0.5,
            borderColor: "#aaa",
            width: "100%",
            top: -10,
          }}
        />
        <SubChipInput
          isSubHeading={true}
          options={cityWithCountryChipData}
          subtitle="Bangalore, Pune, Chennai..."
          label="Cities on your radar"
          placeholder="Add"
          items={radarCities}
          setItems={setRadarCities}
        />
        <View
          style={{
            borderWidth: 0.5,
            borderColor: "#aaa",
            width: "120%",
            top: -10,
          }}
        />
        <SubChipInput
          isSubHeading={true}
          subtitle="Founders, Designers, Mentor..."
          options={rolesLookingForChipData}
          label="Interested job roles"
          placeholder="Add"
          items={rolesLookingFor}
          setItems={setRolesLookingFor}
        />
      </>
    ),

    // Step 4 — profile pic + summary
    () => (
      <View>
        <Text style={[styles.label, { marginBottom: 4 }]}>
          Upload a professional profile picture
        </Text>
        <Text style={styles.subLabelItalic}>No selfies, Keep it classy</Text>

        {image ? (
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            <Image source={{ uri: image }} style={styles.image} />
          </TouchableOpacity>
        ) : uploadingImage ? (
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            <ActivityIndicator animating={true} color={"#A2BF71"} size={50} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            <View style={styles.uploadIconContainer}>
              <Ionicons name="cloud-upload-outline" size={24} color="#000" />
            </View>
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
        )}

        <View style={styles.vbcRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>
              Allow VBC <Text style={{ color: "red" }}>*</Text>
            </Text>
            <Text style={styles.subLabelItalic}>
              Allow Matched Users to Share Your VBCs to their Connections in the
              App
            </Text>
          </View>
          <Switch onValueChange={setShareVBC} value={shareVBC} />
        </View>
      </View>
    ),
  ];

  // Splash screen
  if (step === 5 && finalScreen) {
    setTimeout(() => {
      submit();
    }, 3000);

    return <FinalSetupPage />;
  }

  if (step === 5) {
    const profileData: UserProfile = {
      user_id: userId || "",
      full_name: name || "",
      date_of_birth: dob?.toISOString() ?? new Date().toISOString(),
      gender: gender || "",
      bio: bio || "",
      email: email || "",
      phone: phoneNumber || "",
      current_company: worklist || [],
      job_title: jobTitle,
      city: address,
      current_industry: spaces || [],
      industries_of_interest: connectPeople || [],
      cities_on_radar: radarCities || [],
      connection_preferences: rolesLookingFor || [],
      profile_picture_url:
        image || "https://xsgames.co/randomusers/assets/images/favicon.png",
      allow_vbc_sharing: shareVBC ?? false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(), // optional but good to include
      status: "CONNECTED", // or undefined if not yet set
    };

    return (
      <ProfileSummary
        onBackPress={prev}
        onSuccessPress={() => setFinalScreen(true)}
        userProfile={profileData}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <RandomBackgroundImages
        style={styles.backgroundContainer}
        blur={5}
        type="VeryLight"
        ref={backgroundRef}
      />

      {/* Top Header with Greeting and Skip */}
      <View style={styles.headerContainer}>
        <View style={styles.greetingContainer}>
          {!name ? (
            <Text style={styles.greetingText}>Hey!</Text>
          ) : (
            <Text style={styles.greetingText}>{`Hey ${name}!`}</Text>
          )}
        </View>

        {/* Skip Button - only show on steps 2, 3, 4 */}
        {step >= 2 && step < 4 && (
          <TouchableOpacity style={styles.topSkipButton} onPress={skip}>
            <Text style={styles.topSkipText}>Skip for now</Text>
            <Ionicons name="arrow-forward" size={16} color="#A2BF71" />
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Container with Swipe Gesture */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[styles.bottomContainer, { transform: [{ translateX }] }]}
        >
          {/* Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            {Steps[step]()}
          </ScrollView>

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            {/* Progress and Next Button Container */}
            <View style={styles.progressAndNextContainer}>
              {/* Progress bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressDots}>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <View
                      key={index}
                      style={[
                        styles.progressDot,
                        index === step && styles.activeDot, // Only current step is active
                        index < step && styles.completedDot, // Completed steps have different style
                      ]}
                    />
                  ))}
                </View>
              </View>
              <TouchableOpacity style={styles.nextButton} onPress={next}>
                <Entypo name="chevron-right" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>

      {/* Modal */}
      <OtpModal
        visible={showEmailVerify}
        onClose={() => setEmailVerify(false)}
        email={email}
        type="email"
      />

      <OtpModal
        visible={showPhoneVerify}
        onClose={() => setPhoneVerify(false)}
        phone={phoneNumber}
        selectedFlag
        type="phone"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  headerContainer: {
    position: "absolute",
    top: 60,
    left: 24,
    right: 24,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  greetingContainer: {
    flex: 1,
  },

  greetingText: {
    fontSize: 32,
    fontFamily: "InterBold",
    color: "#BBCF8D",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  topSkipButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(162, 191, 113, 0.3)",
  },

  topSkipText: {
    color: "#A2BF71",
    fontFamily: "InterMedium",
    fontSize: 14,
    marginRight: 4,
  },

  bottomContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 50,
    backgroundColor: "#1E1E1E",
    borderRadius: 24,
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 20,
    maxHeight: screenHeight * 0.8,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  label: {
    fontSize: 16,
    fontFamily: "InterBold",
    marginBottom: 12,
    color: "#FFFFFF",
    lineHeight: 22,
  },

  miniLabel: {
    fontSize: 14,
    fontFamily: "InterBold",
    marginBottom: 10,
    color: "#FFFFFF",
  },

  subLabel: {
    fontSize: 14,
    fontFamily: "InterMedium",
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
  },

  required: {
    color: "#FF6B6B",
    fontSize: 20,
  },

  input: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    color: "#FFFFFF",
    fontFamily: "InterMedium",
    fontSize: 16,
  },

  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dateText: {
    color: "#FFFFFF",
    fontFamily: "InterMedium",
    fontSize: 16,
  },

  placeholderText: {
    color: "#666",
  },

  helperText: {
    fontSize: 12,
    fontFamily: "InterMedium",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 8,
    marginTop: -8,
  },

  genderContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  genderBtn: {
    flex: 1,
    margin: 5,
    backgroundColor: "#1E1E1E",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    verticalAlign: "middle",
    paddingVertical: 16,
    gap: 4,
  },

  selectedGender: {
    borderColor: "#BBCF8D",
  },

  genderText: {
    color: "#FFFFFF",
    fontFamily: "InterMedium",
    fontSize: 14,
    flex: 1,
  },

  selectedGenderText: {
    color: "#BBCF8D",
  },

  bioContainer: {
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingBottom: 12,
    minHeight: 120,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 20,
  },

  bioInput: {
    color: "#FFF",
    fontFamily: "InterMedium",
    fontSize: 14,
    flex: 1,
    textAlignVertical: "top",
  },

  enhanceBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  enhanceIcon: {
    marginRight: 6,
    tintColor: "#A2BF71",
    aspectRatio: 1,
    width: 14,
    height: 14,
  },

  enhanceText: {
    color: "#BBCF8D",
    fontSize: 12,
    fontFamily: "InterSemiBold",
  },

  inputWithButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A2BF71",
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  flexInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    fontFamily: "InterMedium",
    color: "#FFF",
  },

  verifyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  verifyText: {
    color: "#A2BF71",
    fontSize: 13,
    fontFamily: "InterBold",
  },

  iconGear: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#A2BF71",
    aspectRatio: 1,
    width: 14,
    height: 14,
  },

  otpText: {
    fontFamily: "InterBold",
    fontSize: 12,
    color: "#A2BF71",
    textAlign: "right",
    marginBottom: 20,
    marginTop: -8,
  },

  chipContainer: {
    marginBottom: 20,
  },

  imageBox: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressContainer: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 0,
  },

  progressDots: {
    flexDirection: "row",
  },

  progressAndNextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    // backgroundColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "#FFF",
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#A2BF71",
    width: 24,
    height: 8,
    borderRadius: 4,
  },

  completedDot: {
    backgroundColor: "rgba(162, 191, 113, 0.5)",
    width: 8,
    height: 8,
  },

  nextButton: {
    backgroundColor: "#A2BF71",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },

  finishButton: {
    backgroundColor: "#A2BF71",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    flex: 1,
    alignItems: "center",
    marginLeft: 16,
  },

  finishButtonText: {
    color: "#000",
    fontFamily: "InterBold",
    fontSize: 16,
  },

  subHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textBlock: {
    flex: 1,
    paddingRight: 12,
  },

  subLabelBold: {
    fontFamily: "InterBoldItalic",
    fontStyle: "italic",
    color: "rgba(255, 255, 255, 0.7)",
  },

  bottomDropdown: {
    marginTop: 12,
  },

  subLabelItalic: {
    fontSize: 14,
    fontFamily: FONT.ITALICMEDIUM,
    fontStyle: "italic",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 16,
  },

  uploadBox: {
    borderWidth: 2,
    borderColor: "#4B4B4B",
    backgroundColor: "#88888825",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
    flexDirection: "row",
  },

  uploadIconContainer: {
    backgroundColor: "#BBCF8D",
    borderRadius: 40,
    padding: 12,
    marginBottom: 8,
  },

  uploadText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "InterMedium",
  },

  vbcRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
