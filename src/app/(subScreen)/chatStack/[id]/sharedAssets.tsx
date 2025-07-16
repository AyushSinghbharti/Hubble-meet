import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  SectionList,
  FlatList,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { UserProfile } from "@/src/interfaces/profileInterface";

const { width } = Dimensions.get("window");
const GRID_GAP = 8;
const THUMB_SIZE = (width - 32 - GRID_GAP * 2) / 3;

// DUMMY DATA
const mediaSections = [
  {
    title: "Recent",
    data: [
      {
        id: "m1",
        uri: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
      },
      {
        id: "m2",
        uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      },
      {
        id: "m3",
        uri: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      },
      {
        id: "m4",
        uri: "https://images.unsplash.com/photo-1551836022-9bf3b7ba2ace",
      },
    ],
  },
  {
    title: "January",
    data: [
      {
        id: "m5",
        uri: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85",
      },
      {
        id: "m6",
        uri: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      },
      {
        id: "m7",
        uri: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
      },
      {
        id: "m8",
        uri: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92",
      },
      {
        id: "m9",
        uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      },
      {
        id: "m10",
        uri: "https://images.unsplash.com/photo-1551292830-8c1cf23cf63b",
      },
    ],
  },
  {
    title: "2024",
    data: [
      {
        id: "m11",
        uri: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      },
    ],
  },
  {
    title: "2022",
    data: [
      {
        id: "m12",
        uri: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      },
      {
        id: "m13",
        uri: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
      },
    ],
  },
];

const docSections = [
  {
    title: "December",
    data: [
      { id: "d1", name: "Frame.jpg", size: "6.8 MB · JPG", date: "9/2/24" },
      { id: "d2", name: "Frame.jpg", size: "6.8 MB · JPG", date: "9/2/24" },
      { id: "d3", name: "Frame.jpg", size: "6.8 MB · JPG", date: "9/2/24" },
      { id: "d4", name: "Frame.jpg", size: "6.8 MB · JPG", date: "9/2/24" },
    ],
  },
];

const linkSections = [
  {
    title: "December",
    data: [
      {
        id: "l1",
        uri: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        link: "http://example.com/this/is/a/very/long/dummy/link/for/testing/purposes/with/multi",
      },
      {
        id: "l2",
        uri: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92",
        link: "http://example.com/this/is/a/very/long/dummy/link/for/testing/purposes/with/multi",
      },
      {
        id: "l3",
        uri: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
        link: "http://example.com/this/is/a/very/long/dummy/link/for/testing/purposes/with/multi",
      },
    ],
  },
];

interface SharedAssetsProps {}

export default function SharedAssets() {
  const params = useLocalSearchParams();
  const item: UserProfile = JSON.parse(params.item as string);
  const id = params.id;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"media" | "docs" | "links">(
    "media"
  );

  const renderMediaSection = ({ section }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <FlatList
        data={section.data}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.uri }}
            style={styles.mediaThumb}
            resizeMode="cover"
          />
        )}
        columnWrapperStyle={{ gap: GRID_GAP }}
        ItemSeparatorComponent={() => <View style={{ height: GRID_GAP }} />}
        scrollEnabled={false}
      />
    </View>
  );

  const renderDocItem = ({ item }: any) => (
    <View style={styles.docRow}>
      <Image
        style={{ height: 32, width: 32, tintColor: "#868686" }}
        source={require("../../../../../assets/icons/document.png")}
      />
      <View style={styles.docTextWrap}>
        <Text style={styles.docName}>{item.name}</Text>
        <Text style={styles.docMeta}>{item.size}</Text>
      </View>
      <Text style={styles.docDate}>{item.date}</Text>
    </View>
  );

  const renderLinkItem = ({ item }: any) => (
    <View style={styles.linkRow}>
      <Image source={{ uri: item.uri }} style={styles.linkThumb} />
      <Text style={styles.linkText} numberOfLines={2} ellipsizeMode="tail">
        {item.link}
      </Text>
    </View>
  );

  const MediaBody = () => (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      {mediaSections.map((section) => (
        <React.Fragment key={section.title}>
          {renderMediaSection({ section })}
        </React.Fragment>
      ))}
    </ScrollView>
  );

  const DocsBody = () => (
    <SectionList
      sections={docSections}
      keyExtractor={(item) => item.id}
      renderItem={renderDocItem}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={[styles.sectionTitle, { paddingHorizontal: 16, paddingTop: 16 }]}>
          {title}
        </Text>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={{ paddingBottom: 32 }}
    />
  );

  const TabButton = ({
    label,
    value,
  }: {
    label: string;
    value: "media" | "docs" | "links";
  }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(value)}
      style={styles.tabBtn}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.tabText, activeTab === value && styles.tabTextActive]}
      >
        {label}
      </Text>
      {activeTab === value && <View style={styles.tabUnderline} />}
    </TouchableOpacity>
  );

  const LinksBody = () => (
    <SectionList
      sections={linkSections}
      keyExtractor={(item) => item.id}
      renderItem={renderLinkItem}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={[styles.sectionTitle, { paddingHorizontal: 16, paddingTop: 16 }]}>
          {title}
        </Text>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={{ paddingBottom: 32 }}
    />
  );

  return (
    <Modal
      style={styles.container}
      animationType="slide"
      onRequestClose={() => router.back()}
    >
      {/* <View style={styles.container}> */}
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity hitSlop={500} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{item.full_name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabBar}>
        <TabButton label="Media" value="media" />
        <TabButton label="Docs" value="docs" />
        <TabButton label="Links" value="links" />
      </View>

      <View style={styles.content}>
        {activeTab === "media" && <MediaBody />}
        {activeTab === "docs" && <DocsBody />}
        {activeTab === "links" && <LinksBody />}
      </View>
      {/* </View> */}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 12,
    backgroundColor: "#F7F7F7",
    // backgroundColor: "white",
  },
  headerTitle: {
    paddingHorizontal: 16,
    fontFamily: "InterBold",
    textAlign: "center",
    fontSize: 16,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F7F7F7",
  },
  tabBtn: { flex: 1, alignItems: "center", paddingBottom: 12 },
  tabText: { fontSize: 14, color: "#6f6f6f", fontFamily: "Inter" },
  tabTextActive: { color: "black", fontFamily: "Inter" },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 4,
    backgroundColor: "#BBCF8D",
    borderRadius: 2,
  },
  content: { flex: 1 },

  /* Sections */
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter",
    marginBottom: 8,
    color: "#000",
  },

  /* Media */
  mediaThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: "#ccc",
  },

  /* Docs */
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  docTextWrap: { flex: 1, marginLeft: 12 },
  docName: { fontSize: 14, fontFamily: "Inter", color: "#222" },
  docMeta: {
    fontSize: 12,
    color: "#7B7B7B",
    marginTop: 2,
    fontFamily: "Inter",
  },
  docDate: {
    fontSize: 12,
    color: "#7B7B7B",
    fontFamily: "Inter",
    alignSelf: "flex-end",
  },

  /* Links */
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  linkThumb: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginRight: 12,
  },
  linkText: { flex: 1, fontSize: 12, color: "#000", fontFamily: "Inter" },

  /* Separators */
  separator: {
    marginLeft: 56, // indent to align with text, leaving icon/thumbnail space
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e4e4e4",
  },
});
