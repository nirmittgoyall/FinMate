import { Link as RouterLink } from "expo-router";
import React from "react";
import { useCssElement } from "react-native-css";
import {
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  View as RNView,
} from "react-native";

type WithClassName<T> = T & { className?: string };

export const View = (props: WithClassName<React.ComponentProps<typeof RNView>>) =>
  useCssElement(RNView, props, { className: "style" });

export const Text = (props: WithClassName<React.ComponentProps<typeof RNText>>) =>
  useCssElement(RNText, props, { className: "style" });

export const Pressable = (
  props: WithClassName<React.ComponentProps<typeof RNPressable>>
) =>
  useCssElement(RNPressable as React.ComponentType<any>, props as any, {
    className: "style",
  });

export const TextInput = (
  props: WithClassName<React.ComponentProps<typeof RNTextInput>>
) => useCssElement(RNTextInput, props, { className: "style" });

export const ScrollView = (
  props: React.ComponentProps<typeof RNScrollView> & {
    className?: string;
    contentContainerClassName?: string;
  }
) =>
  useCssElement(RNScrollView as React.ComponentType<any>, props as any, {
    className: "style",
    contentContainerClassName: "contentContainerStyle",
  });

const LinkBase = (
  props: React.ComponentProps<typeof RouterLink> & { className?: string }
) =>
  useCssElement(RouterLink as React.ComponentType<any>, props as any, {
    className: "style",
  });

export const Link = Object.assign(LinkBase, {
  Trigger: RouterLink.Trigger,
  Menu: RouterLink.Menu,
  MenuAction: RouterLink.MenuAction,
  Preview: RouterLink.Preview,
});
