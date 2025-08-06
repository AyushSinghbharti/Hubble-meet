// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
//   Button,
// } from "react-native";
// import * as Contacts from "expo-contacts";

// interface Contact {
//   id: string;
//   name: string;
//   phoneNumbers?: { label: string; number: string }[];
// }

// interface ContactPickerProps {
//   visible: boolean;
//   onClose: () => void;
//   onConfirm: (selectedContacts: Contact[]) => void;
// }

// const ContactPicker: React.FC<ContactPickerProps> = ({
//   visible,
//   onClose,
//   onConfirm,
// }) => {
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchContacts = async () => {
//       const { status } = await Contacts.requestPermissionsAsync();
//       if (status === "granted") {
//         const { data } = await Contacts.getContactsAsync({
//           fields: [Contacts.Fields.PhoneNumbers],
//         });
//         setContacts(data as Contact[]);
//       }
//     };

//     if (visible) fetchContacts();
//   }, [visible]);

//   const toggleSelect = (id: string) => {
//     setSelectedContactIds((prev) =>
//       prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
//     );
//   };

//   const handleConfirm = () => {
//     const selected = contacts.filter((c) => selectedContactIds.includes(c.id));
//     onConfirm(selected);
//     onClose();
//   };

//   return (
//     <Modal visible={visible} animationType="slide">
//       <View style={styles.modal}>
//         <Text style={styles.title}>Pick Contacts</Text>
//         <FlatList
//           data={contacts}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={[
//                 styles.contactItem,
//                 selectedContactIds.includes(item.id) && styles.selected,
//               ]}
//               onPress={() => toggleSelect(item.id)}
//             >
//               <Text>{item.name}</Text>
//               {item.phoneNumbers?.[0]?.number && (
//                 <Text style={styles.phone}>{item.phoneNumbers[0].number}</Text>
//               )}
//             </TouchableOpacity>
//           )}
//         />
//         <View style={styles.buttonContainer}>
//           <Button title="Confirm" onPress={handleConfirm} />
//           <Button title="Cancel" color="red" onPress={onClose} />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default ContactPicker;

// const styles = StyleSheet.create({
//   modal: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "600",
//     marginBottom: 12,
//   },
//   contactItem: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderColor: "#eee",
//   },
//   selected: {
//     backgroundColor: "#e0ffe0",
//   },
//   phone: {
//     fontSize: 12,
//     color: "#666",
//   },
//   buttonContainer: {
//     marginTop: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import * as Contacts from "expo-contacts";
import colourPalette from "../theme/darkPaletter";
import { FONT } from "@/assets/constants/fonts";

interface Contact {
  id: string;
  name: string;
  imageUri?: string | null;
  phoneNumbers?: { label: string; number: string }[];
}

interface ContactPickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedContacts: Contact[]) => void;
}

const ContactPicker: React.FC<ContactPickerProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        // Fetch full contact data including image for each
        const enrichedContacts = await Promise.all(
          data.map(async (c) => {
            if (c.imageAvailable) {
              const full = await Contacts.getContactByIdAsync(c.id);
              return {
                ...c,
                imageUri: full?.image?.uri ?? null,
              };
            } else {
              return {
                ...c,
                imageUri: null,
              };
            }
          })
        );

        setContacts(enrichedContacts as Contact[]);
      }
    };

    if (visible) fetchContacts();
  }, [visible]);

  const toggleSelect = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selected = contacts.filter((c) => selectedContactIds.includes(c.id));
    onConfirm(selected);
    onClose();
  };

  const renderContactItem = ({ item }: { item: Contact }) => {
    const isSelected = selectedContactIds.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.contactItem, isSelected && styles.selected]}
        onPress={() => toggleSelect(item.id)}
      >
        <View style={styles.contactRow}>
          <Image
            source={
              item.imageUri
                ? { uri: item.imageUri }
                : {
                    uri: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740",
                  }
            }
            style={styles.avatar}
          />
          <View style={styles.contactDetails}>
            <Text style={styles.name}>{item.name}</Text>
            {item.phoneNumbers?.[0]?.number && (
              <Text style={styles.phone}>{item.phoneNumbers[0].number}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modal}>
        <Text style={styles.title}>Pick Contacts</Text>
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
        />
        <View style={styles.buttonContainer}>
          <Button title="Confirm" onPress={handleConfirm} />
          <Button title="Cancel" color="red" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default ContactPicker;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: 20,
    backgroundColor: colourPalette.backgroundPrimary,
  },
  title: {
    fontSize: 22,
    color: colourPalette.textPrimary,
    fontFamily: FONT.MONSERRATMEDIUM,
    marginBottom: 12,
  },
  contactItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colourPalette.borderColor,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactDetails: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    color: colourPalette.textPrimary,
    fontFamily: FONT.MONSERRATMEDIUM,
  },
  phone: {
    fontSize: 13,
    color: "#666",
  },
  selected: {
    backgroundColor: colourPalette.backgroundSecondary,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ccc",
  },
});
