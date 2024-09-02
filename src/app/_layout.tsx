import "../global.css";
import { Slot } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <View className='flex-1' style={{ flex: 1, paddingTop: insets.top }}>
        <Slot />
      </View>
    </SafeAreaProvider>
  );
}
