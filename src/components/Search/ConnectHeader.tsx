import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const MIN_WIDTH = 40;

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Header = ({ logoSource, onSearch }) => {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();

  const onBagPress = () => {
    router.push("notification");
  };

  const handleSearchToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!searchActive) {
      setSearchActive(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    } else {
      setSearchActive(false);
      setSearchText("");
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.header}>
        {!searchActive && (
          <View style={styles.logoWrapper}>
            <Image
              source={logoSource}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={handleSearchToggle}
            activeOpacity={0.9}
            style={[
              styles.searchContainer,
              searchActive ? styles.searchExpanded : styles.searchIconOnly,
              {
                borderColor: searchActive ? "#BBCF8D" : "#ccc",
                shadowColor: searchActive ? "#BBCF8D" : "transparent",
                shadowOpacity: searchActive ? 0.8 : 0,
                shadowRadius: searchActive ? 6 : 0,
                elevation: searchActive ? 8 : 0,
              },
            ]}
          >
            {searchActive && (
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search..."
                placeholderTextColor="#888"
                editable={true}
                // onSubmitEditing={() => onSearch && onSearch(searchText)}
                onSubmitEditing={() => {
                  if (searchText.trim()) {
                    router.push({
                      pathname: "/connectStack/searchPage",
                      params: { query: searchText.trim() },
                    });
                    setSearchActive(false);
                    setSearchText("");
                    Keyboard.dismiss();
                  }
                }}
              />
            )}
            <Feather
              name={searchActive ? "x" : "search"}
              size={20}
              color="#BBCF8D"
              style={searchActive ? styles.iconExpanded : styles.iconCentered}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onBagPress} style={styles.bagBtn}>
            <Image
              style={{ height: 25, width: 25 }}
              source={require("../../../assets/bag.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#121212",
    position: "relative",
  },
  logoWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "flex-start",
    justifyContent: "center",
    zIndex: 1,
    marginLeft: 22
  },
  logo: {
    height: 24,
    width: 148,

  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    zIndex: 5,
  },
  searchExpanded: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
  },
  searchIconOnly: {
    width: MIN_WIDTH,
    height: MIN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    color: "#0f172a",
    paddingRight: 6, // So the icon doesn't overlap text
  },
  iconCentered: {
    alignSelf: "center",
  },
  iconExpanded: {
    marginLeft: 6,
  },
  bagBtn: {
    padding: 6,
    zIndex: 10,

  },
});
