export default {
  expo: {
    name: "Nova A3 • Manutenção",
    description:
      "App para criação, gerenciamento e acompanhamento de OS (Ordens de Serviço) pelo setor de Manutenção da matriz Nova A3–Areal.",
    slug: "na3-manut",
    version: "3.0.1",
    scheme: "na3-manut",
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
      versionCode: 13, // Subir para 14
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["sentry-expo"],
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: "nova-a3",
            project: "nova-a3",
            authToken:
              "c42b3e3c19924ea4b5b7db86f0bae02305e23998c8bf4a0f9798030d7f0af2c6",
            setCommits: true,
          },
        },
      ],
    },
    extra: {
      environment: "production", // "development/production"
    },
  },
};
