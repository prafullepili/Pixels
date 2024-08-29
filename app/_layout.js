import React from 'react';
import { Stack } from 'expo-router';
import {
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar';

const Layout = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <StatusBar style='dark' />
                <Stack>
                    <Stack.Screen name='home/index' options={{ headerShown: false }} />
                    <Stack.Screen name='index' options={{ headerShown: false }} />
                    <Stack.Screen name='home/image' options={{ headerShown: false, presentation: 'transparentModal', animation: 'fade' }} />
                </Stack>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )

}

export default Layout