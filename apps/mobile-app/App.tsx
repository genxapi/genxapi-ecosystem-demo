import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>genxapi ecosystem</Text>
      <Text style={styles.title}>Mobile App</Text>
      <Text style={styles.subtitle}>Expo starter for the demo.</Text>
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
  }
});
