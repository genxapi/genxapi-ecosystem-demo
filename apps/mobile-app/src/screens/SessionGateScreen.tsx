import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  isMobileRuntimeReady,
  mobileAuthServiceBaseUrl,
  mobilePaymentsServiceBaseUrl,
  mobileRuntimeWarnings,
  mobileUsersServiceBaseUrl,
} from '../../runtime';
import { useAuthSession } from '../auth/AuthSessionContext';

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
      ? 'This mobile app is intentionally scoped to customer self-service. Internal support and admin flows stay in backoffice-app.'
      : 'Each persona signs into auth-service, then the app loads only /me and /me/payments through the generated SDK layer.';

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
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
  card: {
    backgroundColor: '#fffaf3',
    borderColor: '#d9d2c3',
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  eyebrow: {
    color: '#7b6b4f',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    color: '#1d2a22',
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    color: '#5d665f',
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
    color: '#7b6b4f',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  personaName: {
    color: '#1d2a22',
    fontSize: 20,
    fontWeight: '700',
  },
  personaEmail: {
    color: '#4b5a51',
    fontSize: 14,
  },
  personaDescription: {
    color: '#5d665f',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 14,
    marginBottom: 18,
  },
  badge: {
    backgroundColor: '#d9f3d7',
    borderRadius: 999,
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#245b30',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#123524',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#f8fbf6',
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
    color: '#7b6b4f',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  runtimeValue: {
    color: '#1d2a22',
    fontSize: 14,
    lineHeight: 20,
  },
  warningText: {
    color: '#8b3d19',
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    color: '#a11d1d',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#eff1eb',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#233127',
    fontSize: 14,
    fontWeight: '700',
  },
});
