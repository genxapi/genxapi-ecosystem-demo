import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { type CustomerPayment, useCustomerMobileApi } from '../api/sdk';
import { useAuthSession } from '../auth/AuthSessionContext';
import {
  formatCurrency,
  formatDateTime,
  formatLabel,
  getErrorMessage,
} from '../utils/format';

const getStatusTone = (status: CustomerPayment['status']) => {
  switch (status) {
    case 'completed':
      return {
        badge: styles.statusBadgeCompleted,
        text: styles.statusBadgeTextCompleted,
      };
    case 'failed':
      return {
        badge: styles.statusBadgeFailed,
        text: styles.statusBadgeTextFailed,
      };
    case 'refunded':
      return {
        badge: styles.statusBadgeRefunded,
        text: styles.statusBadgeTextRefunded,
      };
    case 'pending':
    default:
      return {
        badge: styles.statusBadgePending,
        text: styles.statusBadgeTextPending,
      };
  }
};

export default function MyPaymentsScreen() {
  const api = useCustomerMobileApi();
  const { user } = useAuthSession();
  const paymentsQuery = useQuery({
    queryKey: ['me', user?.id ?? 'anonymous', 'payments'],
    queryFn: ({ signal }) => api.getMyPayments(signal),
    enabled: Boolean(user),
  });

  const payments = [...(paymentsQuery.data ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const currency = payments[0]?.currency ?? 'USD';
  const completedCount = payments.filter((payment) => payment.status === 'completed').length;
  const refundedCount = payments.filter((payment) => payment.status === 'refunded').length;
  const latestPayment = payments[0] ?? null;

  return (
    <View style={styles.screen}>
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>My Payments</Text>
        <Text style={styles.title}>Your payment history</Text>
        <Text style={styles.description}>
          This screen uses the generated payments SDK against /me/payments, so every record shown
          belongs to the authenticated customer.
        </Text>
      </View>

      {paymentsQuery.isLoading ? (
        <View style={styles.card}>
          <ActivityIndicator color="#123524" />
          <Text style={styles.stateText}>Loading your payments...</Text>
        </View>
      ) : null}

      {paymentsQuery.isError ? (
        <View style={styles.card}>
          <Text style={styles.errorText}>Error: {getErrorMessage(paymentsQuery.error)}</Text>
          <Pressable onPress={() => void paymentsQuery.refetch()} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {!paymentsQuery.isLoading && !paymentsQuery.isError ? (
        <>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Payment records</Text>
              <Text style={styles.summaryValue}>{payments.length}</Text>
              <Text style={styles.summaryDescription}>Only your customer activity is shown here.</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total amount</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalAmount, currency)}</Text>
              <Text style={styles.summaryDescription}>Sum of the payments returned for this session.</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Completed</Text>
              <Text style={styles.summaryValue}>{completedCount}</Text>
              <Text style={styles.summaryDescription}>Successful charges on your account.</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Latest activity</Text>
              <Text style={styles.summaryValue}>
                {latestPayment ? formatLabel(latestPayment.status) : 'No activity'}
              </Text>
              <Text style={styles.summaryDescription}>
                {latestPayment ? formatDateTime(latestPayment.createdAt) : 'No payments found yet.'}
              </Text>
            </View>
          </View>

          {payments.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>No payments yet</Text>
              <Text style={styles.stateText}>
                This customer account does not have any payment history in the demo dataset.
              </Text>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Payment activity</Text>
              <Text style={styles.cardDescription}>
                Refunded payments: {refundedCount}. The app does not expose the internal all-payments queue.
              </Text>
              <View style={styles.paymentList}>
                {payments.map((payment) => {
                  const statusTone = getStatusTone(payment.status);

                  return (
                    <View key={payment.id} style={styles.paymentCard}>
                      <View style={styles.paymentHeader}>
                        <View>
                          <Text style={styles.amountText}>
                            {formatCurrency(payment.amount, payment.currency)}
                          </Text>
                          <Text style={styles.dateText}>{formatDateTime(payment.createdAt)}</Text>
                        </View>
                        <View style={[styles.statusBadge, statusTone.badge]}>
                          <Text style={[styles.statusBadgeText, statusTone.text]}>
                            {formatLabel(payment.status)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Method</Text>
                        <Text style={styles.metaValue}>{formatLabel(payment.method)}</Text>
                      </View>
                      <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Transaction</Text>
                        <Text style={styles.metaValue}>{payment.transactionId}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 16,
  },
  heroCard: {
    backgroundColor: '#edf6f7',
    borderColor: '#c6d9de',
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  eyebrow: {
    color: '#2a6d7d',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    color: '#1d2a22',
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    color: '#5d665f',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fffaf3',
    borderColor: '#d9d2c3',
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 20,
  },
  stateText: {
    color: '#405046',
    fontSize: 15,
    lineHeight: 22,
  },
  errorText: {
    color: '#a11d1d',
    fontSize: 14,
    lineHeight: 20,
  },
  secondaryButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
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
  summaryGrid: {
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#fffaf3',
    borderColor: '#d9d2c3',
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  summaryLabel: {
    color: '#7b6b4f',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: '#1d2a22',
    fontSize: 22,
    fontWeight: '700',
  },
  summaryDescription: {
    color: '#5d665f',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  cardTitle: {
    color: '#1d2a22',
    fontSize: 20,
    fontWeight: '700',
  },
  cardDescription: {
    color: '#5d665f',
    fontSize: 14,
    lineHeight: 20,
  },
  paymentList: {
    gap: 14,
  },
  paymentCard: {
    backgroundColor: '#f6f0e4',
    borderRadius: 20,
    gap: 12,
    padding: 16,
  },
  paymentHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountText: {
    color: '#1d2a22',
    fontSize: 20,
    fontWeight: '700',
  },
  dateText: {
    color: '#5d665f',
    fontSize: 13,
    marginTop: 6,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusBadgeCompleted: {
    backgroundColor: '#d9f3d7',
  },
  statusBadgePending: {
    backgroundColor: '#feefc3',
  },
  statusBadgeRefunded: {
    backgroundColor: '#ecdfff',
  },
  statusBadgeFailed: {
    backgroundColor: '#fde2df',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadgeTextCompleted: {
    color: '#245b30',
  },
  statusBadgeTextPending: {
    color: '#8a5a00',
  },
  statusBadgeTextRefunded: {
    color: '#5c2ca6',
  },
  statusBadgeTextFailed: {
    color: '#9e1c1c',
  },
  metaRow: {
    gap: 4,
  },
  metaLabel: {
    color: '#7b6b4f',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: '#1d2a22',
    fontSize: 15,
    lineHeight: 20,
  },
});
