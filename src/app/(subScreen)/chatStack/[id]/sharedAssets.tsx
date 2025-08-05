import React, { useEffect, useMemo, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { UserProfile } from "@/src/interfaces/profileInterface";
import { useChatStore } from "@/src/store/chatStore";
import moment from "moment";
import MediaViewer from "@/src/components/chatScreenComps/mediaViewer";
import colourPalette from "@/src/theme/darkPaletter";

const { width } = Dimensions.get("window");
const GRID_GAP = 8;
const THUMB_SIZE = (width - 32 - GRID_GAP * 2) / 3;

type MediaItem = {
  id: string;
  url: string;
  fileName?: string;
  type?: string;
  size?: number;
};

export default function SharedAssets() {
  const params = useLocalSearchParams();
  const item: UserProfile = JSON.parse(params.item as string);
  const router = useRouter();
  const messages = useChatStore((s) => s.messages);

  const [activeTab, setActiveTab] = useState<"media" | "docs" | "links">(
    "media"
  );

  // ---- MediaViewer state ----
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerItems, setViewerItems] = useState<MediaItem[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  // ----------------- Flattened global arrays (what MediaViewer will consume) -----------------

  // All image/video items across the chat
  const allMediaItems = useMemo<MediaItem[]>(() => {
    const list: MediaItem[] = [];
    messages.forEach((msg) => {
      if (msg.messageType === "IMAGE" && Array.isArray(msg.media)) {
        msg.media.forEach((m) => {
          list.push({
            id: `${msg.id}-${m.id}`,
            url: m.url ?? m.uri,
            fileName: m.fileName,
            type: m.type, // might be undefined, MediaViewer falls back to url
            size: m.size,
          });
        });
      }
    });
    return list;
  }, [messages]);

  // All document items across the chat
  const allDocItems = useMemo<MediaItem[]>(() => {
    const list: MediaItem[] = [];
    messages.forEach((msg) => {
      if (msg.messageType === "DOCUMENT" && Array.isArray(msg.media)) {
        msg.media.forEach((m) => {
          list.push({
            id: `${msg.id}-${m.id}`,
            url: m.url ?? m.uri,
            fileName: m.fileName,
            type: m.type, // likely application/pdf, docx, etc.
            size: m.size,
          });
        });
      }
    });
    return list;
  }, [messages]);

  // ----------------- Sectioned data for UI (but each item also knows its globalIndex) -----------------

  const mediaSections = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    let counter = 0;

    messages.forEach((msg) => {
      if (msg.messageType === "IMAGE" && Array.isArray(msg.media)) {
        const groupTitle = moment(msg.createdAt).format("MMMM YYYY");

        msg.media.forEach((mediaItem: any) => {
          const uri = mediaItem?.uri ?? mediaItem?.url ?? null;
          if (!uri) return;

          // find the global index for this media in allMediaItems (we can use counter)
          const globalIndex = counter++;

          if (!grouped[groupTitle]) grouped[groupTitle] = [];
          grouped[groupTitle].push({
            id: `${msg.id}-${mediaItem.id}`,
            uri,
            globalIndex,
          });
        });
      }
    });

    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [messages, allMediaItems.length]);

  const docSections = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    let docCounter = 0;

    messages.forEach((msg) => {
      if (msg.messageType === "DOCUMENT" && Array.isArray(msg.media)) {
        const groupTitle = moment(msg.createdAt).format("MMMM YYYY");

        msg.media.forEach((doc: any) => {
          const fileName = doc?.fileName ?? "Unnamed";
          const fileSize = doc?.size
            ? `${(doc.size / 1024 / 1024).toFixed(1)} MB`
            : "Unknown Size";
          const ext = fileName.includes(".")
            ? fileName.split(".").pop()?.toUpperCase()
            : "FILE";

          // global index inside allDocItems
          const globalIndex = docCounter++;

          if (!grouped[groupTitle]) grouped[groupTitle] = [];
          grouped[groupTitle].push({
            id: `${msg.id}-${doc.id}`,
            name: fileName,
            size: `${fileSize} · ${ext}`,
            date: moment(msg.createdAt).format("D/M/YY"),
            uri: doc.url ?? doc.uri,
            globalIndex,
          });
        });
      }
    });

    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [messages, allDocItems.length]);

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

  // ----------------- Handlers to open MediaViewer -----------------
  const openMediaViewerAt = (index: number) => {
    setViewerItems(allMediaItems);
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const openDocViewerAt = (index: number) => {
    setViewerItems(allDocItems);
    setViewerIndex(index);
    setViewerVisible(true);
  };

  // ----------------- Renders -----------------

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
          <TouchableOpacity onPress={() => openMediaViewerAt(item.globalIndex)}>
            {/* No more Linking.openURL here */}
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
    <TouchableOpacity onPress={() => openDocViewerAt(item.globalIndex)}>
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
    <TouchableOpacity
      onPress={async () => {
        const supported = await Linking.canOpenURL(item.link);
        if (supported) {
          Linking.openURL(item.link);
        } else {
          Alert.alert("Can't open this link.");
        }
      }}
    >
      <View style={styles.linkRow}>
        <Image source={{ uri: item.uri }} style={styles.linkThumb} />
        <Text style={styles.linkText} numberOfLines={2} ellipsizeMode="tail">
          {item.link}
        </Text>
      </View>
    </TouchableOpacity>
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
      contentContainerStyle={{ paddingBottom: 32 }}
    />
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

  return (
    <Modal
      backdropColor={colourPalette.backgroundPrimary}
      animationType="slide"
      onRequestClose={() => router.back()}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity hitSlop={500} onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={colourPalette.textPrimary}
          />
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

      {/* MediaViewer Modal */}
      <MediaViewer
        visible={viewerVisible}
        mediaItems={viewerItems}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 12,
    backgroundColor: colourPalette.backgroundSecondary,
  },
  headerTitle: {
    paddingHorizontal: 16,
    fontFamily: "InterBold",
    textAlign: "center",
    fontSize: 16,
    color: colourPalette.textPrimary,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colourPalette.backgroundSecondary,
  },
  tabBtn: { flex: 1, alignItems: "center", paddingBottom: 12 },
  tabText: {
    fontSize: 14,
    color: colourPalette.textSecondary,
    fontFamily: "Inter",
  },
  tabTextActive: {
    color: colourPalette.textPrimary,
    fontFamily: "Inter",
  },
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
    color: colourPalette.textPrimary,
  },

  /* Media */
  mediaThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },

  /* Docs */
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginTop: 3,
    borderColor: colourPalette.borderColor,
  },
  docTextWrap: { flex: 1, marginLeft: 12 },
  docName: {
    fontSize: 14,
    fontFamily: "Inter",
    color: colourPalette.textPrimary,
  },
  docMeta: {
    fontSize: 12,
    color: colourPalette.textSecondary,
    marginTop: 2,
    fontFamily: "Inter",
  },
  docDate: {
    fontSize: 12,
    color: colourPalette.textSecondary,
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
  linkText: { flex: 1, fontSize: 12, color: colourPalette.textPrimary, fontFamily: "Inter" },

  /* Separators */
  separator: {
    height: 1,
    marginTop: 3,
    backgroundColor: colourPalette.borderColor,
  },
});
