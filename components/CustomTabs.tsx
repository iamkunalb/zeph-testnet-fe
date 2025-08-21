import { colors, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Icons from "phosphor-react-native";
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
  const hiddenRoutes = ['chats']; // 👈 Add your screen names here

  // const currentRoute = state.routes[state.index].name;
  // if (hiddenRoutes.includes(currentRoute)) {
  //   return null; // 👈 Hide tab bar
  // }

  const tabBarIcons: any = {
    index: (isFocused: boolean) => (
      <Icons.House size={verticalScale(12)} color={isFocused ? colors.primary : colors.white} weight={isFocused ? 'fill' : 'regular'} />
    ),
    chats: (isFocused: boolean) => (
      <Icons.Chat size={verticalScale(12)} color={isFocused ? colors.primary : colors.white} weight={isFocused ? 'fill' : 'regular'} />
    ),
    activity: (isFocused: boolean) => (
      <Icons.ChartLine size={verticalScale(12)} color={isFocused ? colors.primary : colors.white} weight={isFocused ? 'fill' : 'regular'} />
    ),
    profile: (isFocused: boolean) => (
      <Icons.User size={verticalScale(12)} color={isFocused ? colors.primary : colors.white} weight={isFocused ? 'fill' : 'regular'} />
    ),
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
          >
            {tabBarIcons[route.name] && tabBarIcons[route.name](isFocused)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    height: verticalScale(38),
    backgroundColor: colors.neutral800,
    justifyContent:'space-around',
    alignItems:'center',
    borderTopColor:colors.neutral700,
    borderTopWidth:1,
  },
  tabBarItem: {
    marginBottom:spacingY._5,
    justifyContent:'center',
    alignItems:'center',

  }
});