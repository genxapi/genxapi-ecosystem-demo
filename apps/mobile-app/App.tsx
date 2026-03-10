import { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AuthSessionProvider, useAuthSession } from './src/auth/AuthSessionContext';
import MyPaymentsScreen from './src/screens/MyPaymentsScreen';
import MyProfileScreen from './src/screens/MyProfileScreen';
import SessionGateScreen from './src/screens/SessionGateScreen';
import { queryClient } from './src/query-client';
import { cardShadow, theme } from './src/theme';

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
          <Text style={styles.eyebrow}>GenX API Customer Surface</Text>
          <Text style={styles.title}>Customer Mobile</Text>
          <Text style={styles.subtitle}>
            Second customer consumer reusing the same runtime-configured SDK packages and published
            contract workflow as the web portal.
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
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 18,
  },
  heroCard: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(95, 169, 255, 0.4)',
    backgroundColor: theme.colors.navy,
    ...cardShadow,
  },
  eyebrow: {
    color: theme.colors.primarySoft,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.7,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.surface,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: '#d6e0fb',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  sessionCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    padding: theme.spacing.lg,
    ...cardShadow,
  },
  sessionHeader: {
    gap: 16,
  },
  sessionCopy: {
    gap: 8,
  },
  sectionEyebrow: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sessionTitle: {
    color: theme.colors.navy,
    fontSize: 20,
    fontWeight: '700',
  },
  sessionSubtitle: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  sessionMeta: {
    alignItems: 'flex-start',
    gap: 10,
  },
  customerBadge: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  customerBadgeText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  sessionEmail: {
    color: theme.colors.muted,
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surfaceSoft,
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: theme.colors.navy,
    fontSize: 14,
    fontWeight: '700',
  },
  tabBar: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    padding: 4,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    ...cardShadow,
  },
  tabButtonText: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  tabButtonTextActive: {
    color: theme.colors.primary,
  },
});
