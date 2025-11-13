import { verticalScale } from '@/utils/styling';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import * as Icons from "phosphor-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {

  // const currentRoute = state.routes[state.index].name;
  // if (hiddenRoutes.includes(currentRoute)) {
  //   return null; // 👈 Hide tab bar
  // }

  const tabBarIcons: any = {
    index: (isFocused: boolean) => (
      <Icons.House size={verticalScale(10)} color={isFocused ? '#000000' : '#9CA3AF'} weight={isFocused ? 'fill' : 'regular'} />
    ),
    chats: (isFocused: boolean) => (
      <View style={styles.newChatButton}>
        <View style={styles.plusIconContainer}>
          <Icons.Plus size={verticalScale(5)} color="#FFFFFF" weight="bold" />
        </View>
      </View>
    ),
    profile: (isFocused: boolean) => (
      <Icons.User size={verticalScale(10)} color={isFocused ? '#000000' : '#9CA3AF'} weight={isFocused ? 'fill' : 'regular'} />
    ),
  };

  const tabBarLabels: any = {
    index: 'Home',
    chats: 'New chat',
    profile: 'Profile',
  };

  return (
    <View style={styles.tabBar}>
      {state.routes
        .filter(route => route.name !== 'activity')
        .map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          // Special handling for chats tab - navigate to message screen
          if (route.name === 'chats') {
            router.push('/message');
            return;
          }

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
            <Text style={[
              styles.tabBarLabel,
              { color: isFocused ? '#000000' : '#9CA3AF' }
            ]}>
              {tabBarLabels[route.name]}
            </Text>
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
    height: verticalScale(40),
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    paddingBottom: verticalScale(15),
    paddingTop: verticalScale(5),
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  newChatButton: {
    width: verticalScale(20),
    height: verticalScale(20),
    borderRadius: verticalScale(10),
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: verticalScale(5),
  },
  plusIconContainer: {
    width: verticalScale(8),
    height: verticalScale(8),
    borderRadius: verticalScale(2),
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});