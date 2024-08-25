import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export const wp = percentage => {
    const width = deviceWidth;
    return (percentage * width) / 100;
}

export const hp = percentage => {
    const Height = deviceHeight;
    return (percentage * Height) / 100;
}
