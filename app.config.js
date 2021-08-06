export default {
  expo: {
    name: "Nova A3 • Manutenção",
    description:
      "App para criação, gerenciamento e acompanhamento de OS (Ordens de Serviço) pelo setor de Manutenção da matriz Nova A3–Areal.",
    slug: "na3-manut",
    version: "2.0.3",
    orientation: "portrait",
    icon: "./assets/app-icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.novaa3.manut",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#EEEEEE",
      },
      icon: "./assets/app-icon.png",
      splash: {
        resizeMode: "native",
        mdpi: "./assets/splash-android.png",
        hdpi: "./assets/splash-android@1.5x.png",
        xhdpi: "./assets/splash-android@2x.png",
        xxhdpi: "./assets/splash-android@3x.png",
        xxxhdpi: "./assets/splash-android@4x.png",
        backgroundColor: "#ffffff",
      },
      package: "com.novaa3.manut",
      googleServicesFile: "./google-services.json",
      versionCode: 11, // Subir para 12
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      environment: "production", // or "production"
    },
  },
};
