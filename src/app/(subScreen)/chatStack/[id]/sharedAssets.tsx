import React, { useEffect, useState } from "react";
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
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { UserProfile } from "@/src/interfaces/profileInterface";
import { useChatStore } from "@/src/store/chatStore";
import { useMemo } from "react";
import moment from "moment";

const { width } = Dimensions.get("window");
const GRID_GAP = 8;
const THUMB_SIZE = (width - 32 - GRID_GAP * 2) / 3;

interface SharedAssetsProps {}

export default function SharedAssets() {
  const params = useLocalSearchParams();
  const item: UserProfile = JSON.parse(params.item as string);
  const id = params.id;
  const router = useRouter();
  const messages = useChatStore((s) => s.messages);

  //Local file size calculator
  const getRemoteFileSize = async (url: string): Promise<number | null> => {
    try {
      const res = await fetch(url, { method: "HEAD" });
      const size = res.headers.get("content-length");
      return size ? parseInt(size, 10) : null;
    } catch (err) {
      console.warn("Error fetching file size:", err);
      return null;
    }
  };

  // Link start

  const mediaSections = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    messages.forEach((msg) => {
      if (msg.messageType === "IMAGE" && Array.isArray(msg.media)) {
        const groupTitle = moment(msg.createdAt).format("MMMM YYYY");

        msg.media.forEach((mediaItem: any, index: number) => {
          const uri = mediaItem?.uri ?? mediaItem?.url ?? null;
          if (!uri) return;

          if (!grouped[groupTitle]) grouped[groupTitle] = [];
          grouped[groupTitle].push({
            id: `${msg.id}-${index}`,
            uri,
          });
        });
      }
    });

    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [messages]);

  const docSections = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    messages.forEach((msg) => {
      if (msg.messageType === "DOCUMENT" && Array.isArray(msg.media)) {
        const groupTitle = moment(msg.createdAt).format("MMMM YYYY");

        msg.media.forEach((doc: any, index: number) => {
          const size = getRemoteFileSize(doc.url);
          const fileName = doc?.fileName ?? "Unnamed";
          const fileSize = doc?.size
            ? `${(doc.size / 1024 / 1024).toFixed(1)} MB`
            : "Unknown Size";
          const ext = fileName.includes(".")
            ? fileName.split(".").pop()?.toUpperCase()
            : "FILE";

          if (!grouped[groupTitle]) grouped[groupTitle] = [];
          grouped[groupTitle].push({
            id: `${msg.id}-${index}`,
            name: fileName,
            size: `${fileSize} · ${ext}`,
            date: moment(msg.createdAt).format("D/M/YY"),
            uri: doc.url,
          });
        });
      }
    });

    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [messages]);

  const linkSections = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    messages.forEach((msg) => {
      if (msg.messageType === "LINK" && msg.content) {
        const groupTitle = moment(msg.createdAt).format("MMMM YYYY");

        if (!grouped[groupTitle]) grouped[groupTitle] = [];
        grouped[groupTitle].push({
          id: msg.id,
          uri:
            typeof msg.media === "string"
              ? msg.media
              : "https://via.placeholder.com/150",
          link: msg.content,
        });
      }
    });

    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [messages]);

  useEffect(() => {
    console.log(
      "Processed media sections: ",
      JSON.stringify(mediaSections, null, 2)
    );
    console.log(
      "Processed doc sections: ",
      JSON.stringify(docSections, null, 2)
    );
  }, [mediaSections, docSections]);

  //Link end

  const [activeTab, setActiveTab] = useState<"media" | "docs" | "links">(
    "media"
  );

  const renderMediaSection = ({ section }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <FlatList
        data={section.data}
        maxToRenderPerBatch={5}
        initialNumToRender={10}
        windowSize={1}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={async () => {
              const supported = await Linking.canOpenURL(item.uri);
              if (supported) {
                Linking.openURL(item.uri);
              } else {
                Alert.alert("Can't open this file.");
              }
            }}
          >
            <Image
              source={{ uri: item.uri }}
              style={styles.mediaThumb}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        columnWrapperStyle={{ gap: GRID_GAP }}
        ItemSeparatorComponent={() => <View style={{ height: GRID_GAP }} />}
        scrollEnabled={false}
      />
    </View>
  );

  const renderDocItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={async () => {
        if (!item.uri || typeof item.uri !== "string") {
          Alert.alert("Invalid file URL");
          return;
        }

        const supported = await Linking.canOpenURL(item.uri);
        if (supported) {
          Linking.openURL(item.uri);
        } else {
          Alert.alert("Can't open this file.");
        }
      }}
    >
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
    </TouchableOpacity>
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
        <Text
          style={[
            styles.sectionTitle,
            { paddingHorizontal: 16, paddingTop: 16 },
          ]}
        >
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
        <Text
          style={[
            styles.sectionTitle,
            { paddingHorizontal: 16, paddingTop: 16 },
          ]}
        >
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
