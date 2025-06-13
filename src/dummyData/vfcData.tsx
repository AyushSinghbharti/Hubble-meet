// components/dummyCardData.js
const avatar = require('../../assets/images/IntroCardBG2.jpg');

const getRandomPastel = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 85%)`;
};

export const dummyCardData = [
  {
    id: "1",
    label: "Aarav Sharma",
    letter: "A",
    status: "online",
    camera: true,
    starred: true,
    avatar: require("../../assets/icons/connect.png"),
    bgColor: "#d6c4f2",
    details: "Software Engineer, TCS\nMumbai",
  },
  {
    id: "2",
    label: "Sophia Martinez",
    letter: "S",
    status: "online",
    camera: false,
    starred: false,
       avatar: require("../../assets/icons/connect.png"),
    bgColor: "#f2c4e0",
    details: "UI Designer, Adobe\nCalifornia",
  },
  // Add more...

  ...Array.from({ length: 24 }, (_, i) => {
    const letter = String.fromCharCode(67 + i); // C to Z
    return {
      id: i + 3,
      label: `Card ${letter}`,
      avatar,
      status: 'offline',
      camera: Math.random() > 0.5,
      starred: false,
      letter,
      details: `Details for card ${letter}.`,
    };
  }),
].map((item) => ({ ...item, bgColor: getRandomPastel() }));

export default dummyCardData;
