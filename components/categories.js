import { View, Text, FlatList, StyleSheet, Pressable, Platform } from 'react-native';
import React from 'react';
import { data } from '../constants/data';
import { hp, wp } from '../helpers/common';
import { theme } from '../constants/theme';
import Animated, { FadeInRight } from 'react-native-reanimated';


const Categories = ({ activeCategory, handleChangeCategory }) => {
    return <FlatList
        horizontal
        contentContainerStyle={styles.flatlistContainer}
        data={data.categories}
        keyExtractor={item => item}
        renderItem={({ item, index }) => (
            <CategoriesItem
                isActive={activeCategory == item}
                handleChangeCategory={handleChangeCategory}
                title={item}
                index={index}
            />
        )}
    />
}

const CategoriesItem = ({ title, index, isActive, handleChangeCategory }) => {
    let color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
    let backgroundColor = isActive ? theme.colors.neutral(0.8) : theme.colors.white;
    return <Animated.View entering={FadeInRight.delay(index * 200).duration(1000).springify().damping(14)}>
        <Pressable style={[styles.category, { backgroundColor }]} onPress={() => handleChangeCategory(isActive ? null : title)}>
            <Text style={[styles.title, { color }]}>{title}</Text>
        </Pressable>
    </Animated.View>
}

const styles = StyleSheet.create({
    flatlistContainer: {
        paddingHorizontal: wp(4),
        gap: 8
    },
    category: {
        padding: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        marginVertical: Platform.OS == 'web' ? 10 : 0,
    },
    title: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.medium
    }
})


export default Categories;