import { Dimensions, StyleSheet } from "react-native";
import { FONT } from "../../../../../assets/constants/fonts";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    backgroundColor: "#f7f7f7",
  },
  flatListContent: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingBottom: 20,
    alignItems: "center",
  },
  card: {
    width: width * 0.9,
    height: CARD_HEIGHT * 1.9,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    marginVertical: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  expandThumb: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 10,
    overflow: "hidden",
    width: 80,
    height: 120,
    backgroundColor: "#00000020",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  expandIcon: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    alignItems: "flex-start",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  title: {
    fontSize: 16,
    color: "#f0f0f0",
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: "#e0e0e0",
    marginTop: 2,
  },
  backCardScroll: {
    flex: 1,
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.5,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
  bottomActions: {
    position: "absolute",
    bottom: 20,
    right: 16,
    flexDirection: "column",
    gap: 12,
    zIndex: 10,
  },
  actionButton: {
    backgroundColor: "#BBCF8D",
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    width: 48,
    height: 48,
    justifyContent: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tagBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tagText: {
    fontSize: 14,
    color: "#333",
    fontFamily: FONT.MEDIUM,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONT.BOLD,
    color: "#000",
    marginBottom: 6,
  },
  backCardScrollContent: {
    flexGrow: 1,
  },
  backCardContent: {
    width: "100%",
    height: CARD_HEIGHT * 1.9,
    justifyContent: "flex-end",
    borderRadius: 20,
    overflow: "hidden",
  },
  gradientOverlay: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: "100%",

  },
  detailContent: {
    paddingBottom: 0,
  },
  section: {
    marginTop: 16,
  },
  backText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    textAlign: "left",
    fontFamily: FONT.REGULAR,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    marginTop: 16,
  },
});

export default styles;
