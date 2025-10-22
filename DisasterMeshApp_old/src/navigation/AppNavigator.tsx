/**
 * DisasterMesh - AppNavigator
 *
 * アプリのナビゲーション設定
 * - タブナビゲーション（メッセージ、ノード管理）
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, StyleSheet} from 'react-native';
import MessageScreen from '../screens/MessageScreen';
import NodeScreen from '../screens/NodeScreen';
import type {Node} from '../types/node';
import type {Peripheral} from 'react-native-ble-manager';
import type {MessagePacket} from '../types/message';

const Tab = createBottomTabNavigator();

// アイコンコンポーネント（シンプルなテキストベース）
const TabIcon = ({label, focused}: {label: string; focused: boolean}) => (
  <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
    {label}
  </Text>
);

interface AppNavigatorProps {
  // BLE状態
  isScanning: boolean;
  discoveredDevices: Map<string, Peripheral>;
  connectedNodes: Node[];

  // BLE操作
  onStartScan: () => Promise<void>;
  onStopScan: () => Promise<void>;
  onConnectDevice: (peripheralId: string) => Promise<void>;
  onDisconnectDevice: (peripheralId: string) => Promise<void>;
  onSendMessage: (nodeId: string, content: string) => Promise<void>;
  onMessageReceived?: (peripheralId: string, packet: MessagePacket) => void;
}

export default function AppNavigator({
  isScanning,
  discoveredDevices,
  connectedNodes,
  onStartScan,
  onStopScan,
  onConnectDevice,
  onDisconnectDevice,
  onSendMessage,
  onMessageReceived,
}: AppNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        name="Messages"
        options={{
          tabBarLabel: 'メッセージ',
          tabBarIcon: ({focused}) => (
            <TabIcon label="💬" focused={focused} />
          ),
        }}>
        {() => (
          <MessageScreen
            connectedNodes={connectedNodes}
            onSendMessage={onSendMessage}
            onMessageReceived={undefined}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Nodes"
        options={{
          tabBarLabel: 'ノード',
          tabBarIcon: ({focused}) => (
            <TabIcon label="📡" focused={focused} />
          ),
          tabBarBadge: connectedNodes.length > 0 ? connectedNodes.length : undefined,
        }}>
        {() => (
          <NodeScreen
            isScanning={isScanning}
            discoveredDevices={discoveredDevices}
            connectedNodes={connectedNodes}
            onStartScan={onStartScan}
            onStopScan={onStopScan}
            onConnectDevice={onConnectDevice}
            onDisconnectDevice={onDisconnectDevice}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 24,
    opacity: 0.6,
  },
  tabIconFocused: {
    opacity: 1,
  },
});
