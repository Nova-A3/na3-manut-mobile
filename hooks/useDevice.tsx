import * as ExpoDevice from "expo-device";
import * as Random from "expo-random";
import * as SecureStore from "expo-secure-store";
import * as React from "react";

export type Device = {
  id: string | null;
  type?: "UNKNOWN" | "PHONE" | "TABLET" | "DESKTOP" | "TV";
} & Pick<
  typeof ExpoDevice,
  | "isDevice"
  | "brand"
  | "manufacturer"
  | "modelName"
  | "modelId"
  | "designName"
  | "productName"
  | "deviceYearClass"
  | "totalMemory"
  | "supportedCpuArchitectures"
  | "osName"
  | "osVersion"
  | "osBuildId"
  | "osInternalBuildId"
  | "osBuildFingerprint"
  | "platformApiLevel"
  | "deviceName"
>;

const useDevice = () => {
  const [device, setDevice] = React.useState<Device | null>(null);

  const getDeviceIdAsync = React.useCallback(async () => {
    const storedDeviceId = await SecureStore.getItemAsync("DEVICE_ID");
    if (!storedDeviceId) {
      const idBytes = Random.getRandomBytes(16);
      const idArray: string[] = [];
      idBytes.forEach((byte) => {
        idArray.push(byte.toString().padStart(3, "0"));
      });
      const id = idArray.join("");
      await SecureStore.setItemAsync("DEVICE_ID", id);
      return id;
    } else {
      return storedDeviceId;
    }
  }, []);

  const translateDeviceType = React.useCallback(
    (deviceType: ExpoDevice.DeviceType): Device["type"] => {
      switch (deviceType) {
        case 0:
          return "UNKNOWN";
        case 1:
          return "PHONE";
        case 2:
          return "TABLET";
        case 3:
          return "DESKTOP";
        case 4:
          return "TV";
        default:
          return undefined;
      }
    },
    []
  );

  React.useEffect(() => {
    (async () => {
      if (!device) {
        setDevice({
          id: await getDeviceIdAsync(),
          type: translateDeviceType(await ExpoDevice.getDeviceTypeAsync()),
          isDevice: ExpoDevice.isDevice,
          brand: ExpoDevice.brand,
          manufacturer: ExpoDevice.manufacturer,
          modelName: ExpoDevice.modelName,
          modelId: ExpoDevice.modelId,
          designName: ExpoDevice.designName,
          productName: ExpoDevice.productName,
          deviceYearClass: ExpoDevice.deviceYearClass,
          totalMemory: ExpoDevice.totalMemory,
          supportedCpuArchitectures: ExpoDevice.supportedCpuArchitectures,
          osName: ExpoDevice.osName,
          osVersion: ExpoDevice.osVersion,
          osBuildId: ExpoDevice.osBuildId,
          osInternalBuildId: ExpoDevice.osInternalBuildId,
          osBuildFingerprint: ExpoDevice.osBuildFingerprint,
          platformApiLevel: ExpoDevice.platformApiLevel,
          deviceName: ExpoDevice.deviceName,
        });
      }
    })();
  }, [device]);

  return device;
};

export default useDevice;
