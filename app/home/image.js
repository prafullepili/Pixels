import { BlurView } from "expo-blur";
import { View, Text, StyleSheet, Button, Platform, ActivityIndicator, Pressable, Alert } from "react-native";
import { hp, wp } from "../../helpers/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useState } from "react";
import { theme } from "../../constants/theme";
import { Entypo, Octicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import * as Sharing from 'expo-sharing';
const ImageScreen = () => {
    const router = useRouter();
    const item = useLocalSearchParams();
    let uri = item?.webformatURL;
    const [status, setStatus] = useState('loading');
    const fileName = item?.previewURL?.split('/').pop();
    const imageUrl = uri;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    const onLoad = () => {
        setStatus('');
    }

    const getSize = () => {
        const aspectRatio = item?.imageWidth / item?.imageHeight;
        const maxWidth = Platform.OS == 'web' ? wp(50) : wp(92);
        let calculatedHeight = maxWidth / aspectRatio;
        let calculatedWidth = maxWidth;

        if (aspectRatio < 1) {
            calculatedWidth = calculatedHeight * aspectRatio;
        }
        return {
            width: calculatedWidth,
            height: calculatedHeight,
        }
    }

    const handleDownloadImage = async () => {
        setStatus('downloading');
        let uri = await downloadFile();

        if (uri) {
            showToast('Image downloaded')
        }
    }
    const handleShareImage = async () => {
        console.log('Hello Sharing')
        setStatus('sharing');
        let uri = await downloadFile();
        if (uri) {
            await Sharing.shareAsync(uri, { dialogTitle: 'Hello by Prafull' });
        }
    }
    const downloadFile = async () => {
        try {
            const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
            setStatus('')
            return uri;
        } catch (err) {
            setStatus('');
            console.log('got error', err.message);
            Alert.alert("Image", err.message);
            return null
        }
    }
    const showToast = (message) => {
        Toast.show({
            type: 'success',
            text1: message,
            position: 'bottom',
        })
    }
    const toastConfig = {
        success: ({ text1, props, ...rest }) => <View style={styles.toast}>
            <Text style={styles.toastText}>{text1}</Text>
        </View>
    }
    return (
        <BlurView tint="dark" blurReductionFactor={2} intensity={60} style={styles.container}>
            <View styles={[getSize()]}>
                <View style={styles.loading}>
                    {
                        status === 'loading' && <ActivityIndicator size="large" color={theme.colors.white} />
                    }
                </View>
                <Image transition={100} style={[styles.image, getSize()]} source={uri} onLoad={onLoad} />
            </View>
            <View style={styles.buttons}>
                <Animated.View entering={FadeInDown.springify()}>
                    <Pressable style={styles.button} onPress={() => router.back()}>
                        <Octicons name="x" size={24} color={theme.colors.white} />
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInDown.springify().delay(150)}>
                    {status == 'downloading' ? (
                        <View style={styles.button}>
                            <ActivityIndicator size="small" color="black" />
                        </View>
                    ) : (
                        <Pressable style={styles.button} onPress={handleDownloadImage}>
                            <Octicons name="download" size={24} color={theme.colors.white} />
                        </Pressable>
                    )}
                </Animated.View>

                <Animated.View entering={FadeInDown.springify().delay(250)}>
                    {status == 'sharing' ? (
                        <View style={styles.button}>
                            <ActivityIndicator size="small" color="black" />
                        </View>
                    ) : (
                        <Pressable style={styles.button} onPress={handleShareImage}>
                            <Entypo name="share" size={24} color={theme.colors.white} />
                        </Pressable>
                    )}
                </Animated.View>
            </View>
            <Toast config={toastConfig} visibilityTime={2500} />
        </BlurView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        backgroundColor: theme.colors.white,
    },
    image: {
        borderRadius: theme.radius.lg,
        borderWidth: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.1)'
    },
    loading: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttons: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 50,
    },
    button: {
        height: hp(6),
        width: hp(6),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous'
    },
    toast: {
        padding: 15,
        paddingHorizontal: 30,
        borderRadius: theme.radius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)'
    },
    toastText: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.white
    }
})
export default ImageScreen