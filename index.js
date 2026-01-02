// IMPORTANT: Import gesture handler FIRST before anything else
// This is required for React Navigation to work properly on iOS
import "react-native-gesture-handler";

import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
