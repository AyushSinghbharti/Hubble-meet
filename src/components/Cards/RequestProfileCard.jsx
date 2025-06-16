import { StyleSheet } from "react-native";

const ProfileCard = ({ image, name, title, location }) => {
  return (
    <View style={styles.card}>
      {/* Main Image */}
      <Image source={image} style={styles.image} resizeMode="cover" />

      {/* Expand Thumbnail */}
      <TouchableOpacity style={styles.expandThumb}>
        <Image source={image} style={styles.thumbImage} />
        <AntDesign name="arrowsalt" size={16} color="#fff" style={styles.expandIcon} />
      </TouchableOpacity>

      {/* Gradient Footer */}
      <LinearGradient
        colors={["transparent", "rgba(255,255,255,0.9)", "#fff"]}
        style={styles.gradient}
      >
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.location}>{location}</Text>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    aspectRatio: 2 / 3,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
    backgroundColor: "#fff",
    marginVertical: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  title: {
    fontSize: 16,
    color: "#444",
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});