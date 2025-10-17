/**
 * DisasterMesh - Permissions Utility
 *
 * Android権限のリクエストと管理
 */

import { PermissionsAndroid, Platform } from 'react-native';

/**
 * 権限リクエスト結果の型
 */
export interface PermissionResult {
  granted: boolean;
  deniedPermissions: string[];
}

/**
 * Bluetooth LE権限をリクエスト
 */
export async function requestBluetoothPermissions(): Promise<PermissionResult> {
  // iOSの場合は権限リクエスト不要（Info.plistで設定）
  if (Platform.OS === 'ios') {
    return { granted: true, deniedPermissions: [] };
  }

  // Android 12 (API Level 31) 以上の権限
  const permissions = [
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ];

  try {
    const granted = await PermissionsAndroid.requestMultiple(permissions);

    console.log('[Permissions] Bluetooth permissions result:', granted);

    // すべての権限が許可されたかチェック
    const deniedPermissions: string[] = [];
    let allGranted = true;

    for (const permission of permissions) {
      if (granted[permission] !== PermissionsAndroid.RESULTS.GRANTED) {
        allGranted = false;
        deniedPermissions.push(permission);
      }
    }

    return {
      granted: allGranted,
      deniedPermissions,
    };
  } catch (error) {
    console.error('[Permissions] Request failed:', error);
    return {
      granted: false,
      deniedPermissions: permissions,
    };
  }
}

/**
 * Bluetooth権限がすでに許可されているかチェック
 */
export async function checkBluetoothPermissions(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    const scanPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
    );
    const connectPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    );
    const locationPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    return scanPermission && connectPermission && locationPermission;
  } catch (error) {
    console.error('[Permissions] Check failed:', error);
    return false;
  }
}

/**
 * 位置情報権限のみをリクエスト
 */
export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: '位置情報権限のリクエスト',
        message:
          'DisasterMeshはBluetooth機器をスキャンするために位置情報権限が必要です。',
        buttonNeutral: '後で',
        buttonNegative: 'キャンセル',
        buttonPositive: 'OK',
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error('[Permissions] Location permission request failed:', error);
    return false;
  }
}

/**
 * 権限が拒否された際のエラーメッセージを取得
 */
export function getPermissionErrorMessage(
  deniedPermissions: string[]
): string {
  if (deniedPermissions.length === 0) {
    return '';
  }

  const permissionNames = deniedPermissions.map((permission) => {
    switch (permission) {
      case PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN:
        return 'Bluetoothスキャン';
      case PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT:
        return 'Bluetooth接続';
      case PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE:
        return 'Bluetoothアドバタイズ';
      case PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION:
        return '位置情報';
      default:
        return permission;
    }
  });

  return `以下の権限が拒否されました: ${permissionNames.join(', ')}\n\nアプリを正常に動作させるには、設定から権限を許可してください。`;
}
