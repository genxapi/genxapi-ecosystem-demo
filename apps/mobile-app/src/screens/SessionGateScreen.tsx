import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  isMobileRuntimeReady,
  mobileAuthServiceBaseUrl,
  mobilePaymentsServiceBaseUrl,
  mobileRuntimeWarnings,
  mobileUsersServiceBaseUrl,
} from '../../runtime';
import { useAuthSession } from '../auth/AuthSessionContext';
import { cardShadow, theme } from '../theme';

const runtimeRows = [
  {
    label: 'Auth service',
    value: mobileAuthServiceBaseUrl,
  },
  {
    label: 'Users SDK base URL',
    value: mobileUsersServiceBaseUrl,
  },
  {
    label: 'Payments SDK base URL',
    value: mobilePaymentsServiceBaseUrl,
  },
];

export default function SessionGateScreen() {
  const { demoPersonas, error, isAuthenticated, isCustomer, isPending, signInAsDemoPersona, signOut, user } =
    useAuthSession();

  const title =
    isAuthenticated && !isCustomer ? 'Switch to a customer demo persona' : 'Choose a customer demo session';
  const description =
    isAuthenticated && !isCustomer
      ? 'This mobile app is intentionally scoped to customer self-service. Internal support and admin flows stay in the operations console.'
      : 'Each persona signs into auth-service, then the app loads only /me and /me/payments through the generated SDK package layer.';

  return (
    <View style={styles.screen}>
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>Customer Access</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {isAuthenticated && user && !isCustomer ? (
          <Text style={styles.errorText}>
            Current session: {user.name} ({user.role}). Switch back to a customer persona to continue.
          </Text>
        ) : null}
      </View>

      {demoPersonas.map((persona) => (
        <View key={persona.id} style={styles.card}>
          <View style={styles.personaHeader}>
            <View style={styles.personaCopy}>
              <Text style={styles.personaLabel}>Demo persona</Text>
              <Text style={styles.personaName}>{persona.name}</Text>
              <Text style={styles.personaEmail}>{persona.email}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{persona.role}</Text>
            </View>
          </View>
          <Text style={styles.personaDescription}>{persona.description}</Text>
          <Pressable
            disabled={!isMobileRuntimeReady || isPending}
            onPress={() => {
              void signInAsDemoPersona(persona.id);
            }}
            style={[
              styles.primaryButton,
              !isMobileRuntimeReady || isPending ? styles.disabledButton : null,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {isPending ? 'Starting session...' : `Use ${persona.name}`}
            </Text>
          </Pressable>
        </View>
      ))}

      <View style={styles.card}>
        <Text style={styles.title}>Demo notes</Text>
        <View style={styles.stack}>
          {runtimeRows.map((row) => (
            <View key={row.label}>
              <Text style={styles.runtimeLabel}>{row.label}</Text>
              <Text style={styles.runtimeValue}>{row.value || 'Not configured'}</Text>
            </View>
          ))}
          {!isMobileRuntimeReady ? (
            <Text style={styles.warningText}>
              Persona buttons stay disabled until all three EXPO_PUBLIC_* service URLs are set.
            </Text>
          ) : null}
          {mobileRuntimeWarnings.map((warning) => (
            <Text key={warning} style={styles.warningText}>
              {warning}
            </Text>
          ))}
          {error ? <Text style={styles.errorText}>Error: {error}</Text> : null}
          {isAuthenticated ? (
            <Pressable onPress={signOut} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Clear current session</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 16,
  },
  heroCard: {
    backgroundColor: theme.colors.surfaceSoft,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    padding: theme.spacing.lg,
    ...cardShadow,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    padding: theme.spacing.lg,
    ...cardShadow,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.navy,
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  personaHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  personaCopy: {
    flex: 1,
    gap: 6,
  },
  personaLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  personaName: {
    color: theme.colors.navy,
    fontSize: 20,
    fontWeight: '700',
  },
  personaEmail: {
    color: theme.colors.muted,
    fontSize: 14,
  },
  personaDescription: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 14,
    marginBottom: 18,
  },
  badge: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 999,
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.45,
  },
  stack: {
    gap: 14,
    marginTop: 16,
  },
  runtimeLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  runtimeValue: {
    color: theme.colors.navy,
    fontSize: 14,
    lineHeight: 20,
  },
  warningText: {
    color: theme.colors.warning,
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSoft,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: theme.colors.navy,
    fontSize: 14,
    fontWeight: '700',
  },
});
