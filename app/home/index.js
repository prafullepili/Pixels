import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { theme } from '../../constants/theme';
import { wp, hp, capitalize } from "../../helpers/common";
import Categories from "../../components/categories";
import { apiCall } from "../../api";
import ImageGrid from "../../components/imageGrid";
import { debounce, set } from 'lodash'
import { Platform } from 'react-native';
import FiltersModal from "../../components/filtersModal";
import { act } from "react";
import { useRouter } from "expo-router";


var page = 1;
export default HomeScreen = () => {
    const { top } = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 10 : 30;
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [filters, setFilters] = useState(null);
    const [isEndReached, setIsEndReached] = useState(false);

    const [images, setImages] = useState([]);
    const searchInputRef = useRef(null);
    const modalRef = useRef(null);
    const scrollRef = useRef(null);
    const router = useRouter();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        fetchImages();
    }, [])
    const fetchImages = async (params = { page: 1 }, append = true) => {
        let res = await apiCall(params);
        if (res.success && res?.data?.hits) {
            if (append) {
                if (res?.data?.hits.length === 0) {
                    setStatus('');
                }
                setImages([...images, ...res.data.hits])
            } else {
                setImages([...res.data.hits])
                setStatus('');
            }
        }
    }
    const clearSearch = () => {
        setSearch('');
        searchInputRef?.current?.clear();
    }
    const handleChangeCategory = (category) => {
        setActiveCategory(category);
        setImages([]);
        page = 1;
        let params = {
            page,
            q: search,
            ...filters
        }
        if (category) {
            params.category = category;
        }
        fetchImages(params, false);
    }
    function handleSearch(text) {
        setSearch(text);
        let params = {
            q: text,
            page,
            ...filters
        }
        if (this.activeCategory) params.category = this.activeCategory;
        if (this.filters) {
            params = { ...params, ...this.filters }
        }
        if (activeCategory) params.category = activeCategory;

        if (text.length > 2) {
            page = 1
            setImages([]);
            fetchImages({ ...params }, false)
        }
        if (text == "") {
            page = 1
            searchInputRef?.current?.clear();
            setImages([]);
            fetchImages({ ...params }, false)
        }
    }
    const handleTextDebounce = useCallback(debounce(handleSearch, 500), [])
    const openFiltersModal = () => {
        modalRef?.current?.present();
    }
    const closeFiltersModal = () => {
        modalRef?.current?.close();
    }
    const applyFilters = () => {
        if (filters) {
            page = 1;
            setImages([]);
            let params = {
                page,
                ...filters
            }
            if (activeCategory) params.category = activeCategory;
            if (search) params.q = search;

            fetchImages(params, false);
        }
        closeFiltersModal();
    }
    const resetFilters = () => {
        if (filters) {
            page = 1
            setFilters(null);
            setImages([]);
            let params = {
                page,
            }
            if (activeCategory) params.category = activeCategory;
            if (search) params.q = search;
            fetchImages(params, false);
        }
        closeFiltersModal();
    }
    const clearThisFilter = (filterName) => {
        let filterZ = { ...filters };
        delete filterZ[filterName];
        setFilters({ ...filterZ });
        page = 1;
        setImages([]);
        let params = {
            page,
            ...filterZ
        }
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params, false);
    }
    const handleScroll = (event) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const scrollOffset = event.nativeEvent.contentOffset.y;
        const bottomPosition = contentHeight - scrollViewHeight;

        if (scrollOffset >= bottomPosition - 1) {
            if (!isEndReached) {
                setStatus('loading')
                setIsEndReached(true);
                ++page;
                let params = {
                    page,
                    ...filters,
                }
                if (activeCategory) params.category = activeCategory;
                if (search) params.q = search;
                fetchImages(params);
            }
        } else if (isEndReached) {
            setIsEndReached(false);
        }
    }
    const handleScrollUp = () => {
        scrollRef?.current?.scrollTo({
            y: 0, animated: true
        })
    }
    return (
        <View style={[styles.container, { paddingTop }]}>
            <View style={styles.header}>
                <Pressable onPress={handleScrollUp}>
                    <Text style={styles.title}>Pixels</Text>
                </Pressable>
                {/*Top Menu button */}
                <Pressable onPress={openFiltersModal} style={{ padding: 10, paddingLeft: 30 }}>
                    <FontAwesome6 name="bars-staggered" size={22} color={theme.colors.neutral(0.7)} />
                </Pressable>
            </View>

            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={10} //how often scroll event will fire scrolling  (in ms)
                contentContainerStyle={{ gap: 10 }}
                ref={scrollRef}
            >
                {/* serach bar */}
                <View style={styles.searchBar}>
                    <View style={styles.searchIcon}>
                        <Feather name="search" size={24} color={theme.colors.neutral(0.4)} />
                    </View>
                    <TextInput ref={searchInputRef} onChangeText={handleTextDebounce.bind({ activeCategory, filters })} style={styles.searchInput} placeholder="Serach for photos..." />
                    {search && (<Pressable style={styles.closeIcon} onPress={() => handleSearch('')}>
                        <Ionicons name="close" size={24} color={theme.colors.neutral(0.6)} />
                    </Pressable>)
                    }
                </View>

                <View style={styles.categories}>
                    <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
                </View>
                {
                    /* filters */
                    filters && (
                        <View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                                {Object.keys(filters).map((key, index) => {
                                    let color = key == 'colors' ? ((['yellow', 'pink'].includes(filters[key])) ? 'black' : 'white') : 'black'
                                    return (
                                        <View key={key} style={[styles.filterItem, { backgroundColor: filters[key] }]}>
                                            <Text style={[styles.filterItemText, { color }]}>{capitalize(filters[key])}</Text>
                                            <Pressable style={styles.filterCloseIcon} onPress={() => clearThisFilter(key)}>
                                                <Ionicons name="close" size={14} color={color} />
                                            </Pressable>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        </View>
                    )
                }
                {/* images masonary grid */}
                <View>
                    {images.length > 0 && <ImageGrid router={router} images={images} />}
                </View>

                {/* loading */}
                <View style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}>
                    {status === 'loading' && <ActivityIndicator size='large' />}
                </View>
            </ScrollView>

            {/* filters modal */}
            <FiltersModal modalRef={modalRef} filters={filters} setFilters={setFilters} onClose={closeFiltersModal} onApply={applyFilters} onReset={resetFilters} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15
    },
    header: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.neutral(0.9)
    },
    searchBar: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        backgroundColor: theme.colors.white,
        padding: 6,
        paddingLeft: 10,
        borderRadius: theme.radius.lg,
    },
    searchIcon: {
        padding: 8
    },
    searchInput: {
        flex: 1,
        borderRadius: theme.radius.sm,
        paddingVertical: 10,
        fontSize: hp(1.8),
        paddingLeft: Platform.OS === 'web' && 10,
    },
    closeIcon: {
        backgroundColor: theme.colors.neutral(0.1),
        padding: 8,
        borderRadius: theme.radius.sm,
        marginLeft: 10
    },
    filters: {
        paddingHorizontal: wp(4),
        gap: 10,
    },
    filterItem: {
        backgroundColor: theme.colors.grayBG,
        padding: 3,
        flexDirection: 'row',
        borderRadius: theme.radius.xs,
        padding: 6,
        gap: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.neutral(0.3)
    },
    filterItemText: {
        fontSize: hp(1.3),
    },
    filterCloseIcon: {
        backgroundColor: theme.colors.neutral(0.2),
        padding: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
    }
})