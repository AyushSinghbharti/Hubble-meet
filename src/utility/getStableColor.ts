// utils/getStableColor.ts
const cardColors = ["#FDF0A6", "#FBC8C9", "#C9FBC8", "#F6F6F6", "#E0EAF3"];

export const getStableColor = (id: string): string => {
    const index = id
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0) % cardColors.length;
    return cardColors[index];
};
