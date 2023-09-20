import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  RouteProp,
  createNavigationContainerRef,
} from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

import HomeScreen from "../screens/home";
import AccountScreen from "../screens/account";
import SearchScreen from "../screens/search";
import CardScreen from "../screens/card";
import AddAddressScreen from "../screens/home/address";
import { PageHeader } from "../components/common/header";

const Tab = createBottomTabNavigator<TabList>();
const HomeStack = createNativeStackNavigator<HomeTabProps>();
const SearchStack = createNativeStackNavigator<SearchTabProps>();
const CardStack = createNativeStackNavigator<CardTabProps>();
const AccountStack = createNativeStackNavigator<AccountTabProps>();

type TabList = {
  HomeTab: undefined;
  SearchTab: undefined;
  CardTab: undefined;
  AccountTab: undefined;
};

type HomeTabProps = {
  Home: undefined;
  //Modal: undefined;
  AddAddress: undefined;
};

type SearchTabProps = {
  Search: undefined;
};

type CardTabProps = {
  Card: undefined;
};

type AccountTabProps = {
  Account: undefined;
};

export type HomeTabScreenProps = {
  navigation: NativeStackNavigationProp<HomeTabProps, "Home">;
  route: RouteProp<HomeTabProps, "Home">;
};

export type SearchTabScreenProps = {
  navigation: NativeStackNavigationProp<SearchTabProps, "Search">;
  route: RouteProp<SearchTabProps, "Search">;
};

type CardTabScreenProps = {
  navigation: NativeStackNavigationProp<CardTabProps, "Card">;
  route: RouteProp<CardTabProps, "Card">;
};

type AccountTabScreenProps = {
  navigation: NativeStackNavigationProp<AccountTabProps, "Account">;
  route: RouteProp<AccountTabProps, "Account">;
};

const navRef = createNavigationContainerRef();

const Navigation: React.FC = () => {
  const noTabBarList = ["AddAddress"];
  const [routeName, setRouteName] = useState("");

  return (
    <View style={styles.container}>
      <NavigationContainer
        ref={navRef}
        onReady={() => {
          setRouteName(navRef.getCurrentRoute()?.name ?? "");
        }}
        onStateChange={async () => {
          const previousRouteName = routeName;
          const currentRouteName = navRef.getCurrentRoute()?.name ?? "";
          setRouteName(currentRouteName);
        }}
      >
        <Tab.Navigator
          initialRouteName="HomeTab"
          screenOptions={() => ({
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: "#FF0F0F",
            tabBarStyle: {
              display: noTabBarList.includes(routeName) ? "none" : "flex",
            },
          })}
        >
          <Tab.Screen
            name="HomeTab"
            options={{
              tabBarLabel: "Home",
              headerShown: false,
              tabBarButton: (props: any) => {
                return (
                  <TouchableOpacity {...props} style={styles.button}>
                    <FontAwesome
                      name={"home"}
                      size={32}
                      color={
                        props.accessibilityState.selected ? "#FF0F0F" : "#000"
                      }
                      style={styles.buttonIcon}
                    />
                  </TouchableOpacity>
                );
              },
            }}
          >
            {() => (
              <HomeStack.Navigator>
                <HomeStack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    header: () => (
                      <View
                        style={{
                          flex: 0,
                          paddingTop: 46,
                          paddingBottom: 6,
                          alignItems: "center",
                          borderBottomColor: "lightgrey",
                          borderBottomWidth: 0.4,
                          backgroundColor: "#fff",
                          elevation: 4,
                        }}
                      >
                        <Image
                          source={require("../../assets/images/legacy/logo.png")}
                          style={{ height: 44, aspectRatio: 2 }}
                        />
                      </View>
                    ),
                    headerShown: false,
                  }}
                />

                <HomeStack.Screen
                  name="AddAddress"
                  component={AddAddressScreen}
                  options={{
                    header: ({ navigation }) => (
                      <PageHeader
                        title={"Yeni Adres"}
                        color={"#FF3C36"}
                        onBack={() => {
                          navigation.goBack();
                        }}
                      />
                    ),
                  }}
                />
              </HomeStack.Navigator>
            )}
          </Tab.Screen>

          <Tab.Screen
            name="SearchTab"
            options={{
              tabBarLabel: "Search",
              headerShown: false,
              tabBarButton: (props: any) => (
                <TouchableOpacity {...props} style={styles.button}>
                  <FontAwesome
                    name={"search"}
                    size={26}
                    color={
                      props.accessibilityState.selected ? "#FF0F0F" : "#000"
                    }
                    style={{ paddingBottom: 1 }}
                  />
                </TouchableOpacity>
              ),
            }}
          >
            {() => (
              <SearchStack.Navigator>
                <SearchStack.Screen
                  name="Search"
                  component={SearchScreen}
                  options={{ headerShown: false }}
                />
              </SearchStack.Navigator>
            )}
          </Tab.Screen>

          <Tab.Screen
            name="CardTab"
            options={{
              tabBarLabel: "Card",
              headerShown: false,
              tabBarButton: (props: any) => (
                <TouchableOpacity {...props} style={styles.button}>
                  <FontAwesome
                    name={"credit-card"}
                    size={28}
                    color={
                      props.accessibilityState.selected ? "#FF0F0F" : "#000"
                    }
                    style={styles.buttonIcon}
                  />
                </TouchableOpacity>
              ),
            }}
          >
            {() => (
              <CardStack.Navigator>
                <CardStack.Screen name="Card" component={CardScreen} />
              </CardStack.Navigator>
            )}
          </Tab.Screen>

          <Tab.Screen
            name="AccountTab"
            options={{
              tabBarLabel: "Hesabım",
              headerShown: false,
              tabBarButton: (props: any) => (
                <TouchableOpacity {...props} style={styles.button}>
                  <MaterialCommunityIcons
                    name={"account"}
                    size={32}
                    color={
                      props.accessibilityState.selected ? "#FF0F0F" : "#000"
                    }
                    style={styles.buttonIcon}
                  />
                </TouchableOpacity>
              ),
            }}
          >
            {() => (
              <AccountStack.Navigator>
                <AccountStack.Screen
                  name="Account"
                  component={AccountScreen}
                  options={{ headerTitle: "Hesabım" }}
                />
              </AccountStack.Navigator>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonIcon: { opacity: 0.95 },
});
