import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import React, { useMemo } from "react";
import { BlurView } from "expo-blur";
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import Animated, { Extrapolation, FadeInDown, FadeInRight, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { ColorFilter, CommonFilterRow, SectionView } from "./filterViews";
import { capitalize } from "lodash";
import { data } from "../constants/data";



const sections = {
    'order': (props) => <CommonFilterRow {...props} />,
    'orientation': (props) => <CommonFilterRow {...props} />,
    'type': (props) => <CommonFilterRow {...props} />,
    'colors': (props) => <ColorFilter {...props} />
}

const FiltersModal = ({ modalRef, onClose, onApply, onReset, filters, setFilters }) => {
    const snapPoints = useMemo(() => ['60%'], []);
    return (
        <BottomSheetModal
            ref={modalRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={CustomBackdrop}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.content}>
                    <Text style={styles.filterText}>Filters</Text>
                    <View style={styles.filterContainer}>
                        {
                            Object.keys(sections).map((sectionName, index) => {
                                let sectionView = sections[sectionName];
                                let sectionData = data.filters[sectionName];
                                let title = capitalize(sectionName);
                                return (
                                    <Animated.View entering={FadeInDown.delay((index * 100) + 100).springify().damping(11)} key={sectionName}>
                                        <SectionView title={title} content={sectionView({
                                            data: sectionData,
                                            filters,
                                            setFilters,
                                            filterName: sectionName
                                        })} />
                                    </Animated.View>
                                )
                            })
                        }
                    </View>
                    {/* actions */}
                    <Animated.View entering={FadeInRight.delay(500).springify().damping(11)} style={styles.buttons}>
                        <Pressable style={styles.resetButton} onPress={onReset}>
                            <Text style={[styles.buttonText, { color: theme.colors.neutral(0.9) }]}>Reset</Text>
                        </Pressable>
                        <Pressable style={styles.applyButton} onPress={onApply}>
                            <Text style={[styles.buttonText, { color: theme.colors.white }]}>Apply</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    )
}

const CustomBackdrop = ({ animatedIndex, style }) => {
    const containerAnimatedStyle = useAnimatedStyle(() => {
        let opacity = interpolate(
            animatedIndex.value,
            [-1, 2],
            [0, 2],
            Extrapolation.CLAMP
        )
        return {
            opacity
        }
    });
    const containerStyle = [
        StyleSheet.absoluteFill,
        style,
        styles.overlay,
        containerAnimatedStyle
    ]
    return (
        <Animated.View style={containerStyle}>
            {/* Blue View Backdrom */}
            <BlurView style={[StyleSheet.absoluteFill]} intensity={70} tint="dark" />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        overflow: 'scroll',
    },
    filterContainer: {
        gap: 15
    },

    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        flex: 1,
        gap: 15,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    filterText: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.neutral(0.8),
        marginBottom: 5
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginTop: Platform.OS == 'web' ? 30 : 0,
        paddingBottom: Platform.OS == 'web' ? 50 : 0,
    },
    applyButton: {
        flex: 1,
        backgroundColor: theme.colors.neutral(0.8),
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.md,
    },
    resetButton: {
        flex: 1,
        backgroundColor: theme.colors.neutral(0.03),
        padding: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.grayBG,
        justifyContent: 'center',
        borderRadius: theme.radius.md,
    },
    buttonText: {
        fontSize: hp(2.2)
    }

})
export default FiltersModal