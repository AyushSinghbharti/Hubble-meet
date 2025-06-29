import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import VbcCard from "../../../components/VbcCard";
import { useRouter } from "expo-router";
import { Pressable, TextInput } from "react-native-gesture-handler";

export default function Connections() {
  const [viewSeach, setViewSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [viewPopUp, setPopUp] = useState(false);

  //Renders
  const PopUpMenu = () => {
    return (
      <Pressable
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          flex: 1,
          width: "100%",
          height: "100%",
        }}
        onPress={() => setPopUp(!viewPopUp)}
      >
        <View style={styles.popupContainer}>
          <TouchableOpacity>
            <Text style={styles.popupText}>Invite a Friend</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.popupText}>Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.popupText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        {viewSeach ? (
          <View style={styles.searchContainer}>
            <TouchableOpacity
              onPress={() => setViewSearch(!viewSeach)}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <TextInput
              value={searchText}
              onChangeText={(t) => setSearchText(t)}
              placeholder="Seach"
              placeholderTextColor={"#aaa"}
              style={styles.searchText}
            />
            {searchText && (
              <Entypo
                name="cross"
                size={24}
                color="black"
                onPress={() => setSearchText("")}
              />
            )}
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>Connections</Text>
          </>
        )}

        <View style={styles.headerIcons}>
          {!viewSeach && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setViewSearch(!viewSeach)}
            >
              <Ionicons name="search" size={22} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setPopUp(!viewPopUp)}
          >
            <MaterialIcons name="more-vert" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <View style={styles.scrollArea}>
        <VbcCard spacing={20} />
      </View>

      {/* PopupMenu */}
      {viewPopUp && <PopUpMenu />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 50,
    backgroundColor: "#F7F7F7",
    elevation: 5,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
  },
  searchText: { fontSize: 14, fontFamily: "InterSemiBold", flex: 1 },
  title: {
    fontSize: 18,
    fontFamily: "InterSemiBold",
    color: "#000",
    flex: 1,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    marginLeft: 8,
  },
  scrollArea: {
    paddingHorizontal: 12,
  },

  //Pop Up style
  popupContainer: {
    position: "absolute",
    top: 85,
    right: 24,
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    borderRadius: 10,
    minHeight: 175,
    minWidth: 275,
    gap: 18,
    padding: 26,
    elevation: 5,
  },
  popupText: {
    fontSize: 16,
    fontFamily: "InterMedium",
  },
});
