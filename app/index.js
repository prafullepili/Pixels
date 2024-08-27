import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router'


export default WelcomeScreen = () => {
    const route = useRouter();
    return <View style={styles.container}>

        <Image source={require('../assets/welcome.png')} style={styles.bgImage} resizeMode='cover' />
        <Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
            <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'white', 'white']}
                style={styles.gradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.8 }}
            />
            <View style={styles.contentContainer}>
                <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.title}>Pixels</Animated.Text>
                <Animated.Text entering={FadeInDown.delay(500).springify()} style={styles.punchline}>Every Pixel Tells a Story</Animated.Text>
                <Animated.View entering={FadeInDown.delay(600).springify()}>
                    <Pressable style={styles.startButton} onPress={() => route.navigate('home')} >
                        <Text style={styles.startText}>Start Explore</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </Animated.View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImage: {
        width: wp(100),
        height: hp(100),
        position: 'absolute'
    },
    gradient: {
        width: wp(100),
        height: hp(65),
        bottom: 0,
        position: 'absolute'
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 14,
    },
    title: {
        fontSize: hp(7),
        color: theme.colors.neutral(0.9),
        fontWeight: theme.fontWeights.bold,
    },
    punchline: {
        fontSize: hp(2),
        letterSpacing: 1,
        marginBottom: 10,
        fontWeight: theme.fontWeights.medium
    },
    startButton: {
        marginBottom: 15,
        backgroundColor: theme.colors.neutral(0.9),
        padding: 15,
        paddingHorizontal: 90,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
    },
    startText: {
        color: theme.colors.white,
        fontSize: hp(3),
        fontWeight: theme.fontWeights.medium,
        letterSpacing: 1
    }
})