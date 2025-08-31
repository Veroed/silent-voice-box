import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.29ab270b81d84020b524e432528cbac4',
  appName: 'silent-voice-box',
  webDir: 'dist',
  server: {
    url: 'https://29ab270b-81d8-4020-b524-e432528cbac4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP'
    }
  }
};

export default config;