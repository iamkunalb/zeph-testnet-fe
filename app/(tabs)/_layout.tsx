import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="chats">
        <Label>Chats</Label>
        <Icon sf="note.text" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf="person.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      
      
      {/* <NativeTabs.Trigger name="message" role="search">
        <Icon sf="square.and.pencil" drawable="custom_android_drawable" />
      </NativeTabs.Trigger> */}
    </NativeTabs>
  );
}
