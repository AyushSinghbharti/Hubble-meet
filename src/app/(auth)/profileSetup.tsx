import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Switch,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ProfileCard from "../../components/profileSetupComps/profileCard";
import InitialScreen from "../../components/profileSetupComps/initialScreen";
import FinalSetupPage from "../../components/profileSetupComps/finalScreen";
import TagDropdown from "../../components/TagDropdown";
import colourPalette from "../../theme/darkPaletter";
import RandomBackgroundImages, {
  RandomBGImagesRef,
} from "../../components/RandomBGImage";
import ManualBlur from "../../components/BlurComp";

const ChipInput = ({
  label,
  placeholder,
  items,
  setItems,
  subtitle = "",
  options = [""],
}) => {
  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.chipContainer}
    >
      <Text style={styles.label}>
        {label}
        {subtitle && <Text style={styles.subLabel}>{subtitle}</Text>}
      </Text>
      <TagDropdown
        options={options}
        selected={items}
        onChange={setItems}
        placeholder={placeholder}
        mode={"Transparent"}
      />
    </KeyboardAvoidingView>
  );
};

export default function ProfileSetup() {
  const router = useRouter();

  const [initScreen, setInitScreen] = useState(true);
  const [finalScreen, setFinalScreen] = useState(false);
  const [step, setStep] = useState(0);
  const [image, setImage] = useState(null);

  const [name, setName] = useState("");
  const [dob, setDOB] = useState();
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [address, setAddress] = useState("");
  const [shareVBC, setShareVBC] = useState(false);
  const [worklist, setWorklist] = useState([]); // companies / workplaces
  const [spaces, setSpaces] = useState(["Fintech", "Fashion", "AI"]);
  const [connectPeople, setConnectPeople] = useState(["fintech", "fashion"]); // kind of people
  const [radarCities, setRadarCities] = useState(["Banglore", "Pune"]); // interested cities
  const [rolesLookingFor, setRolesLookingFor] = useState([
    "Marketing",
    "Mentor",
  ]); //Roles
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const backgroundRef = useRef<RandomBGImagesRef>(null);

  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: any) => {
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    setDOB(formattedDate);
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

  const progressWidth = progress.interpolate({
    inputRange: [0, 4],
    outputRange: ["0%", "100%"],
  });

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const next = () => setStep((s) => Math.min(4, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const skip = () => {
    setStep(4);
    setFinalScreen(!finalScreen);
  };
  const submit = () => router.push("/connect");

  const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];

  const Steps = [
    // ------------------------------------------------------------------------
    // 0 — name, dob, gender
    // ------------------------------------------------------------------------
    () => (
      <>
        <Text style={styles.label}>Hey there! What's your full name?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>When were you born?</Text>
        <View style={[styles.input, centerRow]}>
          <TextInput
            style={{
              flex: 1,
              color: colourPalette.textPrimary,
              fontFamily: "InterSemiBold",
            }}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#aaa"
            value={dob}
            onChangeText={setDOB}
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={new Date(1990, 0, 1)}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <FontAwesome5
            name="calendar-alt"
            size={24}
            color="#BDBDBD"
            onPress={() => setDatePickerVisibility(!isDatePickerVisible)}
          />
        </View>

        <Text style={styles.label}>How do you identify?</Text>
        <View style={styles.rowWrap}>
          {genderOptions.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genderBtn, gender === g && selectedGenderStyle]}
              onPress={() => setGender(g)}
            >
              <Text
                style={{
                  fontFamily: "InterMedium",
                  color: colourPalette.textPrimary,
                }}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    ),

    // ------------------------------------------------------------------------
    // 1 — bio + contact
    // ------------------------------------------------------------------------
    () => (
      <>
        <Text style={styles.label}>
          Write a quick bio {"\n"}
          <Text style={styles.subLabel}>(who are you, what drives you)?</Text>
        </Text>
        <View style={[styles.input, bioBox]}>
          <TextInput
            style={{
              flex: 1,
              color: colourPalette.textPrimary,
              fontFamily: "InterMedium",
            }}
            placeholder="A Short Bio..."
            multiline
            placeholderTextColor="#aaa"
            maxLength={160}
            value={bio}
            onChangeText={setBio}
          />
          <Text
            style={{ alignSelf: "flex-end", marginBottom: 8, color: "#aaa" }}
          >
            {bio.length}/160
          </Text>
        </View>

        <Text style={styles.label}>
          Where can people reach you professionally?
        </Text>
        <TextInput
          style={[styles.input, noMargin]}
          placeholder="Enter email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.otpText}>Verify with OTP</Text>

        <Text style={styles.label}>Your mobile number?</Text>
        <TextInput
          style={[styles.input, noMargin]}
          placeholder="Enter mobile number"
          placeholderTextColor="#aaa"
          value={phoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
          onChangeText={setPhoneNumber}
        />
        <Text style={styles.otpText}>Verify with OTP</Text>
      </>
    ),

    // ------------------------------------------------------------------------
    // 2 — work / space
    // ------------------------------------------------------------------------
    () => (
      <>
        <ChipInput
          options={["Google", "Amazon", "Apple", "Microsoft", "Netflix"]}
          label="Where are you working these days?"
          subtitle={"Startup? MNC? Freelancing? We’re cool with all "}
          placeholder="e.g., Google, Amazon"
          items={worklist}
          setItems={setWorklist}
        />

        <Text style={styles.label}>
          What’s your role?{"\n"}
          <Text style={styles.subLabel}>
            Founder, Product Designer, Sales Ninja... you name it.
          </Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Job Title"
          placeholderTextColor="#aaa"
          value={jobTitle}
          onChangeText={setJobTitle}
        />

        <ChipInput
          options={["Finance", "AI", "Retail", "Hospitality", "Engineers"]}
          label={"What industry/sector are you in?\n"}
          subtitle={
            "Finance, AI, Retail, Hospitality... No limits. Add what vibes with you."
          }
          placeholder="Add Space"
          items={spaces}
          setItems={setSpaces}
        />
      </>
    ),

    // ------------------------------------------------------------------------
    // 3 — location + connection preferences
    // ------------------------------------------------------------------------
    () => (
      <>
        <Text style={styles.label}>Where in the world are you?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter City"
          value={address}
          placeholderTextColor="#aaa"
          onChangeText={setAddress}
        />

        <ChipInput
          options={[
            "fintech",
            "fashion",
            "healthcare",
            "education",
            "art & design",
            "gaming",
            "sustainability",
            "travel & hospitality",
          ]}
          label="What kind of people are you looking to connect with?"
          placeholder="Add type"
          items={connectPeople}
          setItems={setConnectPeople}
        />

        <ChipInput
          options={[
            "New York",
            "London",
            "San Francisco",
            "Berlin",
            "Tokyo",
            "Paris",
            "Dubai",
            "Singapore",
          ]}
          label="Any cities on your radar?"
          placeholder="Add City"
          items={radarCities}
          setItems={setRadarCities}
        />

        <ChipInput
          options={[
            "Founders",
            "Designers",
            "Product Managers",
            "Developers",
            "Marketers",
            "Investors",
            "Growth Hackers",
            "Content Creators",
          ]}
          label="Looking for founders? Designers? Product?"
          placeholder="Add Role"
          items={rolesLookingFor}
          setItems={setRolesLookingFor}
        />
      </>
    ),

    // ------------------------------------------------------------------------
    // 4 — profile pic + summary
    // ------------------------------------------------------------------------
    () => (
      <>
        <Text style={styles.label}>
          Upload a professional profile picture{"\n"}
          <Text style={styles.subLabel}>No selfies, Keep it classy</Text>{" "}
        </Text>
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Ionicons name="add" size={40} color="#A2BF71" />
          )}
        </TouchableOpacity>

        <View>
          <Text style={[styles.label, { marginBottom: 0 }]}>Your VBC</Text>
          <View style={[styles.switchRow, { width: "100%" }]}>
            <Text style={[styles.subLabel, { width: "80%" }]}>
              Allow Matched Users to Share Your VBCs to their Connections in the
              App
            </Text>
            <Switch
              trackColor={{ false: "#3F3F46", true: "#6366F1" }} // muted gray → indigo
              thumbColor={shareVBC ? "#E5E7EB" : "#9CA3AF"} // light thumb when on, soft gray when off
              ios_backgroundColor="#3F3F46" // for iOS fallback
              onValueChange={setShareVBC}
              value={shareVBC}
            />
          </View>
        </View>

        {/* simple card preview */}
        <ProfileCard
          avatar={image}
          name={name}
          title={jobTitle}
          location={address}
        />
      </>
    ),
  ];

  // ----------------------------------------------------------------------------
  // splash first‑time screen ---------------------------------------------------
  // ----------------------------------------------------------------------------
  if (step === 0 && initScreen) {
    return <InitialScreen onPress={() => setInitScreen(false)} />;
  }
  if (step === 4 && finalScreen) {
    setTimeout(() => {
      router.replace("/connect");
      setFinalScreen(!finalScreen);
    }, 3000);

    return <FinalSetupPage />;
  }

  // ----------------------------------------------------------------------------
  // main render ----------------------------------------------------------------
  // ----------------------------------------------------------------------------
  return (
    <RandomBackgroundImages
      style={styles.container}
      blur={5}
      ref={backgroundRef}
    >
      {/* header */}
      <View style={styles.header}>
        {step !== 0 ? (
          <TouchableOpacity onPress={prev} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={22} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 22 }} />
        )}
        <Text style={styles.headerText}>{headerTitles[step]}</Text>
        <Text style={styles.headerCount}>{step + 1}/5</Text>
      </View>

      {/* progress bar */}
      <View style={styles.progressBg}>
        <Animated.View
          style={[styles.progressFill, { width: progressWidth }]}
        />
      </View>

      {/* body */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {Steps[step]()}
      </ScrollView>

      {/* fab */}
      {step !== 4 ? (
        <TouchableOpacity
          style={styles.fab}
          onPress={step === 4 ? submit : next}
        >
          <Entypo name="chevron-right" size={28} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={splashButton}
          onPress={() => setFinalScreen(!finalScreen)}
        >
          <Text style={splashButtonText}>You are all set</Text>
        </TouchableOpacity>
      )}

      {step >= 2 && step < 4 && (
        <TouchableOpacity
          style={styles.skip}
          onPress={skip}
          // onPress={() => setFinalScreen(!finalScreen)}
        >
          {/* <Entypo name="chevron-left" size={28} color="#fff" /> */}
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      )}
    </RandomBackgroundImages>
  );
}

const headerTitles = [
  "Let's Start With You",
  "Tell us who you are",
  "Your work life, your vibe",
  "Where do you belong?",
  "Let's make you shine",
];

const centerRow = {
  justifyContent: "center",
  alignItems: "center",
};

const bioBox = {
  minHeight: 100,
  justifyContent: "flex-start" as const,
  alignItems: "flex-start" as const,
  paddingTop: 4,
};

const noMargin = { marginBottom: 0 };

const chipInputPadding = { paddingTop: 5, paddingBottom: 5 };

const selectedGenderStyle = {
  borderColor: "#BBCF8D",
  borderWidth: 2,
  backgroundColor: "#BBCF8D",
};

const splashButton = {
  position: "absolute",
  bottom: 50,
  backgroundColor: colourPalette.buttonPrimary,
  alignSelf: "center",
  width: "90%",
  height: 50,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
};

const splashButtonText = {
  // color: "#fff",
  color: "#000",
  fontFamily: "InterSemiBold",
  fontSize: 16,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 14,
    fontFamily: "InterItalicBold",
    color: colourPalette.textPrimary,
  },
  headerCount: {
    fontSize: 14,
    fontFamily: "InterBold",
    color: colourPalette.textPrimary,
  },
  iconBtn: { padding: 4 },

  /* progress */
  progressBg: {
    height: 8,
    backgroundColor: colourPalette.progressBackground,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  progressFill: {
    height: 8,
    borderRadius: 8,
    backgroundColor: colourPalette.progressActive,
  },

  /* form generic */
  scroll: { padding: 20 },
  label: {
    fontSize: 18,
    fontFamily: "InterBold",
    marginBottom: 10,
    color: colourPalette.textPrimary,
  },
  subLabel: {
    fontSize: 15,
    fontFamily: "InterMediumItalic",
    // color: "#606060",
    color: colourPalette.textSecondary,
  },
  input: {
    minHeight: 55,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderColor: colourPalette.inputBorder,
    color: colourPalette.textPrimary,
    fontFamily: "InterSemiBold",
    fontSize: 14,
    borderWidth: 2,
    flexDirection: "row",
    minWidth: 100,
  },
  otpText: {
    fontFamily: "InterBold",
    fontSize: 12,
    color: "#fff",
    textAlign: "right",
    marginBottom: 20,
    marginTop: 5,
  },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  genderBtn: {
    borderColor: colourPalette.inputBorder,
    borderWidth: 2,
    width: "45%",
    minHeight: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },

  /* chip */
  chipContainer: { marginBottom: 20 },
  chip: {
    flexDirection: "row",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    marginBottom: 8,
  },
  chipText: {
    marginRight: 6,
    fontWeight: "500",
  },
  removeText: {
    fontWeight: "bold",
    color: "#555",
  },

  /* image + summary */
  imageBox: {
    width: 140,
    height: 140,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    backgroundColor: "#FFFFFF44",
    borderColor: colourPalette.inputBorder,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: colourPalette.inputBackground,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  /* fab */
  fab: {
    position: "absolute",
    bottom: 50,
    right: 30,
    backgroundColor: "#A2BF71",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  skip: {
    position: "absolute",
    bottom: 50,
    left: 30,
    height: 56,
    justifyContent: "flex-end",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  skipText: {
    color: colourPalette.textThird,
    fontFamily: "InterSemiBold",
    fontSize: 14,
  },
});
