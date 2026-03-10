import { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AuthSessionProvider, useAuthSession } from './src/auth/AuthSessionContext';
import MyPaymentsScreen from './src/screens/MyPaymentsScreen';
import MyProfileScreen from './src/screens/MyProfileScreen';
import SessionGateScreen from './src/screens/SessionGateScreen';
import { queryClient } from './src/query-client';

type AppScreen = 'profile' | 'payments';

const screens: Array<{ id: AppScreen; label: string }> = [
  { id: 'profile', label: 'My Profile' },
  { id: 'payments', label: 'My Payments' },
];

function MobileCustomerShell() {
  const { isAuthenticated, isCustomer, signOut, user } = useAuthSession();
  const [activeScreen, setActiveScreen] = useState<AppScreen>('profile');

  useEffect(() => {
    if (isCustomer) {
      setActiveScreen('profile');
    }
  }, [isCustomer, user?.id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>genxapi ecosystem</Text>
          <Text style={styles.title}>Customer Self-Service Mobile Demo</Text>
          <Text style={styles.subtitle}>
            `mobile-app` now acts as the second customer consumer, reusing the same runtime-configured
            generated SDK boundary as `web-app`.
          </Text>
        </View>

        <View style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <View style={styles.sessionCopy}>
              <Text style={styles.sectionEyebrow}>Demo Session</Text>
              <Text style={styles.sessionTitle}>
                {isAuthenticated && user && isCustomer ? user.name : 'Choose a seeded customer persona'}
              </Text>
              <Text style={styles.sessionSubtitle}>
                {isAuthenticated && user && isCustomer
                  ? 'This session unlocks only My Profile and My Payments, both backed by /me routes.'
                  : 'The mobile demo keeps auth explicit and lightweight: one tap signs into auth-service with a customer account.'}
              </Text>
            </View>
            {isAuthenticated && user && isCustomer ? (
              <View style={styles.sessionMeta}>
                <View style={styles.customerBadge}>
                  <Text style={styles.customerBadgeText}>Customer</Text>
                </View>
                <Text style={styles.sessionEmail}>{user.email}</Text>
                <Pressable onPress={signOut} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Sign out</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>

        {isCustomer ? (
          <>
            <View style={styles.tabBar}>
              {screens.map((screen) => {
                const isActive = activeScreen === screen.id;

                return (
                  <Pressable
                    key={screen.id}
                    onPress={() => setActiveScreen(screen.id)}
                    style={[styles.tabButton, isActive ? styles.tabButtonActive : null]}
                  >
                    <Text style={[styles.tabButtonText, isActive ? styles.tabButtonTextActive : null]}>
                      {screen.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {activeScreen === 'profile' ? <MyProfileScreen /> : <MyPaymentsScreen />}
          </>
        ) : (
          <SessionGateScreen />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>
        <MobileCustomerShell />
      </AuthSessionProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5efe6',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 16,
  },
  heroCard: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: '#123524',
  },
  eyebrow: {
    color: '#d4f2d2',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fbf6',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: '#c3ddc9',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  sessionCard: {
    backgroundColor: '#fffaf3',
    borderColor: '#d9d2c3',
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  sessionHeader: {
    gap: 16,
  },
  sessionCopy: {
    gap: 8,
  },
  sectionEyebrow: {
    color: '#7b6b4f',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sessionTitle: {
    color: '#1d2a22',
    fontSize: 20,
    fontWeight: '700',
  },
  sessionSubtitle: {
    color: '#5d665f',
    fontSize: 14,
    lineHeight: 20,
  },
  sessionMeta: {
    alignItems: 'flex-start',
    gap: 10,
  },
  customerBadge: {
    backgroundColor: '#d9f3d7',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  customerBadgeText: {
    color: '#245b30',
    fontSize: 12,
    fontWeight: '700',
  },
  sessionEmail: {
    color: '#405046',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#eff1eb',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#233127',
    fontSize: 14,
    fontWeight: '700',
  },
  tabBar: {
    backgroundColor: '#e4ddcf',
    borderRadius: 20,
    flexDirection: 'row',
    padding: 4,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 16,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
  },
  tabButtonText: {
    color: '#675a45',
    fontSize: 14,
    fontWeight: '700',
  },
  tabButtonTextActive: {
    color: '#133923',
  },
});
