import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {
  mobileAuthServiceBaseUrl,
  mobilePaymentsServiceBaseUrl,
  mobileRuntimeWarnings,
  mobileUsersServiceBaseUrl,
} from './runtime';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>genxapi ecosystem</Text>
      <Text style={styles.title}>Mobile App</Text>
      <Text style={styles.subtitle}>Auth-service and SDK bootstrap preview.</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Auth service base URL</Text>
        <Text style={styles.value}>{mobileAuthServiceBaseUrl || 'Not configured yet'}</Text>
        <Text style={styles.label}>Users SDK base URL</Text>
        <Text style={styles.value}>{mobileUsersServiceBaseUrl || 'Not configured yet'}</Text>
        <Text style={styles.label}>Payments SDK base URL</Text>
        <Text style={styles.value}>
          {mobilePaymentsServiceBaseUrl || 'Not configured yet'}
        </Text>
        {mobileRuntimeWarnings.map((warning) => (
          <Text key={warning} style={styles.warning}>
            {warning}
          </Text>
        ))}
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a'
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#475569'
  },
  card: {
    width: '100%',
    marginTop: 24,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 20,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#64748b'
  },
  value: {
    marginTop: 4,
    fontSize: 16,
    color: '#0f172a'
  },
  warning: {
    marginTop: 12,
    color: '#b91c1c',
    fontSize: 14
  }
});
